const guestList = document.querySelector('#guest-list')
const householdList = document.querySelector('#household-list')
const guestFilter = document.querySelector('#filter-guests')
const rows = guestList.getElementsByTagName("tr")
const backendURL = 'http://localhost:3000/'

guestFilter.addEventListener('keyup', event => {
    let searchTerm = guestFilter.value
    rows.forEach( guest
// NEED TO ADD STUFF
    )
})

fetch(`${backendURL}/guests`)
    .then(response => response.json())
    .then(guests => displayGuests(guests))

function displayGuests(guests){
    const guestRSVP = {
        true: '<i class="fas fa-heart"></i>',
        false: '<i class="far fa-frown"></i>',
        null: '<i class="fas fa-question"></i>'
    }
    
    guests.forEach(guest => {
        const row = document.createElement('tr')
        const firstName = document.createElement('td')
        const lastName = document.createElement('td')
        const age = document.createElement('td')
        const email = document.createElement('td')
        const phone = document.createElement('td')
        const rsvp = document.createElement('td')
        const household = document.createElement('td')
        
        firstName.textContent = guest.first_name
        lastName.textContent = guest.last_name
        age.textContent = guest.age
        email.textContent = guest.email
        phone.textContent = guest.phone
        rsvp.innerHTML = guestRSVP[guest.rsvp]
        household.textContent = guest.household.family

        row.append(firstName,lastName,age,email,phone,rsvp,household)
        guestList.append(row)
    })

    countRSVPS(guests)
}

function countRSVPS(guests){
    const rsvpCount = document.querySelector('#rsvp-count')
    const attending = document.createElement('p')
    const notAttending = document.createElement('p')
    const noRSVP = document.createElement('p')

    const attendingCount = guests.filter(guest => guest.rsvp == true).length
    const notAttendingCount = guests.filter(guest => guest.rsvp == false).length
    const noRSVPCount = guests.filter(guest => guest.rsvp == null).length

    attending.innerHTML = `<i class="fas fa-heart"></i> Attending: <b>${attendingCount}</b><br>`
    notAttending.innerHTML = `<i class="far fa-frown"></i> Not Attending: ${notAttendingCount}<br>`
    noRSVP.innerHTML = `<i class="fas fa-question"></i> Not RSVP'd: ${noRSVPCount}<br>`

    rsvpCount.append(attending,notAttending,noRSVP)
}

const addHouseholdForm = document.querySelector('#add-household-form')
addHouseholdForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const householdFormData = new FormData(addHouseholdForm)
    const family = householdFormData.get('family')
    const region = householdFormData.get('region')
    const household = {
        family: family,
        region: region
    }
    renderHousehold(household)
    postNewHousehold(household)
})

function postNewHousehold(household) {
    fetch(`${backendURL}/households`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(household)
    }).then(response => response.json())
    .then(handleResponse)
}

fetch(`${backendURL}/households`)
    .then(response => response.json())
    .then(households => displayHouseholds(households))

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

function displayHouseholds(households){
    households.forEach(renderHousehold)
}

function handleResponse(response){
    const successMessage = document.querySelector('#add-household-form > .success-message')
    successMessage.textContent = response.message
    clearForm()
}

function clearForm() {
    const inputs = document.querySelectorAll('input')
    inputs.forEach(input => {
        input.value = ''
    })
}