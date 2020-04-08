const adminLoginURL = 'http://localhost:3000/admin-login'

const loginForm = document.querySelector('form.login')
const errorMessages = document.querySelector('.error-messages')
const usernameField = document.querySelector('#adminUsername')
const passwordField = document.querySelector('#adminPassword')
const inputs = document.querySelectorAll('input')


loginForm.addEventListener('submit', event => {
    event.preventDefault()
    
    const loginFormData = new FormData(loginForm)
    const username = loginFormData.get('username')
    const password = loginFormData.get('password')
    const user = {
        username: username,
        password: password
    }
    
    formValidation(user)
})

function formValidation(user){
    if (!usernameField.value || !passwordField.value) {
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
    fetch(adminLoginURL, {
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
    if (response.admin) {
        window.location.replace("/dashboard.html")
    } else {
        errorMessages.textContent = response.message
        clearInputs()
    }
}