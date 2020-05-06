import * as PIXI from 'pixi.js'
import { InputOption } from './utils/InputOption'


export { InputOption } from './utils/InputOption'
export { InputCursorStyle } from './utils/InputCursorStyle'
export { InputFontStyle } from './utils/InputFontStyle'
export  { InputColor } from './utils/InputColor'

/**
 * A PIXI TextInput container
*/
export class TextInput extends PIXI.Container {

  /**
   * Option of text input component
   * Need to use @function redraw if Container is already render
   */
  options: InputOption

  /**
   * PIXI text component
   */
  private textComponent: PIXI.Text
  /**
   * PIXI Background component on blur
   */
  private backgroundComponent: PIXI.Graphics
  /**
   * PIXI Background component on focus
   */
  private backgroundComponentFocus: PIXI.Graphics

  /**
   * PIXI Cursor component on focus
   */
  private cursorComponentBlind: PIXI.Graphics
  /**
   * PIXI Cursor component on focus
   */
  private cursorComponentLow: PIXI.Graphics

  /**
   * true if focus
   */
  private isFocus: boolean = false
  /**
   * Actual cursor position
   */
  private cursorPosition: number
  /**
   * Actual cursor position in the world
   */
  private cursorWorldPosition: { x: number, y: number } = { x: 0, y: 0 }
  /**
   * Status of cursor
   */
  private blindStatus: boolean = true

  private keyDownEventRef: any
  private blurEventRef: any
  private interval: number | undefined
  private lastComponentHeight: number = 0
  /**
   * @constructor TextInput
   * @param options Option for text input
   */
  constructor(options: InputOption) {
    super()

    this.options = options
    this.textComponent = new PIXI.Text(this.GenerateValueDisplay())

    this.cursorPosition = this.options.value.length
    this.backgroundComponent = new PIXI.Graphics()
    this.backgroundComponentFocus = new PIXI.Graphics()
    this.cursorComponentBlind = new PIXI.Graphics()
    this.cursorComponentLow = new PIXI.Graphics()
    this.redraw()
    this.backgroundComponentFocus.visible = false
    this.backgroundComponent.interactive = true
    this.backgroundComponent.buttonMode = true
    this.backgroundComponent.on("pointerup", this.focus.bind(this))
    this.backgroundComponent.on("pointerupoutside", this.blur.bind(this))
    this.addChild(this.backgroundComponent)
    this.addChild(this.backgroundComponentFocus)
    this.addChild(this.textComponent)
    this.addChild(this.cursorComponentBlind)
    this.addChild(this.cursorComponentLow)
  }

  /**
   * Generate a display value of initialisation
   */
  private GenerateValueDisplay(): string {
    let display = this.options.value == "" ? this.options.placeHolder : this.options.value
    let style = new PIXI.TextStyle(this.options.style)
    let textMesure = PIXI.TextMetrics.measureText(display, style, false).width
    if (textMesure > this.options.width - 5) {
      let displayWord = display.split(" ")
      display = ""
      let actualSentence = ""
      let actualSentenceSize = 0
      for (let wordKey in displayWord) {
        let word = displayWord[wordKey]
        let wordSize = PIXI.TextMetrics.measureText(word.concat(" "), style, false).width
        if (actualSentenceSize + wordSize > this.options.width - 5) {
          display += actualSentence.concat("\n")
          actualSentence = ""
          actualSentenceSize = 0
        }
        actualSentence += word.concat(" ")
        actualSentenceSize += wordSize
      }
      display += actualSentence
    }

    return display
  }

  /**
   * Draw or redraw cursor graphics
   */
  private DrawCursor() {
    this.cursorComponentBlind.cacheAsBitmap = false
    this.cursorComponentBlind.clear()
    let style = this.options.cursorStyle
    this.cursorComponentBlind
      .beginFill(style.colorBlind.color, style.colorBlind.alpha)
      .drawRect(0, 0, style.width, this.options.style.fontSize + 4)
      .endFill()
    this.cursorComponentBlind.cacheAsBitmap = true
    this.cursorComponentBlind.pivot.y = (this.options.style.fontSize + 4) / 2

    this.cursorComponentLow.cacheAsBitmap = false
    this.cursorComponentLow.clear()
    this.cursorComponentLow
      .beginFill(style.colorLow.color, style.colorLow.alpha)
      .drawRect(0, 0, style.width, this.options.style.fontSize + 4)
      .endFill()
    this.cursorComponentLow.cacheAsBitmap = true
    this.cursorComponentLow.pivot.y = (this.options.style.fontSize + 4) / 2
  }

  /**
 * Draw or redraw background graphics
 */
  private DrawBackground() {

    //Correct height of field
    if (this.options.multiLine) {
      this.lastComponentHeight = this.textComponent.height + this.options.paddingHeight
      if (this.options.maxHeight && this.lastComponentHeight > this.options.maxHeight) {
        this.lastComponentHeight = this.options.maxHeight
      }
    } else {
      this.lastComponentHeight = this.options.height
    }

    this.backgroundComponent.cacheAsBitmap = false
    this.backgroundComponent.clear()
    let option = this.options;
    this.backgroundComponent
      .lineStyle(option.borderWidth, option.borderColor.color, option.borderColor.alpha)
      .beginFill(option.backgroundColor.color, option.backgroundColor.alpha)
      .drawRoundedRect(0, 0, option.width, this.lastComponentHeight, option.roundedBorder)
      .endFill()
    this.backgroundComponent.cacheAsBitmap = true
    this.backgroundComponentFocus.cacheAsBitmap = false
    this.backgroundComponentFocus.clear()
    this.backgroundComponentFocus
      .lineStyle(option.borderWidth, option.borderColorFocus.color, option.borderColorFocus.alpha)
      .beginFill(option.backgroundColorFocus.color, option.backgroundColorFocus.alpha)
      .drawRoundedRect(0, 0, option.width, this.lastComponentHeight, option.roundedBorder)
      .endFill()
    this.backgroundComponentFocus.cacheAsBitmap = true
  }

  /**
   * Draw or redraw text component
  */
  private DrawText() {
    let option = this.options;

    /* if (option.center) {
      this.textComponent.anchor.x = 0.5
      this.textComponent.anchor.y = 0.5
      this.textComponent.x = option.width / 2
      this.textComponent.y = option.height / 2
    } else */
    if (option.multiLine) {
      this.textComponent.x = 5
      this.textComponent.y = 5
    } else {
      this.textComponent.x = 5
      this.textComponent.anchor.y = 0.5
      this.textComponent.y = option.height / 2
    }
    this.textComponent.style = option.style
  }

  /**
   * Redraw background - text or cursor to andle option change
   */
  redraw() {
    this.DrawText()
    this.DrawBackground()
    if (this.options.enableCursor && this.isFocus) {
      this.DrawCursor()
    }
  }

  /**
 *
 * @param event Keyboard event
 */
  private OnKeyDown(event: KeyboardEvent) {
    if (!this.isFocus) {
      return
    }
    event.preventDefault()
    //touche echap -> quitte le focus
    if (event.keyCode === 27) {
      this.blur()
    }
    var lastText = this.textComponent.text
    //touche suppr
    if (event.keyCode == 8 && lastText.length > 0) {
      this.fireTextChange(lastText, lastText.slice(0, this.cursorPosition - 1) + lastText.slice(this.cursorPosition), this.cursorPosition - 1)
      return
    }
    //touche delete
    if (event.keyCode == 46) {
      this.fireTextChange(lastText, "", 0)
      return
    }

    if (event.keyCode >= 37 && event.keyCode <= 40 && this.options.enableCursor) {
      this.useKeyboardPosition(event.keyCode)
      return
    }

    //Si c'est un caractère
    if (event.key.length > 1) {
      return
    }
    //Si la taille ne dépasse pas le max possible
    if (this.options.maxLength > -1 && lastText.length > this.options.maxLength) {
      return
    }

    //Petit manipulation pour ne pas avoir a recalculer la taille du container
    var newText = lastText.slice(0, this.cursorPosition) + event.key + lastText.slice(this.cursorPosition)
    this.textComponent.text = newText
    let newComponentSize = this.textComponent.width
    this.textComponent.text = lastText
    //Si la taille dépasse pas le container
    if (newComponentSize > this.options.width - this.options.style.fontSize) {
      if (!this.options.multiLine) {
        return
      }
      let breakPosition: number = lastText.lastIndexOf(" ")
      if (this.options.wordWrapType == "break-all" || breakPosition == -1) {
        newText = this.addStringIntoStringAt(lastText, this.cursorPosition, "\n".concat(event.key))
        this.cursorPosition += 1
      } else {
        newText = this.replaceCharIntoStringAt(lastText, breakPosition, "\n")
        newText = this.addStringIntoStringAt(newText, this.cursorPosition, event.key)
      }
    }

    if (this.options.onlyNumber) {
      if (!isNaN(Number(newText))) {
        var value = parseFloat(newText)
        if (value < this.options.min || value > this.options.max) {
          return;
        }
      } else {
        return
      }

    }

    this.fireTextChange(lastText, newText, this.cursorPosition + 1)
  }


  /**
   *
   * @param key Key string
   * @param index position to add value
   * @param value string to add
   */
  private addStringIntoStringAt(key: string, index: number, value: string): string {
    return key.slice(0, index).concat(value).concat(key.slice(index))
  }
  /**
   *
   * @param key Key string
   * @param index position to replace char
   * @param value string to replace
   */
  private replaceCharIntoStringAt(key: string, index: number, value: string): string {
    return key.slice(0, index).concat(value).concat(key.slice(index + 1))
  }

  /**
   *
   * @param keyCode
   * Keycode: 37 for right
   *          38 for up
   *          39 for left
   *          40 for bottom
   */
  useKeyboardPosition(keyCode: number) {
    switch (keyCode) {
      case 37:
        //Gauche
        this.changeCursorPosition(this.cursorPosition - 1)
        break
      case 38:
        //Haut
        this.changeCursorPosition(this.cursorPosition - this.calculateCursorPosition().positionInLine)
        break
      case 39:
        //Droite
        this.changeCursorPosition(this.cursorPosition + 1)
        break
      case 40:
        //Bas
        this.changeCursorPosition(this.cursorPosition + this.calculateCursorPosition().positionInLine)
        break
    }
  }

  /**
   * Set new cursor position
   * @param position position to set
   */
  changeCursorPosition(position: number) {
    if (position < 0) {
      return false
    }
    if (position > this.textComponent.text.length) {
      return false
    }
    this.cursorPosition = position
    this.cursorWorldPosition = this.calculateCursorLocation()
    this.cursorTimerEvent()
    return true
  }

  /**
   * Update text
   * @param lastValue last value
   * @param newValue new value
   * @param cursorPosition new cursor position after change
   */
  fireTextChange(lastValue: string, newValue: string, cursorPosition: number) {
    this.options.value = newValue
    this.textComponent.text = newValue

    this.cursorPosition = cursorPosition
    if (this.options.onChange != undefined) {
      this.options.onChange(this.options.onlyNumber ? this.textComponent.text : parseFloat(this.textComponent.text))
    }
    if (this.textComponent.height - this.lastComponentHeight > 0) {
      this.redraw()
    }

    this.changeCursorPosition(cursorPosition)
  }

  /**
   * Calculate size of the text
   */
  calculateValueMetrics(): PIXI.TextMetrics {
    return PIXI.TextMetrics.measureText(this.textComponent.text, this.textComponent.style, false)
  }

  /**
   * calculate
   *  metrix
   *  cursor line
   *  position in line
   *  text after cursor in line
   */
  private calculateCursorPosition(): { metrix: PIXI.TextMetrics, line: number, positionInLine: number, afterCursorLine: string } {
    let metrix = this.calculateValueMetrics()
    let cursorLine = 0
    let positionInLine = 0
    let afterCursorLine = ""
    let actualLocationLoop = 0

    let line = metrix.text.split("\n")
    //On regarde dans toutes les lignes
    for (let value in line) {
      //On enregistre la longueurs des anciennes lignes
      let lastLocation = actualLocationLoop
      let e: string = line[value]
      //On ajoute la longueurs de la nouvelle ligne
      actualLocationLoop += e.length
      //Si la position du curseur est inférieur ou égale à la longueurs de toutes les lignes
      //On ajoute le nombre de ligne car une ligne dispose de un curseur en fin de ligne
      //Si le curseur est dans cette ligne
      if (this.cursorPosition <= actualLocationLoop + cursorLine) {
        //On recupere la position du curseur dans la ligne actuel
        positionInLine = this.cursorPosition - lastLocation - cursorLine//ERROR
        //On recupere la phrase avant le curseur pour calculer sa longueur
        afterCursorLine = e.substr(0, positionInLine)
        break;
      }
      cursorLine += 1;
    }
    return { metrix: metrix, line: cursorLine, positionInLine: positionInLine, afterCursorLine: afterCursorLine }
  }

  /**
   * Calculate cursor location in container
   */
  private calculateCursorLocation(): { x: number, y: number } {
    let position = this.calculateCursorPosition()
    let y = 0
    if (position.line == 0) {
      y = this.options.height / 2
    } else {
      y = (position.line * (position.metrix.lineHeight)) + this.options.height / 2
    }
    let x = PIXI.TextMetrics.measureText(position.afterCursorLine, this.textComponent.style, false).width
      + this.options.cursorStyle.distance
    return { x: x, y: y }
  }

  /**
   * Change display cursor status
   *
   * @param visible cursor is visible ?
   * @param blind cursor is blind ?
   * @param position cursor position
   */
  private displayCursor(visible: boolean, blind: boolean, position: { x: number, y: number }) {
    this.cursorComponentBlind.visible = visible ? !blind : false
    this.cursorComponentLow.visible = visible ? blind : false
    this.cursorComponentBlind.x = position.x
    this.cursorComponentBlind.y = position.y
    this.cursorComponentLow.x = position.x
    this.cursorComponentLow.y = position.y
  }

  /**
   * Event for cursor refresh
   */
  private cursorTimerEvent() {
    this.blindStatus = !this.blindStatus
    this.displayCursor(true, this.blindStatus, this.cursorWorldPosition)
  }


  /**
   * display background focus or blur
   * @param focus true if focus
   */
  private displayBackground(focus: boolean) {
    this.backgroundComponent.visible = !focus
    this.backgroundComponentFocus.visible = focus
  }

  /**
   * Add event after focus
   */
  private AddEvent() {
    this.keyDownEventRef = this.OnKeyDown.bind(this)
    this.blurEventRef = this.blur.bind(this)
    window.addEventListener("keydown", this.keyDownEventRef);
    window.addEventListener("mousedown", this.blurEventRef);
    if (this.options.enableCursor) {
      this.interval = window.setInterval(this.cursorTimerEvent.bind(this), this.options.cursorStyle.speedSwap)
    }
  }
  /**
   * Add event after blind
   */
  private RemoveEvent() {
    window.removeEventListener("keydown", this.keyDownEventRef);
    window.removeEventListener("mousedown", this.blurEventRef);
    if (this.options.enableCursor) {
      window.clearInterval(this.interval)
    }
  }


  /**
   * Set focus to component, force keyboard event to it
   */
  focus() {
    if (this.isFocus) {
      return;
    }
    this.displayBackground(true)
    this.AddEvent()
    this.isFocus = true
    //remove placeholder
    this.textComponent.text = this.options.value
    if (this.options.onFocus != undefined) {
      this.options.onFocus()
    }
  }

  /**
   * Set blur to component, remove event
   */
  blur() {
    if (!this.isFocus) {
      return;
    }
    this.displayBackground(false)
    this.RemoveEvent()
    this.displayCursor(false, false, { x: 0, y: 0 })

    //regenerate display
    this.textComponent.text = this.GenerateValueDisplay()


    this.isFocus = false
    if (this.options.onBlur != undefined) {
      this.options.onBlur()
    }
  }
}

export default TextInput
