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

const createCards = (data) => {
    setTimeout(() => loading(), 2000);
    const countriesContainer = document.getElementById("countries-container");

    for (const country of data) {
        const card = document.createElement("div");
        card.classList.add("card", "hidden")
        card.style.display = "grid";
        card.style.placeItems = "center";
        card.textContent = country.name;
        countriesContainer.appendChild(card);
    }

    document.getElementById("total-countries").textContent = `Total Number of countries: ${data.length}`;
};

const loading = () => {
    const container = document.querySelector(".loading");
    document.querySelector(".wrapper").removeChild(document.querySelector(".spinner"));
    container.classList.remove("loading");
};

fetchCountriesData()
                .then(res => {
                    createCards(res);
                    const hiddenElements = document.querySelectorAll(".hidden");
                    hiddenElements.forEach((el) => observer.observe(el));
                })