import axios from 'https://cdn.skypack.dev/axios';

document.addEventListener('DOMContentLoaded', async () => {
   const searchInput = document.querySelector('.search-input');
   let countriesData;

   const loader = document.querySelector('.loader');
   // fetch url of rest-countries API
   const fetchData = async () => {
      try{
         const res = await axios.get('https://restcountries.com/v3.1/all');
         countriesData = res.data;
         if(countriesData){
            countriesData.sort((a, b) => a.name.common.localeCompare(b.name.common));
            loader.style.display = 'none';
            renderCountries(countriesData);
         }
      } catch (err) {
         console.log('Error fetching: ' + err.message);
      }
   };

   // function to filter countries by search input
   const filterCountriesBySearch = (searchInput) => {
      if (!searchInput) return countriesData;
      searchInput = searchInput.toLowerCase();
      return countriesData.filter(country => {
         return country.name.common.toLowerCase().includes(searchInput);
      });
   };

   // function to filter countries by region
   const filterCountriesByContinent = (region) => {
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

      countries.forEach(country => {
         const countryElement = document.createElement('a');
         countryElement.classList.add('country', 'scale-effect');
         countryElement.href = `details.html?country=${encodeURIComponent(country.name.common)}`;
         countryElement.setAttribute('data-country-name', country.name.common);

         countryElement.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default behavior of anchor tag
            console.log(`Clicked on ${country.name.common}`); // Log the clicked country
            // Navigate to details page with country data
            window.location.href = countryElement.href;
         });

         const flagUrl = country.flags && country.flags.png ? country.flags.png : 'N/A';
         countryElement.innerHTML = `<div class="country-flag"><img src="${flagUrl}" alt="${country.name.common} Flag" /></div>`;
         countryElement.innerHTML += `<div class="country-info"><h2 class="country-title">${country.name.common}</h2></div>`;

         countriesContainer.appendChild(countryElement);
      });
   };

   searchInput.addEventListener('input', (e) => {
      const searchValue = e.target.value.trim();
      const filteredCountries = filterCountriesBySearch(searchValue);
      renderCountries(filteredCountries);
   });

   // event listener for dropdown select <-> region
   const dropdownItems = document.querySelectorAll('.dropdown-body .continent-list li');
   console.log('Dropdown items:', dropdownItems);
   console.log(dropdownItems.values());
   dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
         const continent = e.target.getAttribute('data-region');
         console.log('Selected region:', continent);
         const filteredCountries = filterCountriesByContinent(continent);
         console.log('Filtered countries:', filteredCountries);
         renderCountries(filteredCountries);
      });
   });

   const dropdownHeader = document.querySelector('.dropdown-header');
   const dropdownBody = document.querySelector('.dropdown-body');
   dropdownHeader.addEventListener('click', () => {
      console.log('clicked');
      dropdownHeader.classList.toggle('active');
      dropdownBody.classList.toggle('show');

   });

   // init the page
   await fetchData();
});

const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

if(themeToggle){
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
    });
}