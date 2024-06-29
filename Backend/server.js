const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Country = require('./routes/Collections/Country');
const State = require('./routes/Collections/State');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://shivamt2023:ft123shivam123@cluster0.qcx5f1c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true, // Remove deprecated option
  useUnifiedTopology: true, // Remove deprecated option
  // dbName: 'Service-Portal' // Add your actual database name here
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Import routes
app.use('/collections', Country);
app.use('/collections', State);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
