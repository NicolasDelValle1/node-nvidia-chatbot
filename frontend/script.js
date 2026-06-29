const usuario = "nicolas";


const input = document.getElementById("mensaje");


input.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        enviarMensaje();

    }

});



async function enviarMensaje(){


    const texto = input.value.trim();


    if(!texto) return;



    mostrarMensaje(texto,"usuario");


    input.value="";



    const cargando = mostrarMensaje(
        "Pensando...",
        "ia"
    );



    try {


        const respuesta = await fetch(
            "http://localhost:3000/chat",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({

                    userId:usuario,

                    mensaje:texto

                })

            }
        );



        const datos = await respuesta.json();



        cargando.remove();



        mostrarMensaje(
            datos.respuesta,
            "ia"
        );



    }catch(error){


        cargando.remove();


        mostrarMensaje(
            "Error conectando con el servidor",
            "ia"
        );


        console.error(error);


    }


}



function mostrarMensaje(texto,tipo){

    const chat =
    document.getElementById("chat");


    const div =
    document.createElement("div");


    div.classList.add(
        "mensaje",
        tipo
    );


    div.innerHTML = tipo === "ia"
        ? marked.parse(texto)
        : texto;


    chat.appendChild(div);


    chat.scrollTop =
    chat.scrollHeight;


    return div;

}