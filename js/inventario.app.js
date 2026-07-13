document.addEventListener("DOMContentLoaded", function() {
    const cuerpoTabla = document.getElementById("lista-productos");

    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

    if(productosGuardados.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay productos registrados.</td></tr>`;
        return;
    }

    cuerpoTabla.innerHTML = "";

    productosGuardados.forEach(producto => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.categoria}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.fecha}</td>
            <td><span class="badge activo">${producto.estado}</span></td>
        `;

        cuerpoTabla.appendChild(fila);
    });
});