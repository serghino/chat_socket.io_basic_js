const hapi = require("hapi");
const io = require("socket.io");
const server = new hapi.Server();

server.connection({port: 3001, host: "localhost"});
//Programacion in LINE.
(async function(){ 
    await server.register(require("inert"));
})().then(()=>init());

var init = () => {
    //Mapear un directory
    server.route({
       method : "GET",
       path : "/assets/{path*}",
       config : {
       handler: {
           directory : {
               path: "./public/"
           }
         }
        }
    });

    server.route({
       method : "GET",
       path : "/",
       config : {
       handler: {
           file : {
               path: "./views/index.html"
           }
         }
        }
    });
    
    //Objeto http server.
    var listener = server.listener;
    //Conexion.
    const socket = io(listener);
    var messages = [];
    //Emit para enviar
    //On para recibir
    socket.on("connection", (client)=>{
        //console.log(`new user connected at ${new Date().toISOString()}`);            
        socket.emit("join", messages);
        client.on("message", (pck)=>{
            messages.push({id : client.id, body: pck});
            //Solo para el cliente.
            //client.emit();
            //Esto es para todos los cliente de mi conexion.
            //socket.sockets.emit();
            console.log(messages);
            client.emit("received", `new user connected at ${new Date().toISOString()}`);
            socket.emit("update", messages);
        })
    });

    server.start(()=>console.log(`the server is running a the port ${server.info.port}`));
}