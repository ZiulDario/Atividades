let cadastros = [];

const form = document.getElementById("FormCadastro");
const lista = document.getElementById("listaCadastros");

const inputId = document.getElementById("cadastroId");
const inputNome = document.getElementById("nome");
const inputPet = document.getElementById("pet");
const inputTele = document.getElementById("telefone");
const inputEmail = document.getElementById("email");

form.addEventListener("submit", (e) => {
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
    if (id){
        const cadastro = cadastros.find(c => c.id == id);
        cadastro.nome = nome;
        cadastro.pet = pet;
        cadastro.telefone = telefone;
        cadastro.email = email;
        inputId.value= "";

    }else {
        const novoCadastro = {
            id: Date.now(),
            nome,
            pet,
            telefone,
            email
        };
        cadastros.push(novoCadastro);
    }

    form.reset();
    renderCadastros();
});

function renderCadastros(){
    lista.innerHTML = "";
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

function editarCadastro(id){
    const cadastro = cadastros.find(c => c.id == id);
    inputId.value = cadastro.id
    inputNome.value = cadastro.nome;
    inputPet.value = cadastro.pet;
    inputTele.value = cadastro.telefone;
    inputEmail.value = cadastro.email;
}

function deletarCadastro(id){
    cadastro = cadastros.filter(c => c.id !== id);
    renderCadastros();
}