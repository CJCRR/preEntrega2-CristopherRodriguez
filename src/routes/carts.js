import { Router } from 'express';
//import { CartManager } from '../dao/file/manager/cartManager.js';
import CartManager from "../dao/mongooseManager/carts.dao.js"
import ProductManager from "../dao/mongooseManager/products.dao.js"
import { __dirname } from "../utils.js";

//const cartManager = new CartManager('./src/dao/file/db/carts.json');
const cartManager = new CartManager(__dirname + "../dao/file/manager/cartManager.js");
const cm = new CartManager()
const pm = new ProductManager()

const router = Router();

// Ruta raíz POST /api/carts - Crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Ruta raíz GET /api/carts - Listar todos los productos
router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  if (carts.length === 0) {
    res.status(200).json({ message: "No se crearon los carritos" });
  } else {
    res.status(200).json({ carts });
  }
});

// Ruta GET /api/carts/:cid - Listar los productos que pertenezcan al carrito con el cid proporcionado
router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(cid);

  if (cart === "No Encontrado") {
    res.status(400).json({ message: "Carrito no encontrado" });
  } else if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(400).json({ message: "Carrito no encontrado" });
  }
});

// Ruta POST /api/carts/:cid/products/:pid - Agregar el producto al arreglo “products” del carrito seleccionado

router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  if (cart) {
    res.status(201).json({ message: "Carrito Creado", cart });
  } else {
    res.status(400).json({ message: "Error al crear el carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    await cartManager.addProductToCart(cid, pid);
    res.status(200).json({ message: "Producto agregado al carrito con éxito." });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res
      .status(500)
      .json({ status: "error", message: "No se pudo agregar el producto al carrito." });
  }
});

export default router;
