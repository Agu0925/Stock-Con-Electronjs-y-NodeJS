//Validacion para dejar loguearte solamente si estas autenticado
if(localStorage.getItem("usuario")){
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
        if (data.status !== true) {
            location.href = "login.html";
        };
    });
}else{
    location.href = "login.html";
}