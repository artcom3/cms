const express = require('express');
const app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/cms',
  { useNewUrlParser: true }, (err, res) => {
    if (err) {
      console.log('Connection failed: ' + err);
    }
    else {
      console.log('Connected to database!');
    }
  }
);

app.get('/', (req, res) => {
  res.send('Hola, mundo!');
});

app.listen(3000, () => {
  console.log('La aplicación está corriendo en el puerto 3000');
});