var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),

    // Mongoose Schema definition
    Schema = new mongoose.Schema({
      id       : String, 
      title    : String,
      completed: Boolean
    }),
    
    Todo = mongoose.model('Todo', Schema);

    mongoose.connect(process.env.MONGOLAB_URI, function (error) {
      if (error) console.error(error);
      else console.log('mongo connected');
   });

    var app = express();

    app.use(bodyParser.json()) // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

    app.get('/api', function (req, res) {
      res.json(200, {msg: 'OK' });
    })



    app.use(express.static(__dirname + '/'))
    app.listen(process.env.PORT || 5000);
 
  
