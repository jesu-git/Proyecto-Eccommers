
const btnComprar = document.querySelector('#comprar')



btnComprar.addEventListener('click', (e) => {

  const cart = btnComprar.getAttribute('data-product-id')

  try {
    const compra = fetch(`/api/carts/${cart}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },


    })
      .then(response => response.json())
      .then(data => {
        console.log("holaaa", data)
        if (data == "No") {

          Swal.fire({
            icon: "error",
            title: "Tu compra no se realizo por falta de stock",
            text: "Te avisaremos cuando este disponible",

          });


        } else {

          Swal.fire({
            
            icon: "success",
            title: "Tu compra se realizo con exito",
            showConfirmButton: false,
            timer: 1500
          })

        }
      })

      setTimeout(()=>{
        
        window.location.href = `http://localhost:8080/views/cart/${cart}`
      },4000)
  } catch (error) {

    Swal.fire({
      position: "center-center",
      icon: "error",
      title: error.message,
      showConfirmButton: false,
      timer: 1500
    })

  }

})