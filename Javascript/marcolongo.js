document.addEventListener('DOMContentLoaded', iniciarPagina)

function iniciarPagina() {
    //nav oculto mobile
    let nav = document.querySelector("nav")
    let btnMenu = document.getElementById("btnMenu");

    btnMenu.addEventListener("click", toggleMenu);

    function toggleMenu() {
        nav.classList.toggle("show");
    }
    /************************************** partial render **************************************/
    async function render(id) {
        let main = document.querySelector("main");
        main.innerHTML = '<p style="font-size: 4em; background-color: black; color:white;">Cargando...</p>';
        try {
            let response = await fetch(`${window.location.href}/${id}.html`);
            if (response.ok) {
                let content = await response.text();
                main.innerHTML = content;
                document.title = id+(' - Óptica Marcolongo');
                if (id == 'Pedidos') {
                    iniciarPaginaPedidos();
                }
                else if (id == 'Intranet') {
                    iniciarPaginaIntranet();
                }
            }
            else
                main.innerHTML = `Error al cargar la página ${id}...`;
        }
        catch (error) {
            main.innerHTML = error;
        };
    }

    render('Inicio');

    let navItems = document.querySelectorAll('.navItem');
    navItems.forEach(i => i.addEventListener('click', (e) => {
        render(e.currentTarget.id)
    }));

    /************************************** pedidos **************************************/
    function iniciarPaginaPedidos() {
        //texto aleatorio longitud: largo
        function textoAleatorio(largo) {
            let letras = ['a', 'b', 'c', 'd', '1', '2', '3', 'q', 'w'];
            let texto = '';
            for (i = 1; i <= largo; i++) {
                let index = Math.floor(Math.random() * (letras.length - 0) + 0);
                let letra = letras[index];
                texto = texto + letra;
            }
            return texto;
        }
        //escribe texto aleatorio en el captcha
        function escribirCaptcha() {
            let captcha = document.getElementById("captcha");
            captcha.innerHTML = textoAleatorio(6);
        }
        //compara los textos
        function procesarCaptcha() {
            let contenedor = document.getElementById("validez");
            let captcha = document.getElementById("captcha");
            let formCaptcha = document.getElementById("RTA_captcha").value;
            if (captcha.textContent == formCaptcha) {
                contenedor.innerHTML = "Captcha correcto";
            }
            else {
                contenedor.innerHTML = "Captcha incorrecto";
            }
        }

        escribirCaptcha();

        let form = document.querySelector("form");
        form.addEventListener("submit", e => {
            e.preventDefault()
        })

        let btnEnviar = document.getElementById("btnEnviar");

        btnEnviar.addEventListener("click", procesarCaptcha);

        let btnRecarga = document.getElementById("btnRecarga");
        btnRecarga.addEventListener('click', escribirCaptcha);
    }

    /********************************** intranet **********************************/
    function iniciarPaginaIntranet() {

        let arreglito = [];

        const url = 'https://636555b7f711cb49d1fba72d.mockapi.io/api/clientes';

        let tablaHead = document.getElementById('tablaHead');
        tablaHead.innerHTML = '<tr><th>ID</th><th>Nombre</th><th>Telefono</th><th>Email</th><th>Producto</th><th>Ticket</th><th></th></tr>';

        let tablaBody = document.getElementById('tablaBody');

        let pagina=1;
        const limite=8;
        async function mostrarTabla(pagina) {
            tablaBody.innerHTML = '';
            try {
                let res = await fetch(`${url}/?page=${pagina}&limit=${limite}`);
                arreglito = await res.json();
                console.table(arreglito);
                for (let i = 0; i < arreglito.length; i++) {
                    let id = parseInt(arreglito[i].id);
                    tablaBody.innerHTML +=
                        `<tr><td>${arreglito[i].id}</td>
                            <td>${arreglito[i].nombre}</td>
                            <td>${arreglito[i].telefono}</td>
                            <td>${arreglito[i].email}</td>
                            <td>${arreglito[i].producto}</td>
                            <td>${arreglito[i].ticket}</td>
                            <td><button class="borrador" data-number="${id}" type="button">X</button>
                                <button class="editor" data-number="${id}" type="button">E</button></td></tr>`;
                    if (arreglito[i].ticket>=450)
                        tablaBody.lastChild.classList.add('destacados');
                }
                creaBotones();
            }
            catch (error) {
                console.log(error);
            }
            
            if (arreglito.length<limite)
                btn_siguiente.setAttribute("disabled", "");
            else
                btn_siguiente.removeAttribute("disabled", "");

            if (pagina>1)
                btn_anterior.removeAttribute("disabled", "");
            else
                btn_anterior.setAttribute("disabled", "");
        }
        
        let btn_anterior = document.getElementById('anterior');
        btn_anterior.addEventListener('click', ()=> {
            mostrarTabla(--pagina);
        });
        let btn_siguiente = document.getElementById('siguiente');
        btn_siguiente.addEventListener('click', ()=> {
            mostrarTabla(++pagina);
        });
        
        function creaBotones() {
            let borradores = document.querySelectorAll('.borrador');
            borradores.forEach(b => b.addEventListener('click', (e) => {
                borrarFila(e)
            }));
            let editores = document.querySelectorAll('.editor');
            editores.forEach(b => b.addEventListener('click', (e) => {
                cargaEdit(e)
            }));
        }

        let ID = document.getElementById('ID');
        let nombre = document.getElementById('nombre');
        let telefono = document.getElementById('telefono');
        let email = document.getElementById('email');
        let producto = document.getElementById('producto');
        let ticket = document.getElementById('ticket');

        async function cargaEdit(e){
            console.log(e.target.dataset.number);
            console.log(arreglito[e.target.dataset.number]);
            try {
                let res = await fetch(`${url}/${e.target.dataset.number}`);
                let jason = await res.json();
                if (res.ok) {
                    ID.value = jason.id;
                    nombre.value = jason.nombre;
                    telefono.value = jason.telefono;
                    email.value = jason.email;
                    producto.value = jason.producto;
                    ticket.value = jason.ticket;
                }
            }
            catch (error){
                console.log(error);
            }
        }

        async function enviaDato(e) {
            e.preventDefault()

            if (nombre.value == '' || telefono.value == '' || email.value == '' || producto.value == '' || ticket.value == '')
                alert("falta completar");
            else {
                let cliente = {
                    "nombre": nombre.value,
                    "telefono": telefono.value,
                    "email": email.value,
                    "producto": producto.value,
                    "ticket": ticket.value
                }
                console.log(cliente);
                let res;
                try {
                    /********************* agregar *********************/
                    if (e.currentTarget == btnAgregar) {
                        res = await fetch(url, {
                            "method": "POST",
                            "headers": { "Content-type": "application/json" },
                            "body": JSON.stringify(cliente)
                        })
                    }
                    /********************* agregar por 3 *********************/
                    else if (e.currentTarget == btnAgregarX3) {
                        for (let i = 0; i < 3; i++) {
                            res = await fetch(url, {
                                "method": "POST",
                                "headers": { "Content-type": "application/json" },
                                "body": JSON.stringify(cliente)
                            })
                        }
                    }
                    /********************* modificar *********************/
                    else {
                        if (e.currentTarget == btnModificar) {
                            if (ID.value != '') {
                                res = await fetch(url + "/" + ID.value, {
                                    "method": "PUT",
                                    "headers": { "Content-type": "application/json" },
                                    "body": JSON.stringify(cliente)
                                })
                            }
                            else (alert('escribir id para modificar'));
                        }
                    }
                    if (res.ok) {
                        mostrarTabla(pagina);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }

        let btnAgregarX3 = document.getElementById('btnAgregarX3');
        btnAgregarX3.addEventListener('click', enviaDato);

        let btnModificar = document.getElementById('btnModificar');
        btnModificar.addEventListener('click', enviaDato);

        async function borrarFila(e) {
            try {
                let res = await fetch(url + "/" + e.target.dataset.number, {
                    "method": "DELETE"
                })
                if (res.ok) {
                    console.log("id " + e.target.dataset.number + " borrado");
                    mostrarTabla(pagina);
                }
            } catch (error) {
                console.log(error);
            }
            
        }

        let btnAgregar = document.getElementById('btnAgregar');
        btnAgregar.addEventListener('click', enviaDato);

        mostrarTabla(pagina);

    }
}