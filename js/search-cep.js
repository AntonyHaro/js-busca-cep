const noResultsArea = document.getElementById("no-results");
const logradouroArea = document.getElementById("logradouro-area");
const bairroArea = document.getElementById("bairro-area");
const localidadeArea = document.getElementById("localidade-area");
const estadoArea = document.getElementById("estado-area");
const regiaoArea = document.getElementById("regiao-area");
const ibgeArea = document.getElementById("ibge-area");
const dddArea = document.getElementById("ddd-area");
const ufArea = document.getElementById("uf-area");

function validateInput({ target }) {
    if (target.value.trim().length >= 8) {
        searchButton.removeAttribute("disabled");
    } else {
        searchButton.setAttribute("disabled", "");
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
        ("Erro ao buscar o CEP. Tente novamente mais tarde.");
        return null;
    }
}

async function handleSearch(event) {
    event.preventDefault();
    const cep = document.getElementById("cep-input").value;
    const data = await fetchData(cep);
    fillAreas(data);
}

function fillAreas(data, alreadySearched) {
    if (!data) {
        noResultsArea.textContent = "- Erro ao buscar o CEP.";
        clearAreas([
            logradouroArea,
            bairroArea,
            localidadeArea,
            estadoArea,
            regiaoArea,
            ibgeArea,
            dddArea,
            ufArea,
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
    ufArea.textContent = data.uf;

    if (!alreadySearched)
        setLocalStorageSearch(
            data.cep,
            data.logradouro,
            data.bairro,
            data.localidade
        );
}

function setLocalStorageSearch(cep, logradouro, bairro, localidade) {
    const search = {
        cep: cep,
        logradouro: logradouro,
        bairro: bairro,
        localidade: localidade,
    };
    searchesArray.push(search);
    localStorage.setItem("searches", JSON.stringify(searchesArray));
    renderSearches();
}

function clearAreas(areas) {
    areas.forEach((area) => (area.textContent = ""));
}

function renderSearches() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (searches.length === 0) return;

    const searchesContainer = document.getElementById("searches-wrapper");
    searchesContainer.innerHTML = "";

    searches.forEach((search) => {
        const searchContainer = createSearch(
            search.cep,
            search.logradouro,
            search.bairro,
            search.localidade
        );

        searchesContainer.appendChild(searchContainer);
    });
}

function createSearch(cep, logradouro, bairro, localidade) {
    const search = document.createElement("a");
    search.className = "search";
    search.textContent = cep;
    search.href = "#";

    const adress = document.createElement("p");
    adress.className = "adress";
    adress.textContent = `${logradouro}, ${bairro}, ${localidade}.`;
    search.appendChild(adress);

    search.addEventListener("click", () => {
        handleSearchClick(cep);
    });

    return search;
}

async function handleSearchClick(cep) {
    const data = await fetchData(cep);
    fillAreas(data, true);
}

function clearSearches() {
    localStorage.removeItem("searches");
    const searchesContainer = document.getElementById("searches-wrapper");
    searchesContainer.innerHTML = "- Nenhuma pesquisa feita.";
    searchesArray = [];
}

const input = document.querySelector("input");
const form = document.querySelector("form");
const searchButton = document.getElementById("search-button");
const clearSearchesButton = document.getElementById("clear-searches");

input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSearch);
clearSearchesButton.addEventListener("click", clearSearches);

let searchesArray = JSON.parse(localStorage.getItem("searches")) || [];
renderSearches();
