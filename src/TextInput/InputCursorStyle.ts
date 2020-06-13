import { InputColor } from "./InputColor"

/**
 * Cursor style class
 */
export class InputCursorStyle {
  /**
   * Width of the cursor
   */
  width: number = 4
  /**
  Color on blind
  */
  colorBlind: InputColor = { color: 0x69a7ff, alpha: 1 }
  /**
   * Color on low
   */
  colorLow: InputColor = { color: 0x69a7ff, alpha: 0.5 }
  /**
   * Distance from text
   */
  distance: number = 6
  /**
   * Swap speed of the cursor
   */
  speedSwap: number = 500
}
