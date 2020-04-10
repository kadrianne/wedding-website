const guestList = document.querySelector('#guest-list')
const householdList = document.querySelector('#household-list')
const rows = guestList.getElementsByTagName("tr")
const backendURL = 'http://localhost:3000'
const guestRSVP = {
    true: '<i class="fas fa-heart"></i>',
    false: '<i class="far fa-frown"></i>',
    null: '<i class="fas fa-question"></i>',
    undefined: '<i class="fas fa-question"></i>'
}

fetchGuests()
viewMoreInfo(guestList)

function viewMoreInfo(guestList){
    guestList.addEventListener('click', (event) => {
        const buttonClass = event.target.className
        const rowDataSet = event.target.parentNode.parentNode.dataset
        rowDataSet.target = '#view-guest-modal'
        if (buttonClass.match(/fa-eye/)) {
            viewGuestInfo(rowDataSet.guestid)
        } else if (buttonClass.match(/fa-edit/)) {
            editGuestInfo(rowDataSet.guestid)
        } else if (buttonClass.match(/fa-trash-alt/)) {
            deleteGuestInfo(rowDataSet.guestid)
        }
    })
}

function viewGuestInfo(guestID){
    fetch(`${backendURL}/guests/${guestID}`)
    .then(response => response.json())
    .then(guest => displayGuestInfo(guest))
}

function displayGuestInfo(guest) {
    const viewGuestModal = document.querySelector('#view-guest-modal .modal-body')
    const name = document.createElement('h4')
    const household = document.createElement('p')
    const age = document.createElement('p')
    const email = document.createElement('p')
    const phone = document.createElement('p')
    const rsvp = document.createElement('p')

    console.log(guest)
    viewGuestModal.innerHTML = ''
    name.textContent = `${guest.first_name} ${guest.last_name}`
    household.textContent = `Household: ${guest.household.family}`
    age.textContent = `Age: ${guest.age}`
    email.innerHTML = `E-mail: <a href="mailto:${guest.email}">${guest.email}</a>`
    phone.textContent = `Phone #: ${guest.phone}`
    rsvp.innerHTML = `RSVP: ${guestRSVP[guest.rsvp]}`

    
    viewGuestModal.append(name,household,age,email,phone,rsvp)
}

function editGuestInfo(guestID){
    console.log(guestID)
}

function deleteGuestInfo(guestID){
    console.log(guestID)
}

function filterGuests(){
    const guestFilter = document.querySelector('#filter-guests')
    // guestFilter.addEventListener('keyup', event => {
    //     let searchTerm = guestFilter.value
    //     rows.forEach( guest
    //     )
    // })
}

function fetchGuests(){
    fetch(`${backendURL}/guests`)
        .then(response => response.json())
        .then(guests => {
            displayGuests(guests)
            countRSVPS(guests)
        })
}

function displayGuests(guests){
    guests.forEach(guest => {renderGuest(guest)})
}

function renderGuest(guest){
    const row = document.createElement('tr')
    const firstName = document.createElement('td')
    const lastName = document.createElement('td')
    const age = document.createElement('td')
    const email = document.createElement('td')
    const phone = document.createElement('td')
    const rsvp = document.createElement('td')
    const moreInfoButton = document.createElement('td')
    const editButton = document.createElement('td')
    const deleteButton = document.createElement('td')
    
    row.dataset.guestid = guest.id
    firstName.textContent = guest.first_name
    lastName.textContent = guest.last_name
    age.textContent = guest.age
    email.innerHTML = guest.email
    phone.textContent = guest.phone
    rsvp.innerHTML = guestRSVP[guest.rsvp]
    moreInfoButton.innerHTML = `<i class="fas fa-eye" data-toggle='modal' data-target="#view-guest-modal"></i>`
    editButton.innerHTML = `<i class="fas fa-edit" data-toggle='modal' data-target="#edit-guest-modal"></i>`
    deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`
    
    row.append(firstName,lastName,age,email,phone,rsvp,moreInfoButton,editButton,deleteButton)
    guestList.append(row)
}

function countRSVPS(guests){
    const rsvpCount = document.querySelector('#rsvp-count')
    const attending = document.createElement('p')
    const notAttending = document.createElement('p')
    const noRSVP = document.createElement('p')

    const attendingCount = guests.filter(guest => guest.rsvp == true).length
    const notAttendingCount = guests.filter(guest => guest.rsvp == false).length
    const noRSVPCount = guests.filter(guest => guest.rsvp == null || undefined).length

    attending.innerHTML = `${guestRSVP.true} Attending: ${attendingCount}</b><br>`
    notAttending.innerHTML = `${guestRSVP.false} Not Attending: ${notAttendingCount}<br>`
    noRSVP.innerHTML = `${guestRSVP.null} Not RSVP'd: ${noRSVPCount}<br>`

    rsvpCount.append(attending,notAttending,noRSVP)
}

const addGuestForm = document.querySelector('#add-guest-form')

addGuestForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const guestFormData = new FormData(addGuestForm)
    const first_name = guestFormData.get('first_name')
    const last_name = guestFormData.get('last_name')
    const email = guestFormData.get('email')
    const age = guestFormData.get('age')
    const phone = guestFormData.get('phone')
    const household_id = guestFormData.get('household_id')
    const rsvp = guestFormData.get('rsvp')
    const guest = {
        first_name: first_name,
        last_name: last_name,
        age: age,
        email: email,
        phone: phone,
        rsvp: rsvp,
        household_id: household_id,
    }

    renderGuest(guest)
    postNewGuest(guest)
})

function postNewGuest(guest) {
    fetch(`${backendURL}/guests`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(guest)
    }).then(response => response.json())
    .then(handleResponse)
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
    .then(households => {
        displayHouseholds(households)
        addHouseholdsToDropdown(households)
    })

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

function addHouseholdsToDropdown(households){
    const householdDropdown = document.querySelector('#householdField')

    households.forEach(household => {
        const householdOption = document.createElement('option')
        
        householdOption.textContent = `${household.family} - ${household.region}`
        householdOption.value = household.id

        householdDropdown.appendChild(householdOption)
    })
}

function handleResponse(response){
    const successMessage = document.querySelector('form > .success-message')
    successMessage.textContent = response.message
    clearForm()
}

function clearForm() {
    const inputs = document.querySelectorAll('input')
    const dropdowns = document.querySelectorAll('select')

    inputs.forEach(input => {
        input.value = ''
    })
    dropdowns.forEach(dropdown => {
        dropdown.value = ''
    })
}