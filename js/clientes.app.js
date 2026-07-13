let clientes = [];
let clienteEditando = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarClientesEjemplo();
    renderizarTabla();
    
    document.getElementById('guardarCliente').addEventListener('click', guardarCliente);
    
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaRegistro').value = hoy;
});

function cargarClientesEjemplo() {
    clientes = [
        {
            id: 1,
            nombre: 'María García',
            email: 'maria.garcia@email.com',
            telefono: '7890-1234',
            direccion: 'Av. Principal #456, Col. Centro',
            fechaRegistro: '2026-01-15'
        },
        {
            id: 2,
            nombre: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@email.com',
            telefono: '5678-9012',
            direccion: 'Calle Secundaria #789, Col. Norte',
            fechaRegistro: '2026-02-20'
        },
        {
            id: 3,
            nombre: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            telefono: '3456-7890',
            direccion: 'Blvd. Central #321, Col. Sur',
            fechaRegistro: '2026-03-10'
        }
    ];
}

function renderizarTabla() {
    const tbody = document.getElementById('lista-clientes');
    tbody.innerHTML = '';
    
    if (clientes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
                    No hay clientes registrados. ¡Agrega uno nuevo!
                </td>
            </tr>
        `;
        return;
    }
    
    clientes.forEach(cliente => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="ps-4 fw-semibold text-secondary">${cliente.id}</td>
            <td class="fw-medium">${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion}</td>
            <td>${formatearFecha(cliente.fechaRegistro)}</td>
            <td class="pe-4 text-center">
                <button class="btn-accion btn-editar me-1" onclick="editarCliente(${cliente.id})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${cliente.id})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function guardarCliente() {
    const form = document.getElementById('formCliente');
    const formData = new FormData(form);
    
    const nombre = formData.get('nombre').trim();
    const email = formData.get('email').trim();
    const telefono = formData.get('telefono').trim();
    const direccion = formData.get('direccion').trim();
    const fechaRegistro = formData.get('fechaRegistro');
    const id = document.getElementById('clienteId').value;
    
    // Validaciones
    if (!nombre || !email || !telefono || !direccion || !fechaRegistro) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos del formulario.',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }
    
    // Validar email
    if (!validarEmail(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Email inválido',
            text: 'Por favor, ingresa un correo electrónico válido.',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }
    
    // Validar teléfono (formato básico)
    if (!validarTelefono(telefono)) {
        Swal.fire({
            icon: 'error',
            title: 'Teléfono inválido',
            text: 'Por favor, ingresa un número de teléfono válido (ej: 1234-5678).',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }
    
    if (id) {
        // Editar cliente existente
        const index = clientes.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            clientes[index] = {
                id: parseInt(id),
                nombre,
                email,
                telefono,
                direccion,
                fechaRegistro
            };
            
            Swal.fire({
                icon: 'success',
                title: '¡Cliente actualizado!',
                text: 'Los datos del cliente han sido actualizados correctamente.',
                confirmButtonColor: '#0d6efd'
            });
        }
    } else {
        // Crear nuevo cliente
        const nuevoCliente = {
            id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
            nombre,
            email,
            telefono,
            direccion,
            fechaRegistro
        };
        clientes.push(nuevoCliente);
        
        Swal.fire({
            icon: 'success',
            title: '¡Cliente agregado!',
            text: 'El cliente se ha registrado exitosamente.',
            confirmButtonColor: '#0d6efd'
        });
    }
    
    // Limpiar formulario y cerrar modal
    form.reset();
    document.getElementById('clienteId').value = '';
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCliente'));
    modal.hide();
    
    // Actualizar tabla
    renderizarTabla();
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;
    
    // Llenar formulario con datos del cliente
    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('nombre').value = cliente.nombre;
    document.getElementById('email').value = cliente.email;
    document.getElementById('telefono').value = cliente.telefono;
    document.getElementById('direccion').value = cliente.direccion;
    document.getElementById('fechaRegistro').value = cliente.fechaRegistro;
    
    // Cambiar título del modal
    document.getElementById('modalClienteLabel').textContent = 'Editar Cliente';
    
    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('modalCliente'));
    modal.show();
}

function eliminarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;
    
    Swal.fire({
        title: '¿Eliminar cliente?',
        text: `¿Estás seguro de que deseas eliminar a "${cliente.nombre}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            clientes = clientes.filter(c => c.id !== id);
            renderizarTabla();
            
            Swal.fire({
                icon: 'success',
                title: '¡Cliente eliminado!',
                text: 'El cliente ha sido eliminado del sistema.',
                confirmButtonColor: '#0d6efd'
            });
        }
    });
}

// Funciones de validación
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefono(telefono) {
    // Acepta formatos: 1234-5678, 12345678, 1234 5678
    const regex = /^[\d\s-]+$/;
    return regex.test(telefono) && telefono.replace(/[\s-]/g, '').length >= 8;
}

// Resetear formulario cuando se cierra el modal
document.getElementById('modalCliente').addEventListener('hidden.bs.modal', function() {
    document.getElementById('formCliente').reset();
    document.getElementById('clienteId').value = '';
    document.getElementById('modalClienteLabel').textContent = 'Nuevo Cliente';
});