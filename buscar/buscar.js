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
    const logradouroArea = document.getElementById("logradouro-area");
    const bairroArea = document.getElementById("bairro-area");
    const localidadeArea = document.getElementById("localidade-area");
    const estadoArea = document.getElementById("estado-area");
    const regiaoArea = document.getElementById("regiao-area");
    const ibgeArea = document.getElementById("ibge-area");
    const dddArea = document.getElementById("ddd-area");

    if (!data) {
        noResultsArea.textContent = "- CEP não encontrado.";
        clearAreas([
            logradouroArea,
            bairroArea,
            localidadeArea,
            estadoArea,
            regiaoArea,
            ibgeArea,
            dddArea,
        ]);
        return;
    }

    noResultsArea.textContent = "";
    logradouroArea.textContent = data.logradouro;
    bairroArea.textContent = data.bairro;
    localidadeArea.textContent = data.localidade;
    estadoArea.textContent = data.estado;
    regiaoArea.textContent = data.regiao;
    ibgeArea.textContent = data.ibge;
    dddArea.textContent = data.ddd;

    const search = {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        localidade: data.localidade,
    };
    searchesArray.push(search);
    localStorage.setItem("searches", JSON.stringify(searchesArray));

    renderSearches();
}

function clearAreas(areas) {
    areas.forEach((area) => (area.textContent = ""));
}

function renderSearches() {
    const searchesContainer = document.getElementById("searches-wrapper");
    searchesContainer.innerHTML = "";

    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach((search) => {
        const searchDiv = document.createElement("div");
        searchDiv.className = "search";
        searchDiv.textContent = search.cep;

        const adress = document.createElement("p");
        adress.className = "adress";
        adress.textContent = `${search.logradouro}, ${search.bairro}, ${search.localidade}.`;
        searchDiv.appendChild(adress);

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
