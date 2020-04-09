const guestList = document.querySelector('#guest-list')
const filter = document.querySelector('#filter-guests')
const rows = guestList.getElementsByTagName("tr")

filter.addEventListener('keyup', event => {
    let searchTerm = filter.value
    rows.forEach( guest

    )
})

fetch('http://localhost:3000/guests')
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