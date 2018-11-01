const authString = 'Basic a2V5OnBHUUtNVzJyWHlDaUlwbXM=';

// basic authentication
function auth (req, res, next) {
    if(req.method === 'OPTIONS'){
        next();   
    }
    if(req.headers && req.headers.authorization === authString) {
        next();   
    } else {
        res.status(401).end();   
    }
};

// enable cross-origin resource sharing
function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
};

module.exports = {
    auth,
    cors
};
