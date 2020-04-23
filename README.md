# Kristine & Samuel's Wedding

This is a personal wedding website to provide our wedding guests with wedding details and to collect and manage guest contact information and RSVPs. The goal was to build a responsive website with our own look & feel that would have a seamless UX/UI.

Back-end respository: https://github.com/kadrianne/wedding-website


## Built With
Frontend: HTML, CSS, JavaScript, SASS, Bootstrap, Foundation Building Blocks<br>
Backend: Ruby v2.6.1, Rails API v6.0.2.2, PostgreSQL v12.2

## Features

### Login validation
On both the guest login and admin login page, validation is implemented so that the user is shown error messages when a login/password is blank or not valid. 

![login](https://res.cloudinary.com/kristine-and-samuel/image/upload/v1587671999/wedding-website/login.gif)

### Authorization to view RSVP Page

Authorization is currently implemented on the RSVP page so that users cannot go directly to the URL without logging in first.

![auth](https://res.cloudinary.com/kristine-and-samuel/image/upload/v1587676857/wedding-website/rsvp-auth.gif)

### Guest Information and RSVP

Once logged in, a user can view guest and rsvp information by clicking "guest rsvp" in the menu. Here the guests associated with the household tied to the user's login will be displayed on this page as cards. The user is able to edit each guest's information as well as RSVP for each guest on the guest card. The updates are rendered optimistically and are also persistent on refresh of the page.

![guest-rsvp](https://res.cloudinary.com/kristine-and-samuel/image/upload/v1587672002/wedding-website/guest-rsvp.gif)

### Sticky Header and Image Carousel

The website header is fixed on scroll so that a user can always see the heading and menu on the page. The image carousel allows a user to scroll through multiple images with animations.

![header-carousel](media/header-slider.gif)](https://res.cloudinary.com/kristine-and-samuel/image/upload/v1587672000/wedding-website/header.gif)

### Responsiveness

The site is responsive based on screen width so that it is mobile-friendly for users visiting the website on a phone or tablet.

![responsive](https://res.cloudinary.com/kristine-and-samuel/image/upload/v1587672001/wedding-website/responsive.gif)

### Admin Dashboard

The admin dashboard allows for guest and household management. Guest information can be viewed, edited, and deleted. An RSVP count is also displayed as a quick snapshot of guest responses. On the households page, households can be added. Addresses can also be added to households.

![dashboard](https://res.cloudinary.com/kristine-and-samuel/image/upload/v1587672000/wedding-website/dashboard.gif)

## Challenges

Working with Bootstrap as a CDN was challenging in that it was difficult to understand how existing styles and classes were functioning and what attributes needed to be overriden in order to customize them.

Testing was also challenging in that repetitive manual tests were very time consuming. Also, bugs were not caught immediately and caused difficulties in debugging.

## Future Implementation
- Deployment to production server
- Authorization on all pages based on login/admin access
- Contact form with email integration
- Validation and error handling for add/edit forms
- Filter and pagination on guests table
- Guest count by Age