require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
const noteRoutes = require('./routes/noteRoutes')

//connecting to MongoDB
main().catch((err)=> console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
}
const database = mongoose.connection
database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(express.json());
app.use('/api',noteRoutes)

module.exports = app;