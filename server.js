const express = require('express');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;
const app = express();

// Configuration de Passport
passport.use(new DiscordStrategy({
    clientID: 'VOTRE_CLIENT_ID', // Remplacez par votre Client ID
    clientSecret: 'VOTRE_CLIENT_SECRET', // Remplacez par votre Client Secret
    callbackURL: 'http://localhost:3000/auth/discord/callback', // URL de retour après l'authentification
    scope: ['identify', 'email'] // Scopes que vous demandez
}, function(accessToken, refreshToken, profile, done) {
    // Cette fonction est appelée après la réussite de l'authentification.
    // Vous pouvez sauvegarder les informations de l'utilisateur dans une base de données ici.
    return done(null, profile);
}));

// Sérialisation et désérialisation de l'utilisateur pour la session
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Configuration de la session
app.use(session({ secret: 'some secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Route de démarrage de l'authentification avec Discord
app.get('/auth/discord', passport.authenticate('discord'));

// Route de callback pour Discord
app.get('/auth/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/' }), 
    (req, res) => {
        // Succès de l'authentification, redirection vers la page d'accueil ou autre.
        res.redirect('/');
    }
);

// Route de déconnexion
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Route pour vérifier si l'utilisateur est connecté (utile pour le frontend)
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user); // Renvoyer les informations de l'utilisateur
    } else {
        res.status(401).send('Non authentifié');
    }
});

// Servir les fichiers statiques (comme votre HTML, CSS, JS)
app.use(express.static('public'));

// Lancer le serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
