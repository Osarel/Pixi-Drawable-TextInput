import * as PIXI from "pixi.js"
import { GenerateComplexeTextInput } from "./TextInput/complexeInput";
import { GenerateSimpleTextInput } from "./TextInput/simpleInput";
import { GeneratePlaceHolderInput } from "./TextInput/placeholderInput";
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb
});
document.body.appendChild(app.view)
//Generate complexe text input
app.stage.addChild(GenerateComplexeTextInput());

//Generate simple text input
let input = GenerateSimpleTextInput()
input.x = 500
app.stage.addChild(input);

//Generate placeholder text input
let placeholder = GeneratePlaceHolderInput()
placeholder.x = 1000
app.stage.addChild(placeholder);
