const client = require("./ai");

const conversaciones = {};

// Chat normal
async function enviarMensaje(userId, texto) {

    if (!conversaciones[userId]) {
        conversaciones[userId] = [
            {
                role: "system",
                content: "Eres un asistente de IA. Responde en español. se amable y consiso"
            }
        ];
    }

    conversaciones[userId].push({
        role: "user",
        content: texto
    });

    const respuesta = await client.chat.completions.create({
        model: "deepseek-ai/deepseek-v4-flash",
        messages: conversaciones[userId],
        temperature: 0.5,
        max_tokens: 500
    });

    const textoIA = respuesta.choices[0].message.content;

    conversaciones[userId].push({
        role: "assistant",
        content: textoIA
    });

    return textoIA;
}


// Chat streaming
async function enviarMensajeStream(userId, texto, enviar) {

    if (!conversaciones[userId]) {
        conversaciones[userId] = [
            {
                role: "system",
                content: "Eres un asistente de IA. Responde en español. se amable y consiso"
            }
        ];
    }

    conversaciones[userId].push({
        role: "user",
        content: texto
    });

    const respuesta = await client.chat.completions.create({
        model: "deepseek-ai/deepseek-v4-flash",
        messages: conversaciones[userId],
        temperature: 0.5,
        max_tokens: 500,
        stream: true
    });

    let completa = "";

    for await (const parte of respuesta) {

        const contenido = parte.choices[0]?.delta?.content;

        if (contenido) {
            completa += contenido;
            enviar(contenido);
        }
    }

    conversaciones[userId].push({
        role: "assistant",
        content: completa
    });
}


module.exports = {
    enviarMensaje,
    enviarMensajeStream,
    conversaciones
};