import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import API from './components/fetchCountries'

const input = document.querySelector('#search-box')
const list = document.querySelector('.country-list')
const info = document.querySelector('.country-info')
const DEBOUNCE_DELAY = 300;




input.addEventListener('input', debounce(onCuntrySearch, DEBOUNCE_DELAY))

function onCuntrySearch(evt){
    evt.preventDefault()
    
    const inputValue = evt.target.value.trim();
    if(inputValue === ""){
        clearTextContent()
        return
        }
    
    clearTextContent()
    let langName

    API.fetchCountries(inputValue).then((country) => {
        const amountCountry = country.length
        
        if(amountCountry > 10){
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.',
            { position: "top-right", width: '420px', fontSize: '20px' });
        }
        
        country.map((el) => {

            el.languages.map((lang) => langName = lang.name)
            
            const markup = markupListCountry(el)
            const markupInfo = markupCountryInfo(el, langName)
            markupAmount(markup, markupInfo, amountCountry)
            return;
        })
        
    })
    .catch(error =>{
        Notiflix.Notify.failure("Oops, there is no country with that name.", 
        { position: "center-center", width: '420px', fontSize: '20px' })
    })
    
    

}


function markupAmount(markup, markupInfo, amountCountry){
if(amountCountry >= 2 && amountCountry < 10){
    info.innerHTML = ' ';
    list.insertAdjacentHTML('beforeend', markup);
    return
}
if(amountCountry === 1){
    list.innerHTML = ' ';
     info.insertAdjacentHTML('beforeend', markupInfo);
     return
}

} 

function clearTextContent(){
    list.textContent = " ";
    info.textContent = " ";
}


function markupListCountry({ flags, name }) {
    return `<li class="country-item__all"><img class="country-list__img" src="${flags.svg}" alt="name" width="50" /> ${name}</li>`;
  }

function markupCountryInfo(el, langName){
    return `
    <div class="container">
    <div class="cont-name">
        <img src="${el.flags.svg}" width="150px" alt="${el.name}">
        <h2 class="country-title">${el.name}</h2>
      </div>
        <ul class="country-list">
          <li class="country-item">Capital: <span class="country-text">${el.capital}<span/></li>
          <li class="country-item">Population: <span class="country-text">${el.population}<span/></li>
          <li class="country-item">Languages: <span class="country-text">${langName}<span/></li>
        </ul>
    <div/>`
    
}







