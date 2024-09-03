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
    fillAreas(data);
}

function fillAreas(data) {
    const noResultsArea = document.getElementById("no-results");
    const cepArea = document.getElementById("cep-area");
    const bairroArea = document.getElementById("bairro-area");
    const cidadeArea = document.getElementById("cidade-area");
    const estadoArea = document.getElementById("estado-area");
    const regiaoArea = document.getElementById("regiao-area");

    if (!data) {
        noResultsArea.textContent = "CEP não encontrado.";
        return;
    }

    noResultsArea.textContent = "";
    cepArea.textContent = data.cep;
    bairroArea.textContent = data.bairro;
    cidadeArea.textContent = data.localidade;
    estadoArea.textContent = data.estado;
    regiaoArea.textContent = data.regiao;
}

const input = document.querySelector("input");
const button = document.querySelector("button");
const form = document.querySelector("form");

input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSearch);
