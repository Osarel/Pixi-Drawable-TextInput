import TextInput, { TextInputOption } from "../../dist/TextInput";

export function GeneratePlaceHolderInput() {
  var option = new TextInputOption();
  option.multiLine = true;
  option.style = { fontSize: 14 };
  option.placeHolder = "I am a placeholder"
  var input = new TextInput(option);
  return input
}
