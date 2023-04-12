// Récupérer mongoose
const mongoose = require("mongoose");

// Création du modèle Book
const Book = mongoose.Schema({
  userId: { type: String },
  title: { type: String },
  author: { type: String },
  imageUrl: { type: String },
  year: { type: Number },
  genre: { type: String },
  ratings: [
    {
      userId: { type: String },
      grade: { type: Number },
    },
  ],
  averageRating: { type: Number },
});

// Exporter le modèle
module.exports = mongoose.model("Book", Book);
