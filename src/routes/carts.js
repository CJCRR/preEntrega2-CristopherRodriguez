import { Router } from 'express';
//import { CartManager } from '../dao/file/manager/cartManager.js';
import CartManager from "../dao/mongooseManager/carts.dao.js"
import ProductManager from "../dao/mongooseManager/products.dao.js"
import { __dirname } from "../utils.js";

//const cartManager = new CartManager('./src/dao/file/db/carts.json');

const router = Router()

const cm = new CartManager()
const pm = new ProductManager()

router.get("/", async (req, res) => {
  const carrito = await cm.getCarts()
  res.json({ carrito })
})

router.get("/:cid", async (req, res) => {
  const { cid } = req.params
  const carritofound = await cm.getCartById(cid)
  res.json({ status: "success", carritofound })
})

router.post('/', async (req, res) => {
  try {
    const { obj } = req.body;

    if (!Array.isArray(obj)) {
      return res.status(400).send('Solicitud no válida: los productos deben ser un array');
    }

    const validProducts = [];

    for (const product of obj) {
      const checkId = await pm.getProductById(product._id);
      if (checkId === null) {
        return res.status(404).send(`Product with id ${product._id} not found`);
      }
      validProducts.push(checkId);
    }

    const cart = await cm.addCart(validProducts);
    res.status(200).send(cart);

  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});


router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const checkIdProduct = await pm.getProductById(pid);
    if (!checkIdProduct) {
      return res.status(404).send({ message: `Product with ID: ${pid} not found` });
    }

    const checkIdCart = await cm.getCartById(cid);
    if (!checkIdCart) {
      return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
    }

    const result = await cm.addProductInCart(cid, { _id: pid, quantity: quantity });
    console.log(result);
    return res.status(200).send({
      message: `Product with ID: ${pid} added to cart with ID: ${cid}`,
      cart: result,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).send({ message: "Se produjo un error al procesar la solicitud." });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    for (const product of products) {
      const checkId = await pm.getProductById(product._id);

      if (!checkId) {
        return res.status(404).send({ status: 'error', message: `The ID product: ${product._id} not found` });
      }
    }

    const checkIdCart = await cm.getCartById(cid);
    if (!checkIdCart) {
      return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` });
    }

    const cart = await cm.updateProductsInCart(cid, products);
    return res.status(200).send({ status: 'success', payload: cart });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 'error', message: 'Se produjo un error al procesar la solicitud.' });
  }
});

router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const checkIdProduct = await pm.getProductById(pid);
    if (!checkIdProduct) {
      return res.status(404).send({ status: 'error', message: `Product with ID: ${pid} not found` });
    }

    const checkIdCart = await cm.getCartById(cid);
    if (!checkIdCart) {
      return res.status(404).send({ status: 'error', message: `Cart with ID: ${cid} not found` });
    }

    const findProductIndex = checkIdCart.products.findIndex((product) => product._id.toString() === pid);
    if (findProductIndex === -1) {
      return res.status(404).send({ status: 'error', message: `Product with ID: ${pid} not found in cart` });
    }

    checkIdCart.products.splice(findProductIndex, 1);

    const updatedCart = await cm.deleteProductInCart(cid, checkIdCart.products);

    return res.status(200).send({ status: 'success', message: `Deleted product with ID: ${pid}`, cart: updatedCart });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 'error', message: 'Se produjo un error al procesar la solicitud' });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cm.getCartById(cid);

    if (!cart) {
      return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
    }

    if (cart.products.length === 0) {
      return res.status(404).send({ message: 'El carrito ya está vacío' });
    }

    cart.products = [];

    await cm.updateOneProduct(cid, cart.products);

    return res.status(200).send({
      status: 'success',
      message: `The cart with ID: ${cid} was emptied correctly`,
      cart: cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Se produjo un error al procesar la solicitud' });
  }
});

export default router