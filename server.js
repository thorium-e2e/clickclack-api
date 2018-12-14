// Dependencies
var express = require("express"); // router
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb"); // db
var ObjectID = mongodb.ObjectID;
var pretty = require('express-prettify');
var debug = require('debug')('clickclack-api');

/** ENVIRONMENT **/

// Application PORT
PORT = process.env.PORT || 5000;

// Db URI
MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clickclack"
debug("MONGODB_URI is " + MONGODB_URI);

// Collections
// Free form data
// var CLICKS_COLLECTION = "clicks";
var CLACKS_COLLECTION = "clacks";
// // Real data
// var USERS_COLLECTION = "users";
// var PRODUCTS_COLLECTION = "products";
// var COMMENTS_COLLECTION = "comments";
// var COMMANDS_COLLECTION = "commands";

var app = express();

// "/" endpoint = Simple UI with presentation and instructions
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // api data format
app.use(pretty({ query: 'pretty' }));

// Create a database variable
// outside of the database connection callback
// to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  debug("Database connection is ready");

  // Initialize the app.
  var server = app.listen(PORT, function () {
    var port = server.address().port;
    debug("App now running on port", port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  debug("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

// API ROUTES BELOW

/*  "/clacks"
 *    GET: finds all clacks
 *    POST: creates a new clack
 */

 app.get("/clacks", function(req, res) {
   debug("server receives a request", "GET /clacks");
   db.collection(CLACKS_COLLECTION).find({}).toArray(
     function(err, docs) {
       if (err) {
         handleError(res, err.message, "Failed to get clacks.");
       } else {
         debug("server interacts with database", "Found " + docs.length + " documents");
         res.status(200).json(docs);
       }
     });
 })

app.post("/clacks", function(req, res) {
  debug("server receives a request", "POST /clacks with body :\n" + JSON.stringify(req.body));
  var newClack = req.body;
  db.collection(CLACKS_COLLECTION).insertOne(newClack,
    function(err, doc) {
    if (err) {
      handleError(res, err.message,
        "Failed to create new clack.");
    } else {
      debug("server interacts with database", "Inserted 1 document");
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
  debug("server receives a request", "GET /clacks/" + req.params.id);
  db.collection(CLACKS_COLLECTION).findOne(
    { _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get clack");
    } else {
      debug("server interacts with database", "Found 1 document");
      res.status(200).json(doc);
    }
  });
});

app.put("/clacks/:id", function(req, res) {
  debug("server receives a request", "GET /clacks/" + req.params.id + " with body :\n" + JSON.stringify(req.body));
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(CLACKS_COLLECTION).updateOne(
    {_id: new ObjectID(req.params.id)}, updateDoc,
    function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update clack");
    } else {
      debug("server interacts with database", "Updated 1 document");
      res.status(200).json(doc);
    }
  });
});

app.delete("/clacks/:id", function(req, res) {
  debug("server receives a request", "DELETE /clacks/" + req.params.id);
  db.collection(CLACKS_COLLECTION).deleteOne(
    {_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete clack");
    } else {
      debug("server interacts with database", "Deleted 1 document");
      res.status(204).end();
    }
  });
});

app.delete("/clacks", function(req, res) {
  debug("server receives a request", "DELETE /clacks");
  db.collection(CLACKS_COLLECTION).deleteMany(
    {}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete clacks");
    } else {
      debug("server interacts with database", "Deleted all documents");
      res.status(204).end();
    }
  });
});

// /*  "/clicks"
//  *    GET: finds all clicks
//  *    POST: creates a new click
//  */
//
// app.get("/clicks", function(req, res) {
//   debug("server receives a request", "GET /clicks");
//   db.collection(CLICKS_COLLECTION).find({}).toArray(
//     function(err, docs) {
//     if (err) {
//       handleError(res, err.message, "Failed to get clicks.");
//     } else {
//       res.status(200).json(docs);
//     }
//   });
// });
//
// app.post("/clicks", function(req, res) {
//   debug("server receives a request", "POST /clicks with body :\n" + req.body);
//   var newClick = req.body;
//   db.collection(CLICKS_COLLECTION).insertOne(newClick,
//     function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to create new click.");
//     } else {
//       res.status(201).json(doc.ops[0]);
//     }
//   });
// });
//
// /*  "/clicks/:id"
//  *    GET: find click by id
//  *    PUT: update click by id
//  *    DELETE: deletes click by id
//  */
//
// app.get("/clicks/:id", function(req, res) {
//   debug("server receives a request", "GET /clicks/" + req.params.id);
//   db.collection(CLICKS_COLLECTION).findOne(
//     { _id: new ObjectID(req.params.id) },
//     function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to get click");
//     } else {
//       res.status(200).json(doc);
//     }
//   });
// });
//
// app.put("/clicks/:id", function(req, res) {
//   debug("server receives a request", "GET /clicks/" + req.params.id + " with body :\n" + req.body);
//   var updateDoc = req.body;
//   delete updateDoc._id;
//   db.collection(CLICKS_COLLECTION).updateOne(
//     {_id: new ObjectID(req.params.id)}, updateDoc,
//     function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to update click");
//     } else {
//       res.status(200).json(doc);
//     }
//   });
// });
//
// app.delete("/clicks/:id", function(req, res) {
//   debug("server receives a request", "DELETE /clicks/" + req.params.id);
//   db.collection(CLICKS_COLLECTION).deleteOne(
//     {_id: new ObjectID(req.params.id)}, function(err, result) {
//     if (err) {
//       handleError(res, err.message, "Failed to delete click");
//     } else {
//       res.status(204).end();
//     }
//   });
// });

/*  "/users"
 *    GET: finds all users
 *    POST: creates a new user
 */
//
// app.get("/users", function(req, res) {
//   db.collection(USERS_COLLECTION).find({}).toArray(
//     function(err, docs) {
//     if (err) {
//       handleError(res, err.message, "Failed to get users.");
//     } else {
//       res.status(200).json(docs);
//     }
//   });
// });
//
// app.post("/users", function(req, res) {
//   var newUser = req.body;
//   db.collection(USERS_COLLECTION).find({}).toArray(
//     function(err, docs) {
//     if (err) {
//       handleError(res, err.message, "Failed to get users.");
//     } else {
//       res.status(200).json(docs);
//     }
//   });
// });
