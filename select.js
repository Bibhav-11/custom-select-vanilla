export default class Select {
    constructor(element) {
        this.element = element;
        this.customElementWrapper = document.createElement('div');
        this.customElementLabel = document.createElement('span');
        this.customElementOptions = document.createElement('ul');

        this.options = getFormattedOptions(element.options);

        element.after(this.customElementWrapper);
        element.style.display = 'none';
        setUpCustom(this);      
    }

    get getSelectedOption() {
        return this.options.find(option => option.selected);    
    }

    get getIndexOf() {
        return this.options.indexOf(this.getSelectedOption);
    }

    setValue(value) {
        const prevSelected = this.getSelectedOption;
        prevSelected.selected = false;
        prevSelected.element.selected = false;

        const newSelected = this.options.find(option => option.value === value);
        newSelected.selected = true;
        newSelected.element.selected = true;

        this.customElementOptions.querySelector(`[data-value="${prevSelected.value}"]`).classList.remove('selected');
        this.customElementOptions.querySelector(`[data-value="${newSelected.value}"]`).classList.add('selected');

        this.customElementOptions.querySelector(`[data-value="${newSelected.value}"]`).scrollIntoView({block: "nearest"})

        this.customElementLabel.innerHTML = newSelected.label;
    }
} 

function setUpCustom(select) {
    select.customElementWrapper.classList.add('custom-element-wrapper');
    select.customElementWrapper.tabIndex = 0;
    select.customElementLabel.classList.add('custom-element-label');
    select.customElementOptions.classList.add('custom-element-options');

    select.customElementWrapper.append(select.customElementLabel);
    select.customElementWrapper.append(select.customElementOptions);

    const selected = select.getSelectedOption.label;
    select.customElementLabel.innerHTML = selected;

    select.options.forEach(option => {
        const optionElement = document.createElement('li');
        optionElement.classList.add('custom-element-option');
        optionElement.innerHTML = option.label;
        optionElement.dataset.value = option.value;
        optionElement.classList.toggle('selected', option.selected);

        optionElement.addEventListener('click', e => {
            select.customElementOptions.classList.remove('show');
            select.setValue(option.value);
        })
        select.customElementOptions.append(optionElement);

    })

    select.customElementLabel.addEventListener('click', e => {
        select.customElementOptions.classList.toggle('show');
    })

    select.customElementWrapper.addEventListener('blur', e => {
        select.customElementOptions.classList.remove('show');
    })

    let searchTerm = '', debounceTimeOut;
    select.customElementWrapper.addEventListener('keydown', e=> {
        switch(e.code) {
            case "Space":
            case "Enter":
                select.customElementOptions.classList.toggle('show');
                break;
            case "Escape":
                select.customElementOptions.classList.remove('show');
                break;
            case "ArrowUp":
                const prevElement = select.options[select.getIndexOf - 1];
                if(prevElement) select.setValue(prevElement.value);
                break;
            case "ArrowDown":
                const nextElement = select.options[select.getIndexOf + 1];
                if(nextElement) select.setValue(nextElement.value);
                break;
            default:
                clearTimeout(debounceTimeOut);
                searchTerm = searchTerm + e.key;
                const foundOption = select.options.find(option => option.label.toLowerCase().startsWith(searchTerm));
                if(foundOption) select.setValue(foundOption.value);               
                debounceTimeOut = setTimeout(() => {
                    searchTerm = "";
                }, 500);

        }
    })

}

function getFormattedOptions(options) {
    return [...options].map(option => {
        return {
            value: option.value,
            label: option.label,
            element: option,
            selected: option.selected
        }
    })
}