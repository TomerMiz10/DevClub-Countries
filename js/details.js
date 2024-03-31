
document.addEventListener('DOMContentLoaded', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const countryName = searchParams.get('country');
    console.log(countryName);

    const loader = document.querySelector('.loader');

    if (countryName) {
        loader.style.display = 'none';
        // Function to fetch details of the specified country
        const fetchCountryDetails = async (countryName) => {
            try {
                const res = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
                const countryDetails = res.data[0];
                console.log(countryDetails);
                renderCountryDetails(countryDetails);
            } catch (err) {
                console.log('Error fetching country details: ' + err.message);
            }
        };

        // Function to render country details on the page
        const renderCountryDetails = (country) => {
            const countryDetailsContainer = document.querySelector('.country-details');

            // Check if the properties exist in the country object
            const flagSrc = country.flags ? country.flags.png : ''; // Check if flags property exists
            const population = country.population || 'N/A'; // Check if population property exists
            const capital = country.capital[0] || 'N/A'; // Check if capital property exists

            // Construct HTML to display country details
            countryDetailsContainer.innerHTML = `
                <h2>${country.name.common}</h2>
                <img src="${flagSrc}" alt="${country.name.common} Flag" />
                <p>Population: ${population}</p>
                <p>Region: ${country.region}</p>
                <p>Capital: ${capital}</p>
                <!-- Add more details as needed -->
            `;
        };

        // Fetch country details on page load
        await fetchCountryDetails(countryName);
    } else {
        console.log('Country name is not provided.');
    }
});