// Importation des dépendances
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // 🚀 Ajout de CORS
require('dotenv').config(); // Charge les variables d'environnement depuis .env

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors()); // 🚀 Activation de CORS
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB en utilisant la variable d'environnement URI_MONGO
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connecté à MongoDB');
}).catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
});

// Définition du modèle Client
const clientSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    pointsFidelite: { type: Number, default: 0 }
});

const Client = mongoose.model('Client', clientSchema);

// Route pour ajouter un client
app.post('/clients', async (req, res) => {
    const { nom, prenom, telephone, email, pointsFidelite } = req.body;
    
    try {
        const client = new Client({
            nom,
            prenom,
            telephone,
            email,
            pointsFidelite
        });
        await client.save();
        res.status(201).json(client);
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de l\'ajout du client', error: err });
    }
});

// Route pour obtenir tous les clients
app.get('/clients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des clients', error: err });
    }
});

// Route pour obtenir un client par ID
app.get('/clients/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du client', error: err });
    }
});

// Route pour modifier un client
app.put('/clients/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, telephone, email, pointsFidelite } = req.body;
    
    try {
        const client = await Client.findByIdAndUpdate(id, {
            nom,
            prenom,
            telephone,
            email,
            pointsFidelite
        }, { new: true });
        
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du client', error: err });
    }
});

// Route pour supprimer un client
app.delete('/clients/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const client = await Client.findByIdAndDelete(id);
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.status(200).json({ message: 'Client supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du client', error: err });
    }
});

// Démarrage du serveur
const port = 5000;
app.listen(port, () => {
    console.log(`Le serveur fonctionne sur http://localhost:${port}`);
});
