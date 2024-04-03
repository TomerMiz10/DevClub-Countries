import axios from 'https://cdn.skypack.dev/axios';

document.addEventListener('DOMContentLoaded', async () => {
   let allCountries = [];
   let filteredCountries = [];

   const dropdownHeader = document.querySelector('.dropdown-header');
   const dropdownBody = document.querySelector('.dropdown-body');
   const continentList = document.querySelector('.continent-list');

   const fetchData = async () => {
      try{
         const res = await axios.get('https://restcountries.com/v3.1/all');
         allCountries = res.data;
         filteredCountries = allCountries;

         if(allCountries){
            document.querySelector('.loader').style.display = 'none';
            renderCountries(allCountries);
            initListeners();
         }
      } catch (err) {
         console.log('Error fetching: ' + err.message);
      }
   };

   const renderCountries = (countries) => {
      const countriesContainer = document.querySelector('.countries-grid');
      if (!countriesContainer) {
         console.error('Countries container not found');
         return;
      }

      countriesContainer.innerHTML = '';
      const numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
         countryElement.innerHTML = `
                <img src="${flagUrl}" alt="${country.name.common}" class="flag">
                <div class="country-info">
                    <h3>${country.name.common}</h3>
                    <p>Population: ${numberWithCommas(country.population)}</p>
                </div>
            `;
         countriesContainer.appendChild(countryElement);
      });
   };

   const filterCountriesBySearch = (searchInput) => {
      if (!searchInput) return allCountries;
      searchInput = searchInput.toLowerCase();
      return allCountries.filter(country => {
         return country.name.common.toLowerCase().includes(searchInput);
      });
   };

   const filterCountriesByContinent = (region) => {
      if (region === 'All') {
         return allCountries;
      } else {
         return allCountries.filter(country => {
            return country.continents && country.continents[0] === region;
         });
      }
   };

   const sortCountriesByPopulation = (countries) => {
      return countries.sort((a, b) => b.population - a.population);
   };

   const sortCountriesByName = (countries) => {
        return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
   }


   const initListeners = () => {
      dropdownListener();
      searchListener();
      populationListener();
      nameListener();
      darkThemeListener();
   };


   const dropdownListener = () => {
      const toggleDropdown = () => {
         dropdownBody.classList.toggle('show');
         continentList.style.display = continentList.style.display ===
         'list-item' ? 'none' : 'list-item';
      }

      dropdownHeader.addEventListener('click', () => {
         toggleDropdown();
      });

      const dropdownItems = continentList.querySelectorAll('li');
      dropdownItems.forEach(item => {
         item.addEventListener('click', () => {
            const selectedRegion = item.dataset.region;
            filteredCountries = filterCountriesByContinent(selectedRegion);
            renderCountries(filteredCountries);
         });
      });

      document.addEventListener('click', (event) => {
         const isDropdownClicked = dropdownHeader.contains(event.target)
            || dropdownBody.contains(event.target);
            if (!isDropdownClicked) {
                dropdownBody.classList.remove('show');
            }
      });
   }

   const searchListener = () =>{
      const searchInput = document.querySelector('.search-input');
      searchInput.addEventListener('input', (e) => {
         const searchValue = e.target.value.trim();
         filteredCountries = filterCountriesBySearch(searchValue);
         renderCountries(filteredCountries);
      });
   }

   const populationListener = () => {
      const populationSortButton = document.createElement('button');
      populationSortButton.type = 'button';
      populationSortButton.textContent = 'Sort by Population';
      populationSortButton.classList.add('button', 'sort-by-population');
      populationSortButton.addEventListener('click', () => {
         sortCountriesByPopulation(filteredCountries);
         renderCountries(filteredCountries);
      });
      document.querySelector('.filters').appendChild(populationSortButton);
   }

   const nameListener = () => {
        const nameSortButton = document.createElement('button');
        nameSortButton.type = 'button';
        nameSortButton.textContent = 'Sort by Name';
        nameSortButton.classList.add('button', 'sort-by-name');
        nameSortButton.addEventListener('click', () => {
             sortCountriesByName(filteredCountries);
             renderCountries(filteredCountries);
        });
        document.querySelector('.filters').appendChild(nameSortButton);
   }

   const darkThemeListener = () => {
      const themeToggle = document.querySelector('.theme-toggle');

      if(themeToggle){
         themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
         });
      }
   }


   // init the page
   await fetchData();
});

