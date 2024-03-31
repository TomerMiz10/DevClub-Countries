
document.addEventListener('DOMContentLoaded', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const countryName = searchParams.get('country');

    const loader = document.querySelector('.loader');

    if (countryName) {
        loader.style.display = 'none';
        const fetchCountryDetails = async (countryName) => {
            try {
                const res = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
                const countryDetails = res.data[0];
                renderCountryDetails(countryDetails);
            } catch (err) {
                console.log('Error fetching country details: ' + err.message);
            }
        };

        const renderCountryDetails = (country) => {
            const countryDetailsContainer = document.querySelector('.country-details');

            // Check if the properties exist in the country object
            const countryName = country.name ? country.name.common : 'N/A';
            const flagSrc = country.flags ? country.flags.png : '';
            const population = country.population ? numberWithCommas(country.population) : 'N/A';
            const continent = country.continents ? country.continents[0] : 'N/A';
            const capital = country.capital[0] || 'N/A';
            const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
            const subregion = country.subregion || 'N/A';
            const currencies = country.currencies
                ? `${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol})`
                : 'N/A';


            // Construct HTML to display country details
            countryDetailsContainer.innerHTML = `
                <p><strong>Country Name</strong> ${countryName}
                    <br>
                    <img src="${flagSrc}" alt="${countryName} Flag" class="flag-image"/>
                    <p><strong>Population:</strong> ${population}</p>
                    <p><strong>Continent:</strong> ${continent}</p>
                    <p><strong>Capital:</strong> ${capital}</p>
                    <p><strong>Languages:</strong> ${languages}</p>
                    <p><strong>Subregion:</strong> ${subregion}</p>
                    <p><strong>Currencies:</strong> ${currencies}</p>
                </p>                
            `;
        };

        // Fetch country details on page load
        await fetchCountryDetails(countryName);
    } else {
        console.log('Country name is not provided.');
    }
});

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

if(themeToggle){
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
    });
}