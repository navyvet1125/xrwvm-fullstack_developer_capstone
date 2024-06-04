/*jshint esversion: 8 */

import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';
import Cars from './inventory.js';

const app = express();
const port = 3050;


app.use(cors())
app.use(express.urlencoded({ extended: false}));
const db = mongoose.connection;
const carData = JSON.parse(fs.readFileSync('car_records.json', 'utf8'));

// Connect to MongoDB
mongoose.connect('mongodb://mongo_db:27017/', 
{ 
    dbName: 'dealershipsDB',
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

Cars.deleteMany({})
.then(() => Cars.insertMany(carData.cars))
.catch(err => console.log(err));


// Define the root API endpoint
app.get('/', (req, res) => res.send('Welcome to the Mongoose API'));

app.get('/cars/:id', (req, res) => {
    const id = req.params.id;
    Cars.find({dealer_id: id})
        .then(cars => res.status(200).send(cars))
        .catch(err => res.status(500).send(err));
});

app.get('/cars', (req, res) => {
    Cars.find({}, null, {limit: 20})
        .then(cars => res.status(200).send(cars))
        .catch(err => res.status(500).send(err));
});


app.get('/carsbymake/:id/:make', (req, res) => {
    const id = req.params.id;
    const make = req.params.make;
    Cars.find({dealer_id: id, make: make})
        .then(cars => res.status(200).send(cars))
        .catch(err => res.status(500).send(err));
});

app.get('/carsbymodel/:id/:model', (req, res) => {
    const id = req.params.id;
    const model = req.params.model;
    Cars.find({dealer_id: id, model: model})
        .then(cars => res.status(200).send(cars))
        .catch(err => res.status(500).send(err));
});

app.get('/carsbymaxmileage/:id/:mileage', (req, res) => {
    const id = req.params.id;
    const mileage = req.params.mileage;
    let query = {dealer_id: id};
    switch(mileage) {
        case '50000':
            query.mileage = {$lte: 50000};
            break;
        case '100000':
            query.mileage = {$gt: 50000, $lte: 100000};
            break;
        case '150000':
            query.mileage = {$gt: 100000, $lte: 150000};
            break;
        case '200000':
            query.mileage = {$gt: 150000, $lte: 200000};
            break;
        default:
            query.mileage = {$gt: 200000};
            break;
    }
    Cars.find(query)
        .then(cars => res.status(200).send(cars))
        .catch(err => res.status(500).send(err));
});

app.get('/carsbyprice/:id/:price', (req, res) => {
    const id = req.params.id;
    const price = req.params.price;
    let query = {dealer_id: id};
    switch(price) {
        case '20000':
            query.price = {$lte: 20000};
            break;
        case '40000':
            query.price = {$gt: 20000, $lte: 40000};
            break;
        case '60000':
            query.price = {$gt: 40000, $lte: 60000};
            break;
        case '80000':
            query.price = {$gt: 60000, $lte: 80000};
            break;
    
        default:
            query.price = {$gt: 80000};
            break;
    }
    Cars.find(query)
        .then(cars => res.status(200).send(cars))
        .catch(err => res.status(500).send(err));
});

app.get('/carsbyyear/:id/:year', (req, res) => {
    const id = req.params.id;
    const year = req.params.year;
    Cars.find({dealer_id: id, year: year})
        .then(cars => res.status(200).send(cars))
        .catch(err => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
