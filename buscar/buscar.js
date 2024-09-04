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
        if (!response.ok) throw new Error("Erro na solicitação");

        const data = await response.json();
        return data.erro ? null : data;
    } catch (error) {
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
        noResultsArea.textContent = "- CEP não encontrado.";
        clearAreas([cepArea, bairroArea, cidadeArea, estadoArea, regiaoArea]);
        return;
    }

    noResultsArea.textContent = "";
    cepArea.textContent = data.cep;
    bairroArea.textContent = data.bairro;
    cidadeArea.textContent = data.localidade;
    estadoArea.textContent = data.estado;
    regiaoArea.textContent = data.regiao;

    searchesArray.push(data.cep);
    localStorage.setItem("searches", JSON.stringify(searchesArray));
    renderSearches();
}

function clearAreas(areas) {
    areas.forEach((area) => (area.textContent = ""));
}

function renderSearches() {
    const searchesContainer = document.getElementById("searches-wrapper");
    searchesContainer.innerHTML = "";

    const searches = JSON.parse(localStorage.getItem("searches"));
    searches.forEach((search) => {
        const searchDiv = document.createElement("div");
        searchDiv.className = "search";
        searchDiv.textContent = search;
        searchesContainer.appendChild(searchDiv);
    });
}

const input = document.querySelector("input");
const button = document.querySelector("button");
const form = document.querySelector("form");

input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSearch);

const searchesArray = JSON.parse(localStorage.getItem("searches")) || [];
renderSearches();
