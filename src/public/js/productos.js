
document.addEventListener('DOMContentLoaded', function () {
  const btnAgregar = document.querySelectorAll('.add-to-cart');
  const elemento = document.querySelector('#cart')
  const cart = elemento.getAttribute('cart')
  
  btnAgregar.forEach(button => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-product-id');

      agregarACart(productId, cart)

    });
  });

  function agregarACart(productId, cart) {

    fetch(`/api/carts/${cart}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then(response => response.json())
      .then ( data => {

        if(data == "NoAccess"){

          Swal.fire({
          
            icon: "warning",
            title: "No tiene permitido esta accion!",
            showConfirmButton: false,
            timer: 1000
          });
  
        }else{

          Swal.fire({
            
            icon: "success",
            title: data,
            showConfirmButton: false,
            timer: 1000
          });


        }

        console.log("producto agregado correctamente")


      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
});