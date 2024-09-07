function validateInput() {
    const cidadeValue = document.getElementById("cidade").value.trim();
    const logradouroValue = document.getElementById("logradouro").value.trim();

    if (logradouroValue.length >= 3 && cidadeValue.length >= 3) {
        searchButton.removeAttribute("disabled");
    } else {
        searchButton.setAttribute("disabled", "");
    }
}

async function fetchData(uf, cidade, logradouro) {
    const url = `https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`;
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
    const uf = document.getElementById("uf").value;
    const cidade = document.getElementById("cidade").value;
    const logradouro = document.getElementById("logradouro").value;
    const data = await fetchData(uf, cidade, logradouro);
    renderResults(data);
}

function renderResults(data) {
    const cepsWrapper = document.getElementById("ceps-wrapper");
    cepsWrapper.innerHTML = "";

    if (!data || data.length == 0) {
        noResultsArea.textContent = "- Sem resultados.";
        return;
    }

    noResultsArea.textContent = "";
    data.forEach((search) => {
        const cep = createCepContainer(
            search.cep,
            search.logradouro,
            search.bairro,
            search.localidade
        );
        cepsWrapper.appendChild(cep);
    });
}

function createCepContainer(cep, logradouro, bairro, localidade) {
    const cepContainer = document.createElement("div");
    cepContainer.className = "cep";
    cepContainer.textContent = cep;

    const adress = document.createElement("p");
    adress.className = "adress";
    adress.textContent = `${logradouro}, ${bairro}, ${localidade}.`;
    cepContainer.appendChild(adress);

    return cepContainer;
}

const form = document.querySelector("form");
const searchButton = document.getElementById("search-button");
const noResultsArea = document.getElementById("no-results");

document.getElementById("cidade").addEventListener("input", validateInput);
document.getElementById("logradouro").addEventListener("input", validateInput);

form.addEventListener("submit", handleSearch);
