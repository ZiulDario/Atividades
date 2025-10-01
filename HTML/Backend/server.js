const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./clinica.db", (err) =>{
    if (err) console.error(err.message);
    else console.log("Conectado ao banco de dados SQLite.");
});

db.run (`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    pet TEXT NOT NULL
)`);

app.get("/clientes", (req, res) =>{
    db.all("SELECT * FROM clientes", [], (err, rows) =>{
        if (err) res.status(500).json({error: err.message});
        else res.json(rows);
    });
});
app.post("/clientes", (req, res) =>{
    const {nome, email, telefone, pet} = req.body;
    db.run(`
        INSERT INTO clientes (nome, email, telefone, pet) VALUES (?, ?, ?, ?)`,
        [nome, email, telefone, pet],
        function (err){
            if (err) res.status(500).json({error: err.message});
            else res.json({id: this.lastID, nome, email, telefone, pet});
        }
    );


    });

app.put("/clientes/:id", (req, res) =>{
    const {id} = req.params;
    const {nome, email, telefone, pet} = req.body;
    db.run(
        `UPDATE clientes SET nome = ?, email = ?, telefone = ?, pet = ? WHERE id = ?`,
        [nome, email, telefone, pet, id],
        function (err){
            if (err) res.status(500).json({error: err.message});
            else res.json({updated : this.changes});
        }
    );
});

app.delete("/clientes/:id", (req, res) =>{
    const {id} = req.params;
    db.run(`DELETE FROM clientes WHERE id = ?`, id, 
    function (err){
        if (err) res.status(500).json({error: err.message});
        else res.json({deleted: this.changes});
    });
});

app.listen(3000, () => console.log("Servidor rodando em: http://localhost:3000"));