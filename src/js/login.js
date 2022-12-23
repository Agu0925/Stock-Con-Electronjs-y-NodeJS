let email = document.getElementById("LoginEmail");
let pass = document.getElementById("LoginPass");
document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let usuario = {
        email: email.value.toLowerCase(),
        pass: pass.value
    }
    fetch("http://localhost:3000/login", {
        method: "POST", // or 'PUT'
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)// data can be `string` or {object}!
    })
        .then(resp => resp.json())
        .then((data) => {
            let iterator = data.res
            if (iterator.status === true) {
                localStorage.setItem("usuario", JSON.stringify({ name: iterator.name, email: iterator.email, token: iterator.token }));
                document.getElementById("errorLogin").innerHTML = "";
                logAuth();
            } else {
                document.getElementById("errorLogin").innerHTML = iterator;
            }
        });
});
function logAuth() {
    let token = { token: JSON.parse(localStorage.getItem("usuario")).token, email: JSON.parse(localStorage.getItem("usuario")).email };
    fetch("http://localhost:3000/auth", {
        method: "POST", // or 'PUT'
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(token)// data can be `string` or {object}!
    })
        .then(resp => resp.json())
        .then((data) => {
            if (data.status === true) {
                location.href = "index.html";
            }
        })
};