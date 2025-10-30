import express from "express"

const routerProduct = express.Router();

routerProduct.get('/', (req, res) => {
    console.log("entro a la ruta home actualizada")
    res.send('ROUTES PRODUCTS')
})

routerProduct.post('/', (req, res) => {
    console.log("entro a la ruta home de post")
    const products = [
        { name: "camara profesional", id: "1" },
        { name: "micro profesional", id: "2" },

    ]
    res.json({"productos": products})
})

export default routerProduct;