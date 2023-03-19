import * as Blockly from "blockly/core";
import { FieldSlider } from "@blockly/field-slider";
import file_path from "./../assets/file_upload.svg";
import axios from "axios";

let fileContent;

/**
 * Blocks definition
 */

Blockly.Blocks["expand"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("Expand");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([["Expansão por Vértice", "vfractoid"]]),
      "DROPDOWN"
    );
    this.appendDummyInput()
      .appendField("com k =")
      .appendField(new FieldSlider(1, 1, 10), "SLIDER")
      .appendField("vértice(s)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["multiline_arg"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldMultilineInput(""),
      "MULT_ARG"
    );

    this.setOutput(true, null);
    this.setColour(160);
  },
};

Blockly.JavaScript["multiline_arg"] = function (block) {
  let code = block.getFieldValue("MULT_ARG");
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks["multiline_append"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Free code")
      .appendField(new Blockly.FieldMultilineInput(""), "MULT_APND")
      .setCheck("String");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(275);
  },
};

Blockly.JavaScript["multiline_append"] = function (block) {
  let code = block.getFieldValue("MULT_APND");
  return code;
};

Blockly.Blocks["aggregate"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("Aggregate");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Argumento 1")
      .appendField(new Blockly.FieldDropdown([["Pattern", "Pattern"]]), "arg1");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Argumento 2")
      .appendField(
        new Blockly.FieldDropdown([["LongWritable", "LongWritable"]]),
        "arg2"
      );
    this.appendValueInput("KEY_FN")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Key function (e,c,k)");
    this.appendValueInput("VALUE_FN")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Value function (e,c,v)");
    this.appendValueInput("REDUCE_FN")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Reduce function (v1,v2)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["filter"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("Filter");
    this.appendValueInput("FUNCTION")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Function (e,c) ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["input"] = {
  init: function () {
    this.appendStatementInput("NAME")
      .setCheck("expand")
      .appendField("Input")
      .appendField(
        new Blockly.FieldImage(
          file_path,
          30,
          30,
          { alt: "*", flipRtl: "FALSE" },
          // function called when click on image
          func
        )
      );
    this.setColour(60);
    this.setTooltip("Selecione o arquivo de entrada");
    this.setHelpUrl("");
    this.setOnChange(function () {
      if (fileContent !== undefined) {
        this.setWarningText(null);
      } else {
        this.setWarningText("Por favor, selecione um arquivo");
      }
    });
  },
};

function func() {
  let input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => {
    // getting a hold of the file reference
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:3080/fractal/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response.data.data.name);
      })
      .catch(function (error) {
        console.error(error);
      });
    // setting up the reader

    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    // here we tell the reader what to do when it's done reading...
    reader.onload = (readerEvent) => {
      fileContent = readerEvent.target.result; // this is the content!
    };
  };
  input.click();
  return fileContent;
}

/**
 * Block Generators
 */

Blockly.JavaScript["input"] = function (block) {
  let code = Blockly.JavaScript.statementToCode(block, "NAME");
  return code;
};

Blockly.JavaScript["expand"] = function (block) {
  let passos = block.getFieldValue("SLIDER");
  // let choice = block.getFieldValue("DROPDOWN");

  let code = `expand(${passos}).
				`;
  return code;
};

Blockly.JavaScript["aggregate"] = function (block) {
  let key_fn = Blockly.JavaScript.valueToCode(
    block,
    "KEY_FN",
    Blockly.JavaScript.ORDER_ATOMIC
  ).replace(/["']/g, "");
  let value_fn = Blockly.JavaScript.valueToCode(
    block,
    "VALUE_FN",
    Blockly.JavaScript.ORDER_ATOMIC
  ).replace(/["']/g, "");
  let reduce_fn = Blockly.JavaScript.valueToCode(
    block,
    "REDUCE_FN",
    Blockly.JavaScript.ORDER_ATOMIC
  ).replace(/["']/g, "");
  let arg1 = block.getFieldValue("arg1").replace(/["']/g, "");
  let arg2 = block.getFieldValue("arg2").replace(/["']/g, "");
  let code = `aggregate [${arg1},${arg2}] (
                    "motifs", 
                    (e,c,k) => { ${key_fn} },
                    (e,c,v) => { ${value_fn} },
                    (v1,v2) => { ${reduce_fn} 	}
                )
                val motifsMap = motifs.aggregationMap[${arg1},${arg2}]("motifs") 
				`;
  return code;
};

Blockly.JavaScript["filter"] = function (block) {
  let value_option1 = Blockly.JavaScript.valueToCode(
    block,
    "FUNCTION",
    Blockly.JavaScript.ORDER_ATOMIC
  ).replace(/["']/g, "");
  let arg;
  if (value_option1.includes("s.")) {
    arg = "s";
  } else {
    arg = "e";
  }
  let code = `filter { (${arg},c) => ${value_option1} }.`;
  return code;
};
