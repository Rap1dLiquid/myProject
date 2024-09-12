const utils = {
  withGrid(n) {
    return n * 32;
  },
  asGridCoord(x,y,dir) {
    dir= dir||''
    if(dir!==''){
    return `${x*32},${y*32},${dir}`
    }
    else if(dir===''){
    return `${x*32},${y*32}`
    }

  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 32;
    if (direction === "left") { 
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }
    return {x,y};
  },
  oppositeDirection(direction) {
    if (direction === "left") { return "right" }
    if (direction === "right") { return "left" }
    if (direction === "up") { return "down" }
    return "up"
  },

  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail
    });
    document.dispatchEvent(event);
  }
  
}





































































































































//I'm not good enough, i could never be good enough.
//i could never be good enough for you.
//I Hate my self, i should have been grateful , i should have told you at the peak of our friendship. im an idiot
//i should have noticed the signs that you were interested in me , but now you have lost interest. i hate myself
//i should have not been nervous .i should have talked to you, i should have, i don't want to be nervous,
//i hate it that im nervous, i hate it that i was born the quiet kid.
//i hate it that i was born nervous, especially with people i secretly like.
//i hate it that im fat , i hate it that im stupid, i hate it that i couldnt talk to people
//i hate it that i couldn't talk to beautiful people.
//i should have killed myself,
//Perhaps now.


