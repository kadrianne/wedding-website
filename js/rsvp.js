const backendURL = 'http://localhost:3000'
const authorized = document.querySelectorAll('.authorized')
const unauthorized = document.querySelector('.unauthorized')
const guestCards = document.querySelector('.guest-cards')

authenticate()

function authenticate(){
    fetch(`${backendURL}/authenticate-login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        }
    }).then(response => response.json())
        .then(loginResults => {
            if (loginResults.message == 'Error') {
                hideContent()
            } else {
                getHousehold(loginResults)
            }
        })
}

function hideContent(){
    unauthorized.style.display = "block"
    authorized.forEach(element => {
        element.style.display = "none"
    })
}

function getHousehold(login){
    fetch(`${backendURL}/households/${login.household_id}`)
        .then(response => response.json())
        .then(household => {
            displayFamilyName(household)
            displayGuests(household)
            cardEventListeners(household.id)
        })
}

function displayFamilyName(household){
    const h2 = document.querySelector('h2')
    h2.textContent = `for ${household.family} family`
}

function displayGuests(household){
    const sortedGuests = household.guests.sort((a,b) => a.id - b.id)

    sortedGuests.forEach(guest => {
        createGuestCard(guest)
    })
}

function createGuestCard(guest){
    const card = document.createElement('div')
    const name = document.createElement('h3')
    const edit = document.createElement('span')
    const cardBody = document.createElement('div')
    const cardFooter = document.createElement('div')
    
    card.className = 'card'
    card.setAttribute('guest-id', `${guest.id}`)
    name.className = 'card-header'
    name.innerHTML = `<span id='first-name-guest-${guest.id}'>${guest.first_name}</span> <span id='last-name-guest-${guest.id}'>${guest.last_name}</span>`
    edit.innerHTML = `<i class="far fa-edit" data-toggle='modal' data-target="#edit-guest-modal"></i><a data-toggle='modal' data-target="#edit-guest-modal"> Edit</a>`
    edit.className = 'edit-text'
    cardBody.className = 'card-body'
    cardFooter.className = 'card-footer'

    guestCards.append(card)
    card.append(name,edit,cardBody,cardFooter)
    displayGuestInfo(cardBody,guest)
    rsvpFooter(cardFooter,guest)
}

function displayGuestInfo(cardBody,guest){
    const info = document.createElement('div')
    const age = document.createElement('p')
    const email = document.createElement('p')
    const phone = document.createElement('p')
    const addressContainer = document.createElement('div')
    const addressLabel = document.createElement('b')
    const addressElement = document.createElement('p')
    
    age.innerHTML = `<b>Age:</b>  <span id='age-guest-${guest.id}'>${guest.age}</span>`
    email.innerHTML = `<b>Email:</b>  <span id='email-guest-${guest.id}'>${guest.email}</span>`
    phone.innerHTML = `<b>Phone:</b>  <span id='phone-guest-${guest.id}'>${guest.phone}</span>`
    addressLabel.textContent = 'Address:'
    addressLabel.className = 'label'
    addressContainer.className = 'address-container'

    addressContainer.append(addressLabel)
    displayAddress(addressContainer,addressElement,guest.address_id,guest.id)
    cardBody.append(age,email,phone,addressContainer)
}

function displayAddress(addressContainer,addressElement,addressID,guestID){
    fetch(`${backendURL}/addresses/${addressID}`)
        .then(response => response.json())
        .then(address => {
            if (address.street2 == null) {
                addressElement.innerHTML = `<address id='address-guest-${guestID}'>
                    <p>${address.street1}</p>
                    <p>${address.city}, ${address.state} ${address.zip}</p>
                    <p>${address.country}</p>
                </address>`
            } else {
                addressElement.innerHTML = `<b>Address:</b>
                <address id='address-guest-${guestID}'>
                    <p>${address.street1}, ${address.street2}</p>
                    <p>${address.city}, ${address.state} ${address.zip}</p>
                    <p>${address.country}</p>
                </address>`
            }

            addressContainer.append(addressElement)
        })
}

function rsvpFooter(cardFooter,guest){
    const rsvpText = document.createElement('p')
    const rsvpButtons = document.createElement('p')
    const yesButton = document.createElement('button')
    const noButton = document.createElement('button')
    const clearRSVP = document.createElement('a')
    
    rsvpText.textContent = `Will ${guest.first_name} be attending?`
    yesButton.innerText = 'Yes'
    yesButton.className = 'yes-button'
    yesButton.id = `yes-button-${guest.id}`
    noButton.innerText = 'No'
    noButton.className = 'no-button'
    noButton.id = `no-button-${guest.id}`
    clearRSVP.innerHTML = 'Clear RSVP'
    clearRSVP.className = 'clear-rsvp'
    clearRSVP.id = `clear-button-${guest.id}`
    
    if (guest.rsvp == true) {
        yesButton.classList.add('active')
    } else if (guest.rsvp == false) {
        noButton.classList.add('active')
    }
    
    cardFooter.append(rsvpText,yesButton,noButton,clearRSVP)
}

function cardEventListeners(householdID){
    guestCards.addEventListener('click', (event) => {
        const element = event.target
        const guestID = element.parentNode.parentNode.getAttribute('guest-id')
        if (element.classList.contains('yes-button')){
            yesButtonHandler(guestID)
        } else if (element.classList.contains('no-button')){
            noButtonHandler(guestID)
        } else if (element.parentNode.className == 'edit-text'){
            updateMessage('')
            editGuestInfo(householdID,guestID)
        } else if (element.className == 'clear-rsvp'){
            clearRSVPHandler(guestID)
        }
    })
}

function yesButtonHandler(guestID){
    const yesButton = document.querySelector(`#yes-button-${guestID}`)
    const noButton = document.querySelector(`#no-button-${guestID}`)
    
    yesButton.classList.add('active')
    noButton.classList.remove('active')
    fetchGuest(guestID,true)
}

function noButtonHandler(guestID){
    const yesButton = document.querySelector(`#yes-button-${guestID}`)
    const noButton = document.querySelector(`#no-button-${guestID}`)
    
    noButton.classList.add('active')
    yesButton.classList.remove('active')
    
    fetchGuest(guestID,false)
}

function clearRSVPHandler(guestID){
    const yesButton = document.querySelector(`#yes-button-${guestID}`)
    const noButton = document.querySelector(`#no-button-${guestID}`)
    
    yesButton.classList.remove('active')
    noButton.classList.remove('active')

    fetchGuest(guestID,null)
}

function fetchGuest(guestID,rsvp){
    fetch(`${backendURL}/guests/${guestID}`)
        .then(response => response.json())
        .then(guest => patchRSVP(guest,rsvp))
}

function patchGuest(guestID,guest){
    fetch(`${backendURL}/guests/${guestID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            guest: {
                first_name: guest.first_name,
                last_name: guest.last_name,
                age: guest.age,
                email: guest.email,
                phone: guest.phone,
                household_id: guest.household_id
            }
        })
    }).then(response => response.json())
        .then(response => updateMessage(response.message))
    // location.reload()
}

function patchRSVP(guest,rsvp){
    fetch(`${backendURL}/guests/${guest.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            guest: {
                first_name: guest.first_name,
                last_name: guest.last_name,
                rsvp: rsvp,
                household_id: guest.household_id
            }
        })
    })
}

function renderGuestInfo(guestID,guest){
    const first_name = document.querySelector(`#first-name-guest-${guestID}`)
    const last_name = document.querySelector(`#last-name-guest-${guestID}`)
    const age = document.querySelector(`#age-guest-${guestID}`)
    const phone = document.querySelector(`#phone-guest-${guestID}`)
    const email = document.querySelector(`#email-guest-${guestID}`)
    
    first_name.textContent = guest.first_name
    last_name.textContent = guest.last_name
    age.textContent = guest.age
    phone.textContent = guest.phone
    email.textContent = guest.email
}

function editGuestInfo(householdID,guestID){
    const editGuestForm = document.querySelector('#edit-guest-form')
    const first_name = document.querySelector('#editFirstNameField')
    const last_name = document.querySelector('#editLastNameField')
    const age = document.querySelector('#editAgeField option')
    const email = document.querySelector('#editEmailField')
    const phone = document.querySelector('#editPhoneField')

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

            first_name.value = guest.first_name
            last_name.value = guest.last_name
            email.value = guest.email
            phone.value = guest.phone
            preselectAgeFromDropdown(guestAgeOptions[guest.age])
        })

    editGuestEventListener(householdID,guestID)
}

function editGuestEventListener(householdID,guestID){
    const editGuestForm = document.querySelector('#edit-guest-form')

    editGuestForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const guestFormData = new FormData(editGuestForm)
        const first_name = guestFormData.get('first_name')
        const last_name = guestFormData.get('last_name')
        const email = guestFormData.get('email')
        const age = guestFormData.get('age')
        const phone = guestFormData.get('phone')
        const updatedGuest = {
            first_name: first_name,
            last_name: last_name,
            age: age,
            email: email,
            phone: phone,
            household_id: householdID
        }

        renderGuestInfo(guestID,updatedGuest)
        patchGuest(guestID,updatedGuest)
    }, {once: true})
}

function preselectAgeFromDropdown(optionID){
    const ageOption = document.querySelector(`#${optionID}`)
    ageOption.setAttribute("selected","")
}

function updateMessage(message){
    const successMessage = document.querySelector('#edit-guest-form .success-message')
    successMessage.textContent = message
}