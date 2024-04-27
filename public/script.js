
let songMap = {};
let ipMap = {};

let songs = [];
let ips = [];

function setup() {
  getBirds();
}

function draw() {
  //YYYY-MM-DDTHH:mm:ss.sssZ
  let now = new Date();
  songs.forEach(song => {
    let m = now.getMonth() + 1;
    let fm = ("0" + m).slice(-2);
    let ds = (1900 + now.getYear()) + "-" + fm + "-" + now.getDate() + "T" + song.time;
    let sTime = new Date(ds);

    let elapsed = (now.getTime() - sTime.getTime()) / 60000;

    song.el.position(song.el.position().x, map(elapsed, 0, 100, 50, windowHeight));

  });

}

function addSong(_bird) {
  let b = createDiv(_bird.name);
  b.class("song");
  b.position(random(windowWidth), random(windowHeight));
  _bird.el = b;
  songs.push(_bird);
}

async function getBirds() {
  const response = await fetch("/birds");
  const birds = await response.json();
  
  birds.forEach(bird => {
    //have we seen the node before?
    if (!ipMap[bird.node]) {
      ipMap[bird.node] = true;
      ips.push(bird.node);
    }

    //have we seen this song before?
    if (!songMap[bird.url]) {
      songMap[bird.url] = true;
      addSong(bird);
    }
  });
}

setInterval(getBirds, 10000);