document.getElementById("register").addEventListener("click", () => {
    let objeto = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        pass: document.getElementById("pass").value,
        pass2: document.getElementById("pass2").value
    }
    fetch("http://localhost:3000/signup", {
        method: "POST", // or 'PUT'
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objeto) // data can be `string` or {object}!
    }) 
    .then(response => response.json())
    .then(data => {
        console.log(data.res);
    });
    console.log("Registrado");
    window.location.href = "login.html";
})
