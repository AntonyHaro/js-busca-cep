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

function fillAreas(data, alreadySearched) {
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

    if (!alreadySearched) {
        setLocalStorageSearch(
            data.cep,
            data.logradouro,
            data.bairro,
            data.localidade
        );
        renderSearches();
    }
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
        const searchContainer = document.createElement("a");
        searchContainer.className = "search";
        searchContainer.textContent = search.cep;
        searchContainer.href = "#";

        const adress = document.createElement("p");
        adress.className = "adress";
        adress.textContent = `${search.logradouro}, ${search.bairro}, ${search.localidade}.`;
        searchContainer.appendChild(adress);

        searchContainer.addEventListener("click", () => {
            handleSearchClick(search.cep);
        });

        searchesContainer.appendChild(searchContainer);
    });
}

async function handleSearchClick(cep) {
    const data = await fetchData(cep);
    fillAreas(data, true);
}

const input = document.querySelector("input");
const button = document.querySelector("button");
const form = document.querySelector("form");

input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSearch);

localStorage.clear();
const searchesArray = JSON.parse(localStorage.getItem("searches")) || [];
renderSearches();
