let email = document.getElementById("LoginEmail");
let pass = document.getElementById("LoginPass");
document.getElementById("btnLogin").addEventListener("click", () => {
    let usuario = {
        email: email.value,
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
                logAuth();
            } else {
                console.log(data.res);
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
            console.log(data.status);
            if (data.status === true) {
                location.href = "index.html";
            }
        })
};