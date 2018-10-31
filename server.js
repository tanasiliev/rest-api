const express = require('express'); 		
const app = express(); 				
const wrap = require('co-express');
const bodyParser = require('body-parser');
const db = require('./db');

const port = process.env.PORT || 3034; 		
const router = express.Router(); 	

// enable cross-origin resource sharing
const cors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors);


router
    .route('/api/:collectionName')
    .get(wrap(function* (req, res) {
        const { collectionName } =req.params;
        try {
            const collection = yield db.getCollection(collectionName)
            const result = yield collection.select();
            res.json(result); 
        } catch (error) {
            res.json(error);
        }
    }))
    .post(wrap(function* (req, res) {
        const { collectionName } = req.params;
        const data = req.body;
        try {
            const collection = yield db.getCollection(collectionName)
            const result = yield collection.create(data);
            res.json(result); 
        } catch (error) {
            res.json(error);
        }
    }))

router
    .route('/api/:collectionName/:id') 
    .get(wrap(function* (req, res) {
        const { id, collectionName } = req.params;
        try {
            const collection = yield db.getCollection(collectionName)
            const result = yield collection.find(id);
            res.json(result); 
        } catch (error) {
            res.json(error);       
        }
    }))
    .put(wrap(function* (req, res) {
        const { id, collectionName } = req.params;
        const data = req.body;
        try {
            const collection = yield db.getCollection(collectionName)
            const result = yield collection.update(id, data);
            res.json(result); 
        } catch (error) {
            res.json(error);
        }
    }))
    .delete(wrap(function* (req, res) {
        const { id, collectionName } = req.params;
        try {
            const collection = yield db.getCollection(collectionName)
            const result = yield collection.remove(id);
            res.json(result); 
        } catch (error) {
            res.json(error);   
        }
    }))
 

app.use('/', router);
app.listen(port, function () {
    console.log('Server running on port ' + port);
})
