var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var fs = require('fs');


// Writes asynchronously

// Creates the app for express
var app = express();

// Enables json parsing
app.use(bodyParser.json());

// Initializing Firebase Backend
var myDataRef = new Firebase('https://luminous-heat-8591.firebaseio.com/');

app.get('/', function(req, res) {
  res.sendFile(__dirname+ '/index.html');
});

// Server responding to GET request
app.get('/notes', function (req,res) {
    var returnData = [];
	myDataRef.once("value", function(snap) {
        snap.forEach(function(valueSnap) {
            returnData.push({x:parseFloat(valueSnap.val().x), y:parseFloat(valueSnap.val().y), z:parseFloat(valueSnap.val().z), text:valueSnap.val().text, color:parseInt(valueSnap.val().color)});
        })
		//console.log("All data: ", snap.val());
        console.log("Return data: ", returnData);
        res.contentType('application/json');
        res.send(JSON.stringify(returnData)); 
	});

	//res.sendFile(__dirname+ '/index.html');
});


// Server responding to POST request
app.post('/notes', function (req,res) {

	// Storing data into database

    // console.log(req.param("x"));
    // console.log(req.params.x);

    var body = '';
    // Event listener for starting to read data (save data here)
    // Right now we only use these event listeners to debug
    req.on('data', function (data) {
        body += data;
        // console.log("Partial body: " + body);
        

        // Parsing the data from the request (TODO: NEED TO USE REAL JSON ATTRIBUTES)
        
        // TODO: COMMENT THIS AFTER WE GET ACTUAL IMPLEMENTATION WORKING!
        //myDataRef.push({requestText:body});

        // TODO: UNCOMMENT THESE NEXT 5 LINES AFTER ACTUAL IMPLEMENTATION IS WOKRING
        console.log()
        var noteDict = {};
        var splitData = body.split("&");

        if (splitData[0] && splitData[1] && splitData[2] && splitData[3] && splitData[4]) {

            var first = splitData[0].split("=")
            var second = splitData[1].split("=")
            var third = splitData[2].split("=")
            var fourth = splitData[3].split("=")
            var fifth = splitData[4].split("=")

            noteDict[first[0]] = first[1]
            noteDict[second[0]] = second[1]
            noteDict[third[0]] = third[1]
            noteDict[fourth[0]] = fourth[1]
            noteDict[fifth[0]] = fifth[1]

            var x = noteDict["x"];
            var y = noteDict["y"];
            var z = noteDict["z"];
            var text = noteDict["text"];
            var color = noteDict["color"];

            myDataRef.push({text:text, x:x, y:y, z:z, color: color});
            console.log("POST RECEIVED: ");

        } else {
            console.log("invalid data format");
        }

    });

    // Event listener for after end of data reached (perform actions to be done after data is processed here)
    req.on('end', function () {
        //console.log("Body: " + body);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('post received');

    });

    // Writing to the response and sending it
});

// App listening on Port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on Port 3000");
});
