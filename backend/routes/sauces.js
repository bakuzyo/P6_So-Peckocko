const express = require('express');
const router = express.Router();            //Création d'un router avec la méthode .Router() d'express
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');



router.post('/', auth, multer, sauceCtrl.createSauce);          // Création des routes pour différentes requêtes 
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce);

module.exports = router;
