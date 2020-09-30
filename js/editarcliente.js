(function () {
    let DB;
    let idCliente;

    const nombreInput = document.querySelector("#nombre");
    const emailInput = document.querySelector("#email");
    const telefonoInput = document.querySelector("#telefono");
    const empresaInput = document.querySelector("#empresa");

    const formulario = document.querySelector("#formulario");

    document.addEventListener("DOMContentLoaded", () => {
        conectarDB();

        formulario.addEventListener("submit", actualizarCliente);

        const URL = new URLSearchParams(window.location.search);
        idCliente = URL.get("id");

        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open("crm", 1);

        abrirConexion.onerror = function (e) {
            alert(`Database error: ${e.target.errorCode}`);
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        };
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(["crm"], "readonly");
        const objectStore = transaction.objectStore("crm");

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        };
    }

    function actualizarCliente(e) {
        e.preventDefault();

        if (
            nombreInput.value === "" ||
            emailInput.value === "" ||
            empresaInput.value === "" ||
            telefonoInput.value === ""
        ) {
            imprimirAlerta("Todos los campos son obligatorios", "error");
            return;
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente),
        };

        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function () {
            imprimirAlerta("Editado correctamente");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        };

        transaction.onerror = function () {
            imprimirAlerta("Hubo un error editando el cliente", "error");
        };
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }
})();
