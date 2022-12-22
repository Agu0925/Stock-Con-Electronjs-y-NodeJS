document.getElementById("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.getElementById("pass").value === document.getElementById("pass2").value) {
        let objeto = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value.toLowerCase(),
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
        location.href = "login.html";
    }
})