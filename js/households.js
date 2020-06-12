const householdList = document.querySelector('#household-list')
const backendURL = 'https://wedding-website-backend.herokuapp.com'
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.token}`
}

fetchHouseholds()
addHouseholdEventListener()
addAddressEventListener()

function fetchHouseholds(){
    fetch(`${backendURL}/households`, {headers: headers})
        .then(response => response.json())
        .then(households => {
            displayHouseholds(households)
            addHouseholdDropdown(households)
        })
}

function displayHouseholds(households){
    households.forEach(renderHousehold)
}

function renderHousehold(household){
    const row = document.createElement('tr')
    const family = document.createElement('td')
    const region = document.createElement('td')
    const guestCount = document.createElement('td')
    
    family.textContent = household.family
    region.textContent = household.region
    if (!household.guests) {
        guestCount.textContent = 0
    } else {
        guestCount.textContent = household.guests.length
    }

    row.append(family,region,guestCount)
    householdList.append(row)
}

function addHouseholdEventListener() {
    const addHouseholdForm = document.querySelector('#add-household-form')
    addHouseholdForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const householdFormData = new FormData(addHouseholdForm)
        const family = householdFormData.get('family')
        const region = householdFormData.get('region')
        const household = {family,region}

        renderHousehold(household)
        postNewHousehold(household)
        event.target.reset()
    })
}

function postNewHousehold(household) {
    fetch(`${backendURL}/households`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(household)
    }).then(response => response.json())
    .then(results => {
        handleResponse(results,'household')
    })
}

function handleResponse(response,element){
    const successMessage = document.querySelector(`#add-${element}-form .success-message`)
    successMessage.textContent = response.message
}

getStates()

function getStates(){
    fetch('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json')
        .then(response => response.json())
        .then(results => addStatesToDropdown(Object.keys(results)))
}

function addStatesToDropdown(states){
    const stateDropdown = document.querySelector('#stateField')
    states.forEach(state => {
        const stateOption = document.createElement('option')
        stateOption.textContent = state
        stateOption.value = state
        stateDropdown.append(stateOption)
    })
}

function addHouseholdDropdown(households){
    const householdDropdown = document.querySelector('.household-dropdown')
    households.forEach(household => {
        addHouseholdToDropdown(household,householdDropdown)
    })
}

function addHouseholdToDropdown(household,dropdown){
    const householdOption = document.createElement('option')
            
    householdOption.textContent = `${household.family} - ${household.region}`
    householdOption.value = household.id
    householdOption.className = `household-option-${household.id}`

    dropdown.appendChild(householdOption)
}

function addAddressEventListener(){
    const addAddressForm = document.querySelector('#add-address-form')
    addAddressForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const addressFormData = new FormData(addAddressForm)
        const household_id = addressFormData.get('household_id')
        const street1 = addressFormData.get('street1')
        const street2 = addressFormData.get('street2')
        const city = addressFormData.get('city')
        const state = addressFormData.get('state')
        const zip = addressFormData.get('zip')
        const country = addressFormData.get('country')
        const address = {household_id,street1,street2,city,state,zip,country}
        
        // renderAddress(address)
        postNewAddress(address)
        event.target.reset()
    })
}

function postNewAddress(address){
    fetch(`${backendURL}/addresses`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(address)
    }).then(response => response.json())
        .then(results => {
            console.log(results)
            handleResponse(results,'address')})
}