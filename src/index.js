import './sass/main.scss';
import '@pnotify/core/dist/BrightTheme.css';

import { debounce } from 'lodash';
import { error } from '@pnotify/core';

import countriesCard from '../templates/countries-card.hbs';
import countriesList from '../templates/countries-list.hbs';
import fetchCountry from './fetchCountries'

const searchForm = document.querySelector('.js-form');
const cardContainer = document.querySelector('.card-container');

searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
    e.preventDefault();

    clearPage();
    const searchQuery = e.target.value;

    fetchCountry(searchQuery)
     .then(countries => {
      if (countries.length > 10) {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
          mode: 'light',
          closer: true,
          sticker: false,
          hide: true,
          delay: 2000,
        });
        return;
      }
      if (countries.length <= 10 && countries.length > 1) {
        renderCountriesList(countries);
        return;
      }
      if (countries.length === 1) {
        renderCountriesCard(countries);
        return;
      }
    })
    .catch(onFetchError);
}

function renderCountriesCard(country) {
    const markup = countriesCard(country)
    cardContainer.innerHTML = markup;
}

function renderCountriesList(country) {
  const contriesList = countriesList(country);
  cardContainer.innerHTML = contriesList;
}

function clearPage() {
    cardContainer.innerHTML = "";
}

function onFetchError(err) {
  error({
    text: `${err}`,
    mode: 'dark',
    closer: true,
    sticker: false,
    hide: true,
    delay: 1000,
  });
}