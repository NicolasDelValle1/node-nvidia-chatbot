const usuario = "nicolas";
const input = document.getElementById("mensaje");

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        enviarMensaje();
    }
});

function mostrarIndicadorEscritura() {
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.classList.add("typing-indicator");
    div.id = "typing-indicator";
    div.innerHTML = `<span></span><span></span><span></span>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
}

async function enviarMensaje() {
    const texto = input.value.trim();
    if (!texto) return;

    mostrarMensaje(texto, "usuario");
    input.value = "";

    // Mostrar indicador de escritura
    const indicator = mostrarIndicadorEscritura();

    let respuestaCompleta = "";

    try {
        const respuesta = await fetch("https://chatbot-08o8.onrender.com/chat-stream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: usuario,
                mensaje: texto
            })
        });

        // Remover indicador y crear mensaje IA
        indicator.remove();
        const mensajeIA = mostrarMensaje("", "ia");

        const reader = respuesta.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const eventos = buffer.split("\n\n");
            buffer = eventos.pop();

            eventos.forEach(evento => {
                if (evento.startsWith("data:")) {
                    const contenido = evento.replace("data: ", "");
                    if (contenido === "[DONE]") return;

                    respuestaCompleta += contenido;

                    // 🔧 normalizador de texto mejorado
                    let limpio = respuestaCompleta
                        // arregla espacios antes de puntuación
                        .replace(/\s+\./g, ".")
                        .replace(/\s+,/g, ",")
                        .replace(/\s+:/g, ":")
                        .replace(/\s+\?/g, "?")
                        .replace(/\s+!/g, "!")
                        // arregla dobles puntos
                        .replace(/\.\./g, ".")
                        // arregla saltos en listas numeradas
                        .replace(/(\d+)\.\s*/g, "\n$1. ")
                        // limpia espacios múltiples
                        .replace(/\s+/g, " ")
                        // arregla puntos seguidos de mayúscula (puntos finales)
                        .replace(/\. ([a-z])/g, (match, p1) => `. ${p1.toUpperCase()}`)
                        // asegura mayúscula al inicio de cada oración
                        .replace(/(^|\.\s+)([a-z])/g, (match, p1, p2) => `${p1}${p2.toUpperCase()}`);

                    // Procesar markdown con marked
                    mensajeIA.innerHTML = marked.parse(limpio);

                    // Aplicar estilos adicionales a los elementos del mensaje
                    const preElements = mensajeIA.querySelectorAll('pre');
                    preElements.forEach(pre => {
                        pre.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        pre.style.padding = '16px 20px';
                        pre.style.borderRadius = '12px';
                        pre.style.overflowX = 'auto';
                        pre.style.margin = '10px 0';
                        pre.style.border = '1px solid rgba(255, 255, 255, 0.06)';
                    });

                    const codeElements = mensajeIA.querySelectorAll('code');
                    codeElements.forEach(code => {
                        if (!code.parentElement.matches('pre')) {
                            code.style.backgroundColor = 'rgba(118, 185, 237, 0.08)';
                            code.style.padding = '2px 8px';
                            code.style.borderRadius = '6px';
                            code.style.color = '#76b9ed';
                            code.style.fontFamily = "'JetBrains Mono', 'Fira Code', 'Consolas', monospace";
                        }
                    });

                    const strongElements = mensajeIA.querySelectorAll('strong');
                    strongElements.forEach(strong => {
                        strong.style.color = '#76b9ed';
                    });

                    const linkElements = mensajeIA.querySelectorAll('a');
                    linkElements.forEach(link => {
                        link.style.color = '#4a9eff';
                        link.style.textDecoration = 'none';
                    });

                    const blockquoteElements = mensajeIA.querySelectorAll('blockquote');
                    blockquoteElements.forEach(blockquote => {
                        blockquote.style.borderLeft = '3px solid #4a9eff';
                        blockquote.style.paddingLeft = '16px';
                        blockquote.style.margin = '10px 0';
                        blockquote.style.color = '#b0b0c0';
                    });

                    const headingElements = mensajeIA.querySelectorAll('h1, h2, h3, h4');
                    headingElements.forEach(heading => {
                        heading.style.color = '#76b9ed';
                        heading.style.margin = '12px 0 6px 0';
                    });

                    const listElements = mensajeIA.querySelectorAll('ul, ol');
                    listElements.forEach(list => {
                        list.style.margin = '8px 0';
                        list.style.paddingLeft = '24px';
                    });

                    const listItemElements = mensajeIA.querySelectorAll('li');
                    listItemElements.forEach(li => {
                        li.style.margin = '4px 0';
                    });

                    const paragraphElements = mensajeIA.querySelectorAll('p');
                    paragraphElements.forEach(p => {
                        p.style.margin = '6px 0';
                    });

                    if (paragraphElements.length > 0) {
                        paragraphElements[0].style.marginTop = '0';
                        paragraphElements[paragraphElements.length - 1].style.marginBottom = '0';
                    }
                }
            });

            const chat = document.getElementById("chat");
            chat.scrollTop = chat.scrollHeight;
        }

    } catch (error) {
        console.error(error);
        indicator.remove();
        const mensajeError = mostrarMensaje("❌ Error conectando con la IA", "ia");
        mensajeError.style.color = '#ff6b6b';
        mensajeError.style.border = '1px solid rgba(255, 107, 107, 0.2)';
        mensajeError.style.backgroundColor = 'rgba(255, 107, 107, 0.05)';
    }
}

function mostrarMensaje(texto, tipo) {
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.classList.add("mensaje", tipo);

    if (tipo === "ia" && texto === "") {
        div.innerHTML = '';
    } else if (tipo === "ia") {
        div.innerHTML = marked.parse(texto);
    } else {
        div.textContent = texto;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
}

// Función para limpiar el chat (opcional)
function limpiarChat() {
    const chat = document.getElementById("chat");
    chat.innerHTML = '';
    // Mensaje de bienvenida
    const bienvenida = mostrarMensaje("👋 ¡Hola! Soy tu asistente IA hecho por Nicox. ¿En qué puedo ayudarte?", "ia");
    bienvenida.style.background = 'rgba(118, 185, 237, 0.05)';
    bienvenida.style.border = '1px solid rgba(118, 185, 237, 0.1)';
}

// Auto-enfoque en el input al cargar
document.addEventListener('DOMContentLoaded', () => {
    input.focus();
    // Mensaje de bienvenida inicial
    if (document.getElementById("chat").children.length === 0) {
        const bienvenida = mostrarMensaje("👋 ¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte?", "ia");
        bienvenida.style.background = 'rgba(118, 185, 237, 0.05)';
        bienvenida.style.border = '1px solid rgba(118, 185, 237, 0.1)';
    }
});

// Comando para limpiar chat (escribe "clear" en la consola si quieres)
console.log('💬 Chat IA cargado. Escribe "limpiarChat()" en consola para reiniciar.');