var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CLIPS_COLLECTION = "clips";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/clips"
 *    GET: finds all clips
 *    POST: creates a new clip
 */

app.get("/clips", function(req, res) {
  db.collection(CLIPS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/clips", function(req, res) {
  var newClip = req.body;

  if (!(req.body.name || req.body.description)) {
    handleError(res, "Invalid user input", "Must provide a name and description.", 400);
  }

  db.collection(CLIPS_COLLECTION).insertOne(newClip, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new clip.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/clips/:id"
 *    GET: find clip by id
 *    PUT: update clip by id
 *    DELETE: deletes clip by id
 */

app.get("/clips/:id", function(req, res) {
  db.collection(CLIPS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get clip");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/clips/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(CLIPS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update clip");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/clips/:id", function(req, res) {
  db.collection(CLIPS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete clip");
    } else {
      res.status(204).end();
    }
  });
});
