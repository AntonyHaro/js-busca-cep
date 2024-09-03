function validateInput({ target }) {
    if (target.value.trim().length >= 8) {
        button.removeAttribute("disabled");
    } else {
        button.setAttribute("disabled", "");
    }
}

async function fetchData(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.erro) {
            console.error("CEP não encontrado:", cep);
            return null;
        } else {
            return data;
        }
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        return null;
    }
}

async function handleSearch(event) {
    event.preventDefault();
    const cep = document.getElementById("cep-input").value;
    const data = await fetchData(cep);
    fillFields(data);
}

function fillFields(data) {
    const noResultsField = document.getElementById("no-results");
    const cepField = document.getElementById("cep-field");
    const bairroField = document.getElementById("bairro-field");
    const cidadeField = document.getElementById("cidade-field");
    const estadoField = document.getElementById("estado-field");
    const regiaoField = document.getElementById("regiao-field");

    if (!data) {
        noResultsField.textContent = "CEP não encontrado.";
        return;
    }

    noResultsField.textContent = "";
    cepField.textContent = data.cep;
    bairroField.textContent = data.bairro;
    cidadeField.textContent = data.localidade;
    estadoField.textContent = data.estado;
    regiaoField.textContent = data.regiao;
}

const input = document.querySelector("input");
const button = document.querySelector("button");
const form = document.querySelector("form");

input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSearch);
