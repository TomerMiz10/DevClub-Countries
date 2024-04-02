import axios from 'https://cdn.skypack.dev/axios';

document.addEventListener('DOMContentLoaded', async () => {
   let countriesData;

   const fetchData = async () => {
      try{
         const res = await axios.get('https://restcountries.com/v3.1/all');
         countriesData = res.data;
         if(countriesData){
            countriesData.sort((a, b) => a.name.common.localeCompare(b.name.common));
            document.querySelector('.loader').style.display = 'none';
            renderCountries(countriesData);
            initDropdownListeners();
         }
      } catch (err) {
         console.log('Error fetching: ' + err.message);
      }
   };

   const filterCountriesByContinent = (region) => {
      if (region === 'All') {
         renderCountries(countriesData);
      } else {
         const filteredCountries = countriesData.filter(country => {
            return country.continents && country.continents[0] === region;
         });
         renderCountries(filteredCountries);
      }
   };

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
            event.preventDefault();
            window.location.href = countryElement.href;
         });

         const flagUrl = country.flags && country.flags.png ? country.flags.png : 'N/A';
         countryElement.innerHTML = `<div class="country-flag"><img src="${flagUrl}" alt="${country.name.common} Flag" /></div>`;
         countryElement.innerHTML += `<div class="country-info"><h2 class="country-title">${country.name.common}</h2></div>`;

         countriesContainer.appendChild(countryElement);
      });
   };

   const filterCountriesBySearch = (searchInput) => {
      if (!searchInput) return countriesData;
      searchInput = searchInput.toLowerCase();
      return countriesData.filter(country => {
         return country.name.common.toLowerCase().includes(searchInput);
      });
   };

   const searchInput = document.querySelector('.search-input');
   searchInput.addEventListener('input', (e) => {
      const searchValue = e.target.value.trim();
      const filteredCountries = filterCountriesBySearch(searchValue);
      renderCountries(filteredCountries);
   });

   const dropdownHeader = document.querySelector('.dropdown-header');
   const dropdownBody = document.querySelector('.dropdown-body');
   const continentList = document.querySelector('.continent-list');
   const initDropdownListeners = () => {
      dropdownHeader.addEventListener('click', () => {
         dropdownBody.classList.toggle('show');
         continentList.style.display = continentList.style.display === 'list-item' ? 'none' : 'list-item';
      });

      const dropdownItems = continentList.querySelectorAll('li');
      dropdownItems.forEach(item => {
         item.addEventListener('click', () => {
            const selectedRegion = item.dataset.region;
            filterCountriesByContinent(selectedRegion);
         });
      });
   };

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