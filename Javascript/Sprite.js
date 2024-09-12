class Sprite {
  constructor(config) {

    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    //Shadow
    this.shadow = new Image();
    this.useShadow =  true; //config.useShadow || false


      this.shadow.src = config.shadowsrc || "images/shadow.png";
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    //Configure Animation & Initial State
    this.animations = config.animations|| {
      "idle-down" : [ [1,0] ],
      "idle-right": [ [1,2] ],
      "idle-up"   : [ [1,3] ],
      "idle-left" : [ [1,1] ],
      "walk-down" : [ [2,0],[1,0],[0,0],[1,0], ],
      "walk-right": [ [2,2],[1,2],[0,2],[1,2], ],
      "walk-up"   : [ [2,3],[1,3],[0,3],[1,3], ],
      "walk-left" : [ [2,1],[1,1],[0,1],[1,1], ]
    }
    console.log(config.animations)
    
  
    this.currentAnimation = "idle-down"; // config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 32;
    this.animationFrameProgress = this.animationFrameLimit;
    

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1.5;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }


  }
  

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 97 + utils.withGrid(13.5) - cameraPerson.x;//95,135
    const y = this.gameObject.y - 135 + utils.withGrid(10) - cameraPerson.y;//13.5, 10

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);


    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(this.image,
      frameX * 32, frameY * 32,
      32,32,
      x,y,
      32,32
    )

    this.updateAnimationProgress();
  }

}

