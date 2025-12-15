const mongoose = require('mongoose');
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();

    if (!q) {
        return res.status(404).json({ message: "No trips found" });
    } else {
        return res.status(200).json(q);
    }
};

// GET: /trips/:tripCode - returns a single trip
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({ 'code': req.params.tripCode })
        .exec();

    if (!q || q.length === 0) {
        return res.status(404).json({ message: "Trip not found" });
    } else {
        return res.status(200).json(q);
    }
};

// POST: /trips - Adds a new Trip
const tripsAddTrip = async (req, res) => {
    console.log('POST request received');
    console.log(req.body);

    const newTrip = new Model({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save();

    if (!q) {
        return res.status(400).json(err);
    } else {
        return res.status(201).json(q);
    }
};

// PUT: /trips/:tripCode - Updates a trip
const tripsUpdateTrip = async (req, res) => {
    console.log('PUT request received');
    console.log(req.params);
    console.log(req.body);

    const q = await Model
        .findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true }
        )
        .exec();

    if (!q) {
        return res.status(400).json({ message: "Trip not found" });
    } else {
        return res.status(201).json(q);
    }
};

// DELETE: /trips/:tripCode - Deletes a trip
const tripsDeleteTrip = async (req, res) => {
    console.log('DELETE request received');
    console.log(req.params);

    const q = await Model
        .findOneAndDelete({ 'code': req.params.tripCode })
        .exec();

    if (!q) {
        return res.status(404).json({ message: "Trip not found" });
    } else {
        return res.status(200).json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};