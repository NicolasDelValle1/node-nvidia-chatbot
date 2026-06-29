require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { enviarMensaje, conversaciones } = require("./chat");


const app = express();
app.use(cors());


const PORT = 3000;


// Permitir JSON
app.use(express.json());


// Ruta principal
app.get("/usuarios", (req,res)=>{

    res.json({

        usuarios: Object.keys(conversaciones)

    });

});


// Ruta del chat
app.post("/chat", async (req, res) => {

    try {

        const userId = req.body?.userId;
        const mensaje = req.body?.mensaje;


        if (!mensaje) {

            return res.status(400).json({
                error: "Falta el mensaje"
            });

        }


        const respuesta = await enviarMensaje(userId, mensaje);


        res.json({

            respuesta: respuesta

        });


    } catch(error) {


        res.status(500).json({

            error: error.message

        });


    }

});


// Iniciar servidor
app.listen(PORT, () => {

    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);

});