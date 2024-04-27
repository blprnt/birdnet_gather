var request = require("request");
const express = require("express");
const app = express();


//List of host names for BirdNet nodes
let nodes = ["brighton", "brooklyn", "moos"];
//This is the list of most recent birds heard (maybe can be trimmed)
let recentBirds = [];


//Express server stuff
app.set('view engine', 'pug')
app.use(express.static("public"));

//Get historic observations at a location
app.get("/birds", (req, res) => {
  res.send(JSON.stringify(recentBirds));
});

// listen for requests :)
const listener = app.listen(5050, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
