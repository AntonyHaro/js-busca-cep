function validateInput({ target }) {
    if (target.value.trim().length >= 8) {
        searchButton.removeAttribute("disabled");
    } else {
        searchButton.setAttribute("disabled", "");
    }
}

async function fetchData(uf, cidade, logradouro) {
    const url = `https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro na solicitação");

        const data = await response.json();
        console.log(data);
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
    if (!data) {
        noResultsArea.textContent = "- Erro ao buscar o CEP.";
        return;
    }

    const cepsWrapper = document.getElementById("ceps-wrapper");
    cepsWrapper.innerHTML = "";

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

const input = document.querySelector("input");
const form = document.querySelector("form");
const searchButton = document.getElementById("search-button");

// input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSearch);
