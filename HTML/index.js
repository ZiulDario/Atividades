document .addEventListener('DOMContentLoaded', () => {
const form = document.querySelector("#contato form");

    if (!form){
        console.error("Formulário não encontrado!");
        return;
    }
    form.addEventListener("submit", (event) =>{
        event.preventDefault();
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if(nome ==="" || email ==="" || mensagem ===""){
            alert("Por favor, preencha todos os campos.");
            return;
        }
        const emailValido = /\S+@\S+\.\S+/.test(email);
        if(!emailValido){
            alert("Por favor, insira um endereço de email válido.");
            return;
        }
        alert('Obrigado, %(nome)! Sua mensagem foi enviada com sucesso.');
        

    });

});