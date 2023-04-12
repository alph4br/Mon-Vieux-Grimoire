// Récupérer les packages
const express = require('express');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/books');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config()
const rateLimiter = require('express-rate-limit');


const limiter = rateLimiter({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 50, // Limiter l'ip à faire 50 requêtes par window (ici 1mn)
	standardHeaders: true, // Retourne `RateLimit-*` dans les headers
	legacyHeaders: false, // Désactiver les headers `X-RateLimit-*`
})

// Créer l'application express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongoose
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Erreur de connexion à MongoDB:', err));


// Erreur CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(limiter);
// Middlewares
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exporter l'app
module.exports = app;