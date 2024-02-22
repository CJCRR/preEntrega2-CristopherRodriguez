import { Router } from 'express';
//import { ProductManager } from '../dao/file/manager/ProductManager.js';
import  ProductManager from "../dao/mongooseManager/products.dao.js";
import CartManager from '../dao/mongooseManager/carts.dao.js';

const pm = new ProductManager()
const cm = new CartManager()

const router = Router();


router.get('/home', async (req, res) => {
  const listProducts = await pm.getProductsView()
  res.render('home', { listProducts });
});


router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts")
})

router.get("/realtimeproducts/:pid", async (req, res) => {
  const id = req.params.pid
  const product = await pm.getProductById(id)
  res.render('product', { product })
});
router.get('/carts', async (req, res) => {
  const listCarts = await cm.getCarts()
  res.render('carts', { listCarts });
});

router.get("/chat",(req,res)=>{
  res.render("chat")
})


export default router;