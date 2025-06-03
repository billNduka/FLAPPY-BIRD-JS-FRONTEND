const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/leaderboardRoutes')


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/leaderboard', routes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to mongoDB');
    app.listen(PORT, console.log(`server running on Port ${PORT}`));
}).catch(err => {
    console.log('Error connecting to mongoDB:', err);
})
