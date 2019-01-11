'use strict';

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const utils = require('../sharedUtils/sharedUtils.js');

const app = express();
const port = 27018;
const mongoCreds = require('../auth.json');
const mongoURL = `mongodb://${mongoCreds.user}:${mongoCreds.password}@localhost:27017/`
// const mongoURL = `mongodb://localhost:27017/`;

function serve() {
    console.log(mongoURL);
    utils.mongoConnectWithRetry(mongoURL, 2000, (connection) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true}));

    app.post('/db/exists', (request, response) => {            
        if (!request.body) {
            return utils.failure(response, '/db/exists needs post request body');
        }
        const databaseName = request.body.dbname;
        const database = connection.db(databaseName);
        const query = request.body.query;
        const projection = request.body.projection;


        database.listCollections().toArray(function(err, collectionList){
            function checkCollectionForHits(collectionName, query, projection, callback) {
                const collection = database.collection(collectionName);        
                collection.find(query, projection).limit(1).toArray((err, items) => {          
                    callback(!_.isEmpty(items));
                });  
            }
        
            function checkEach(collectionList, checkCollectionForHits, query,
                projection, evaluateTally) {
                    var doneCounter = 0;
                    var results = 0;          
                    collectionList.forEach(function (collection) {
                        var collectionName = collection.name;
                        checkCollectionForHits(collectionName, query, projection, function (res) {
                            utils.log(`got request to find_one in ${collectionName} with` +
                                ` query ${JSON.stringify(query)} and projection ${JSON.stringify(projection)}`);          
                            doneCounter += 1;
                            results+=res;
                            if (doneCounter === collectionList.length) {
                            evaluateTally(results);
                            }
                        });
                });
            }
            function evaluateTally(hits) {
                console.log("hits: ", hits);
                response.json(hits>0);
            }

            var filteredCollectionList = _.filter(
                collectionList,
                function(x) {
                    console.log(x)
                    return (x.name !== "mpGame3" && x.name !== "mpGame4");
            });

            checkEach(filteredCollectionList, checkCollectionForHits, query, projection, evaluateTally);
        });
    });


    app.post('/db/insert', (request, response) => {
        if (!request.body) {
            return utils.failure(response, '/db/insert needs post request body');
        }
        console.log(`got request to insert into ${request.body.colname}`);

        const databaseName = request.body.dbname;
        const collectionName = request.body.colname;
        if (!collectionName) {
            return utils.failure(response, '/db/insert needs collection');
        }
        if (!databaseName) {
            return utils.failure(response, '/db/insert needs database');
        }

        const database = connection.db(databaseName);

        // Add collection if it doesn't already exist
        if (!database.collection(collectionName)) {
            console.log('creating collection ' + collectionName);
            database.createCollection(collectionName);
        }

        const collection = database.collection(collectionName);

        const data = _.omit(request.body, ['colname', 'dbname']);
        // log(`inserting data: ${JSON.stringify(data)}`);
        collection.insert(data, (err, result) => {
            if (err) {
            return utils.failure(response, `error inserting data: ${err}`);
            } else {
            return utils.success(response, `successfully inserted data. result: ${JSON.stringify(result)}`);
            }
        });
    });

    app.listen(port, () => {
        utils.log(`running at http://localhost:${port}`);
    });
  });
}
serve();
