import Select from './select.js'

const selectElements = document.querySelectorAll('[data-custom]');

selectElements.forEach(element => {
    new Select(element);
})