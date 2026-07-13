document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.querySelector(".formulario");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const precio = document.getElementById("precio").value.trim();
    const cantidad = document.getElementById("cantidad").value.trim();

    if (codigo.length < 3) {
      alert("El código debe tener al menos 3 caracteres.");
      return;
    }
    if (nombre.length < 2) {
      alert("El nombre debe tener al menos 2 caracteres.");
      return;
    }
    if (isNaN(precio) || precio <= 0) {
      alert("El precio debe ser un número positivo.");
      return;
    }
    if (isNaN(cantidad) || cantidad < 1) {
      alert("La cantidad minima debe de ser 1.");
      return;
    }

    const nuevoProducto = {
      codigo: codigo,
      nombre: nombre,
      precio: parseFloat(precio).toFixed(2),
      cantidad: cantidad,
      categoria: "General",
      fecha: new Date().toLocaleDateString("es-ES"),
      estado: "Activo",
    };

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.push(nuevoProducto);

    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarConfirmacion(nombre);
    formulario.reset();
  });
});

function mostrarConfirmacion(nombreProducto) {
  Swal.fire({
    title: "Producto registrado",
    text: `El producto "${nombreProducto}" ha sido registrado exitosamente.`,
    icon: "success",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#3085d6",
  });
}