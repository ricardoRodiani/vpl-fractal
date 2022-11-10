<template>
  <div id="app" data-app>
    <BlocklyComponent id="blockly" :options="options" ref="ref_blk" />
    <v-layout class="fab-container">
      <v-dialog v-model="code_dialog" width="800px" scrollable>
        <template v-slot:activator="{ on }">
          <v-btn @click="showCode" dark v-on="on" class="menu-btn">
            <span> Show Code</span>
            <v-icon small right>mdi-eye</v-icon>
          </v-btn>
        </template>
        <v-card v-if="showCode">
          <v-card-actions>
            <v-card-title class="headline grey lighten-2" primary-title>
              Fractal Code
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn dark @click="copyToClipboard">Copy</v-btn>
          </v-card-actions>
          <v-card-text style="white-space: pre">
            {{ code }}
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="graph_dialog" width="800px" scrollable>
        <template v-slot:activator="{ on }">
          <v-btn @click="showCode" dark v-on="on" class="menu-btn">
            <span> Show Result</span>
            <v-icon small right>mdi-eye</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-actions>
            <v-card-title class="headline grey lighten-2" primary-title>
              Graph Visualization
            </v-card-title>
            <v-spacer></v-spacer>
            <!-- <v-btn dark @click="exportSvg">Export SVG</v-btn> -->
          </v-card-actions>
          <GraphComponentVue
            v-bind:network_prop="network"
            v-bind:networkEvents_prop="networkEvents"
          />
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import BlocklyJS from "blockly/javascript";
import BlocklyComponent from "./components/BlocklyComponent.vue";
import GraphComponentVue from "./components/GraphComponent.vue";
import DarkTheme from "@blockly/theme-dark";
import axios from "axios";
import "./blocks/fractal";

export default {
  name: "app",
  components: {
    BlocklyComponent,
    GraphComponentVue,
  },
  data() {
    return {
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
          height: "640px",
          physics: true,
          nodes: {
            widthConstraint: 60,
            heightConstraint: 20,

            borderWidth: 1,
            borderWidthSelected: 2,
            shape: "circle",

            color: {
              selected: "orange",
              background: "lightgray",
              border: "black",
            },
            font: {
              color: "black",
              size: 14,
              // face: "Poppins",
              background: "",
              strokeWidth: 0,
              strokeColor: "#ffffff",
            },
            shadow: false,
          },
        },
      },
      msg: "",
      header: `
              import br.ufmg.cs.systems.fractal._;
              import br.ufmg.cs.systems.fractal.pattern.Pattern
              import br.ufmg.cs.systems.fractal.util.Logging
              import org.apache.hadoop.io.LongWritable
              val fc = new FractalContext(sc)
              val graphPath = "/home/unix/libs_tcc/fractal/data/citeseer-single-label.graph";
              val fgraph = fc.textFile (graphPath)
              val motifs = fgraph`,
      footer: `
              for ((key,value) <- motifsMap) { 
                println(s"output{\${'"'}key\${'"'}:\${'"'}\${key}\${'"'},\${'"'}value\${'"'}:\${'"'}\${value}\${'"'}}")
              }
              fc.stop()
              `,
      code: "",
      json: null,
      code_dialog: false,
      graph_dialog: false,
      options: {
        theme: DarkTheme,
        collapse: true,
        comments: false,
        disable: false,
        maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: "start",
        css: true,
        media: "https://blockly-demo.appspot.com/static/media/",
        rtl: false,
        scrollbars: true,
        sounds: true,
        oneBasedIndex: true,
        grid: {
          spacing: 20,
          length: 1,
          colour: "#888",
          snap: false,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
        toolbox: `
        <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
        <block type="input"/>
        <block type="expand">
          <field name="DROPDOWN">vfractoid</field>
          <field name="NAME">1</field>
        </block>
        <block type="aggregate">
          <value name="NAME2">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
          <value name="NAME3">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
          <value name="NAME">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
        </block>
        <block type="filter">
          <value name="OPTION1">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
          <value name="OPTION2">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
        </block>
        </xml>`,
      },
    };
  },
  methods: {
    showCode() {
      const workspace = this.$refs["ref_blk"].workspace;
      this.code = BlocklyJS.workspaceToCode(workspace);
      let match = this.code.match(".*fractoid.");
      this.code = this.code.replace(/.*fractoid./g, "");
      this.header = this.header + match[0];
      this.code = this.header + this.code;
      this.code = this.code + this.footer;
      axios
        .post("http://localhost:3080/fractal/runcode", {
          stmt: `${this.code}`,
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.code);
    },
    exportSvg() {
      const old_label = this.network.nodes["1"].label;
      if (old_label == "Teste") {
        this.network.nodes["1"].label = "Teste 2";
      } else {
        this.network.nodes["1"].label = "Teste";
      }
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html,
body {
  margin: 0;
}

#blockly {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.fab-container {
  position: fixed;
  top: 20px;
  right: 20px;
}

.menu-btn {
  margin: 10px;
}
</style>

