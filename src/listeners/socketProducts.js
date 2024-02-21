import ProductManager from "../dao/mongooseManager/products.dao.js";
const productManager = new ProductManager()

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected con ID:", socket.id)
        
        const listProducts = await productManager.getProducts({});
  socketServer.emit("sendProducts", listProducts);

  socket.on("addProduct", async (obj) => {
      await productManager.addProduct(obj);
      const listProducts = await productManager.getProducts({});
      socketServer.emit("sendProducts", listProducts);
  });

  socket.on("deleteProduct", async (id) => {
      await productManager.deleteProduct(id);
      const listProducts = await productManager.getProducts({});
      socketServer.emit("sendProducts", listProducts);
  });

  socket.on("nuevousuario",(usuario)=>{
          console.log("usuario" ,usuario)
          socket.broadcast.emit("broadcast",usuario)
         })
         socket.on("disconnect",()=>{
             console.log(`Usuario con ID : ${socket.id} esta desconectado `)
         })

    })
};

export default socketProducts;