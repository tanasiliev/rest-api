const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
require('./promise-finally')

const dbTable = 'rest-api';
const uri = `mongodb+srv://key:pGQKMW2rXyCiIpms@cluster0-bdoms.mongodb.net/${dbTable}`;

function validateId (id){
	var regex = /^[0-9a-fA-F]{24}$/;
	return regex.test(id); 
};

function connect() {
	return new Promise((resolve, reject) => {
		MongoClient.connect(uri, { useNewUrlParser: true }, function(error, client) {
			if(error) {
				reject(error);
			}
			resolve({ db: client.db(dbTable), onComplete: ()=> client.close() });
		});
	});
};

function getCollection(name){
	return connect()
	.then(({ db, onComplete }) => {
		const collection = new Collection(name, db, onComplete);
		return collection;
	});
};

function Collection(name, db, onComplete){
	this.collection = db.collection(name);
	this.onComplete = onComplete;
};

Collection.prototype = {
	create: function(obj){
		return new Promise((resolve, reject) => {
			obj.created_at = new Date().toUTCString();
			this.collection.insertOne(obj, (error, data) => {
				error ? resolve(error) : resolve(data);
			});
		})
		.finally(this.onComplete);
	},
	select: function(){
		return new Promise((resolve, reject) => {
			this.collection.find().toArray((error, data) => {
				error ? resolve(error) : resolve(data);
			});
		})
		.finally(this.onComplete);
	},
	update: function(id, obj){
		return new Promise((resolve, reject) => {
			if(!validateId(id)) {
				reject({error: "invalid id"});
			}
			this.collection.findOne({'_id': ObjectID(id)}, (error, record)=> {
				if (error) reject(error);
				else {
					if (record){
						// modify the record
						for (var prop in obj) {
							record[prop] = obj[prop];
						}
						record.updated_at = new Date().toUTCString(); 
						this.collection.updateOne(record, function(err, result) { 
							if (error) reject(error);
								else {
									var returnObj = {};
									returnObj[id] = 'updated';
									resolve(returnObj);
								}	
							});
					}
					else {
						resolve({});
					} 
				}
			});
		})
		.finally(this.onComplete);
	},
	remove: function(id){
		return new Promise((resolve, reject) => {
			if(!validateId(id)) {
				reject({error: "invalid id"});
			}
			this.collection.deleteOne({'_id':ObjectID(id)}, (error, record) => { 
				if (error) {
					reject(err)
				} else {
					const returnObj = {};
					(record == 0) || (returnObj[id] = 'deleted');
					resolve(returnObj);
				}
			});
		})
		.finally(this.onComplete);	 
	},
	find: function(id) {
		return new Promise((resolve, reject) => {
			if(!validateId(id)) {
				reject({error: "invalid id"});
			}
			this.collection.findOne({'_id': ObjectID(id)}, (error, data) => {
				error ? reject(error) : resolve(data || {});
			});
		})
		.finally(this.onComplete);	 	
	}
};

module.exports = {
	getCollection
};