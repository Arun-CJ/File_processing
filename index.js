const express = require ('express');
const cors = require('cors');
const app = express ();
app.use (express.json ());
app.use (express.urlencoded ({extended: false}));
const path = require ('path'); 


app.use(cors());
app.use ('/public', express.static (path.join (__dirname, 'uploads')));




// api routes
app.use ('/api/upload', require ('./routes/api/upload'));

const PORT = 5050;


app.listen (PORT, function () {
  console.log ('server running on port ',PORT);
});
