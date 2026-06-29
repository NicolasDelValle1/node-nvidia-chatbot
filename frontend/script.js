const usuario = "nicolas";


const input = document.getElementById("mensaje");



input.addEventListener("keypress",function(event){


    if(event.key==="Enter" && !event.shiftKey){

        event.preventDefault();

        enviarMensaje();

    }


});




async function enviarMensaje(){


    const texto=input.value.trim();


    if(!texto)return;



    mostrarMensaje(texto,"usuario");


    input.value="";



    const mensajeIA=mostrarMensaje(
        "✨",
        "ia"
    );



    let respuestaCompleta="";



    try{


        const respuesta=await fetch(

            "https://chatbot-08o8.onrender.com/chat-stream",

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



        const reader=respuesta.body.getReader();

        const decoder=new TextDecoder();



        let buffer="";



        while(true){


            const {done,value}=await reader.read();


            if(done)break;



            buffer+=decoder.decode(
                value,
                {
                    stream:true
                }
            );



            const eventos=buffer.split("\n\n");


            buffer=eventos.pop();



            eventos.forEach(evento=>{


                if(evento.startsWith("data:")){


                    const contenido=
                    evento.replace("data: ","");



                    const json=
                    JSON.parse(contenido);



                    respuestaCompleta+=json.token;



                    let limpio=
                    respuestaCompleta
                    .replace(/\s+\./g,".")
                    .replace(/\s+,/g,",")
                    .replace(/\s+:/g,":")
                    .replace(/\s+\?/g,"?")
                    .replace(/\s+!/g,"!")
                    .replace(/\s+/g," ");



                    mensajeIA.innerHTML=
                    marked.parse(limpio);



                }


            });



            const chat=document.getElementById("chat");


            chat.scrollTop=chat.scrollHeight;


        }



    }catch(error){


        console.error(error);


        mensajeIA.textContent=
        "❌ Error conectando con la IA";


    }


}




function mostrarMensaje(texto,tipo){


    const chat=document.getElementById("chat");


    const div=document.createElement("div");


    div.classList.add(
        "mensaje",
        tipo
    );



    div.innerHTML=texto;



    chat.appendChild(div);



    chat.scrollTop=chat.scrollHeight;



    return div;


}