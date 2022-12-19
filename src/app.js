let express = require('express');
let app = express();
let fs = require('fs');
//Metodo cors para habilitar peticiones CORS en local
let cors = require('cors');
//Metodo path para dar la ruta raiz para que sea compatible en varios OS
let path = require('path');
//Traigo el json a utilizar como base de datos
let servidor = require(path.join(__dirname, 'server', 'servidor.json'));
//Cors para habilitar envios en local
app.use(cors());
//uso express.json para leer el dato enviado como js
app.use(express.json());
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Encendido ${port}`);
});
//Traer todo el json 
app.get('/', (req, res) => {
    res.send(servidor)
});
//Filtrar por id
app.get('/:id', (req, res) => {
    //Validacion para verificar si existe el objeto y sino devolver el json completo
    if (servidor[servidor.findIndex(servidor => servidor.id == req.params.id)]) {
        //Filtro por findIndex
        res.send(servidor[servidor.findIndex(servidor => servidor.id == req.params.id)]);
    } else { res.send(servidor); }
});
//Metodo POST para cargar datos al json
app.post('/', (req, res) => {
    //Validacion para no repetir id
    if (!servidor[servidor.findIndex(servidor => servidor.id == req.body.id)]) {
        //Pusheo el req.body que recibe
        servidor.push(req.body);
        //Reescribo el json con writeFile
        fs.writeFile(path.join(__dirname, 'server', 'servidor.json'), JSON.stringify(servidor), (err) => {
            if (err)
                console.log(err);
        })
        res.send({res:true});
    } else { res.send({res:false}); }
});
//Metodo PUT para modificar un item
app.put('/:id', (req, res) => {
    //Declaro el producto
    let prod = servidor[servidor.findIndex(servidor => servidor.id == req.params.id)];
    //Validacion para saber que existe este objeto
    if (prod) {
        //Validacion para descontar items si es un producto "padre"
        if (prod.partes) {
            //Validacion para restar solamente cuando se suma un nuevo producto "padre"
            if (prod.Cantidad < req.body.Cantidad) {
                let multiplicacion = req.body.Cantidad - prod.Cantidad;
                //Recorro el array de partes que es donde estan los productos "hijos"
                for (const iterator of prod.partes) {
                    //Declaro el producto "hijo"
                    let stockHijos = servidor[servidor.findIndex(servidor => servidor.id == iterator.id)];
                    //Lo resto identificando el producto por id con findIndex
                    stockHijos.Cantidad = stockHijos.Cantidad - (iterator.cantidad * multiplicacion);
                };
            };
        };
        //Modifico los valores del objeto le doy el indice con findIndex
        prod.Producto = req.body.Producto;
        prod.Cantidad = req.body.Cantidad;
        //Reescribo el json con writeFile
        fs.writeFile(path.join(__dirname, 'server', 'servidor.json'), JSON.stringify(servidor), (err) => {
            if (err)
                console.log(err);
        })
        res.send({res:true});
    } else {
        //Sino existe mandar el json sin cambios
        res.send({res:false});
    };
})
//Metodo DELETE
app.delete("/:id", (req, res) => {
    //Validacion para saber que existe este objeto
    if (servidor[servidor.findIndex(servidor => servidor.id == req.params.id)]) {
        //Borro el objeto con splice le doy el indice con findIndex
        servidor.splice(servidor.findIndex(servidor => servidor.id == req.params.id), 1);
        //Reescribo el json con writeFile
        fs.writeFile(path.join(__dirname, 'server', 'servidor.json'), JSON.stringify(servidor), (err) => {
            if (err)
                console.log(err);
        })
        res.send({res:true});
    } else {
        //Sino hay objetos con el id seleccionado mando el json sin cambios
        res.send({res:false});
    }
});
//Metodo Put para anclar productos
app.put('/anclar/:id', (req, res) => {
    console.log(req.body);
    //Declaro el producto
    let prod = servidor[servidor.findIndex(servidor => servidor.id == req.params.id)];
    //Si el producto existe
    if (prod && prod.id != req.body.id) {
        //Si el producto tiene items anclados solamente pushear al array el nuevo objeto
        if (prod.partes) {
            //Traigo el array de anclados
            let partes = prod.partes;
            //Validacion para saber si existe el producto para no duplicarlos
            if (partes[partes.findIndex(partes => partes.id == req.body.id)]) { res.send(prod) } else {
                partes.push(req.body);
                //Reescribo el json con writeFile
                fs.writeFile(path.join(__dirname, 'server', 'servidor.json'), JSON.stringify(servidor), (err) => {
                    if (err)
                        console.log(err);
                });
                res.send({res:true});
            }
            //Sino tiene productos anclados creo el array partes y pusheo el objeto
        } else {
            prod.partes = [req.body];
            //Reescribo el json con writeFile
            fs.writeFile(path.join(__dirname, 'server', 'servidor.json'), JSON.stringify(servidor), (err) => {
                if (err)
                    console.log(err);
            });
            res.send({res:true});
        };
    } else { res.send({res:false}) };
});
//Metodo Delete para productos anclados
//Traigo el array de anclados y selecciono el indice para borrarlo
app.delete('/anclar/:id', (req, res) => {
    //Declaro el producto
    let prod = servidor[servidor.findIndex(servidor => servidor.id == req.params.id)];
    //Si el producto existe
    if (prod) {
        //Si el producto tiene anclados
        if (prod.partes) {
            let partes = prod.partes;
            //Validacion para saber que existe este objeto
            if (partes[partes.findIndex(partes => partes.id == req.body.id)]) {
                //Borro el objeto con splice le doy el numero indice con findIndex
                partes.splice(partes.findIndex(partes => partes.id == req.body.id), 1)
                //Reescribo el json con writeFile
                fs.writeFile(path.join(__dirname, 'server', 'servidor.json'), JSON.stringify(servidor), (err) => {
                    if (err)
                        console.log(err);
                });
                res.send({res:true});
            } else { res.send({res:false}); };
        } else { res.send({res:false}) };
    } else { res.send({res:false}) };
});
//Metodo PUT para eliminar de produccion
app.put('/elimProduccion/:id', (req, res) => {
    //Declaro el producto
    let prod = servidor[servidor.findIndex(servidor => servidor.id == req.params.id)];
    //Validacion para saber que existe este objeto
    if (prod) {
        //Validacion para descontar items si es un producto "padre"
        if (prod.partes) {
            //Validacion para restar solamente cuando se suma un nuevo producto "padre"
            if (prod.Cantidad > req.body.Cantidad) {
                let multiplicacion = prod.Cantidad - req.body.Cantidad;
                //Recorro el array de partes que es donde estan los productos "hijos"
                for (const iterator of prod.partes) {
                    //Declaro el producto "hijo"
                    let stockHijos = servidor[servidor.findIndex(servidor => servidor.id == iterator.id)];
                    //Lo resto identificando el producto por id con findIndex
                    stockHijos.Cantidad = stockHijos.Cantidad + (iterator.cantidad * multiplicacion);
                };
            };
        };
        //Modifico los valores del objeto le doy el indice con findIndex
        prod.Producto = req.body.Producto;
        prod.Cantidad = req.body.Cantidad;
        //Reescribo el json con writeFile
        fs.writeFile(path.join(__dirname, 'server', 'servidor.json'), JSON.stringify(servidor), (err) => {
            if (err)
                console.log(err);
        })
        res.send({res:true});
    } else {
        //Sino existe mandar el json sin cambios
        res.send({res:false});
    };
});
