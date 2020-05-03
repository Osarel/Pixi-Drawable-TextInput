# Pixi-Drawable-TextInput
 You need to create a text input with pixi but you don't want to use the dom of the canvas, this plugin allows you to draw your own text input


## Installation :
You can install pixi drawable text input with standard npm

`npm install pixi-drawable-textinput`

Or with yarn

`yarn add pixi-drawable-textinput`


## Use :

### Simple text input
```typescript
import "./styles.css";
import * as PIXI from "pixi.js";
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
```

[Test online](https://codesandbox.io/s/simple-pixi-textinput-6dk8b)

### Complexe text input

```typescript
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

```

[Test online](https://codesandbox.io/s/complexe-pixi-textinput-zwmtw)

## to-do list

The project is open to any new proposal and correction pull request and issues I will take the necessary measures to advance the project

### V1.0.2
- [x] Add development test server
- [x] Fix placeholder
- [ ] Fix alpha cursor
- [] Fix input out of field
- [x] Fix cursor field empty

### Futur
- [ ] Create a documentation
- [ ] Add mobile support
- [ ] Cursor up when key up and down when key down
