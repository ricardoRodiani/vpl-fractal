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
          <v-btn @click="showGraph" dark v-on="on" class="menu-btn">
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
            v-bind:unique_motif_value="uniqueMotifValue"
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
      uniqueMotifValue: {},
      networkEvents: "",
      network: {
        nodes: [],
        edges: [],
        options: {
          autoResize: true,
          groups: {},
          height: "640px",
          physics: true,
          nodes: {
            widthConstraint: 60,
            heightConstraint: 20,

            borderWidth: 1,
            borderWidthSelected: 2,
            shape: "circle",

            color: {
              // selected: "orange",
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
              val graphPath = "REPLACE_PATH";
              val fgraph = fc.textFile (graphPath)
              val motifs = fgraph.vfractoid.`,
      footer: `
              for ((key,value) <- motifsMap) { 
                println(s"output{\${'"'}key\${'"'}:\${'"'}\${key}\${'"'},\${'"'}value\${'"'}:\${'"'}\${value}\${'"'}}")
              }
              fc.stop()
              `,
      code: "",
      json: null,
      outputObjects: [],
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
          <value name="KEY_FN">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
          <value name="VALUE_FN">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
          <value name="REDUCE_FN">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
        </block>
        <block type="filter">
          <value name="FUNCTION">
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
      this.outputObjects = [];
      const workspace = this.$refs["ref_blk"].workspace;
      this.code = BlocklyJS.workspaceToCode(workspace);
      // let match = this.code.match(".*fractoid.");
      // this.code = this.code.replace(/.*fractoid./g, "");
      // let temp_header = this.header + match[0];
      this.code = this.header + this.code;
      this.code = this.code + this.footer;

      axios
        .post("http://localhost:3080/fractal/runcode", {
          stmt: `${this.code}`,
        })
        .then((response) => {
          console.log(response.data);
          let outputString =
            response.data.data["text/plain"].match(/output{.*}/g);

          outputString.map((string) => {
            const obj = JSON.parse(string.split(/output/g)[1]);
            this.outputObjects.push(obj);
          });
          console.log(this.outputObjects);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.code);
    },
    exportSvg() {
      let old_label = this.network.nodes["1"].label;
      if (old_label == "Teste") {
        this.network.nodes["1"].label = "Teste 2";
      } else {
        this.network.nodes["1"].label = "Teste";
      }
    },
    showGraph() {
      this.network.nodes = [];
      this.network.edges = [];
      const nodesUniqueId = [];
      let uniqueGroups = [];
      let uniqueGroupsObj = {};
      let uniqueMotifValue = {};
      let edgesCount = 0;
      for (let i = 0; i < this.outputObjects.length; i++) {
        const outputElement = this.outputObjects[i];
        const aNodes = outputElement.key.split("],");
        const nValue = outputElement.value;
        let diff_index = 0;
        for (let j = 0; j < aNodes.length; j++) {
          const nodeElement = aNodes[j];
          const sMotif = nodeElement.slice(1, 8);
          const aNodeLabel = sMotif.split("-");
          let fromNodeId = aNodeLabel[0].slice(0, 1);
          const fromNodeLabel = aNodeLabel[0].slice(2, 3);
          let toNodeId = aNodeLabel[1].slice(0, 1);
          const toNodeLabel = aNodeLabel[1].slice(2, 3);
          const groupName = `Motif_${i}`;
          let addFromNode = false;
          let addToNode = false;
          if (nodesUniqueId.indexOf(fromNodeId) === -1) {
            nodesUniqueId.push(fromNodeId);
            addFromNode = true;
          }
          if (nodesUniqueId.indexOf(toNodeId) === -1) {
            nodesUniqueId.push(toNodeId);
            addToNode = true;
          }
          if (uniqueGroups.indexOf(groupName) === -1) {
            uniqueGroups.push(groupName);
            uniqueMotifValue[groupName] = nValue;
          }
          if (i !== 0 && j == 0) {
            diff_index = i * 100;
          }
          fromNodeId = `${diff_index + parseInt(fromNodeId)}`;
          toNodeId = `${diff_index + parseInt(toNodeId)}`;
          if (nodesUniqueId.indexOf(fromNodeId) === -1) {
            nodesUniqueId.push(fromNodeId);
            addFromNode = true;
          }
          if (nodesUniqueId.indexOf(toNodeId) === -1) {
            nodesUniqueId.push(toNodeId);
            addToNode = true;
          }
          if (addFromNode) {
            this.network.nodes.push({
              id: fromNodeId,
              group: groupName,
              label: `${fromNodeLabel}`,
              color: {
                background: selectColor(fromNodeLabel),
                border: "black",
                highlight: { background: "yellow", border: "black" },
                hover: { background: "yellow", border: "black" },
              },
            });
          }
          if (addToNode) {
            this.network.nodes.push({
              id: toNodeId,
              group: groupName,
              label: `${toNodeLabel}`,
              color: {
                background: selectColor(toNodeLabel),
                border: "black",
                highlight: { background: "yellow", border: "black" },
                hover: { background: "yellow", border: "black" },
              },
            });
          }
          this.network.edges.push({
            id: edgesCount,
            from: fromNodeId,
            to: toNodeId,
          });
          edgesCount++;
        }
      }

      // add groups options
      // const colorOptions = ["green", "red", "blue", "orange"];
      uniqueGroups.map((group) => {
        uniqueGroupsObj[group] = {
          // color: {
          //   background: colorOptions[index],
          // },
          // borderWidth: 3,
        };
      }, this);
      this.network.options.groups = uniqueGroupsObj;
      this.uniqueMotifValue = uniqueMotifValue;
    },
  },
};

function selectColor(number) {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,75%)`;
}
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

