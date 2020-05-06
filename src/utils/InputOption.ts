import { InputColor } from "./InputColor"
import { InputFontStyle } from "./InputFontStyle"
import { InputCursorStyle } from "./InputCursorStyle"


/**
 * Text input settings class
 */
export class InputOption {
  /**
   * Color of the background
   */
  backgroundColor: InputColor = { color: 0xffffff, alpha: 0.5 }
  /**
   * Color of the background when focus
   */
  backgroundColorFocus: InputColor = { color: 0xffffff, alpha: 1 }

  /**
   * Width of the input it was static
   */
  width: number = 120
  /**
   * Height of the input it was dynamic if input is multiline
   */
  height: number = 25
  /**
   * Padding height on text
   */
  paddingHeight: number = 10
  /**
   * Max Height of the input use in multiline input
   */
  maxHeight?: number

  /**
   * Style of the input text
   */
  style: InputFontStyle = new InputFontStyle()
  /**
   * Placeholder when input is empty and blur
   */
  placeHolder: string = ""
  /**
   * Current value
   */
  value: string = ""
  /**
   * Max length of value
   */
  maxLength: number = -1

  /**
   * Border style rounded
   */
  roundedBorder: number = 0
  /**
   * Border style color
   */
  borderColor: InputColor = { color: 0, alpha: 1 }
  /**
   * Border style color on focus
   */
  borderColorFocus: InputColor = { color: 0, alpha: 1 }
  /**
   * Border width
   */
  borderWidth: number = 2

  /**
   * If multiline height is dynamics
   * wordWrapType take effect and wrap word when is to huge
   * default is false
   */
  multiLine: boolean = false
  /**
   * Word wrap type
   * break-work :  break word at last space characters
   * break-all : break word at last characters
  */
  wordWrapType: "break-word" | "break-all" = "break-word"
  /**
   * Only allow Number typing in the text input
   * Default is false
  */
  onlyNumber: boolean = false
  /**
   * if only number set minimum number to reach
   * Default is Number.MIN_VALUE
  */
  min: number = Number.MIN_VALUE
  /**
   * if only number set maximum number to reach
   * Default is Number.MAX_VALUE
  */
  max: number = Number.MAX_VALUE

  /**
   * Change cursor style
   */
  cursorStyle: InputCursorStyle = new InputCursorStyle()
  /**
   * Enable or disable cursor
   */
  enableCursor: boolean = true

  /**
   * @event
   * @description
   * Event fire when input change
   */
  onChange?: (e: string | number) => void
  /**
   * @event
   * @description
   * Event fire when input focus
   */
  onFocus?: () => void
  /**
   * @event
   * @description
   * Event fire when input blur
   */
  onBlur?: () => void
}
