import { Router } from 'express';
//import { ProductManager } from '../dao/file/manager/ProductManager.js';
import  ProductManager from "../dao/mongooseManager/products.dao.js";
import { __dirname } from "../utils.js";

const router = Router();
const productManager = new ProductManager(__dirname +'./src/dao/file/db/products.json');

router.get('/home', async (req, res) => {
  const listProducts = await productManager.getProducts()
  res.render('home', { listProducts });
});

router.get("/realtimeproducts", async (req,res) => {
  const listProducts = await productManager.getProducts()
  res.render("realTimeProducts", {
    listProducts: listProducts
  })
});

router.get("/realtimeproducts/:pid", async (req, res) => {
  const id = req.params.pid
  const product = await productManager.getProductById(id)
  res.render('product', { product })
})

router.get("/chat",(req,res)=>{
  res.render("chat")
})


export default router;