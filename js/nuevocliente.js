(function () {
    let DB;

    const formulario = document.querySelector("#formulario");

    document.addEventListener("DOMContentLoaded", () => {
        conectarDB();

        formulario.addEventListener("submit", validarCliente);
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

    function validarCliente(e) {
        e.preventDefault();

        const nombre = document.querySelector("#nombre").value;
        const email = document.querySelector("#email").value;
        const telefono = document.querySelector("#telefono").value;
        const empresa = document.querySelector("#empresa").value;

        if (nombre === "" || email === "" || telefono === "" || empresa === "") {
            imprimirAlerta("Todos los campos son obligatorios", "error");
            return;
        }

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
        };

        cliente.id = Date.now();

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(["crm"], "readwrite");

        const objectStore = transaction.objectStore("crm");

        objectStore.add(cliente);

        transaction.onerror = function () {
            imprimirAlerta("Ha sucedido un error", "error");
        };

        transaction.oncomplete = function () {
            imprimirAlerta("Cliente agregado correctamente");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        };
    }
})();
