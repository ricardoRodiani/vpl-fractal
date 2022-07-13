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
            new Blockly.FieldDropdown([
                ["Expansão por Vértice", "vfractoid"],
                ["Expansão por Aresta", "afractoid"],
                ["Expansão por Padrão", "pfractoid"],
            ]),
            "DROPDOWN"
        );
        this.appendDummyInput()
            .appendField("a partir de")
            .appendField(new FieldSlider(1, 1, 10), "NAME")
            .appendField("passo(s)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["aggregate"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Aggregate");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Argumento 1")
            .appendField(
                new Blockly.FieldDropdown([["Pattern", "argpattern"]]),
                "arg1"
            );
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Argumento 2")
            .appendField(
                new Blockly.FieldDropdown([["LongWritable", "arglongwritable"]]),
                "arg2"
            );
        this.appendValueInput("NAME1")
            .setCheck("String")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Custom name");
        this.appendValueInput("NAME2")
            .setCheck("String")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Key function");
        this.appendValueInput("NAME3")
            .setCheck("String")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Value function");
        this.appendValueInput("NAME")
            .setCheck("String")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Reduce function");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

function func() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
        // getting a hold of the file reference
        let file = e.target.files[0];
        // setting up the reader
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        // here we tell the reader what to do when it's done reading...
        reader.onload = (readerEvent) => {
            fileContent = readerEvent.target.result; // this is the content!
            let formData = new FormData();
            formData.append("image", fileContent);
            axios.post('http://localhost:5000/api/posts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function (response) {
                  console.log(response.data);
                })
                .catch(function (error) {
                  console.error(error);
                });
        };
    };
    input.click();
    return fileContent
}

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
    },
};

/**
 * Block Generators
 */

Blockly.JavaScript["input"] = function (block) {
    let code = Blockly.JavaScript.statementToCode(block, "NAME");
    return code;
};

Blockly.Blocks["filter"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Filter");
        this.appendValueInput("OPTION1")
            .setCheck("String")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Function");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["expand"] = function (block) {
    let tipo = block.getFieldValue("DROPDOWN");
    let passos = block.getFieldValue("NAME");
    // let value_name = Blockly.JavaScript.valueToCode(
    // 	block,
    // 	"NAME",
    // 	Blockly.JavaScript.ORDER_ATOMIC
    // );
    // TODO: Assemble JavaScript into code letiable.
    let code = `// motifs application
				val motifs = fgraph.${tipo}.
				expand(${passos}).
				`;
    return code;
};

Blockly.JavaScript["aggregate"] = function (block) {
    let value_name1 = Blockly.JavaScript.valueToCode(
        block,
        "NAME1",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let value_name2 = Blockly.JavaScript.valueToCode(
        block,
        "NAME2",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let value_name3 = Blockly.JavaScript.valueToCode(
        block,
        "NAME3",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    // TODO: Assemble JavaScript into code letiable.
    let code = `
				aggregate [Pattern,LongWritable] (
				${value_name1},
				(e,c,k) => { ${value_name2} },
				(e,c,v) => { ${value_name3} },
				(v1,v2) => { ${value_name} 	})

				val motifsMap = motifs.aggregationMap[Pattern,LongWritable](${value_name1})
					for ((motif,count) <- motifsMap) {
					logInfo(s"motif=\${motif} count=\${count}")
				}
				`;
    // TODO: Change ORDER_NONE to the correct strength.
    // return [code, Blockly.JavaScript.ORDER_NONE];
    return code;
};

Blockly.JavaScript["filter"] = function (block) {
    let value_option1 = Blockly.JavaScript.valueToCode(
        block,
        "OPTION1",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let value_option2 = Blockly.JavaScript.valueToCode(
        block,
        "OPTION2",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    // TODO: Assemble JavaScript into code letiable.
    let code = `\n${{ value_option1, value_option2 }}`;
    // TODO: Change ORDER_NONE to the correct strength.
    // return [code, Blockly.JavaScript.ORDER_NONE];
    return code;
};
