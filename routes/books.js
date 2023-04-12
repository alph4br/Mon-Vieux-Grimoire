// Récupérer les packages
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

// Récupérer le controlleur
const bookCtrl = require('../controllers/books');

// Les routes
router.post('/', auth, multer, bookCtrl.addBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.bestRating);
router.get('/:id', bookCtrl.getBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.put('/:id', auth, multer, bookCtrl.updateBook);

// Exporter le router
module.exports = router;