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

router.route('/api/:collectionName')
      
    .get(function(req, res) {
    	var params = req.params;   
    	var collection = db.getCollection(params.collectionName);
        collection.select(function(err, result){
			res.json(result);
    	});
	})  

	.post(function(req, res) {
		var params = req.params;   
        var data = req.body;
    	var collection = db.getCollection(params.collectionName);
        collection.create( data, function(err, result){
			res.json(result);
    	});
	});

router.route('/api/:collectionName/:id') 

	.get(function(req, res) {
        var params = req.params;   
    	var collection = db.getCollection(params.collectionName);
        collection.selectById(params.id, function(err, result){
			res.json(result);
    	});
	})

	.put(function(req, res) {
        var params = req.params;   
        var data = req.body;
    	var collection = db.getCollection(params.collectionName);
        collection.update(params.id, data, function(err, result){
			res.json(result);
    	});
	})

	.delete(function(req, res) {
	    var params = req.params;   
    	var collection = db.getCollection(params.collectionName);
        collection.remove(params.id, function(err, result){
			res.json(result);
    	});
	});


app.use('/', router);

app.listen(port);
//console.log('Server running on port ' + port);