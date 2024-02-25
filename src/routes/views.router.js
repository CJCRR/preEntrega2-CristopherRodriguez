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
  const carrito = await cm.getCarts()
  res.render('carts', { carrito });
});

router.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
      const cart = await cm.getCartById(cartId);
      res.render('cart', { cart, products: cart.products });
  } catch (err) {
      console.error('Error al obtener el carrito por ID:', err.message);
      res.status(500).send('Error al obtener el carrito por ID');
  }
});

router.get("/chat",(req,res)=>{
  res.render("chat")
})


export default router;