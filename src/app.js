require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    enviarMensaje,
    enviarMensajeStream,
    conversaciones
} = require("./chat");

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API de IA funcionando 🚀");
});


// CHAT NORMAL
app.post("/chat", async (req, res) => {

    console.log("Chat recibido:", req.body);

    const { userId, mensaje } = req.body;

    const respuesta = await enviarMensaje(userId, mensaje);

    res.json({ respuesta });
});


// STREAMING
app.post("/chat-stream", async (req, res) => {

    console.log("Streaming recibido:", req.body);

    const { userId, mensaje } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    await enviarMensajeStream(userId, mensaje, (token) => {

        // IMPORTANTE: siempre string seguro
        res.write(`data: ${token}\n\n`);

    });

    res.write("data: [DONE]\n\n");
    res.end();
});


// USUARIOS
app.get("/usuarios", (req, res) => {
    res.json({
        usuarios: Object.keys(conversaciones)
    });
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});