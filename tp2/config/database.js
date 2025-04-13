import sqlite3Pkg from 'sqlite3';
const sqlite3 = sqlite3Pkg.verbose();

const db = new sqlite3.Database(
  './maBaseDeDonnees.sqlite',
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('Erreur de connexion :', err.message);
    } else {
      console.log('Connecté à la base de données SQLite.');

      db.run(
        `CREATE TABLE IF NOT EXISTS personnes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error('Erreur lors de la création de la table :', err.message);
          } else {
            const personnes = ['Bob', 'Alice', 'Charlie'];
            personnes.forEach((nom) => {
              db.run(`INSERT INTO personnes (nom) VALUES (?)`, [nom], (err) => {
                if (err) {
                  console.error(`Erreur lors de l'insertion de ${nom} :`, err.message);
                }
              });
            });
          }
        }
      );
    }
  }
);

export default db 