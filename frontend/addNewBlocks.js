const fs = require("fs");

// Define the file path and new line to be added
const filePath = "./src/blocks/fractal.js";

const newLine = `Blockly.Blocks["${blockName}"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("${blockName}");
        ${
          dropdown
            ? `this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Expansão por Vértice", "vfractoid"],
                ["Expansão por Aresta", "efractoid"],
                ["Expansão por Padrão", "pfractoid"],
            ]),
            "DROPDOWN"`
            : ``
        }
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
};`;

// Read the file
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  // Append the new line to the file
  const updatedData = data + "\n" + newLine;

  // Write the updated data back to the file
  fs.writeFile(filePath, updatedData, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(`Successfully appended "${newLine}" to ${filePath}`);
  });
});
