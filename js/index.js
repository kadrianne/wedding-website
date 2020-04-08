const guestLoginURL = 'http://localhost:3000/guest-login'

const loginForm = document.querySelector('form.login')
const errorMessages = document.querySelector('.error-messages')
const loginNameField = document.querySelector('#loginUsername')
const passwordField = document.querySelector('#loginPassword')
const inputs = document.querySelectorAll('input')


loginForm.addEventListener('submit', event => {
    event.preventDefault()
    
    const loginFormData = new FormData(loginForm)
    const loginName = loginFormData.get('login_name')
    const password = loginFormData.get('password')
    const user = {
        login_name: loginName,
        password: password
    }
    
    formValidation(user)
})

function formValidation(user){
    if (!loginNameField.value || !passwordField.value) {
        errorMessages.textContent = 'Username/Password fields cannot be blank.'
        clearInputs()
    } else {
        authenticateUser(user)
    }
}

function clearInputs(){
    inputs.forEach(input => addEventListener('click', () => {errorMessages.textContent = ''}))
}

function authenticateUser(user){
    fetch(guestLoginURL, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => response.json())
    .then(checkAuthorization)
}

function checkAuthorization(response){
    if (response.login) {
        window.location.replace("/home.html")
    } else {
        errorMessages.textContent = response.message
        clearInputs()
    }
}