import axios from 'https://cdn.skypack.dev/axios';


document.addEventListener('DOMContentLoaded', async () => {
   const searchInput = document.querySelector('.search-input');
   let countriesData;

   // fetch url of rest-countries API
   const fetchData = async () => {
      try{
         const res = await axios.get('https://restcountries.com/v3.1/all');
         countriesData = res.data;
         console.log(countriesData);
         renderCountries(countriesData);
      } catch (err) {
         console.log('Error fetching: ' + err.message);
      }
   };

   // function to filter countries by search input
   const filterCountriesBySearch = (searchInput) => {
      if (!searchInput) return countriesData;
      searchInput = searchInput.toLowerCase();
      const filteredCountries = countriesData.filter(country => {
         return country.name.common.toLowerCase().includes(searchInput);
      });
      console.log(filteredCountries);
      return filteredCountries;
   };

   // function to filter countries by region
   const filterCountriesByRegion = (region) => {
      return countriesData.filter(country =>
         region === 'all' || country.region.toLowerCase() === region.toLowerCase());
   };

   // function to render countries
   const renderCountries = (countries = countriesData) => {
      const countriesContainer = document.querySelector('.countries-grid');
      if (!countriesContainer) {
         console.error('Countries container not found');
         return;
      }

      countriesContainer.innerHTML = '';

      countries.forEach(country =>{
         const countryElement = document.createElement('a');
         countryElement.classList.add('country', 'scale-effect');
         countryElement.href = `details.html?country=${encodeURIComponent(country.name.common)}`;
         countryElement.setAttribute('data-country-name', country.name.common);

         // Add event listener to handle click on country
         countryElement.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default behavior of anchor tag
            console.log(`Clicked on ${country.name.common}`); // Log the clicked country
            // Navigate to details page with country data
            window.location.href = countryElement.href;
         });

         countryElement.innerHTML = `<div class="country-flag"><img src="${country.flags.png}" alt="${country.name.common} Flag" /></div>`;
         countryElement.innerHTML += `<div class="country-info"><h2 class="country-title">${country.name.common}</h2></div>`;

         countriesContainer.appendChild(countryElement);
      });
   };

   // event listener for search input
   searchInput.addEventListener('input', (e) => {
      const searchValue = e.target.value.trim();
      const filteredCountries = filterCountriesBySearch(searchValue);
      renderCountries(filteredCountries);
   });

   // event listener for dropdown select <-> region
   const dropdownItems = document.querySelectorAll('.dropdown-body li');
   dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
         const region = this.getAttribute('data-region');
         const filteredCountries = filterCountriesByRegion(region);
         renderCountries(filteredCountries);
      });
   });
   // init the page
   await fetchData();
});

