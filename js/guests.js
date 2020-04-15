const guestList = document.querySelector('#guest-list')
const rows = guestList.getElementsByTagName("tr")
const backendURL = 'http://localhost:3000'
const guestRSVP = {
    true: '<i class="fas fa-heart"></i>',
    false: '<i class="far fa-frown"></i>',
    null: '<i class="fas fa-question"></i>',
    undefined: '<i class="fas fa-question"></i>'
}

fetchGuests()
viewMoreInfoEventListener(guestList)
addGuestEventListener()
fetchHouseholds()
clearMessageOnAddGuest()

function fetchGuests(){
    fetch(`${backendURL}/guests`)
        .then(response => response.json())
        .then(guests => {
            displayGuests(guests)
            countRSVPS(guests)
        })
}

function displayGuests(guests){
    const sortedGuests = guests.sort((a,b) => a.id - b.id)
    sortedGuests.forEach(guest => {renderGuest(guest)})
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
    const rsvpCount = document.querySelector('#rsvp-count .stats-list')
    const attending = document.createElement('li')
    const notAttending = document.createElement('li')
    const noRSVP = document.createElement('li')

    const attendingCount = guests.filter(guest => guest.rsvp == true).length
    const notAttendingCount = guests.filter(guest => guest.rsvp == false).length
    const noRSVPCount = guests.filter(guest => guest.rsvp == null || undefined).length

    attending.innerHTML = `${guestRSVP.true} <span id='attending-count'>${attendingCount}</span><span class="stats-list-label">Attending</span>`
    notAttending.innerHTML = `${guestRSVP.false} <span id='not-attending-count'>${notAttendingCount}</span><span class="stats-list-label">Not Attending</span>`
    noRSVP.innerHTML = `${guestRSVP.null} <span id='no-rsvp-count'>${noRSVPCount}</span><span class="stats-list-label">Not RSVP'd</span>`

    rsvpCount.append(attending,notAttending,noRSVP)
}

function viewMoreInfoEventListener(guestList){
    guestList.addEventListener('click', (event) => {
        const buttonClass = event.target.className
        const rowDataSet = event.target.parentNode.parentNode.dataset
        rowDataSet.target = '#view-guest-modal'
        if (buttonClass.match(/fa-eye/)) {
            getGuestInfo(rowDataSet.guestid)
        } else if (buttonClass.match(/fa-edit/)) {
            editGuestInfo(rowDataSet.guestid)
        } else if (buttonClass.match(/fa-trash-alt/)) {
            deleteGuestInfo(event.target,rowDataSet.guestid)
        }
    })
}

function getGuestInfo(guestID){
    fetch(`${backendURL}/guests/${guestID}`)
        .then(response => response.json())
        .then(guest => displayGuestInfo(guest))
}

function displayGuestInfo(guest) {
    const viewGuestModal = document.querySelector('#view-guest-modal .modal-body')
    const name = document.querySelector('#view-guest-name')
    const household = document.createElement('p')
    const age = document.createElement('p')
    const email = document.createElement('p')
    const phone = document.createElement('p')
    const rsvp = document.createElement('p')

    viewGuestModal.innerHTML = ''
    name.textContent = `${guest.first_name} ${guest.last_name}`
    household.innerHTML = `<b>Household:</b>  ${guest.household.family}`
    age.innerHTML = `<b>Age:</b>  ${guest.age}`
    email.innerHTML = `<b>E-mail:</b>  <a href="mailto:${guest.email}">${guest.email}</a>`
    phone.innerHTML = `<b>Phone #:</b>  ${guest.phone}`
    rsvp.innerHTML = `<b>RSVP:</b>  ${guestRSVP[guest.rsvp]}`

    viewGuestModal.append(household,age,email,phone,rsvp)
}

function editGuestInfo(guestID){
    const editGuestForm = document.querySelector('#edit-guest-form')
    const first_name = document.querySelector('#editFirstNameField')
    const last_name = document.querySelector('#editLastNameField')
    const household = document.querySelector('#editHouseholdField')
    const age = document.querySelector('#editAgeField option')
    const email = document.querySelector('#editEmailField')
    const phone = document.querySelector('#editPhoneField')
    const rsvp = document.querySelector('#editRsvpField')

    fetch(`${backendURL}/guests/${guestID}`)
        .then(response => response.json())
        .then(guest => {
            const guestAgeOptions = {
                '': 'nullAgeOption',
                null: 'nullAgeOption',
                'Adult 12+': 'adultOption',
                'Child 3-12': 'childOption',
                'Baby 0-3': 'babyOption'
            }
            
            const guestRSVPOptions = {
                null: 'null-rsvp-option',
                true: 'attending-option',
                false: 'not-attending-option'
            }
    
            first_name.value = guest.first_name
            last_name.value = guest.last_name
            email.value = guest.email
            phone.value = guest.phone
            preselectAgeFromDropdown(guestAgeOptions[guest.age])
            preselectHouseholdFromDropdown(guest.household_id)
            preselectRSVPFromDropdown(guestRSVPOptions[guest.rsvp])
        })

        editGuestEventListener(guestID)
    }

function preselectAgeFromDropdown(optionID){
    const ageOption = document.querySelector(`#${optionID}`)
    ageOption.setAttribute("selected","")
}
    
function preselectHouseholdFromDropdown(householdID){
    const householdOption = document.querySelector(`#edit-guest-form .household-option-${householdID}`)
    householdOption.setAttribute("selected","")
}

function preselectRSVPFromDropdown(optionID){
    const rsvpOption = document.querySelector(`#${optionID}`)
    rsvpOption.setAttribute("selected","")
}

function deleteGuestInfo(target,guestID){
    target.parentNode.parentNode.remove()
    deleteGuest(guestID)
}

function deleteGuest(guestID){
    fetch(`${backendURL}/guests/${guestID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
}

function filterGuests(){
    const guestFilter = document.querySelector('#filter-guests')
    // guestFilter.addEventListener('keyup', event => {
    //     let searchTerm = guestFilter.value
    //     rows.forEach( guest
    //     )
    // })
}

function addGuestEventListener(){
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
        const guest = {first_name,last_name,age,email,phone,rsvp,household_id}

        addToRSVPCount(guest.rsvp)
        postNewGuest(guest)
        event.target.reset()
    })
}

function addToRSVPCount(rsvp){
    const rsvpCounts = {
        true: 'attending-count',
        false: 'not-attending-count',
        '': 'no-rsvp-count'
    }
    
    const countElement = document.querySelector(`#${rsvpCounts[rsvp]}`)
    let count = parseInt(countElement.textContent)
    count += 1
    countElement.textContent = count
}

function postNewGuest(guest) {
    fetch(`${backendURL}/guests`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({guest: guest})
    }).then(response => response.json())
        .then(result => {
            renderGuest(result.guest)
            handleGuestResponse(result)
        })
}

function fetchHouseholds(){
    fetch(`${backendURL}/households`)
        .then(response => response.json())
        .then(addHouseholdDropdowns)
}

function addHouseholdDropdowns(households){
    const householdDropdowns = document.querySelectorAll('.household-dropdown')

    householdDropdowns.forEach(dropdown => {
        households.forEach(household => addHouseholdToDropdown(household,dropdown))
    })
}

function addHouseholdToDropdown(household,dropdown){
    const householdOption = document.createElement('option')
            
    householdOption.textContent = `${household.family} - ${household.region}`
    householdOption.value = household.id
    householdOption.className = `household-option-${household.id}`

    dropdown.appendChild(householdOption)
}

function handleGuestResponse(response){
    const successMessage = document.querySelector('#add-guest-form .success-message')
    successMessage.textContent = response.message
}

function clearMessageOnAddGuest(){
    const addGuestButton = document.querySelector('#add-guest')
    
    addGuestButton.addEventListener('click', (event) => {
        const successMessages = document.querySelectorAll('.success-message')
        successMessages.forEach(message => message.textContent = '')
    })
}

function editGuestEventListener(guestID){
    const editGuestForm = document.querySelector('#edit-guest-form')
    editGuestForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const guestFormData = new FormData(editGuestForm)
        const first_name = guestFormData.get('first_name')
        const last_name = guestFormData.get('last_name')
        const email = guestFormData.get('email')
        const age = guestFormData.get('age')
        const phone = guestFormData.get('phone')
        const household_id = guestFormData.get('household_id')
        const rsvp = guestFormData.get('rsvp')
        const guest = {first_name,last_name,age,email,phone,rsvp,household_id}

        patchGuest(guestID,guest)
    })
}

function patchGuest(guestID,guest){
    fetch(`${backendURL}/guests/${guestID}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({guest: guest})
    })
    location.reload()
}