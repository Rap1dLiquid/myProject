class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }
  
  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  isSpaceTaken(currentX, currentY, direction){
    const {x,y} = utils.nextPosition(currentX, currentY, direction);//suppose wall is 2,2
    if(direction==="left"){
      return this.walls[`${x},${y},right`] || this.walls[`${x},${y}`] || false;
      }
      else if(direction==="right"){
      return this.walls[`${x},${y},left`] || this.walls[`${x},${y}`] || false;
      }
      else if(direction==="up"){
      return this.walls[`${x},${y},down`]  || this.walls[`${x},${y}`] || false;
      }
       else if(direction==="down"){
      return this.walls[`${x},${y},up`] || this.walls[`${x},${y}`] || false;
      }
     
      

  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  Nothing: {
    lowerSrc: "images/literalNothing.png",
    upperSrc: "images/literalNothing.png",
  },
  DemoRoom: {
    lowerSrc: "images/Whitespace.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(26),
        y: utils.withGrid(28),
        src: "images/Omori.png",
        events:[
          { type: "walk", direction: "up", time: 800},
        ]
      }),
      bookWhiteSpace: new GameObject({
        x: utils.withGrid(29),
        y: utils.withGrid(26),
        src: "",
        useShadow:false,
        talking:[
          {
        events: [
        { type:"textMessage", text:"A SketchBook."},
        ]
      }
      ]
      }),
      tissueWhiteSpace: new Person({
        x: utils.withGrid(29),
        y: utils.withGrid(28),
        src: "",
        talking:[
          {
        events: [
        { type:"textMessage", text:"A tissue to wipe away your sorrows."},
        ]
      }
      ]
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "npc1.png",
        behaviorLoop: [

        ],
        
        talking: [
          {
            events: [
              { type: "textMessage", text: "Stranger 1: hey", faceHero: "npcA" },
              { type: "textMessage", text: "Me : uhh hey"},
              { who: "hero", type: "walk",  direction: "up" },
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "npc2.png",
        // behaviorLoop: [
        //   { type: "walk",  direction: "left" },
        //   { type: "stand",  direction: "up", time: 800 },
        //   { type: "walk",  direction: "up" },
        //   { type: "walk",  direction: "right" },
        //   { type: "walk",  direction: "down" },
        // ]
      }),
    },
    walls:{
      //"16,16": true,
      [utils.asGridCoord(29,28)]: true,
      [utils.asGridCoord(29,26)]: true,
    },
    cutsceneSpaces: {
    
    }
    
  },
  NeighborsRoom: {
    lowerSrc: "images/neighborsroom.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        name:'omori',
        isPlayerControlled: true,
        x: utils.withGrid(15),
        y: utils.withGrid(15),
        src: "images/Omori.png",
        
        events:[
          { type: "walk", direction: "up", time: 800},
        ]
      }),
      basil: new Person({
        x: utils.withGrid(15),
        y: utils.withGrid(17),
        src: "images/BasilDreamSprite.png",
        behaviorLoop: [
          {type:'stand', direction:'down', time:500},
          {type:'stand', direction:'right', time:500},
          {type:'stand', direction:'up', time:90000},
          ],
        talking:[{
        events:[
          {type:"textMessage", text: "Hello!, i'm BASIL!", faceHero:"basil",imgsrc:"", name:"???"},
          {type:"textMessage", text: "I Like Cameras and Flowers!", faceHero:"basil" ,imgsrc:"BasilNeutral", name:"BASIL"},
          {type:"textMessage", text: "Let's Be Friends!", faceHero:"basil" , imgsrc:"BasilSquintHappy", name:"BASIL"},
          {type:"textMessage", text: "Okay", faceHero:"basil", imgsrc:"OmoriNeutral1", name:"SUNNY"}
        ]
      }]
      }),

      kel: new Person({
        x:utils.withGrid(16),
        y:utils.withGrid(17),
        src:"images/KelSprite.png",
        talking:[{
          events:[
            {type:"textMessage", text: "Hello", faceHero:"kel", imgsrc:"KelSmiling1", name:"KEL"}
          ]
        }]
       
      }),

      HeadPillowNeighborsRoom: new GameObject2({
        x: utils.withGrid(15),
        y:utils.withGrid(13),
        src:"",
        talking:[
          {
          events:[
            {type:"textMessage", text: "A pillow shaped like a girl's head"},
          ]
        }
        ]
      }),


    },
    walls:{
      //"16,16": true,
     [utils.asGridCoord(19,14,'left')]:true,
     [utils.asGridCoord(19,15,'left')]:true,
     [utils.asGridCoord(20,14)]:true,
     [utils.asGridCoord(11,17)]:true,
     [utils.asGridCoord(11,18)]:true,
     [utils.asGridCoord(10,18)]:true,
     [utils.asGridCoord(10,17)]:true,
     [utils.asGridCoord(9,17)]:true,
     [utils.asGridCoord(9,18)]:true,
     [utils.asGridCoord(8,13)]:true,
     [utils.asGridCoord(9,13)]:true,
     [utils.asGridCoord(10,13)]:true,
     [utils.asGridCoord(11,13)]:true,
     [utils.asGridCoord(12,13)]:true,
     [utils.asGridCoord(13,13)]:true,
     [utils.asGridCoord(14,13)]:true,
     [utils.asGridCoord(15,13)]:true,
     [utils.asGridCoord(16,13)]:true,
     [utils.asGridCoord(17,13)]:true,
     [utils.asGridCoord(18,13)]:true,
     [utils.asGridCoord(21,13)]:true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(15,23)]: [
        {
          events: [
            { type: "changeMap", map:"DemoRoom" },
          ]
        }
      ],
      [utils.asGridCoord(19,10)]: [
        {
          events: [
            { type: "changeMap", map:"stumpEntrance" },
          ]
        }
      ],
      [utils.asGridCoord(20,10)]: [
       {
          events: [
            { type: "changeMap", map:"stumpEntrance" },
          ]
        }
      ], 
    }
    
  },
  stumpEntrance: {
    lowerSrc: "images/stumpEntrance.png",
    upperSrc: "images/stumpEntranceUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(15),
        src: "images/Omori.png",
        events:[
  
        ]
      }),
    },
    walls:{
      //"16,16": true,
 
    },
    cutsceneSpaces: {
       [utils.asGridCoord(10,30)]: [
        {
           events: [
             {who:"hero", type:"walk",direction:"down",time:1500},
             {type:"changeMap", map:"ForestPlayground"}
           ]
         }
       ], 
       [utils.asGridCoord(10,14)]: [
        {
           events: [
             { type: "changeMap", map:"NeighborsRoom" },
           ]
         }
       ], 
    }
    
  },

  ForestPlayground: {
    lowerSrc: "images/ForestPlayground.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(21),//21,8
        y: utils.withGrid(8),
        src: "images/Omori.png",
        events:[
          
        ]
      }),
  
    },
    walls:{
      //"16,16": true,
      [utils.asGridCoord(12,15)]:true,
      [utils.asGridCoord(12,13)]:true,
      [utils.asGridCoord(13,13)]:true,
      [utils.asGridCoord(14,17)]:true,
    },
    cutsceneSpaces: {
     [utils.asGridCoord(21,7)]:[
      {events:[
        {type:'changeMap', map:'stumpEntrance'}
      ]}
     ]
    }
    
  },

}

