import TextInput, { TextInputOption } from "pixi-drawable-textinput";
const app = new PIXI.Application({
  width: 400,
  height: 200,
  backgroundColor: 0x1099bb
});
document.body.appendChild(app.view);
var option = new TextInputOption();
option.multiLine = true;
option.style = { fontSize: 12 };
option.value = "A simple text input";
var input = new TextInput(option);

app.stage.addChild(input);
