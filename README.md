# Pixi-Drawable-TextInput
 You need to create a text input with pixi but you don't want to use the dom of the canvas, this plugin allows you to draw your own text input

***

## Installation :
You can install pixi drawable text input with standard npm

`npm install pixi-drawable-textinput`

Or with yarn

`yarn add pixi-drawable-textinput`

***

## Use :

Simple text input
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
