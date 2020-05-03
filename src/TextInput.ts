import * as PIXI from 'pixi.js'

export class TextInputCursorStyle {
  width: number = 4
  colorBlind: TextInputColor = { color: 0x69a7ff, alpha: 1 }
  colorLow: TextInputColor = { color: 0x69a7ff, alpha: 0.5 }
  distance: number = 6
  speedSwap: number = 500
}

export class TextInputColor {
  color: number = 0x000000
  alpha: number = 1
}

export class TextInputFontStyle {
  fontFamily?: string = "Arial"
  fontSize: number = 14
  fontStyle?: string
  fontWeight?: string
  fill?: string[]
  stroke?: string
  strokeThickness?: number
  dropShadow?: boolean
  dropShadowColor?: string
  dropShadowBlur?: number
  dropShadowAngle?: number
  dropShadowDistance?: number
}

export class TextInputOption {
  backgroundColor: TextInputColor = { color: 0xffffff, alpha: 0.5 }
  backgroundColorFocus: TextInputColor = { color: 0xffffff, alpha: 1 }

  width: number = 120
  height: number = 25
  maxHeight?: number

  style: TextInputFontStyle = new TextInputFontStyle()
  placeHolder: string = ""
  value: string = ""
  maxLength: number = -1

  roundedBorder: number = 0
  borderColor: TextInputColor = { color: 0, alpha: 1 }
  borderColorFocus: TextInputColor = { color: 0, alpha: 1 }
  borderWidth: number = 2

  multiLine: boolean = false
  wordWrapType: "break-word" | "break-all" = "break-word"
  onlyNumber: boolean = false
  min: number = Number.MIN_VALUE
  max: number = Number.MAX_VALUE

  cursorStyle: TextInputCursorStyle = new TextInputCursorStyle()
  enableCursor: boolean = true

  onChange?: (e: string | number) => void
  onFocus?: () => void
  onBlur?: () => void
}

export default class TextInput extends PIXI.Container {

  options: TextInputOption

  private textComponent: PIXI.Text
  private backgroundComponent: PIXI.Graphics
  private backgroundComponentFocus: PIXI.Graphics

  private cursorComponentBlind: PIXI.Graphics
  private cursorComponentLow: PIXI.Graphics

  private isFocus: boolean = false
  cursorPosition: number
  cursorLine: number = 0
  private cursorWorldPosition: {x: number, y: number} = {x: 0, y:0}

  private keyDownEventRef: any
  private blurEventRef: any
  private interval: number | undefined
  private blindStatus: boolean = true
  private lastComponentHeight: number = 0

  constructor(options: TextInputOption) {
    super()

    this.options = options
    this.textComponent = new PIXI.Text(this.GenerateValueDisplay())
    this.cursorPosition = this.options.value.length
    this.backgroundComponent = new PIXI.Graphics()
    this.backgroundComponentFocus = new PIXI.Graphics()
    this.cursorComponentBlind = new PIXI.Graphics()
    this.cursorComponentLow = new PIXI.Graphics()
    this.DrawBackground()
    this.DrawText()
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

  private GenerateValueDisplay(): string {
    return this.options.value == "" ? this.options.placeHolder : this.options.value
  }

  private DrawCursor(){
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

  private DrawBackground() {

    let backgroundHeight = this.options.height
    if(this.lastComponentHeight > backgroundHeight){
      backgroundHeight = this.lastComponentHeight
      if(this.options.maxHeight && backgroundHeight < this.options.maxHeight){
        backgroundHeight = this.options.maxHeight
      }
    }

    this.backgroundComponent.cacheAsBitmap = false
    this.backgroundComponent.clear()
    let option = this.options;
    this.backgroundComponent
      .lineStyle(option.borderWidth, option.borderColor.color, option.borderColor.alpha)
      .beginFill(option.backgroundColor.color, option.backgroundColor.alpha)
      .drawRoundedRect(0, 0, option.width, backgroundHeight, option.roundedBorder)
      .endFill()
    this.backgroundComponent.cacheAsBitmap = true
    this.backgroundComponentFocus.cacheAsBitmap = false
    this.backgroundComponentFocus.clear()
    this.backgroundComponentFocus
      .lineStyle(option.borderWidth, option.borderColorFocus.color, option.borderColorFocus.alpha)
      .beginFill(option.backgroundColorFocus.color, option.backgroundColorFocus.alpha)
      .drawRoundedRect(0, 0, option.width, backgroundHeight, option.roundedBorder)
      .endFill()
    this.backgroundComponentFocus.cacheAsBitmap = true
  }

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

  redraw() {
    this.DrawBackground()
    this.DrawText()
    if(this.options.enableCursor){
      this.DrawCursor()
    }
  }


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
    if (event.keyCode == 8) {
      this.fireTextChange(lastText, lastText.slice(0, this.cursorPosition - 1) + lastText.slice(this.cursorPosition), this.cursorPosition-1)
      return
    }
    //touche delete
    if (event.keyCode == 46) {
      this.fireTextChange(lastText, "", 0)
      return
    }

    if( event.keyCode >= 37 && event.keyCode <= 40 && this.options.enableCursor){
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
    var newText= lastText.slice(0, this.cursorPosition) + event.key+ lastText.slice(this.cursorPosition)
    this.textComponent.text = newText
    let newComponentSize = this.textComponent.width
    this.textComponent.text = lastText
    //Si la taille dépasse pas le container
    if (newComponentSize  > this.options.width - this.options.style.fontSize) {
      if(!this.options.multiLine){
        return
      }
      let breakPosition: number = lastText.lastIndexOf(" ")
      if(this.options.wordWrapType == "break-all" || breakPosition == -1){
        newText = this.addStringIntoStringAt(lastText, this.cursorPosition, "\n".concat(event.key))
        this.cursorPosition += 1
      } else {
        newText = this.replaceCharIntoStringAt(lastText, breakPosition, "\n")
        newText = this.addStringIntoStringAt(newText, this.cursorPosition, event.key)
      }
    }

    if (this.options.onlyNumber) {
      if(!isNaN(Number(newText))){
        var value = parseFloat(newText)
        if(value < this.options.min || value > this.options.max){
          return;
        }
      } else {
        return
      }

    }

    this.fireTextChange(lastText, newText, this.cursorPosition + 1)
  }

  addStringIntoStringAt(key: string, index: number, value: string) : string{
    return key.slice(0, index).concat(value).concat(key.slice(index))
  }
  replaceCharIntoStringAt(key: string, index: number, value: string) : string{
    return key.slice(0, index).concat(value).concat(key.slice(index +1))
  }

  useKeyboardPosition(keyCode: number){
    switch(keyCode){
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
  changeCursorPosition(position: number){
    if(position < 0){
      return false
    }
    if(position > this.textComponent.text.length){
      return false
    }
    this.cursorPosition = position
    this.cursorWorldPosition = this.calculateCursorLocation()
    this.cursorTimerEvent()
    return true
  }

  fireTextChange(lastValue: string, newValue: string, cursorPosition: number){
    this.options.value = newValue
    this.textComponent.text = newValue

    this.cursorPosition = cursorPosition
    if(this.options.onChange != undefined){
      this.options.onChange(this.options.onlyNumber ? this.textComponent.text : parseFloat(this.textComponent.text))
    }
    if(this.textComponent.height - this.lastComponentHeight  > 0
      || this.lastComponentHeight - this.textComponent.height > this.options.style.fontSize ){
      this.lastComponentHeight = this.textComponent.height + this.options.style.fontSize
      this.redraw()
    }

    this.changeCursorPosition(cursorPosition)
  }

  private calculateTextMetrics() : PIXI.TextMetrics {
    return PIXI.TextMetrics.measureText(this.textComponent.text, this.textComponent.style, true)
  }

  private calculateCursorPosition() : {metrix: PIXI.TextMetrics, line: number, positionInLine: number, afterCursorLine: string}{
    let metrix = this.calculateTextMetrics()
    let cursorLine = 0
    let positionInLine = 0
    let afterCursorLine = ""
    let actualLocationLoop = 0

    let line = metrix.text.split("\n")
    //On regarde dans toutes les lignes
    for(let value in line) {
      //On enregistre la longueurs des anciennes lignes
      let lastLocation = actualLocationLoop
      let e: string = line[value]
      //On ajoute la longueurs de la nouvelle ligne
      actualLocationLoop += e.length
      //Si la position du curseur est inférieur ou égale à la longueurs de toutes les lignes
      //On ajoute le nombre de ligne car une ligne dispose de un curseur en fin de ligne
      //Si le curseur est dans cette ligne
      if(this.cursorPosition <= actualLocationLoop + cursorLine ){
        //On recupere la position du curseur dans la ligne actuel
        positionInLine = this.cursorPosition - lastLocation - cursorLine//ERROR
        //On recupere la phrase avant le curseur pour calculer sa longueur
        afterCursorLine = e.substr(0, positionInLine)
        break;
      }
      cursorLine += 1;
    }
    return {metrix: metrix, line: cursorLine, positionInLine: positionInLine, afterCursorLine: afterCursorLine}
  }

  private calculateCursorLocation() : {x: number, y:number}
  {
    let position = this.calculateCursorPosition()
    let y = 0
    if(position.line == 0){
      y = this.options.height / 2
    } else {
      y =  (position.line * (position.metrix.lineHeight)) + this.options.height / 2
    }
    let x = PIXI.TextMetrics.measureText(position.afterCursorLine, this.textComponent.style, false).width
    + this.options.cursorStyle.distance
    return {x:x, y:y}
  }

  private displayCursor(visible: boolean, blind: boolean, position: {x: number, y: number}) {
    this.cursorComponentBlind.visible = visible ? !blind : false
    this.cursorComponentLow.visible = visible ? blind : false
    this.cursorComponentBlind.x = position.x
    this.cursorComponentBlind.y = position.y
    this.cursorComponentLow.x = position.x
    this.cursorComponentLow.y = position.y
  }

  private cursorTimerEvent(){
    this.blindStatus = !this.blindStatus
    this.displayCursor(true, this.blindStatus, this.cursorWorldPosition)
  }

  private displayBackground(focus: boolean) {
    this.backgroundComponent.visible = !focus
    this.backgroundComponentFocus.visible = focus
  }

  private AddEvent() {
    this.keyDownEventRef = this.OnKeyDown.bind(this)
    this.blurEventRef = this.blur.bind(this)
    window.addEventListener("keydown", this.keyDownEventRef);
    window.addEventListener("mousedown", this.blurEventRef);
    if(this.options.enableCursor){
      this.interval = window.setInterval(this.cursorTimerEvent.bind(this), this.options.cursorStyle.speedSwap)
    }
  }

  private RemoveEvent() {
    window.removeEventListener("keydown", this.keyDownEventRef);
    window.removeEventListener("mousedown", this.blurEventRef);
    if(this.options.enableCursor){
      window.clearInterval(this.interval)
    }
  }


  focus() {
    if (this.isFocus) {
      return;
    }
    this.displayBackground(true)
    this.AddEvent()
    this.isFocus = true
    console.log("focus")
    //remove placeholder
    this.textComponent.text = this.options.value
    if(this.options.onFocus != undefined){
      this.options.onFocus()
    }
  }

  blur() {
    if (!this.isFocus) {
      return;
    }
    this.displayBackground(false)
    this.RemoveEvent()
    this.displayCursor(false, false, {x: 0, y:0})

    //regenerate display
    this.textComponent.text = this.GenerateValueDisplay()


    this.isFocus = false
    if(this.options.onBlur != undefined){
      this.options.onBlur()
    }
  }
}
