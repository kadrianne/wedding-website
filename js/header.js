const header = document.querySelector('header')
const heading = document.createElement('p')
const tagline = document.createElement('p')
const menu = document.createElement('nav')
const menuLinks = [
    {
        title: "save the date",
        url: "/index.html"
    },{
        title: "club paradise",
        url:"club-paradise.html"
    },{
        title: "contact",
        url:"contact.html"
    }
]

heading.className = "heading"
heading.innerText = "Kristine & Samuel"

tagline.className = "tagline"
tagline.innerText = "are getting married!"

menu.className = "menu"

menuLinks.forEach(link =>{
    const menuItem = document.createElement('li')
    menuItem.innerHTML = `<a href="${link.url}">${link.title}</a>`
    menu.append(menuItem)
})

header.append(heading)
header.append(tagline)
header.append(menu)

document.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const sticky = header.offsetTop;

    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
})
