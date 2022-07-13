<template>
  <div id="app" data-app>
    <BlocklyComponent id="blockly" :options="options" ref="ref_blk" />
    <div class="text-center">
      <v-dialog v-model="dialog" width="700px" scrollable>
        <template v-slot:activator="{ on }">
          <v-btn absolute right top @click="showCode" dark v-on="on">
            <span> Show Code</span>
            <v-icon small right>mdi-eye</v-icon>
          </v-btn>
        </template>
        <v-card>
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
    </div>
  </div>
</template>

<script>
import BlocklyJS from "blockly/javascript";
import BlocklyComponent from "./components/BlocklyComponent.vue";
import DarkTheme from "@blockly/theme-dark";
import axios from "axios";
import "./blocks/fractal";

export default {
  name: "app",
  components: {
    BlocklyComponent,
  },
  data() {
    return {
      msg: "",
      header: `
              // file: fractal-apps/src/main/scala/br/ufmg/cs/systems/fractal/apps/MyMotifsApp.scala
              package br.ufmg.cs.systems.fractal.apps

              import br.ufmg.cs.systems.fractal._
              import br.ufmg.cs.systems.fractal.pattern.Pattern
              import br.ufmg.cs.systems.fractal.util.Logging
              import org.apache.hadoop.io.LongWritable
              import org.apache.spark.{SparkConf, SparkContext}

              object MyFractalApp extends Logging {
                def main(args: Array[String]): Unit = {
                  // environment setup
                  val conf = new SparkConf().setAppName("MotifsApp")
                  val sc = new SparkContext(conf)
                  val fc = new FractalContext(sc)
                  val graphPath = args(0) // input graph
                  val fgraph = fc.textFile (graphPath)
                  `,
      footer: `
              // environment cleaning
                  fc.stop()
                  sc.stop()
                }
              }
              `,
      code: "",
      dialog: false,
      dialogFile: false,
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
          <value name="NAME1">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
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
      this.code = BlocklyJS.workspaceToCode(this.$refs["ref_blk"].workspace);
      this.code = this.header + this.code;
      this.code = this.code + this.footer;
      var json = BlocklyJS.serialization.workspaces.save(this.$refs["ref_blk"].workspace);
      const options = {
        method: "GET",
        url: "/api/posts/",
        headers: { "Content-Type": "application/json" },
        data: {
          statement: '2 * 3',
          json
        },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });

      // fetch("api/cliques/2", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json;charset=utf-8",
      //   },
      //   body: {
      //     file: "local:/home/zxc/libs_tcc/fractal/fractal-core/build/libs/fractal-core-SPARK-2.2.0.jar",
      //     className: "br.ufmg.cs.systems.fractal.FractalSparkRunner",
      //     args: [
      //       "al",
      //       "/home/zxc/libs_tcc/fractal/data/citeseer-single-label.graph",
      //       "cliques",
      //       "scratch",
      //       "1",
      //       "2",
      //       "info",
      //     ],
      //     driverMemory: "2g",
      //     numExecutors: 1,
      //     executorCores: 1,
      //     executorMemory: "2g",
      //   },
      // })
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.code);
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
</style>

