import TextInput, { TextInputOption } from "../../dist/TextInput";

export function GenerateSimpleTextInput() {
  var option = new TextInputOption();
  option.multiLine = true;
  option.style = { fontSize: 12 };
  option.value = "A simple text input";
  var input = new TextInput(option);
  return input
}
