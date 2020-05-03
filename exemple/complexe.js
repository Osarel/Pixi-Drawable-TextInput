import * as PIXI from "pixi.js";
import TextInput, {
  TextInputOption,
  TextInputCursorStyle
} from "pixi-drawable-textinput";
const app = new PIXI.Application({
  width: 800,
  height: 400,
  backgroundColor: 0x1099bb
});
document.body.appendChild(app.view);
var option = new TextInputOption();
option.backgroundColorFocus = { color: 0xcffbff, aplha: 1 };
option.backgroundColor = { color: 0xe02f5e, aplha: 1 };
option.multiLine = true;
option.maxLength = 100;
option.roundedBorder = 40;
option.borderWidth = 5;
option.style = {
  fontFamily: "Arial",
  fontSize: 36,
  fontStyle: "italic",
  fontWeight: "bold",
  fill: ["#ffffff", "#00ff99"], // gradient
  stroke: "#4a1850",
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6
};
option.height = 60;
option.width = 400;
option.value = "A complexe text input";

option.cursorStyle = new TextInputCursorStyle();
option.cursorStyle.distance = 0;
option.cursorStyle.colorBlind = { color: 0xff0000, aplha: 1 };
option.cursorStyle.colorLow = { color: 0x000000, aplha: 0.5 };
option.cursorStyle.width = 10;
option.cursorStyle.speedSwap = 200;
var input = new TextInput(option);

input.x = 10;
input.y = 10;

app.stage.addChild(input);
