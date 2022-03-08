/* 
File Name: app.js
Student Name: Hitesh Dharmadhikari
Student ID: 301150694
Date: 12/2/2021
*/

console.log("Started App");

//Smooth Scroll animation for Navbar button click
const navBarScroll = new SmoothScroll('.navbar a[href*="#"]',{
    speed: 800,
});

//Smooth Scroll animation for Get In Touch button click
const contactScroll = new SmoothScroll('#home a[href*="#"]',{
    speed: 800,
});

//Smooth Scroll animation for Checkout My Work button click
const projectScroll = new SmoothScroll('#services a[href*="#"]',{
    speed: 800,
});

//Alert Fading animation
$(".alert-success").fadeTo(2000, 500).slideUp(500, function(){
    $("alert-success").slideUp(500);
});
