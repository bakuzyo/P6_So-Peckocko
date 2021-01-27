const Sauce = require('../models/Sauce');     //On récupére le modèl type d'une sauce
const fs = require('fs');     //file system, gestionnaire de fichiers Node


exports.createSauce = (req, res, next) => {       // Création de sauce sur la base de données
  console.log(req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);     // On obtiens les informations par rapports aux valeurs d'entrée
  const sauce = new Sauce({      // Ces valeurs d'entrée sont placées dans un élément sauce
    ...sauceObject,           // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de sauceObject
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save()      // méthode save pour enregistrer la sauce dans la base de donnée
  .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
  .catch(error => res.status(400).json({error}));     // Affiche un status et message d'erreur
};


exports.getOneSauce = (req, res, next) => {     // Charge les informations de la sauce selectionnée
  Sauce.findOne({     // Méthode findOne pour trouver la sauce dans la base de donnée 
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {     // Modification de la sauce sélectionnée
  let sauceToEdit = {};                         // On obtiens les informations de la sauce 
  req.file ? (
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceToEdit = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
 ) : (
    sauceToEdit = { ...req.body }
  )
  Sauce.updateOne(            // On push dans la base de données les informations modifiées
    { _id: req.params.id },
    { ...sauceToEdit, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {     // Pour supprimer une sauce
  Sauce.findOne({ _id: req.params.id })         // On sélectionne l'Id de la sauce à supprimer
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

exports.likeOrDislikeSauce = (req, res, next) => {      // Pour liker/disliker

  const likeStatus = req.body.like;
  const userId = req.body.userId;
  const thisSauceId = req.params.id;
  Sauce.findOne({ _id: req.params.id }).then(sauce => {

    console.log(sauce.usersLiked);


    if (likeStatus === 1) {
      console.log(userId+' aime cette sauce.');
      Sauce.updateOne(
        { _id: thisSauceId },
        {$push: { usersLiked: userId }, $inc: { likes: +1 },}
      )
      .then(() => res.status(200).json({ message: 'Vous aimez cette sauce. (^-^) ' }))
      .catch((error) => res.status(400).json({ error }))


    }

    if (likeStatus === -1) {
      console.log('Vous n\'aimez pas cette sauce.');
      Sauce.updateOne(
        { _id: thisSauceId },
        {$push: { usersDisliked: userId }, $inc: { dislikes: +1 },}
      )
      .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce. :-( ' }))
      .catch((error) => res.status(400).json({ error }))
    }

    if (likeStatus === 0) {
      console.log('Vous annulez votre j\'aime ou j\'aime pas.');
      const ind = sauce.usersLiked.indexOf(userId);
      if (ind > -1) {
        sauce.usersLiked.slice(ind, 1);
        Sauce.updateOne(
          { _id: thisSauceId },
          {$push: { usersLiked: {$each: [ ], $slice: ind} }, $inc: { likes: -1 },}

        )
        .then(() => res.status(200).json({ message: ' ' }))
        .catch((error) => res.status(400).json({ error }))
      } else if (ind === -1) {
        const indDisliked = sauce.usersDisliked.indexOf(userId);
        sauce.usersDisliked.slice(indDisliked, 1);
        Sauce.updateOne(
          { _id: thisSauceId },
          {$push: { usersDisliked: {$each: [ ], $slice: indDisliked} }, $inc: { dislikes: -1 },}

        )
        .then(() => res.status(200).json({ message: ' ' }))
        .catch((error) => res.status(400).json({ error }))
      }
    }

  });

}