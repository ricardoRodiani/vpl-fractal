<template>
  <div id="wrapper">
    <Network
      class="network"
      ref="network"
      :nodes="network.nodes"
      :edges="network.edges"
      :options="network.options"
      @click="networkEvent('click')"
      @double-click="networkEvent('doubleClick')"
      @oncontext="networkEvent('oncontext')"
      @hold="networkEvent('hold')"
      @release="networkEvent('release')"
      @select="networkEvent('select')"
      @select-node="networkEvent('selectNode')"
      @select-edge="networkEvent('selectEdge')"
      @deselect-node="networkEvent('deselectNode')"
      @deselect-edge="networkEvent('deselectEdge')"
      @drag-start="networkEvent('dragStart')"
      @dragging="networkEvent('dragging')"
      @drag-end="networkEvent('dragEnd')"
      @hover-node="networkEvent('hoverNode')"
      @blur-node="networkEvent('blurNode')"
      @hover-edge="networkEvent('hoverEdge')"
      @blur-edge="networkEvent('blurEdge')"
      @zoom="networkEvent('zoom')"
      @show-popup="networkEvent('showPopup')"
      @hide-popup="networkEvent('hidePopup')"
      @start-stabilizing="networkEvent('startStabilizing')"
      @stabilization-progress="networkEvent('stabilizationProgress')"
      @stabilization-iterations-done="
        networkEvent('stabilizationIterationsDone')
      "
      @stabilized="networkEvent('stabilized')"
      @resize="networkEvent('resize')"
      @init-redraw="networkEvent('initRedraw')"
      @before-drawing="networkEvent('beforeDrawing')"
      @after-drawing="afterDrawing"
      @animation-finished="networkEvent('animationFinished')"
      @config-change="networkEvent('configChange')"
      @nodes-mounted="networkEvent('nodes-mounted')"
      @nodes-add="networkEvent('nodes-add')"
      @nodes-update="networkEvent('nodes-update')"
      @nodes-remove="networkEvent('nodes-remove')"
      @edges-mounted="networkEvent('edges-mounted')"
      @edges-add="networkEvent('edges-add')"
      @edges-update="networkEvent('edges-update')"
      @edges-remove="networkEvent('edges-remove')"
    >
    </Network>
  </div>
</template>

<script>
import { Network } from "vue2vis";
export default {
  data: () => ({
    networkEvents: "",
    network: {
      nodes: [
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
      ],
      edges: [
        { id: 1, from: 1, to: 3 },
        { id: 2, from: 1, to: 2 },
        { id: 3, from: 2, to: 4 },
        { id: 4, from: 2, to: 5 },
        { id: 5, from: 3, to: 3 },
      ],
      options: {
        height: "500px",
        physics: false,
        nodes: {
          widthConstraint: 60,
          heightConstraint: 20,

          borderWidth: 1,
          borderWidthSelected: 2,
          shape: "box",

          color: {
            selected: "orange",
            background: "lightgray",
            border: "black",
          },
          font: {
            color: "black",
            size: 10,
            face: "Poppins",
            background: "",
            strokeWidth: 0,
            strokeColor: "#ffffff",
          },
          shadow: false,
        },
      },
    },
  }),
  components: {
    Network,
  },
  methods: {
    networkEvent(eventName) {
      if (this.networkEvents.length > 500) this.networkEvents = "";
      this.networkEvents += `${eventName}, `;
      // if (eventName === "afterDrawing") this.drawSwimlanes();
    },

    addNode() {
      const id = new Date().getTime();
      this.network.nodes.push({ id, label: "New node" });
      // this.$refs.network.network.body.emitter.emit("_dataChanged");
    },
    addEdge() {
      const n1 = Math.floor(Math.random() * this.network.nodes.length);
      const n2 = Math.floor(Math.random() * this.network.nodes.length);
      this.network.edges.push({
        id: `${this.network.nodes[n1].id}-${this.network.nodes[n2].id}`,
        from: this.network.nodes[n1].id,
        to: this.network.nodes[n2].id,
      });
    },
    layout() {
      for (var i = 0; i < this.network.nodes.length; i++) {
        console.log(this.$refs.network.nodes[i]);
      }
    },

    afterDrawing(ctx) {
      ctx.strokeStyle = "green";
      ctx.fillStyle = "green";

      this.network.nodes.map(
        function (node) {
          let n = this.$refs.network.getPositions(node.id)[node.id];
          ctx.strokeRect(n.x - 50, n.y - 50, 100, 100);
          ctx.fillText("Hello Homie", n.x, n.y - 40);
          return null;
        }.bind(this)
      );
      // ctx.strokeRect(50, 50, 100, 100);
      ctx.stroke();
    },

    resetNetwork() {
      this.network = {
        nodes: [
          { id: 1, label: "Node 1" },
          { id: 2, label: "Node 2" },
          { id: 3, label: "Node 3" },
          { id: 4, label: "Node 4" },
          { id: 5, label: "Node 5" },
        ],
        edges: [
          { id: 1, from: 1, to: 3 },
          { id: 2, from: 1, to: 2 },
          { id: 3, from: 2, to: 4 },
          { id: 4, from: 2, to: 5 },
          { id: 5, from: 3, to: 3 },
        ],
        options: {},
      };
    },
    removeNode() {
      this.network.nodes.splice(0, 1);
    },
    removeEdge() {
      this.network.edges.splice(0, 1);
    },
  },
};
</script>

<style>
/* @import "~vue-visjs/dist/vue-visjs.css"; */
.wrapper {
  padding: 10px 10px;
  text-align: center;
  height: 800px;
}
.events {
  text-align: left;
  height: 70px;
}
.network {
  height: 100%;
  width: 100%;
}
</style>