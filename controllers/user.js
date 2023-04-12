// Récupérer le modèle
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// S'INSCRIRE
exports.signup = (req, res, next) => {
    // Récupérer les données du formulaire
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            
            // Enregister dans la base de donnée
            user.save()
            .then(() => res.status(200).json({message: "L'utilisateur a bien été créé !"}))
            .catch(() => res.status(400).json({error: 'Cette e-mail existe déjà !'}))
        })
        .catch((error) => res.status(400).json({error: error}))
}

// LOGIN
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user)
            {
                bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (valid)
                    {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                {userId: user._id},
                                'RANDOM_TOKEN_SECRET',
                                {expiresIn: '24h'}
                            )
                        })
                    }
                    else 
                    {
                        res.status(401).json({ message: 'Paire email/mot de passe incorrecte' });
                    }
                })
                .catch((error) => console.log(error))
            }
            else 
            {
                res.status(401).json({ message: 'Paire email/mot de passe incorrecte' });
            }
        })
        .catch((error) => console.log(error))

}