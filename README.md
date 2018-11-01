# Restful CRUD APIs with Nodejs and MongoDB

## Overview:
### [Express](https://expressjs.com/):
Fast, unopinionated, minimalist web framework for Node.js
- middlewares:
  - **[body-parser](https://github.com/expressjs/body-parser)**: Node.js body parsing middleware.
  - **[co-express](https://github.com/mciparelli/co-express)**: An express wrapper that enables generators to be used as middlewares.
  - **cors**:  enable Cross-origin resource sharing (CORS)
   - **auth**:  Basic authentication
- [co](https://github.com/tj/co): The ultimate generator based flow-control goodness for nodejs (supports thunks, promises, etc)

### [MongoDB](https://www.mongodb.com/):
MongoDB stores data in flexible, JSON-like documents, meaning fields can vary from document to document and data structure can be changed over time.


Setup
---

```
npm install
```


## npm scripts

* `npm start` – start server on port 3034


## Recommended versions
- node v8.4.x
- npm v5.3.x


How to use in blowser
---

```
const userName = 'admin';
const password = 'secretpassword';
const tableName = 'users';
xhr({
    method: 'GET',
    url: `http://localhost:3034/api/${tableName}`,
    headers: {
    	'Authorization': 'Basic ' + btoa(userName + ':' + password),
    }
})
.then((res) => {
    console.log(res)
});
```
