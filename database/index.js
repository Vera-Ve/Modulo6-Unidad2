const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://verasavinave:AzrPqownGJYq3Cqc@cluster0.uykfgh9.mongodb.net/songs?retryWrites=true&w=majority')
.then(() => console.log('Connected to Mondo'))
.catch((err) => console.log('Error connecting to MongoDB', err));