// Dependencies
var express = require("express"); // router
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb"); // db
var ObjectID = mongodb.ObjectID;
var pretty = require('express-prettify');

// Db URI
MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clickclack"
// MONGODB_URI = "mongodb://master:master123@ds239873.mlab.com:39873/myclips"

// Collections
// Free form data
var CLICKS_COLLECTION = "clicks";
var CLACKS_COLLECTION = "clacks";
// Realistic data
var USERS_COLLECTION = "users";
var PRODUCTS_COLLECTION = "products";
var COMMANDS_COLLECTION = "commands";

var app = express();
app.use(express.static(__dirname + "/public")); // "/" endpoint = Simple UI with presentation and instructions
app.use(bodyParser.json()); // api data format
app.use(pretty({ query: 'pretty' }));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
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

// API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/clicks"
 *    GET: finds all clicks
 *    POST: creates a new click
 */

app.get("/clicks", function(req, res) {
  db.collection(CLICKS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get clicks.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/clicks", function(req, res) {
  var newClick = req.body;
  db.collection(CLICKS_COLLECTION).insertOne(newClick, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new click.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/clicks/:id"
 *    GET: find click by id
 *    PUT: update click by id
 *    DELETE: deletes click by id
 */

app.get("/clicks/:id", function(req, res) {
  db.collection(CLICKS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get click");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/clicks/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(CLICKS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update click");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.delete("/clicks/:id", function(req, res) {
  db.collection(CLICKS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete click");
    } else {
      res.status(204).end();
    }
  });
});

/*  "/clacks"
 *    GET: finds all clacks
 *    POST: creates a new clack
 */

app.get("/clacks", function(req, res) {
  db.collection(CLACKS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get clacks.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/clacks", function(req, res) {
  var newClack = req.body;
  db.collection(CLACKS_COLLECTION).insertOne(newClack, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new clack.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/clacks/:id"
 *    GET: find clack by id
 *    PUT: update clack by id
 *    DELETE: deletes clack by id
 */

app.get("/clacks/:id", function(req, res) {
  db.collection(CLACKS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get clack");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/clacks/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(CLACKS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update clack");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.delete("/clacks/:id", function(req, res) {
  db.collection(CLACKS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete clack");
    } else {
      res.status(204).end();
    }
  });
});

/*  "/users"
 *    GET: finds all users
 *    POST: creates a new user
 */

app.get("/users", function(req, res) {
  db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/users", function(req, res) {
  var newUser = req.body;
  // db.collection(USERS_COLLECTION).insertOne(newUser, function(err, doc) {
  //   if (err) {
  //     handleError(res, err.message, "Failed to create new user.");
  //   } else {
  //     res.status(201).json(doc.ops[0]);
  //   }
  // });
  db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {
      res.status(200).json(docs);
    }
  });
});
