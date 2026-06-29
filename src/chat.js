const client = require("./ai");

const conversaciones = {};


async function enviarMensaje(userId, texto) {

    if (!conversaciones[userId]) {

        conversaciones[userId] = [
            {
                role: "system",
                content: `
                Eres un asistente de IA.
                Responde de forma clara y concisa.
                No escribas explicaciones excesivamente largas a menos que el usuario lo solicite.
                Usa ejemplos simples cuando sea necesario.
                Responde en español.
                `
            }
        ];

    }


    conversaciones[userId].push({
        role: "user",
        content: texto
    });


    const respuesta = await client.chat.completions.create({

        model: "meta/llama-3.1-8b-instruct",

        messages: conversaciones[userId],

        temperature: 0.7,

        max_tokens: 300

    });


    const textoIA = respuesta.choices[0].message.content;


    conversaciones[userId].push({
        role: "assistant",
        content: textoIA
    });


    return textoIA;

}


module.exports = {
    enviarMensaje,
    conversaciones
};