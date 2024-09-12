class TextMessage {
  constructor({ text, onComplete, imgsrc, name }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
    this.imgsrc = imgsrc || '';
    this.name = name || "";
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessagee");

    if(this.imgsrc!=='' && this.name!==''){
    this.element.innerHTML = (`
      <div class="TextMessageName">
      ${this.name}
      </div>
      <div class="TextMessageImageDiv">
      <img src="images/${this.imgsrc}.png" class="TextMessageImage">
      </div>
      <div class="TextMessage">
      <p class="TextMessage_p"></p>
      <button class="TextMessage_button"><img class="TextMessageImageButton TextMessageImageButtonJS" src="images/hans.png"></button>
      </div>
      
    `)}

    else if(this.imgsrc===''&& this.name!==''){
      this.element.innerHTML = (`
        <div class="TextMessageName">
        ${this.name}
        </div>
        <div class="TextMessage TextMessageCss">
        <p class="TextMessage_p"></p>
        <button class="TextMessage_button"><img class="TextMessageImageButton TextMessageImageButtonJS" src="images/hans.png"></button>
        </div>
        
      `)}

    else if(this.imgsrc===''&& this.name===''){
      this.element.innerHTML = (`
        <div class="TextMessage TextMessageCss">
        <p class="TextMessage_p"></p>
        <button class="TextMessage_button"><img class="TextMessageImageButton TextMessageImageButtonJS" src="images/hans.png"></button>
        </div>
        
      `)}


    //Init the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: this.text
    })


    this.element.querySelector("button").addEventListener("click", () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("KeyZ", () => {
      this.done();
    })
    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    })

  }

  done() {

    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }

}