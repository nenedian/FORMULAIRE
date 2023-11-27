const express = require('express');
const app = express();
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const port = 3000;


// Middleware pour l'analyse des données JSON et URL-encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/wiews/index.html'));
});

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Route pour traiter la soumission du formulaire
app.post('/submit', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.send(
           `<!DOCTYPE html>
           <html lang="en">
           <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>Document</title>
               <link rel="stylesheet" href="/css/styles.css">
           </head>
           <body>
               <p class="reponse">Formulaire soumis avec succès !</p>
               <div class="donne"> 
                   <h1>Nom : ${req.body.nom} </h1>
                   <h1>Prénom : ${req.body.prenom} </h1>
                   <h1>Genre : ${req.body.checkbox} </h1>
                   <h1>Pays : ${req.body.select} </h1>
               </div>  
          </body>
           `);
});

// Fonction asynchrone pour récupérer les auteurs depuis une API
async function fetchAuthors() {
  try {
    const auteurss = await axios.get('https://openlibrary.org/authors/OL33421A.json');
    const authors = auteurss.data;
    console.log(auteurss);

  } catch (error) {
    console.error('Erreur lors de la récupération des auteurs :', error.message);
  }
}

// Appel de la fonction asynchrone
fetchAuthors();

app.listen(port, () => {
  console.log(`Serveur http://127.0.0.1:${port} lancé avec succès`);
});
