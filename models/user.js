// Récupérer mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du modèle User
const User = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

User.plugin(uniqueValidator);

// Exporter le modèle
module.exports = mongoose.model('User', User);