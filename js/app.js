const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const City = require('../db/models/city.js').City;

const apiKey = '315bdb45e49dcae9a4a9512b11a04583';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
const request = require('request');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/weather/city', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  request(`${baseURL}?q=${req.query.q}&appid=${apiKey}`, (err, response, body) => {
    return formRes(res, err, body);
  });
});

app.get('/weather/coordinates', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  request(`${baseURL}?lat=${req.query.lat}&lon=${req.query.lon}&appid=${apiKey}`, (err, response, body) => {
    return formRes(res, err, body);
  });
});

app.get('/favourites', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  // console.log(Note.find({city: "London"}))
  City.find({})
      .then((items) => {
        results = null;
        console.log(items)
        results = [];
        // console.log(items);
        for (item of items) {
          results.push(item.city)
        }
        res.status(200).send(results);
      }).catch((err) => (res.status(200).send(err.message)));
});

app.post('/favourites', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  const body = req.body;
  console.log(req);
  const city = new City({
    city: body.name
  });
  city.save(city)
      .then((city) => res.status(201).send(city));
});

app.delete('/favourites', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  City.find({}, (err, items) => {
    console.log(items);
    console.log(req.body.num1);
    id = items[req.body.num1]._id;
    console.log(id);
    ObjectId = require('mongodb').ObjectId;
    details = { '_id': new ObjectId(id) };
    // console.log(details);
    City.deleteOne(details)
        .then((id) => res.status(200).send(JSON.stringify('Note ' + id + ' deleted!')));
  });
});

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', '*');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.send('ok');
});

function formRes(res, err, ok) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  if(err) {
    throw res.status(500).send({message: err});
  }
  res.status(200);
  res.send(ok);
  return res;

}

module.exports = app;
