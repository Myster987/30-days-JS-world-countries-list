const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
});

const handleFetching = async (task) => {
    try {
        const data = await task;
        const result = await data.json();
        return [result, null]
    } catch (error) {
        return [null, error]
    }
};

const fetchCountriesData = async () => {
    const url = "https://restcountries.com/v2/all";
    const [data, error] = await handleFetching((await fetch(url)));

    if (error) return null;

    return data;
};

const searchForCoutryData = (countryName, data) => {
    for (const country of data){
        if (country.name == countryName){
            return country
        }
    }
};

const createCards = (data, delay = 2000) => {
    if (delay > 0) {
        setTimeout(() => loading(), delay);
    }
    const countriesContainer = document.getElementById("countries-container");
    const saveDialog = countriesContainer.children[0];

    countriesContainer.innerHTML = "";
    countriesContainer.appendChild(saveDialog);

    for (const country of data) {
        const card = document.createElement("div");
        card.classList.add("card", "hidden")
        card.style.display = "grid";
        card.style.placeItems = "center";
        card.textContent = country.name;
        card.addEventListener("click", (e) => {
            const countryName = e.target.textContent;
            const dataOfCountry = searchForCoutryData(countryName, countriesData);
            const dialog = document.getElementById("show-country-data");
            const flag = document.getElementById("flag");

            flag.src = dataOfCountry.flags.svg;
            flag.alt = `Flag of ${countryName}`;

            const h2CountryName = document.getElementById("countryName");
            h2CountryName.textContent = countryName;
            
            const h4CountryName = document.getElementById("countryCapital");
            h4CountryName.textContent = `capital: ${dataOfCountry.capital}`;
            
            const h6Continent = document.getElementById("continent");
            h6Continent.textContent = `continent: ${dataOfCountry.region}`;

            const population = document.getElementById("population");
            population.textContent = `population: ${dataOfCountry.population.toLocaleString("en-US")}`;

            const area = document.getElementById("area");
            area.textContent = `area: ${dataOfCountry.area.toLocaleString("en-US")} km²`;

            const button = document.getElementById("closeBtn");
            button.onclick = () => dialog.close();

            dialog.showModal();
        });
        countriesContainer.appendChild(card);
    }
};

const loading = () => {
    const container = document.querySelector(".loading");
    document.querySelector(".wrapper").removeChild(document.querySelector(".spinner"));
    container.classList.remove("loading");
};

const searchCoutries = (data, toSearch, mode="firstWord") => {
    const result = [];
    toSearch = toSearch.toLowerCase();

    for (const country of data) {
        let index;

        if (mode == "firstWord") {
            let coutryName = country.name.toLowerCase();
            let indexOfSpace = coutryName.indexOf(" ");
            index = (indexOfSpace == -1 ? coutryName : coutryName.substring(0, indexOfSpace)).indexOf(toSearch);
        } else {
            index = country.name.toLowerCase().indexOf(toSearch);
        }

        if (index != -1) {
            result.push({coutry: country, index: index});
        }
    }

    return result.sort((a, b) => a.index - b.index).map((val) => val.coutry);
};

let countriesData = [];
let searchResult = [];
let mode = "firstWord"
let currentlyFocused = document.getElementById("starting-word");

fetchCountriesData()
                .then(res => {
                    countriesData = res;
                    createCards(res);
                    const hiddenElements = document.querySelectorAll(".hidden");
                    hiddenElements.forEach((el) => observer.observe(el));
                    document.getElementById("total-countries").textContent = `Total Number of countries: ${res.length}`;
                });

const searchBtn = document.querySelector(".search-icon-container");
searchBtn.onclick = () => {
    if (!countriesData.length) return;

    
    searchResult = searchCoutries(countriesData, document.getElementById("search-input").value, mode);
    console.log(searchResult);
    createCards(searchResult, 0);
    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach((el) => observer.observe(el));
};

document.getElementById("starting-word").onclick = (e) => {
    currentlyFocused.classList.remove("selected");
    currentlyFocused = e.target;
    mode = "firstWord";
    currentlyFocused.classList.add("selected");
};

document.getElementById("search-by-any-word").onclick = (e) => {
    currentlyFocused.classList.remove("selected");
    currentlyFocused = e.target;
    mode = "anyWord";
    currentlyFocused.classList.add("selected");
};

document.getElementById("sort-by").onclick = () => {
    const data = document.getElementById("countries-container");

    for (let i = 1; i < data.childNodes.length; i++){
        data.insertBefore(data.childNodes[i], data.childNodes[1]);
    }
};