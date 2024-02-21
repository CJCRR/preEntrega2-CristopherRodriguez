import { productsModel } from "../models/products.model.js"

export default class ProductManager {

    getProducts = async () => {
        try {
            return await productsModel.find().lean();
        } catch(error){
            console.log("cannot update user on mongo: "+ error);
        }
    }

    getProductById = async (id) => {
        try {
          const product = await productsModel.findById(id).lean()
          if (product) {
            product._id = product._id.toString()
            return product
          } else {
            return null
          }
        } catch (error) {
          console.log("cannot update user on mongo: " + error)
        }
      }

    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title })
        }
        catch(error){
            console.log("cannot update user on mongo: "+ error);
        }

    }

    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product });
        } catch(error){
            console.log("cannot update user on mongo: "+ error);
        }

    }

    deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch(error){
            console.log("cannot update user on mongo: "+ error);
        }
    }

}