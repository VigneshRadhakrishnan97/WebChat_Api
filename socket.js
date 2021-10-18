const express = require("express");
const http_server = require("http");
const socket_io = require("socket.io");
const Chat =require("./model/Chat");
const date = require("date-and-time");

const socket=()=>{
    try {

        const app2 = express();
        const server = http_server.createServer(app2);
        const io = socket_io(server, {
          transports: ["websocket", "polling"],
        });
        
        //connection
        io.on("connection", (client) => {
             //console.log("connection"); 

         client.on("user",(user)=>{  
            
             client.join(user);
             //console.log("joined - "+user); 
             io.to(user).emit("connected", user);
             //console.log("emitted " ); 
            //console.log(client.rooms); 
            //client.disconnect();
         });

         //message
         client.on("send",async(message)=>{
             try
             {
             console.log("Message received from client - ");
             console.log(message);
             console.log(client.rooms); 
             const { emailAddress, avatar, id, msg ,name} = message;
             //DB call
            const chats = await Chat.findById(id);
            if(!chats)
            return io.to(emailAddress).emit("errors", "Chat does not exist");
             let chat = {
               email: emailAddress,
               name: name,
               avatar: avatar,
               text: msg,
             };
            chats.chat = [...chats.chat, chat];
            await chats.save();

            const now = new Date();
            const value = date.format(now, "YYYY/MM/DD HH:mm:ss");
            chat = { ...chat, date:value,chat_id:id };
            io.to(chats.creator).emit("message", chat);
             chats.users.forEach(user => {
                 console.log(user);
                  io.to(user).emit("message", chat);
             });
            
             }
             catch(error)
             {
                 return io.to(emailAddress).emit("errors", error);
             }
         });

         //disconnect
         client.on("discon",(user)=>{
             console.log("disco"+user);
             io.to(user).emit("disconnected", "disconected");
             client.leave(user);
         });

         //client.disconnect();
 
        });
        const PORT = process.env.PORT || 5001;
        server.listen(PORT, () => {
          console.log("Socket listening over port " + PORT);
        });
    } catch (error) {
        console.log(error)
    }


}

module.exports = socket;