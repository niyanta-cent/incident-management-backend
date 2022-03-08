/* 
File Name: style.css
Student Name: Hitesh Dharmadhikari
Student ID: 301150694
Date: 2/3/2021
*/

console.log("Login Script started");

//let apiHost = 'http://localhost:3000';
let apiHost = 'https://hitesh-dharmadhikari.herokuapp.com';

let loginButton = document.getElementById('login-button');
loginButton.addEventListener("click", (e)=>{

    console.log("login clicked" , e.target.id);

    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    console.log("username",username,"password",password);


    fetch(apiHost+'/login', {
          method: 'POST',
          headers:{
              'Content-Type':'application/json',
          },
          body: JSON.stringify({
            "username": username,
            "password":password,
          }),
    }).then(response => {
        response.json().then(data => {
            
            console.log("data444", data);
            localStorage.setItem('token',data.token);
            location.href = '/contact-list';
            //alert("Successful");

        });
    }).catch(error=>{
        location.href = '/contact-list';
        throw error;
        console.log("error123", error);
        alert("Something went wrong 123.");
    });

})