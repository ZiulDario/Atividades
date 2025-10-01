//1. Importar as bibliotecas necessárias
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

//2. Configurações básicas do servidor
const app = express();
const PORT = 3000;
const db = new sqlite3.Database ("./db/database.sqlite");

//3. Criar tabela de usuários se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
    )
`);

//4. Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

//5. Rota para cadastro de usuários
app.post("/register", (req, res) => {
    const {username, password} = req.body;
    const hash = bcrypt.hashSync(passoword, 8);

    db.run("INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hash],
        (err) => {
            if (err) {
                return res.send("Erro: Usuário já existe.");
            }
            res.send("Usuário cadastrado com sucesso! <a href='/'>Voltar ao login</a>");
        }
    )
});

//6. Rota para login
app.post("/login", (req, res) => {
    const {username, password} = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row => {
        if (!row) {
            return res.send("Usuário não encontrado.");
        }

        if (!bcrypt.compareSync(password, row.password)){
            return res.send("Senha incorreta.");
        }

        res.send(`Bem-vindo, ${username}! <a href='/'>Sair</a>`);

    }));
});

//7. Iniciar o sevidor na porta 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
