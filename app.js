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

const createCards = (data) => {
    setTimeout(() => loading(), 2000);
    const countriesContainer = document.getElementById("countries-container");

    for (const country of data) {
        const card = document.createElement("div");
        card.classList.add("card", "hidden")
        card.style.display = "grid";
        card.style.placeItems = "center";
        card.textContent = country.name;
        card.addEventListener("click", (e) => {
            const countryName = e.target.textContent;
            const dataOfCountry = searchForCoutryData(countryName, countriesData);
            const dialog = document.querySelector("#show-country-data");

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

    document.getElementById("total-countries").textContent = `Total Number of countries: ${data.length}`;
};

const loading = () => {
    const container = document.querySelector(".loading");
    document.querySelector(".wrapper").removeChild(document.querySelector(".spinner"));
    container.classList.remove("loading");
};

let countriesData;

fetchCountriesData()
                .then(res => {
                    countriesData = res;
                    createCards(res);
                    const hiddenElements = document.querySelectorAll(".hidden");
                    hiddenElements.forEach((el) => observer.observe(el));
                });
