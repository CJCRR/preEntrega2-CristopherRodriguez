const socketClient = io();

socketClient.on("sendProducts", (listProducts) => {
  updateProductList(listProducts);
});

function updateProductList(listProducts) {
  const div = document.getElementById("container");

  let productos = listProducts;
  let products = "";
  div.innerHTML = "";
  productos.forEach((product) => {
    products += `
    <div class="col">
      <div class="card h-100" id=${product._id}>
        <img src=${product.thumbnail} class="card-img-top" alt=${product.title}>
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-title">${product._id}</p>
          <p class="card-text">Descripcion: ${product.description}</p>
          <p class="card-text">Código: ${product.code}</p>
          <div class="row">
            <p class="card-text col">Stock: ${product.stock}</p>
            <p class="card-text col">Precio: ${product.price}</p>
          </div>
          <a href="/realtimeproducts/${product._id}" class="btn btn-outline-primary">Ver más</a>
        </div>
      </div>
    </div>
    `;

    div.innerHTML = products;
  });
}
const form = document.getElementById("formProducts");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;

  let status = true; 
  socketClient.emit("addProduct", 
  {title, description, stock, thumbnail, price, code, status});
 
  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", (e) => {
  const deleteIdInput = document.getElementById("pid");
  const deleteId = deleteIdInput.value;
  socketClient.emit("deleteProduct", deleteId);
  deleteIdInput.value = "";
});

