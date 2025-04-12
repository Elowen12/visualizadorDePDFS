class visualizadorPDF {
    constructor(ruta, tema = "basico", ancho = 800, alto = 1200) {
        this.ruta = ruta;
        this.ancho = ancho;
        this.alto = alto;
        this.tema = tema;
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        this.scale = 1; // Escala inicial para el zoom
        this.MostrarTexto = false; // Estado inicial del botón Mostrar Texto
    }

    MostrarPDF(contenedor, pagina) {
        this.pdfjsLib.getDocument(this.ruta).promise.then((pdf) => {
            this.totalPaginas = pdf.numPages;
            this.paginaActual = pagina;

            const cont = document.getElementById(contenedor);
            cont.innerHTML = "";

            const contenido = document.createElement("div");
            contenido.id = "visualizador";
            contenido.classList.add(this.tema === "basico" ? "visualizador" : "visualizadorDark");

            const formPagina = document.createElement("div");
            formPagina.id = "formPaginas";

            const pa = document.createElement("span");
            pa.textContent = "Pagina Actual: ";

            const inpPA = document.createElement("input");
            inpPA.type = "text";
            inpPA.value = this.paginaActual;

            const pT = document.createElement("span");
            pT.textContent = "/" + this.totalPaginas;

            const divBotonera = document.createElement("div");
            divBotonera.id = "botonera";

            const btnZoomIn = document.createElement("button");
            btnZoomIn.textContent = "Zoom +";

            const btnZoomOut = document.createElement("button");
            btnZoomOut.textContent = "Zoom -";

            const btnPaginaAnterior = document.createElement("button");
            btnPaginaAnterior.textContent = "Anterior";

            const btnPaginaSiguiente = document.createElement("button");
            btnPaginaSiguiente.textContent = "Siguiente";

            const btnVerTexto = document.createElement("button");
            btnVerTexto.textContent = "Mostrar Texto";

            const divTexto = document.createElement("div");
            const pTexto = document.createElement("p");
            pTexto.id = "pTexto";
            pTexto.style.display = "none"; // Ocultar el texto por defecto

            formPagina.appendChild(pa);
            formPagina.appendChild(inpPA);
            formPagina.appendChild(pT);

            contenido.appendChild(formPagina);

            divBotonera.appendChild(btnZoomIn);
            divBotonera.appendChild(btnZoomOut);
            divBotonera.appendChild(btnPaginaAnterior);
            divBotonera.appendChild(btnPaginaSiguiente);
            divBotonera.appendChild(btnVerTexto);
            contenido.appendChild(divBotonera);

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = this.alto;
            canvas.width = this.ancho;

            contenido.appendChild(canvas);
            contenido.appendChild(divTexto);
            divTexto.appendChild(pTexto);

            cont.appendChild(contenido);

            const paginaARenderizar = (page) => {
                const viewport = page.getViewport({ scale: this.scale });
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                page.render(renderContext);

                page.getTextContent().then((textContent) => {
                    let texto = "";
                    textContent.items.forEach((item) => {
                        texto += item.str + "<br>";
                    });
                    pTexto.innerHTML = texto;
                });
            };

            const cargarPagina = (NumeroPagina) => {
                if (NumeroPagina > 0 && NumeroPagina <= this.totalPaginas) {
                    this.paginaActual = NumeroPagina;
                    pdf.getPage(this.paginaActual).then(paginaARenderizar);
                    inpPA.value = this.paginaActual;
                } else {
                    alert("Número de página inválido.");
                }
            };

            cargarPagina(this.paginaActual);

            inpPA.addEventListener("change", (e) => {
                const nuevaPagina = parseInt(e.target.value, 10);
                cargarPagina(nuevaPagina);
            });

            btnZoomIn.addEventListener("click", () => {
                this.scale += 0.1;
                cargarPagina(this.paginaActual);
            });

            btnZoomOut.addEventListener("click", () => {
                if (this.scale > 0.2) {
                    this.scale -= 0.1;
                    cargarPagina(this.paginaActual);
                }
            });

            btnPaginaAnterior.addEventListener("click",()=>{
                if(this.paginaActual > 0){
                    this.paginaActual -= 1;

                    if(this.paginaActual == 0 ){
                        this.paginaActual = 1
                    }

                    cargarPagina(this.paginaActual)
                    inpPA.value = this.paginaActual
                    
                }
            });

            btnPaginaSiguiente.addEventListener("click",()=>{
                if(this.paginaActual > 0 && this.paginaActual <= this.totalPaginas){
                    this.paginaActual += 1;
                    if(this.paginaActual > this.totalPaginas){
                        this.paginaActual = this.totalPaginas
                    }
                    cargarPagina(this.paginaActual)
                    inpPA.value = this.paginaActual
                    
                }
            });

            btnVerTexto.addEventListener("click", () => {
                if (this.MostrarTexto === false) {
                    canvas.style.display = "none";
                    pTexto.style.display = "block";
                    btnZoomIn.style.display = "none"
                    btnZoomOut.style.display = "none"
                    btnVerTexto.textContent = "Mostrar Documento";
                    this.MostrarTexto = true;
                } else {
                    canvas.style.display = "block";
                    pTexto.style.display = "none";
                     btnZoomIn.style.display = "inline-block"
                    btnZoomOut.style.display =  "inline-block"
                    btnVerTexto.textContent = "Mostrar Texto";
                    this.MostrarTexto = false;
                }
            });
        });
    }
}
