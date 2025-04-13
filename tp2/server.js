import express from 'express';
import db from './config/database.js';

import session from 'express-session';
import Keycloak from 'keycloak-connect';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const keycloakConfig = require('./config/keycloak-config.json');

const app = express();
const PORT = 3000;

const memoryStore = new session.MemoryStore();

app.use(session({
    secret: 'api-secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
}));

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
app.use(keycloak.middleware());

app.use(express.json());

app.get('/protected',keycloak.protect(), (req, res) => {
    res.json({ message: 'Vous êtes authentifié !' });
});

app.get('/', (req, res) => {
    res.json("Registre de personnes ! Choisissez le bon routage !");
});

app.get('/personnes', (req, res) => {
    db.all("SELECT * FROM personnes", [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

app.get('/personnes/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "success", data: row });
    });
});

app.post('/personnes', (req, res) => {
    const nom = req.body.nom;
    if (!nom) {
        res.status(400).json({ error: "Le nom est requis." });
        return;
    }

    db.run("INSERT INTO personnes (nom) VALUES (?)", [nom], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: { id: this.lastID, nom }
        });
    });
});

app.put('/personnes/:id', (req, res) => {
    const id = req.params.id;
    const nom = req.body.nom;

    if (!nom) {
        res.status(400).json({ error: "Le nom est requis." });
        return;
    }

    db.run(`UPDATE personnes SET nom = ? WHERE id = ?`, [nom, id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ message: "Personne non trouvée." });
        } else {
            res.json({ message: "Mise à jour réussie." });
        }
    });
});

app.delete('/personnes/:id', (req, res) => {
    const id = req.params.id;

    db.run(`DELETE FROM personnes WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ message: "Personne non trouvée." });
        } else {
            res.json({ message: "Suppression réussie." });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
