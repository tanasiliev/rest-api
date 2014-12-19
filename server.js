var express    = require('express'); 		
var app        = express(); 				
var bodyParser = require('body-parser');
var db = require('./db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; 		
var router = express.Router(); 	


// enable cross-origin resource sharing
app.response.__proto__.allowCrossOrigin = function() {
   this.set('Access-Control-Allow-Origin', '*');
}

var send = function(err, result){
    this.allowCrossOrigin();
    if (err) {
        return this.json({err: err}); 
    }
    this.json(result); 
} 		

router.route('/api/:collectionName')

.get(function(req, res) {
    var params = req.params;   
    var collection = db.getCollection(params.collectionName);
    collection.select(send.bind(res));
})  
.post(function(req, res) {
    var params = req.params;   
    var data = req.body;
    var collection = db.getCollection(params.collectionName);
    collection.create( data, send.bind(res));
});

router.route('/api/:collectionName/:id') 

.get(function(req, res) {
    var params = req.params;   
    var collection = db.getCollection(params.collectionName);
    collection.selectById(params.id, send.bind(res));
})
.put(function(req, res) {
    var params = req.params;   
    var data = req.body;
    var collection = db.getCollection(params.collectionName);
    collection.update(params.id, data, send.bind(res));
})
.delete(function(req, res) {
    var params = req.params;   
    var collection = db.getCollection(params.collectionName);
    collection.remove(params.id, send.bind(res));
});

app.use('/', router);
app.listen(port);
//console.log('Server running on port ' + port);