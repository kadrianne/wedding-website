const householdList = document.querySelector('#household-list')
const backendURL = 'http://localhost:3000'

fetchHouseholds()
addHouseholdEventListener()

function fetchHouseholds(){
    fetch(`${backendURL}/households`)
        .then(response => response.json())
        .then(displayHouseholds)
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
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(household)
    }).then(response => response.json())
    .then(results => {
        handleHouseholdResponse(results)
    })
}

function handleHouseholdResponse(response){
    const successMessage = document.querySelector('#add-household-form .success-message')
    successMessage.textContent = response.message
}