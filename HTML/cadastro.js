let cadastros = [];

const form = document.getElementById("FormCadastro");
const lista = document.getElementById("listaCadastros");

const inputId = document.getElementById("cadastroId");
const inputNome = document.getElementById("nome");
const inputPet = document.getElementById("pet");
const inputTele = document.getElementById("telefone");
const inputEmail = document.getElementById("email");

const API_URL = "http://localhost:3000/clientes";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = inputId.value;
    const nome = inputNome.value.trim();
    const pet = inputPet.value.trim();
    const telefone = inputTele.value.trim();
    const email = inputEmail.value.trim();

    if (!nome || !pet || !telefone || !email){
        alert("Preencha todos os campos !");
        return;
    }
    const dados = {nome, pet, telefone, email};
    if (id){
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dados),
        });
        input.Id.value = "";
    }else {
        await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dados),
        });
    };
    form.reset();
    renderCadastros();
});

async function renderCadastros(){
    lista.innerHTML = "";
    const resp = await fetch(API_URL);
    const cadastros = await resp.json();


    cadastros.forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.nome}</td>
            <td>${c.pet}</td>
            <td>${c.telefone}</td>
            <td>${c.email}</td>
            <td>
                <button class "btn btn-sm btn-warning me-2" onclick="editarCadastro(${c.id})">Editar</button>
                <button class "btn btn-sm btn-danger" onclick="deletarCadastro(${c.id})">Deletar</button>
            </td>
        `;

        lista.appendChild(tr);
    });
}

async function editarCadastro(id){
    const resp = await fetch(`${API_URL}`);
    const cadastros = await resp.json();

    const cadastro = cadastros.find(c => c.id == id);
    inputId.value = cadastro.id
    inputNome.value = cadastro.nome;
    inputPet.value = cadastro.pet;
    inputTele.value = cadastro.telefone;
    inputEmail.value = cadastro.email;
}

async function deletarCadastro(id){
    await fetch(`${API_URL}/${id}`, {method: "DELETE"});
    renderCadastros();
}
document.addEventListener("DOMContentLoaded", renderCadastros);
