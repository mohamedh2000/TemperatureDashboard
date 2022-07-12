const express = require("express");
var cors = require("cors");
const app = express();
const port = 3001;
app.use(cors({ origin: "http://localhost:3000" }));
var bodyParser = require("body-parser");
const Redis = require("ioredis");
const redis = new Redis();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

let tempArr = [];

app.get("/getData", (req, res) => {
  //only last 15
    let getSlice = async () => {
        let tempData = await redis.lrange("temperature", 0, -1);
        let mostRecent = [];
        if(tempData.length > 15) {
            mostRecent = tempData.slice(tempData.length - 15);
            console.log(mostRecent)
        }
        let refactoredMap = [];
        mostRecent.map((val) => {refactoredMap.push({'uv': parseInt(val)})})
        res.status(200).send(refactoredMap);
    }
    getSlice();
    
});

app.post("/newTemp", (req, res) => {

    let pushNew = async () => {
        let newTemperature = req.body.temperature;
        console.log(newTemperature)
        await redis.rpush("temperature", newTemperature);
        tempArr.push(newTemperature);
        res.sendStatus(200);
    }
    pushNew();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
