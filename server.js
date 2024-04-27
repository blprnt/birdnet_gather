/*


http://brooklyn.local/todays_detections.php?ajax_detections=true&display_limit=undefined&hard_limit=5

*/


var request = require("request");
const express = require("express");
const app = express();
const fs = require('fs');
const axios = require("axios");

var HTMLParser = require('node-html-parser');


//List of host names for BirdNet nodes
let nodes = ["192.168.91.148", "192.168.91.109", "192.168.91.149"];
//This is the list of most recent birds heard (maybe can be trimmed)
let recentBirds = [];
let birdMap = {};


function gather() {

  nodes.forEach(node => {
    let url = "http://" + node + "/todays_detections.php?ajax_detections=true&display_limit=undefined&hard_limit=10"
     axios
      .get(url)
      .then((response) => {
        //console.log(response)
        var root = HTMLParser.parse(response.data);
        let blocks = root.querySelectorAll("td");

        let bird;

        for (let i = 0; i < blocks.length; i++) {
          let block = blocks[i];
          if (i % 4 == 0) {
            bird = {
              "node":node,
              "time":block.text.trim()
            };
          }
          if (i % 4 == 1) {
            //console.log(block);
            let birds = block.querySelectorAll("a");
            for (let j = 0; j < birds.length; j+=2) {
                bird.name = birds[j].text;
                bird.latin = birds[j + 1].text;
              }

          } else if (i % 4 == 2) {
            bird.confidence = block.text.split(" ")[1].trim().replace("%","");
          } else if (i % 4 == 3) {
            let audio = block.querySelector("audio");
            let title = audio.getAttribute("title");
            bird.url = "http://" + node + title;
            if (!birdMap[bird.url]) {
              recentBirds.push(bird);
              birdMap[bird.url] = bird;
            }
          }
        }


        /*
        for (let i = 0; i < birds.length; i+=2) {
          let name = birds[i].text;
          let latin = birds[i + 1].text;

        }
        */
        
      })
      .catch((err) => console.log("Fetch error " + err));

  }) 

}

setInterval(gather, 10000);
gather();

//Express server stuff
app.set('view engine', 'pug')
app.use(express.static("public"));

//Get recent bird list
app.get("/birds", (req, res) => {
  res.send(JSON.stringify(recentBirds));
});

// listen for requests :)
const listener = app.listen(50001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
