//let url = "https://agile-reaches-23713.herokuapp.com/";
let url = "http://localhost:3000/";
let idProd = "";
let prodArray = [];
let idmodal = "";
let idProduccion = "";
//Mostrar productos ni bien entro a la pagina
mostrar();
//Al cargar toda la pagina
document.addEventListener("DOMContentLoaded", () => {
    id();
    arrayProd();
    //Boton para Buscar los productos
    document.getElementById("mostrar").addEventListener("click", () => {
        mostrar();
    });
    //Boton para agregar un producto
    document.getElementById("agregar").addEventListener("click", () => {
        id();
        if (
            document.getElementById("producto").value != "" && document.getElementById("cantidad").value != "" && document.getElementById("id").value != "" &&
            !prodArray.includes(document.getElementById("producto").value.toLowerCase())
        ) {
            let objeto = {
                Producto: document.getElementById("producto").value,
                Cantidad: parseInt(document.getElementById("cantidad").value),
                id: parseInt(idProd)
            };
            fetch(url, {
                method: "POST", // or 'PUT'
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objeto) // data can be `string` or {object}!
            });
            setTimeout(() => {
                mostrar();
                arrayProd();
            }, 200);
        }
    });
    //Boton para modificar un producto
    document.getElementById("modificar").addEventListener("click", () => {
        if (document.getElementById("producto").value != "" && document.getElementById("cantidad").value != "" && document.getElementById("id").value != "") {
            let objeto = {
                Producto: document.getElementById("producto").value,
                Cantidad: parseInt(document.getElementById("cantidad").value),
            };
            fetch(url + document.getElementById("id").value, {
                method: "PUT", // or 'POST'
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objeto) // data can be `string` or {object}!
            });
            setTimeout(() => {
                mostrar();
            }, 200);
        }
    });
    //Boton para borrar un producto
    document.getElementById("borrar").addEventListener("click", () => {
        if (document.getElementById("producto").value != "" && document.getElementById("cantidad").value != "" && document.getElementById("id").value != "") {
            fetch(url + document.getElementById("id").value, {
                method: "DELETE"
            });
            document.getElementById("producto").value = "";
            document.getElementById("cantidad").value = "";
            setTimeout(() => {
                mostrar();
            }, 200);
        }
    });
    //Buscador para modal
    document.getElementById("buscProducto").addEventListener("input", () => {
        modal(idmodal);
    });
    //Boton Finalizar El envio a produccion
    document.getElementById("finalizar").addEventListener("click", () => {
        fetch(url)
            .then((resp) => resp.json())
            .then((datos) => {
                document.getElementById("produccion2").innerHTML = "";
                let cantidades = "";
                for (const iterator of datos) {
                    if (document.getElementsByClassName("idproduccion" + iterator.id)) {
                        let suma = [];
                        for (const iterator2 of document.getElementsByClassName("idproduccion" + iterator.id)) {
                            suma.push(parseInt(iterator2.innerHTML));
                            if (document.getElementById("suma" + iterator.id)) {
                                document.getElementById("produccion2").removeChild(document.getElementById("suma" + iterator.id));
                            }
                            cantidades = `
                                <tr id="suma${iterator.id}">
                                    <td>${iterator.Producto}</td>
                                    <td>${suma.reduce((a, b) => a + b, 0)}</td>
                                </tr>
                                `;
                            document.getElementById("produccion2").innerHTML += cantidades;
                        }
                    }
                }
                setTimeout(() => {
                    window.print();
                    document.getElementById("produccion2").innerHTML = "";
                    document.getElementById("produccion").innerHTML = "";
                }, 200);
            });
    });
});
//Realizo fetch get y imprimo los resultados
function mostrar() {
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            let productos = "";
            for (const iterator of datos) {
                if (iterator.Producto) {
                    if (
                        iterator.Producto.toLowerCase().includes(
                            document.getElementById("producto").value.toLowerCase()
                        ) ||
                        document.getElementById("producto").value == ""
                    ) {
                        if (iterator.partes) {
                            if (iterator.Cantidad < 10) {
                                let productoAnclado = "";
                                for (const partes of iterator.partes) {
                                    productoAnclado += " - " + partes.Producto
                                };
                                productos += `
                    <div onclick="selecID(${iterator.id})" class="col-md-6 py-md-3 m-auto border btn btn-danger">
                        <div class="row">
                            <div class="col-md-6 my-2 my-md-1">
                                <h4 class="card-title">${iterator.Producto}</h4>
                                <p class="card-text my-md-4 text-start">Stock - ${iterator.Cantidad}</p>
                                <p class="card-text text-start">Partes ${productoAnclado} </p>
                            </div>
                            <div class="col-md-6 m-auto text-center">
                                <img class="w-50"
                                src="./img/herramientas.jpg" alt="" />
                            </div>
                            <div class="col-md-12 my-2 my-md-1">
                            </div>
                            <div class="col-md-6 my-2 my-md-1">
                                <span onclick="produccion(${iterator.id})" data-bs-toggle="modal" data-bs-target="#pModal" class='btn btn-success w-100'>+</span>
                            </div>
                            <div class="col-md-6 my-2 my-md-1">
                                <span onclick="modal(${iterator.id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class='btn btn-warning w-100'>Anclar Productos</span>
                            </div>
                        </div>
                    </div>`;
                            } else {
                                let productoAnclado = "";
                                for (const partes of iterator.partes) {
                                    productoAnclado += " - " + partes.Producto
                                };
                                productos += `
                    <div onclick="selecID(${iterator.id})" class="col-md-6 py-md-3 m-auto border btn btn-dark">
                        <div class="row">
                            <div class="col-md-6 my-2 my-md-1">
                                <h4 class="card-title">${iterator.Producto}</h4>
                                <p class="card-text my-md-4 text-start">Stock - ${iterator.Cantidad}</p>
                                <p class="card-text text-start">Partes ${productoAnclado} </p>
                            </div>
                            <div class="col-md-6 m-auto text-center">
                                <img class="w-50"
                                src="./img/herramientas.jpg" alt="" />
                            </div>
                            <div class="col-md-12 my-2 my-md-1">
                            </div>
                            <div class="col-md-6 my-2 my-md-1">
                                <span onclick="produccion(${iterator.id})" data-bs-toggle="modal" data-bs-target="#pModal" class='btn btn-success w-100'>+</span>
                            </div>
                            <div class="col-md-6 my-2 my-md-1">
                                <span onclick="modal(${iterator.id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class='btn btn-warning w-100'>Anclar Productos</span>
                            </div>
                        </div>
                    </div>`;
                            }
                        } else if (iterator.Cantidad < 10) {
                            productos += `
                    <div onclick="selecID(${iterator.id})" class="col-md-6 py-md-3 m-auto border btn btn-danger">
                        <div class="row">
                            <div class="col-md-6 my-2 my-md-1">
                                <h4 class="card-title">${iterator.Producto}</h4>
                                <p class="card-text my-md-4 text-start">Stock - ${iterator.Cantidad}</p>
                                <p class="card-text text-start">Partes - </p>
                            </div>
                            <div class="col-md-6 m-auto text-center">
                                <img class="w-50"
                                src="./img/herramientas.jpg" alt="" />
                            </div>
                            <div class="col-md-12 my-2 my-md-1">
                            </div>
                            <div class="col-md-6 my-2 my-md-1">
                                <span onclick="produccion(${iterator.id})" data-bs-toggle="modal" data-bs-target="#pModal" class='btn btn-success w-100'>+</span>
                            </div>
                            <div class="col-md-6 my-2 my-md-1">
                                <span onclick="modal(${iterator.id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class='btn btn-warning w-100'>Anclar Productos</span>
                            </div>
                        </div>
                    </div>`;
                        } else {
                            productos += `
                    <div onclick="selecID(${iterator.id})" class="col-md-6 py-md-3 m-auto border btn btn-dark">
                        <div class="row">
                            <div class="col-md-6 my-2 my-md-1">
                                <h4 class="card-title">${iterator.Producto}</h4>
                                <p class="card-text my-md-4 text-start">Stock - ${iterator.Cantidad}</p>
                                <p class="card-text text-start">Partes - </p>
                            </div>
                            <div class="col-md-6 m-auto text-center">
                                <img class="w-50"
                                src="./img/herramientas.jpg" alt="" />
                            </div>
                            <div class="col-md-12 my-2 my-md-1">
                            </div>
                            <div class="col-md-6 my-2 my-md-1">
                                <span onclick="produccion(${iterator.id})" data-bs-toggle="modal" data-bs-target="#pModal" class='btn btn-success w-100'>+</span>
                            </div>
                            <div class="col-md-6 my-2 my-md-1">
                                <span onclick="modal(${iterator.id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class='btn btn-warning w-100'>Anclar Productos</span>
                            </div>
                        </div>
                    </div>`;
                        }
                    }
                }
                //Imprimo con innerHTML
                document.getElementById("mostrarDatos").innerHTML = productos;
            }
        });
};
//Funcion para traerme los datos de cada producto
function selecID(id) {
    fetch(url + id)
        .then((resp) => resp.json())
        .then((datos) => {
            document.getElementById("producto").value = datos.Producto;
            document.getElementById("cantidad").value = datos.Cantidad;
            document.getElementById("id").value = datos.id;
        });
};
//Funcion para que la id sea unica
function id() {
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            idProd = Math.floor(Math.random() * 999999);
            if (datos[datos.findIndex(datos => datos.id == idProd)]) {
                idProd = Math.floor(Math.random() * 999999);
                document.getElementById("id").value = idProd;
            } else {
                document.getElementById("id").value = idProd;
            };
        });
};
//Funcion para pushear los nombres en un array para hacer validacion
function arrayProd() {
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            for (const iterator of datos) {
                if (iterator.Producto) {
                    prodArray.push(iterator.Producto.toLowerCase());
                }
            }
        });
};
//Funcion para imprimir todos los productos en el modal
function modal(id) {
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            let ids = [];
            idmodal = id;
            //Que inicie vacio el html de anclados
            document.getElementById("anclados").innerHTML = "";
            //Declaro el producto
            let prod = datos[datos.findIndex(datos => datos.id == idmodal)];
            //Le doy el titulo al modal
            document.getElementById("modalTitulo").innerHTML = prod.Producto;
            //Muestro los productos anclados
            if (prod.partes) {
                for (const partes of prod.partes) {
                    document.getElementById("anclados").innerHTML += `
                <div id="anclaDiv${partes.id}" class="row border bg-success p-2">
                    <div class="col text-center m-auto"><p class="m-auto"><span id="prod${partes.id}">${partes.Producto}</span></p></div>
                    <div class="col text-center m-auto"><p class="m-auto">Cant - <span id="cant${partes.id}">${partes.cantidad}</span></p></div>
                    <div class="col-2 text-center m-auto"><p class="m-auto">ID - <span id="id${partes.id}">${partes.id}</span></p></div>
                    <div class="col text-end"><span onclick="elimAncla(${partes.id})" class='btn btn-danger'>X</span></div>
                </div>
                `;
                    ids.push(partes.id);
                };
            };
            //Mostrar productos en el modal
            let modalInfo = "";
            for (const iterator of datos) {
                if (iterator.Producto) {
                    //Filtros para no mostrar el producto seleccionado y sus anclados
                    if (iterator.Producto != document.getElementById("modalTitulo").innerHTML && !ids.includes(iterator.id)) {
                        if (
                            iterator.Producto.toLowerCase().includes(
                                document.getElementById("buscProducto").value.toLowerCase()
                            ) || document.getElementById("buscProducto").value == ""
                        ) {
                            modalInfo += `
                        <div id="div${iterator.id}" class="row border bg-dark p-2">
                          <div class="col my-auto">${iterator.Producto}</div>
                          <div class="col my-auto"><input type="number" class="input-group" name="" id="${iterator.id}"></div>  
                          <div class="col text-end"><span onclick="anclar(${iterator.id})" class='btn btn-success'>+</span></div>
                        </div>
                        `;
                        };
                    };
                };
            };
            document.getElementById("modal-body").innerHTML = modalInfo;
        });
};
//Funcion para anclar productos a productos "padres" en modal
function anclar(id) {
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            if (document.getElementById(id).value != 0) {
                let iterator = datos[datos.findIndex(datos => datos.id == id)];
                document.getElementById("anclados").innerHTML += `
                <div id="anclaDiv${iterator.id}" class="row border bg-success p-2">
                    <div class="col text-center m-auto"><p class="m-auto"><span id="prod${iterator.id}">${iterator.Producto}</span></p></div>
                    <div class="col text-center m-auto"><p class="m-auto">Cant - <span id="cant${iterator.id}">${document.getElementById(id).value}</span></p></div>
                    <div class="col-2 text-center m-auto"><p class="m-auto">ID - <span id="id${iterator.id}">${iterator.id}</span></p></div>
                    <div class="col text-end"><span onclick="elimAncla(${iterator.id})" class='btn btn-danger'>X</span></div>
                </div>
                `;
                let objeto = {
                    Producto: iterator.Producto,
                    cantidad: parseInt(document.getElementById(id).value),
                    id: parseInt(iterator.id)
                };
                fetch(url + "anclar/" + datos[datos.findIndex(datos => datos.Producto == document.getElementById("modalTitulo").innerHTML)].id, {
                    method: "PUT", // or 'POST'
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(objeto) // data can be `string` or {object}!
                });
                document.getElementById("modal-body").removeChild(document.getElementById("div" + id));
                setTimeout(() => {
                    mostrar();
                }, 200);
            } else {
                document.getElementById(id).style.background = "red";
            }
        });
};
//Funcion para elminiar producto anclado en modal
function elimAncla(id) {
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            //Identifico el producto
            let iterator = datos[datos.findIndex(datos => datos.id == id)];
            //Agrego el div al body
            document.getElementById("modal-body").innerHTML += `
        <div id="div${iterator.id}" class="row border bg-dark p-2">
            <div class="col my-auto">${iterator.Producto}</div>
            <div class="col my-auto"><input type="number" class="input-group" name="" id="${iterator.id}"></div>  
            <div class="col text-end"><span onclick="anclar(${iterator.id})" class='btn btn-success'>+</span></div>
        </div>
        `;
            fetch(url + "anclar/" + datos[datos.findIndex(datos => datos.Producto == document.getElementById("modalTitulo").innerHTML)].id, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            //Borro el div anclado
            setTimeout(() => {
                mostrar();
            }, 200);
            document.getElementById("anclados").removeChild(document.getElementById("anclaDiv" + id));
        });
};
//Modal Produccion
function produccion(id) {
    idProduccion = id;
    document.getElementById('cantProducto').value = "";
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            let iterator = datos[datos.findIndex(datos => datos.id == id)];
            document.getElementById('modalTituloProd').innerHTML = iterator.Producto;
        });
};
//Funcion para enviar a "producción"
document.getElementById("enviarProduccion").addEventListener("click", () => {
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            let iterator = datos[datos.findIndex(datos => datos.id == idProduccion)];
            let productoAnclado = "";
            if (document.getElementById('cantProducto').value > 0) {
                if (iterator.partes) {
                    for (const partes of iterator.partes) {
                        productoAnclado += " - " + partes.Producto + ": <span class='" + "idproduccion" + partes.id + "'>" + partes.cantidad * document.getElementById('cantProducto').value + "</span>" + " ";
                    };
                    if (!document.getElementById(`produc${iterator.id}`)) {
                        document.getElementById('produccion').innerHTML += `
<div id="produc${iterator.id}" class="col-md-6 py-md-3 m-auto border btn btn-success">
<div class="row">
    <div class="col-12 text-end my-2 my-md-1">
    <button onclick="sacarProduc(${iterator.id})" type="button" class="btn-close" aria-label="Close"></button>    
    </div>
    <div class="col-12 text-center my-2 my-md-1"></div>
    <div class="col-12 my-2 my-md-1">
        <h4 class="card-title">${iterator.Producto}</h4>
        <p class="card-text my-md-4 text-start">Cantidad - <span id="c${iterator.id}">${parseInt(document.getElementById('cantProducto').value)}</span></p>
        <p class="card-text my-md-4 text-start">Partes ${productoAnclado}</p>
    </div>
    <div class="col-md-12 my-2 my-md-1">
    </div>
</div>
</div>
        `;
                        //Fetch para cambiar el stock
                        let objeto = {
                            Producto: iterator.Producto,
                            Cantidad: parseInt(iterator.Cantidad) + parseInt(document.getElementById('cantProducto').value),
                        };
                        fetch(url + iterator.id, {
                            method: "PUT", // or 'POST'
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(objeto) // data can be `string` or {object}!
                        });
                        document.getElementById('cantProducto').value = "";
                        location.href = "#produccion";
                    }
                } else {
                    if (!document.getElementById(`produc${iterator.id}`)) {
                        document.getElementById('produccion').innerHTML += `
<div id="produc${iterator.id}" class="col-md-6 py-md-3 m-auto border btn btn-success">
<div class="row">
    <div class="col-12 text-end my-2 my-md-1">
    <button onclick="sacarProduc(${iterator.id})" type="button" class="btn-close" aria-label="Close"></button>    
    </div>
    <div class="col-12 text-center my-2 my-md-1"></div>
    <div class="col-12 my-2 my-md-1">
        <h4 class="card-title">${iterator.Producto}</h4>
        <p class="card-text my-md-4 text-start">Cantidad - <span id="c${iterator.id}">${parseInt(document.getElementById('cantProducto').value)}</span></p>
        <p class="card-text my-md-4 text-start">Partes - </p>
    </div>
    <div class="col-md-12 my-2 my-md-1">
    </div>
</div>
</div>
        `;
                        //Fetch para cambiar el stock
                        let objeto = {
                            Producto: iterator.Producto,
                            Cantidad: parseInt(iterator.Cantidad) + parseInt(document.getElementById('cantProducto').value),
                        };
                        fetch(url + iterator.id, {
                            method: "PUT", // or 'POST'
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(objeto) // data can be `string` or {object}!
                        });
                        document.getElementById('cantProducto').value = "";
                        location.href = "#produccion";
                    }
                };
                setTimeout(() => {
                    mostrar();
                }, 200);
            } else {
                document.getElementById('cantProducto').value = "";
            };
        });
});
//Funcion para sacar de producción
function sacarProduc(id) {
    fetch(url)
        .then((resp) => resp.json())
        .then((datos) => {
            iterator = datos[datos.findIndex(datos => datos.id == id)];
            //Fetch para cambiar el stock
            let objeto = {
                Producto: iterator.Producto,
                Cantidad: parseInt(iterator.Cantidad) - parseInt(document.getElementById(`c${id}`).innerHTML),
            };
            fetch(url + "elimProduccion/" + iterator.id, {
                method: "PUT", // or 'POST'
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objeto) // data can be `string` or {object}!
            });
            setTimeout(() => {
                document.getElementById("produccion").removeChild(document.getElementById(`produc${id}`));
                mostrar();
            }, 200);
        });
};
