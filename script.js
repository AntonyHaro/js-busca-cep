const input = document.querySelector("input");
const button = document.querySelector("button");
const form = document.querySelector("form");

const validateInput = ({ target }) => {
    if (target.value.trim().length >= 8) {
        button.removeAttribute("disabled");
    } else {
        button.setAttribute("disabled", "");
    }
};

const handleSearch = (event) => {
    event.preventDefault();
    localStorage.setItem("search", input.value);
};

input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSearch);