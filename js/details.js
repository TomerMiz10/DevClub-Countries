
document.addEventListener('DOMContentLoaded', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const countryName = searchParams.get('country');
    const loader = document.querySelector('.loader');
    const COUNTRY_BY_NAME_URL = `https://restcountries.com/v3.1/name/${countryName}`;

    if (countryName) {
        loader.style.display = 'none';
        const fetchCountryDetails = async () => {
            try {
                const res = await axios.get(COUNTRY_BY_NAME_URL);
                const countryDetails = res.data[0];
                console.log(countryDetails);
                renderCountryDetails(countryDetails);
            } catch (err) {
                console.log('Error fetching country details: ' + err.message);
            }
        };

        const renderCountryDetails = (country) => {
            const countryDetailsContainer = document.querySelector('.country-details');

            if (country){
                const {name, flagSrc, population,
                    continent, capital, languages,
                    subregion, currencies } = getCountryDetails(country);

            countryDetailsContainer.innerHTML = `
                <p><strong>Country Name</strong> ${name}
                    <br>
                    <img src="${flagSrc}" alt="${name} Flag" class="flag-image"/>
                    <p><strong>Population:</strong> ${population}</p>
                    <p><strong>Continent:</strong> ${continent}</p>
                    <p><strong>Capital:</strong> ${capital}</p>
                    <p><strong>Languages:</strong> ${languages}</p>
                    <p><strong>Subregion:</strong> ${subregion}</p>
                    <p><strong>Currencies:</strong> ${currencies}</p>
                </p>                
            `;
            } else {
                countryDetailsContainer.innerHTML = 'Country details not found';
            }
        };

        const getCountryDetails = (country) => {
            const numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const NA = 'N/A';

            const name = country.name ? country.name.common : NA;
            const flagSrc = country.flags ? country.flags.png : '';
            const population = country.population ? numberWithCommas(country.population) : NA;
            const continent = country.continents ? Object.values(country.continents).join(', ') : NA;
            const capital = country.capital ? country.capital[0] : NA;
            const languages = country.languages ? Object.values(country.languages).join(', ') : NA;
            const subregion = country.subregion || NA;
            const currencies = country.currencies
                ? `${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol})`
                : NA;

            return {
                name, flagSrc, population,
                continent, capital, languages,
                subregion, currencies
            };
        }

        // Fetch country details on page load
        await fetchCountryDetails();
    } else {
        console.log('Country name is not provided.');
    }
});

const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

if(themeToggle){
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
    });
}