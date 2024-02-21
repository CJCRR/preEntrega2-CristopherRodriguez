import { Router } from 'express';
import { __dirname } from "../utils.js";
//import  { ProductManager }  from '../dao/file/manager/ProductManager.js';
import ProductManager from "../dao/mongooseManager/products.dao.js"

const manager = new ProductManager(__dirname + './src/dao/file/db/products.json');

const router = Router();

// Ruta raíz GET /api/products - Listar todos los productos

router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await manager.getProducts();
  if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.status(200).json(limitedProducts);
  } else if (!limit) {
      res.status(200).json(products);
  } else {
      res.status(400).json({ message: "Error al obtener los productos" });
  }
});


// Ruta GET /api/products/:pid - Traer sólo el producto con el id proporcionado
router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductsById(id);
  if (product === "No Encontrado") {
      res.status(400).json({ message: "Producto no encontrado" });
  } else if (product) {
      res.status(200).json(product);
  } else {
      res.status(400).json({ message: "Producto no encontrado" });
  }
});

// Ruta raíz POST /api/products - Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
      const product = await manager.addProduct(req.body);
      if (product === "El código insertado ya existe") {
          res.status(400).json({ message: "Error al crear el producto", product });
      } else if (product === "Complete todos los campos") {
          res.status(400).json({ message: "Error al crear el producto", product });
      } else {
          res.status(201).json({ message: "Producto creado", product });
      }
  } catch (error) {
      throw new error("Error al crear el producto", error);
  }
});

// Ruta PUT /api/products/:pid - Actualizar un producto
router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.updateProduct(id, req.body);
  if (product) {
      res.status(200).json({ message: "Producto actualizado", product });
  } else {
      res.status(400).json({ message: "Error al actualizar el producto" });
  }
});

// Ruta DELETE /api/products/:pid - Eliminar un producto
router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.deleteProduct(id);
  if (product === `No se encuentra el producto con el id : ${id}`) {
      res.status(400).json({ message: "Error al eliminar el producto", product });
  } else if (product) {
      res.status(200).json({ message: "Producto eliminado", product });
  } else {
      res.status(400).json({ message: "Error al eliminar el producto" });
  }
});


export default router;