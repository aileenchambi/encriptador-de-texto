/** Variables para textareas */
const entrada_texto = document.querySelector('.entrada__texto');
const resultado_texto = document.querySelector('.resultado__texto');

/** Variables para botones */
const botonEncriptar = document.getElementById('encriptar')
const botonDesencriptar = document.getElementById('desencriptar');
const botonCopiar = document.getElementById('copiar');
const botonLimpiar = document.getElementById('limpiar');

/* Dicionario de caracteres */
const caracteres = {
    'a': 'ai',
    'e': 'enter',
    'i': 'imes',
    'o': 'ober',
    'u': 'ufat'
};

/** Funciones de inicialización */
document.addEventListener('DOMContentLoaded', () => {
    condicionesIniciales();
    conectarBotones();
});

/** Condiciones iniciales */
function condicionesIniciales() {
    limpiarTextarea('.entrada__texto');
    mostrarElemento('.salida__mensaje');
    ocultarElemento('.salida__resultado');
}

/** Conexión de botones con sus funciones correspondientes */
function conectarBotones() {
    botonEncriptar.addEventListener('click', () => procesarTexto(encriptarTexto));
    botonDesencriptar.addEventListener('click', () => procesarTexto(desencriptarTexto));
    entrada_texto.addEventListener('input', restablecerMensajeValidacion);
    botonCopiar.addEventListener('click', copiarTexto);
    botonLimpiar.addEventListener('click', limpiarResultado);
}

/** Funciones de validación */
function verificarTexto(texto) {
    const regex = /^[a-zñ0-9 \n]*$/;
    return regex.test(texto);
}

function limpiarTexto(texto) {
    return texto.trim();
}

/** Funciones de encriptación y desencriptación*/
function encriptarTexto(texto) {
    let textoEncriptado = [];

    for (let i = 0; i < texto.length; i++) {
        if (texto[i] in caracteres) {
            textoEncriptado.push(caracteres[texto[i]]);
        } else {
            textoEncriptado.push(texto[i]);
        }
    }
    return textoEncriptado.join('');
}

function desencriptarTexto(textoEncriptado) {
    let textoDesencriptado = [];

    for (let i = 0; i < textoEncriptado.length; i++) {
        let caracterDesencriptado = textoEncriptado[i];

        for (let clave in caracteres) {
            const subcadena = textoEncriptado.slice(i, i + caracteres[clave].length);
            if (subcadena === caracteres[clave]) {
                caracterDesencriptado = clave;
                i += caracteres[clave].length - 1;
                break;
            }
        }

        textoDesencriptado.push(caracterDesencriptado);
    }

    return textoDesencriptado.join('');
}

/** Función de procesamiento de texto (encriptar y desencriptar) */
function procesarTexto(funcionProcesar) {
    const texto = limpiarTexto(entrada_texto.value);

    if (!texto || !verificarTexto(texto)) {
        mostrarMensajeValidacion(texto);
        return;
    }

    mostrarResultado(texto, funcionProcesar);
    limpiarTextarea('.entrada__texto')
}

/** Funciones para la validación de mensajes */
function obtenerMensajeValidacion(estado) {
    const mensajes = {
        vacio: {
            mensaje: 'Introduce Texto',
            icono: './assets/icon-alerta-rojo.svg',
            color: '#8a0808'
        },
        invalido: {
            mensaje: 'Solo letras minúsculas, sin acentos ni caracteres especiales',
            icono: './assets/icon-alerta-rojo.svg',
            color: '#8a0808'
        },
        valido: {
            mensaje: 'Solo letras minúsculas, sin acentos ni caracteres especiales',
            icono: 'assets/icon-alerta.svg',
            color: '#000000'
        }
    };

    return mensajes[estado];
}

function aplicarMovimiento(icono, mensaje) {
    icono.classList.add('shake');
    mensaje.classList.add('shake');

    setTimeout(() => {
        icono.classList.remove('shake');
        mensaje.classList.remove('shake');
    }, 500);
}

function mostrarMensajeValidacion(texto) {
    const icono = document.querySelector('.validacion__icono');
    const mensaje = document.querySelector('.validacion__mensaje');
    let config;

    if (!texto) {
        config = obtenerMensajeValidacion('vacio');
        aplicarMovimiento(icono, mensaje);
    } else if (!verificarTexto(texto)) {
        config = obtenerMensajeValidacion('invalido');
        aplicarMovimiento(icono, mensaje);
    } else {
        config = obtenerMensajeValidacion('valido');
    }

    mensaje.textContent = config.mensaje;
    icono.src = config.icono;
    mensaje.style.color = config.color;
}

function restablecerMensajeValidacion() {
    mostrarMensajeValidacion(entrada_texto.value);
}

/**funcion para mostrar el resultado  */
function mostrarResultado(texto, funcion) {
    resultado_texto.value = funcion(texto);
    mostrarElemento('.salida__resultado');
    ocultarElemento('.salida__mensaje');
}

/** Funciones auxiliares */
function mostrarElemento(elemento) {
    document.querySelector(elemento).style.display = 'flex';
}

function ocultarElemento(elemento) {
    document.querySelector(elemento).style.display = 'none';
}

function limpiarTextarea(textarea) {
    document.querySelector(textarea).value = '';
}

/** Función para limpiar el resultado */
function limpiarResultado() {
    limpiarTextarea('.resultado__texto')
    mostrarElemento('.salida__mensaje');
    ocultarElemento('.salida__resultado');
}

/** Funciones para copiar texto */
function mostrarMensaje(texto) {
    const mensaje = document.createElement('div');
    mensaje.textContent = texto;
    mensaje.classList.add('mensaje-emergente');

    document.body.appendChild(mensaje);

    requestAnimationFrame(() => {
        mensaje.classList.add('mostrar');
    });

    setTimeout(() => {
        mensaje.classList.add('ocultar');

        setTimeout(() => mensaje.remove(), 500);

    }, 2000);
}

async function copiarTexto() {
    const texto = resultado_texto.value;
    try {
        await navigator.clipboard.writeText(texto);
        mostrarMensaje('Texto copiado');
    } catch (err) {
        mostrarMensaje('El texto no pudo copiarse');
    }
}
