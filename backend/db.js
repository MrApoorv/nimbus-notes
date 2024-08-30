const mongoose = require('mongoose');
const mongoURI = "mongodb://0.0.0.0:27017/nimbusnotes";

const connectToMongo = async () => {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
};

module.exports = connectToMongo;