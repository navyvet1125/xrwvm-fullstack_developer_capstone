// Mongoose model for cars inventory
// Author: Evan J. Washington
// Schema should have the following fields:
// dealer_id: Number
// make: String
// model: String
// year: Number
// bodyType: String
// mileage: Number
// price: Number
//  all fields are required

// The model will be named cars , corresponding to the 'cars' collection in the connected MongoDB database.
// The MongoDB model will be exported with this name.

const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carsSchema = new Schema({
    dealer_id: {
        type: Number,
        required: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    bodyType: {
        type: String,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const cars = mongoose.model('cars', carsSchema);
module.exports = cars;