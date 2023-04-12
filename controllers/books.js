// Récupérer le modèle et les packages
const { error } = require('console');
const Book = require('../models/book');
const fs = require('fs');
const path = require('path');

// Add book
exports.addBook = (req, res, next) => {
    // On récupère le formulaire
    const getBookForm = JSON.parse(req.body.book);

    // On créer le livre
    const book = new Book({
        ...getBookForm,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    // On l'enregistre dans la base de donnée
    book.save()
        .then(() => res.status(201).json({message: "Le livre a bien été ajouté !"}))
        //.catch((error) => {error: error})
        .catch((error) => {res.status(400).json({error: error})})
}

// Get all books
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => {res.status(200).json(books)})
        .catch((error) => {res.status(400).json({error: error})})
}

// Get book
exports.getBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({error: error}))
}

// Delete book
exports.deleteBook = (req, res, next) => {
    if (req.auth.userId === req.body.userId)
    {
        // Supprimer l'image
        Book.findOne({_id: req.params.id})
            .then((book) => {
                // Récupérer le nom d' l'image
                const image = book.imageUrl.split('/')

                // Supprimer l'image
                fs.unlink(path.join(__dirname, '..', 'images', image[image.length - 1]), (error) => {
                    if (error)
                    {
                        console.log(error)
                    }
                });
            })
            .catch((error) => res.status(400).json({error: error}))

        // Supprimer le livre
        Book.deleteOne({_id: req.params.id})
            .then(() => {res.status(200).json("Le livre a bien été supprimé !")})
            .catch(error => res.status(400).json({error: error}))
    }
}

// Rate book
exports.rateBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => {book.ratings.push({ 
            userId: req.body.userId,
            grade: req.body.rating
        })
            // Met à jour la note moyenne du livre
            this.updateAverageRatingBook(book, book.ratings)
            
            // Sauvegarder les modifications
            book.save();
        })
        .catch(error => res.status(400).json({error: error}))
}

// Update averageRating Book
exports.updateAverageRatingBook = (book, ratings) => {
    // Tous les grades
    let allGrades = 0;
    
    // On récupère toutes les notes afin de les ajouter
    ratings.map((rating) => {
        allGrades += rating.grade;
    })
    
    // Faire la moyenne et l'inscrire dans averageRating du livre
    book.averageRating = allGrades / ratings.length;
}

// Bestrating
exports.bestRating = (req, res, next) => {
    Book.find()
        .then((books) => {
            // Tri des livres par note moyenne décroissante
            books.sort((a, b) => b.averageRating - a.averageRating);
            
            // Récupération des 3 premiers livres triés
            const top3 = books.slice(0, 3);
            
            // Renvoyer le top 3
            res.status(200).json(top3);
        })
        .catch((error) => {res.status(400).json({error: error})})
}

// Update book
exports.updateBook = (req, res, next) => {
    if (req.auth.userId === req.body.userId)
    {
        Book.findOne({_id: req.params.id})
            .then((book) => {
                if (book.userId === req.auth.userId) {
                    let updateBookForm = {...req.body};
                    if (req.file) {
                        // Supprimer l'ancienne image  
                        const image = book.imageUrl.split('/')

                        // Supprimer l'image
                        fs.unlink(path.join(__dirname, '..', 'images', image[image.length - 1]), (error) => {
                            if (error)
                            {
                                res.status(400).json({error: error})
                            }
                        });

                        // Mettre à jour l' image
                        updateBookForm.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                    }

                    // Mettre à jour le book
                    Book.updateOne({_id: req.params.id}, updateBookForm)
                        .then(() => {
                            res.status(200).json({message: "Livre modifié !"});
                        })
                        .catch((error) => {
                            res.status(400).json({error: error});
                        });
                } else {
                    res.status(403).json({message: "Requête non autorisée"});
                }
            })
        .catch((error) => {
            res.status(400).json({error: error});
        });
    } 
}


