const backendURL = 'http://localhost:3000'
const authorized = document.querySelectorAll('.authorized')
const unauthorized = document.querySelector('.unauthorized')

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
        })
}

function displayFamilyName(household){
    const h1 = document.querySelector('h1')
    h1.textContent = `RSVP for ${household.family} family`
}

function displayGuests(household){
    household.guests.forEach(guest => {
        createGuestCard(guest)
    })
}

function createGuestCard(guest){
    const guestCards = document.querySelector('.guest-cards')
    const card = document.createElement('div')
    const cardBody = document.createElement('div')
    const cardFooter = document.createElement('div')
    const name = document.createElement('h4')
    const info = document.createElement('p')
    const rsvpText = document.createElement('p')
    const rsvpButtons = document.createElement('p')
    const age = document.createElement('p')
    const email = document.createElement('p')
    const phone = document.createElement('p')
    const address = document.createElement('p')
    const buttons = document.createElement('div')
    const yesButton = document.createElement('input')
    const yesButtonLabel = document.createElement('label')
    const noButton = document.createElement('input')
    const noButtonLabel = document.createElement('label')

    card.className = 'card'
    name.className = 'card-header'
    name.textContent = `${guest.first_name} ${guest.last_name}`
    cardBody.className = 'card-body'
    cardFooter.className = 'card-footer'
    rsvpText.textContent = `Will ${guest.first_name} be attending?`
    age.textContent = `Age: ${guest.age}`
    email.textContent = `Email: ${guest.email}`
    phone.textContent = `Phone: ${guest.phone}`
    address.textContent = `Address: ${guest.address}`
    yesButton.type = 'radio'
    yesButton.id = 'yesButton'
    noButton.type = 'radio'
    noButton.id = 'noButton'
    yesButtonLabel.htmlFor = 'yesButton'
    yesButtonLabel.textContent = 'Yes'
    noButtonLabel.htmlFor = 'noButton'
    noButtonLabel.textContent = 'No'

    guestCards.append(card)
    card.append(name,cardBody,cardFooter)
    cardBody.append(age,email,phone,address)
    cardFooter.append(rsvpText,buttons)
    buttons.append(yesButton,yesButtonLabel,noButton,noButtonLabel)
}