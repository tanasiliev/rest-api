var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
    ObjectID = require('mongodb').ObjectID;

var db = null;
var connectionString = 'mongodb://admin:min1@ds055980.mongolab.com:55980/rest-api'
                
MongoClient.connect(connectionString, function(err, mongodb){
	if(err) throw err;
	else db = mongodb;
});

var validateId = function(id){
    var regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(id); 
}

var Collection = function(name){
     this._collection = db.collection(name);
}

Collection.prototype = {
    
    create : function(obj, callback){
    	obj.create_dt = new Date().toUTCString();
	    this._collection.insert(obj, function (err, data) {
			if (err) callback(err);
			else callback(null, data);
		});
	},
	select : function(callback){
	    this._collection.find().toArray(function (err, data) {
			if (err) callback(err);
			else callback(null, data);
		});
	},
	update : function(id, obj, callback){
		var self = this;
		if(!validateId(id)) {
			return callback(null, {error: "invalid id"});
		}	
	    self._collection.findOne({'_id': ObjectID(id)},function (err, record) {
			if (err) callback(err);
			else {
				if (record){
					// modify the record
		        	for (var prop in obj) {
		        		record[prop] = obj[prop];
		        	}
		        	record.updated_dt = new Date().toUTCString(); 
		            self._collection.save(record, function(err, result) { 
		            	if (err) callback(err)
		            	else {
		            		var returnObj = {};
		            	    returnObj[id] = 'updated';
		            	 	callback(null, returnObj);
		            	}	
		            });
			    }
			    else {
			    	callback(null, {});
			    } 
			}
		});
	},
	remove : function(id, callback){
		if(!validateId(id)) {
			return callback(null, {error: "invalid id"});
		}
	    this._collection.remove({'_id':ObjectID(id)}, function(err,record) { 
	    	if (err) callback(err)
	    	else {
                var returnObj = {};
                (record == 0) || (returnObj[id] = 'deleted');
        	 	callback(null, returnObj);
	    	}
	    }); 
    },
    selectById : function(id, callback){
    	if(!validateId(id)) {
			return callback(null, {error: "invalid id"});
		}
	    this._collection.findOne({'_id': ObjectID(id)},function (err, record) {
			if (err) callback(err)
		    else {
			    callback(null, record || {});
		    }
		});
	}
};

// do small performance if we already have the colection 
// just return the inctance instead of creating the same new one
var collections = (function(){
	var collections = {};
	var get = function(name){
	    if(!name){ 
	      throw 'Name of the Collection is required!';
	    }
	    if(!collections[name]){
	       collections[name] = new Collection(name);
	    }
	    return collections[name]; 
	};

	return {
		get: get
	}
})();

module.exports = {
	getCollection: function(name){
        return collections.get(name);;
	}
};
