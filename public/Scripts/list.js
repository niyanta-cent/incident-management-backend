/* 
File Name: style.css
Student Name: Hitesh Dharmadhikari
Student ID: 301150694
Date: 2/3/2021
*/
console.log("Script started");

//let apiHost = 'http://localhost:3000';
let apiHost = 'https://hitesh-dharmadhikari.herokuapp.com';

console.log("apiHost", apiHost);

let homeNavBar = document.getElementById("home-nav-bar");
let aboutNavBar = document.getElementById("about-nav-bar");
let servicesNavBar = document.getElementById("services-nav-bar");
let projectsNavBar = document.getElementById("projects-nav-bar");
let contactNavBar = document.getElementById("contact-nav-bar");

homeNavBar.href = "/";
aboutNavBar.href= "/#about";
servicesNavBar.href= "/#services";
projectsNavBar.href= "/#projects";
contactNavBar.href= "/#contact";

let saveButton = document.getElementById('save-button');
saveButton.addEventListener("click", (e)=>{
    console.log("save clicked" , e.target.id);

    let name = document.getElementById('contact-name').value;
    let number = document.getElementById('contact-number').value;
    let email = document.getElementById('contact-email').value;

    console.log("name111: ", name, number, email);

    fetch(apiHost+'/contact-list/add', {
          method: 'POST',
          headers:{
              'Content-Type':'application/json',
              'Accept':'application/json'
          },
          body: JSON.stringify({
            "contact_name": name,
            "contact_number":number,
            "email": email,
          }),
    }).then(response => {
        response.json().then(data => {
            location.href = '/contact-list';
            //console.log("data444", data);
            
            //alert("Successful");

        });
    }).catch(error=>{
        alert("Something went wrong.");
    });

})


function onEditClick(id){
    console.log("onEditClick123",id);   

    fetch(apiHost+'/contact-list/edit/'+id, {
          method: 'GET',
          headers:{
              'Content-Type':'application/json',
              'Accept':'application/json'
          },
    }).then(response => {
        response.json().then(data => {
            //location.href = '/contact-list';
            console.log("data444", data);
            
            document.getElementById('contact-name-edit').value = data.contact_name;
            document.getElementById('contact-number-edit').value = data.contact_number;
            document.getElementById('contact-email-edit').value = data.email;

            $('#exampleModalCenterEdit').modal('show');

            let saveButtonEdit = document.getElementById('save-button-edit');
            saveButtonEdit.addEventListener("click", (e)=>{
                console.log("Save_edit_clicked");

                let nameEdit = document.getElementById('contact-name-edit').value;
                let numberEdit = document.getElementById('contact-number-edit').value;
                let emailEdit = document.getElementById('contact-email-edit').value;

                fetch(apiHost+'/contact-list/edit/'+id, {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Accept':'application/json'
                    },
                    body: JSON.stringify({
                        "_id":id,
                        "contact_name": nameEdit,
                        "contact_number":numberEdit,
                        "email": emailEdit,
                    }),
                }).then(response => {
                    response.json().then(data => {
                        location.href = '/contact-list';
                        //console.log("data444", data);
                        
                        //alert("Successful");

                    });
                }).catch(error=>{
                    alert("Something went wrong.");
                });

            })


        });
    }).catch(error=>{
        alert("Something went wrong.");
    });



}

function onDeleteClick(id){

    $('#exampleModalCenterDelete').modal('show');
    let deleteButton = document.getElementById('delete-button');
    deleteButton.addEventListener("click", (e)=>{

        fetch(apiHost+'/contact-list/delete/'+id, {
            method: 'get',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
        }).then(response => {
            response.json().then(data => {
                location.href = '/contact-list';
                //console.log("data444", data);
                
                //alert("Successful");

            });
        }).catch(error=>{
            alert("Something went wrong.");
        });

    })
}


