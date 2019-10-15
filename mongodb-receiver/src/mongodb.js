const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const config = require('./config/config.json');

// MongoDB config
const address = config.mongodb.address;
const port = config.mongodb.port;
const dbName = config.mongodb.dbName;
const rawDataCollection = config.mongodb.collections[0];

const url = "mongodb://" + address + ":" + port + "/" + dbName;

function insertDocumentInCollection(myobj, collection) {
    try {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            const dbo = db.db(dbName);
            dbo.collection(collection).insertOne(myobj, function (err, _res) {
                if (err) throw err;
                db.close();
            });
        });
    } catch (err) {
        console.log("Error at insertDocumentInCollection()" + err);
    }
};

module.exports = {

    /*Function to find a value in a Collection*/
    findInCollection: function (_id, collection, callback) {
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db(dbName);
                dbo.collection(collection).find({ _id: ObjectId(_id) }).toArray(function (err, result) {
                    if (err) throw err;
                    db.close();
                    callback(result);
                });
            });
        } catch (err) {
            console.log("Error at findInCollection()" + err);
        }
    },

    /*Function to find "x" last values*/
    findInCollectionLast: function (numOfData, callback) {
        numOfData = parseInt(numOfData);
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db(dbName);
                dbo.collection(rawDataCollection).find({}).sort({ _id: -1 }).limit(numOfData).toArray(function (err, result) {
                    if (err) throw err;
                    db.close();
                    callback(result);
                });
            });
        } catch (err) {
            console.log("Error at findInCollectionLast()" + err);
        }
    },

    /*Function to add a value in a Collection*/
    insertData: function (obj) {
        insertDocumentInCollection(obj, rawDataCollection);
    },

    /*Function to find a value in a Collection*/
    findRawData: function (callback) {
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db(dbName);
                dbo.collection(collection).toArray(function (err, result) {
                    if (err) throw err;
                    db.close();
                    callback(result);
                });
            });
        } catch (err) {
            console.log("Error at findRawData()" + err);
        }
    }
};