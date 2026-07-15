document.addEventListener('DOMContentLoaded', () => {
    const productoSelect = document.getElementById('producto');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnProcesar = document.getElementById('btnProcesar');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalVenta = document.getElementById('totalVenta');
    
    let total = 0;

    // 1. Cargar productos desde el localStorage al menú desplegable
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    
    // Agregamos algunos productos base por si el inventario está vacío
    const productosBase = [
        { nombre: 'Monitor Gamer 24"', precio: 249.99, estado: 'Activo' },
        { nombre: 'Teclado Mecánico RGB', precio: 85.00, estado: 'Activo' }
    ];

    const todosLosProductos = [...productosBase, ...productosGuardados];

    todosLosProductos.forEach(prod => {
        if (prod.estado === "Activo") {
            const option = document.createElement('option');
            option.value = prod.nombre;
            option.setAttribute('data-precio', prod.precio);
            option.textContent = `${prod.nombre} - $${prod.precio}`;
            productoSelect.appendChild(option);
        }
    });

    // 2. Lógica para agregar al carrito
    btnAgregar.addEventListener('click', () => {
        const cliente = document.getElementById('cliente').value;
        const cantidad = document.getElementById('cantidad').value;

        if (cliente === '' || productoSelect.value === '' || cantidad <= 0) {
            Swal.fire({ icon: 'warning', title: 'Datos incompletos', text: 'Selecciona cliente, producto y cantidad.' });
            return;
        }

        const nombreProducto = productoSelect.value;
        const precioProducto = parseFloat(productoSelect.options[productoSelect.selectedIndex].getAttribute('data-precio'));
        const subtotal = precioProducto * cantidad;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="fw-medium">${nombreProducto}</td>
            <td>$${precioProducto.toFixed(2)}</td>
            <td>${cantidad}</td>
            <td class="fw-semibold text-dark">$${subtotal.toFixed(2)}</td>
            <td class="text-center">
                <button class="btn-eliminar" onclick="eliminarFila(this, ${subtotal})">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </td>
        `;

        listaCarrito.appendChild(fila);
        actualizarTotal(subtotal);

        // Limpiar selección
        productoSelect.value = '';
        document.getElementById('cantidad').value = '1';
    });

    // 3. Lógica para procesar venta
    btnProcesar.addEventListener('click', () => {
        if (total === 0) {
            Swal.fire({ icon: 'error', title: 'Carrito vacío', text: 'Agrega productos antes de vender.' });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: '¡Venta procesada!',
            text: `Venta registrada por $${total.toFixed(2)}.`,
            confirmButtonText: 'Aceptar'
        }).then(() => {
            listaCarrito.innerHTML = '';
            document.getElementById('cliente').value = '';
            total = 0;
            totalVenta.innerText = '$0.00';
        });
    });

    // Funciones globales
    window.actualizarTotal = function(monto) {
        total += monto;
        totalVenta.innerText = `$${total.toFixed(2)}`;
    }

    window.eliminarFila = function(boton, monto) {
        boton.parentNode.parentNode.remove();
        actualizarTotal(-monto);
    }
});