import express from "express";
import Product from "../models/product.js";

const routerProduct = express.Router();



/////esto lo hicimos con pepe
routerProduct.post("/", async (req, res, next) => {
  console.log(req.body)

  if (!req.body.name || !req.body.description || !req.body.price) {
    next(new Error("Name, price and description required"));
    return;
  }

  const { name, description, price } = req.body;

  try {
    const new_product = new Product({
      name,
      description,
      price
    });
    await new_product.save();

    res.status(201).json(new_product);

  } catch (err) {
    console.error(err);
    next(err);
  }

  next(new Error("Method not yet implemented"));
})



routerProduct.get("/:id", async(req, res, next) =>{
  const {id} = req.params;

  try{
    const found = await Product.findById(id);

    res.status(200).json(found);


  }catch (err){
    console.error(err);
    next(err);
    

  }

});


routerProduct.get("/", async(req, res, next) =>{

  try{
    const found = await Product.find();
    res.status(200).json(found);

  }catch (err){
    console.error(err);
    next(err);
    
  }
});





//////////////rutas de productos//////////////
routerProduct.get('/', (req, res) => {
  console.log("entro a la ruta home actualizada")


  /////////error simulado/////////
  res.status(400);
  throw new Error("Error simulado");
  /////////////////////////////////


  res.send('Hello World!')
})

routerProduct.post('/', (req, res) => {
  console.log("entro a la ruta home de post")
  const products = [
    { name: "camara profesional", id: "1" },
    { name: "micro profesional", id: "2" }
  ]
  res.json({
    "productos": products
  });
})

export default routerProduct;