const menuLinks = [
    {
        title: "guests",
        url: "./dashboard/guests.html"
    },{
        title: "households",
        url:"./dashboard/households.html"
    }
]

buildHeader()

function buildHeader() {
    const header = document.querySelector('header')
    addHeading(header)
    // addTagline(header)
    createMenu(header)
    // document.addEventListener('scroll', makeHeaderSticky(header))
}

function addHeading(header){
    const heading = document.createElement('p')
    heading.className = 'dash-heading'
    heading.innerText = "Dashboard"
    heading.style.fontSize = 30
    header.append(heading)
}

// function addTagline(header){
//     const tagline = document.createElement('p')
//     tagline.className = "tagline"
//     tagline.innerText = "are getting married!"
//     header.append(tagline)
// }

function createMenu(header){
    const menu = document.createElement('nav')
    const menuContainer = document.createElement('div')
    const menuList = document.createElement('ul')

    menu.className = "menu navbar navbar-expand-lg navbar-collapse justify-content-center navbar-light"
    menu.innerHTML = `<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#menu-links">
    <span class="navbar-toggler-icon"></span>
    </button>`

    menuContainer.className = "collapse navbar-collapse"
    menuContainer.id = 'menu-links'
    
    menuList.className = "navbar-nav mr-auto mt-2 mt-lg-0"
    
    menuLinks.forEach(link =>{
        const menuItem = document.createElement('li')
        menuItem.className = "nav-link"
        menuItem.innerHTML = `<a href="${link.url}">${link.title}</a>`
        menuList.append(menuItem)
    })

    menuContainer.appendChild(menuList)
    menu.appendChild(menuContainer)
    header.append(menu)
}

function makeHeaderSticky(header){
    return () => {
        const sticky = header.offsetTop
        
        if (window.pageYOffset > sticky) {
            header.classList.add("sticky")
        } else {
            header.classList.remove("sticky")
        }
    }
}