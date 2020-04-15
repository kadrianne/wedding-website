const backendURL = 'http://localhost:3000'
const authorized = document.querySelectorAll('.authorized')
const unauthorized = document.querySelector('.unauthorized')
const guestCards = document.querySelector('.guest-cards')

authenticate()
cardEventListeners()

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
    const card = document.createElement('div')
    const name = document.createElement('h3')
    const edit = document.createElement('span')
    const cardBody = document.createElement('div')
    const cardFooter = document.createElement('div')
    
    card.className = 'card'
    card.setAttribute('guest-id', `${guest.id}`)
    name.className = 'card-header'
    name.textContent = `${guest.first_name} ${guest.last_name}`
    edit.innerHTML = `<i class="far fa-edit"></i><a> Edit</a>`
    edit.className = 'edit-text'
    cardBody.className = 'card-body'
    cardFooter.className = 'card-footer'

    guestCards.append(card)
    card.append(name,edit,cardBody,cardFooter)
    guestInfo(guest)
    rsvpFooter(guest)
    
    function guestInfo(guest){
        const info = document.createElement('p')
        const age = document.createElement('p')
        const email = document.createElement('p')
        const phone = document.createElement('p')
        const address = document.createElement('p')
        
        age.innerHTML = `<b>Age:</b>  ${guest.age}`
        email.innerHTML = `<b>Email:</b>  ${guest.email}`
        phone.innerHTML = `<b>Phone:</b>  ${guest.phone}`
        address.innerHTML = `<b>Address:</b>  ${guest.address}`
        
        cardBody.append(age,email,phone,address)
    }
    
    function rsvpFooter(guest){
        const rsvpText = document.createElement('p')
        const rsvpButtons = document.createElement('p')
        const yesButton = document.createElement('button')
        const noButton = document.createElement('button')
        const clearRSVP = document.createElement('a')
        
        rsvpText.textContent = `Will ${guest.first_name} be attending?`
        yesButton.innerText = 'Yes'
        yesButton.className = 'yes-button'
        noButton.innerText = 'No'
        noButton.className = 'no-button'
        clearRSVP.innerHTML = 'Clear RSVP'
        clearRSVP.className = 'clear-rsvp'
        
        if (guest.rsvp == true) {
            yesButton.classList.add('active')
        } else if (guest.rsvp == false) {
            noButton.classList.add('active')
        }
        
        cardFooter.append(rsvpText,yesButton,noButton,clearRSVP)
    }
}

function cardEventListeners(){
    guestCards.addEventListener('click', (event) => {
        if (event.target.classList.contains('yes-button')){
            console.log(event.target.parentNode)
            yesButtonHandler()
        } else if (event.target.classList.contains('no-button')){
            noButtonHandler()
        } else if (event.target.parentNode.className == 'edit-text'){
            editGuestHandler()
        } else if (event.target.className == 'clear-rsvp'){
            clearRSVPHandler()
        }
    })
}


function yesButtonHandler(){
    // yesButton.classList.add('active')
    // noButton.classList.remove('active')
    // patchGuest(guest,true)
}
function noButtonHandler(){
    // noButton.classList.add('active')
    // yesButton.classList.remove('active')
    // patchGuest(guest,false)
}
function clearRSVPHandler(){
    // yesButton.classList.remove('active')
    // noButton.classList.remove('active')
    // patchGuest(guest,null)
}
function editGuestHandler(){
    console.log('edit')
}

function patchGuest(guest,rsvp){
    fetch(`${backendURL}/guests/${guest.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            first_name: guest.first_name,
            last_name: guest.last_name,
            rsvp: rsvp,
            household_id: guest.household_id
        })
    })
}