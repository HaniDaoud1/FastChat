"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";
import { Pacifico } from "next/font/google";
import { useDispatch,useSelector } from "react-redux";
import { RootState } from "@/app/store/store"; // adapte le chemin selon ton arborescence
import { logout } from "../store/state";
import { SendHorizontal } from 'lucide-react';
import { Trash2 } from 'lucide-react';


const pacifico = Pacifico({
    weight: "400",
    subsets: ["latin"],
  });

// Définir un type Message
type Message = {
  text?: string;
  imageUrl?: string;
  username?: string;
  date?:string;
  _id?: string;
};

const Chat = () => {

    const [openDeleteIndex, setOpenDeleteIndex] = useState<number | null>(null);


      const user = useSelector((state: RootState) => state.user);
      
      const dispatch=useDispatch();
    
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3002", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("messageHistory", (history: Message[]) => {
        setMessages(history.map((msg) => ({
          text: msg.text,
          username: msg.username || "User",
          imageUrl: msg.imageUrl,
          date:msg.date,
          _id: msg._id


          
        }
    )));
      });

    // Ecouter les messages reçus
    socket.on("message", (msg: Message) => {
      console.log("New message:", msg);
      setMessages((prev) => [
        ...prev,
        {
          text: msg.text,
          username: msg.username || "User",
          imageUrl: msg.imageUrl, // Si une image est envoyée, elle est incluse ici
          date:msg.date,
          _id: msg._id

        
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const msg: Message = {
        text: newMessage,
        username: user.userInfo.username, // Le nom de l'utilisateur
        imageUrl:user.userInfo.picturePath,
        date: new Date().toString(), // ✅ ici
    };
      socketRef.current.emit("message", msg); // On envoie le message au serveur
      setNewMessage(""); // On vide le champ de saisie
    }
  };

  const Logout=()=>{
    dispatch(logout());
  }


  const deleteMsg = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3002/deletemessage/${id}`, {
        method: "DELETE",
      });
  
      const response = await res.json();
      if (res.ok) {
        // 🔥 Supprimer le message côté frontend aussi :
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      } else {
        alert(response.error || "Erreur");
      }
      
    } catch (err) {
      alert("Erreur serveur");
    }
  };


  return (
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 30 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{
    duration: 0.9,
    ease: [0.25, 0.8, 0.25, 1], // custom cubic-bezier for smoother easing
  }}
  className="flex flex-col min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 p-4"
>
<div className="flex justify-end">
<button
  onClick={Logout}
  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m4-8V7a2 2 0 10-4 0v1"
    />
  </svg>
  Logout
</button>
  </div>
   {/* Messages */}

   <motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
  className={`${pacifico.className} text-5xl font-semibold text-center mb-2 mt-3 text-[#2ab300] drop-shadow-xl tracking-wider`}
  style={{
    WebkitTextStroke: '1px #208900',
  }}
>
  Fast Chat
</motion.div>

       <div className="flex-1 overflow-y-auto m-auto lg:w-[70%] sm:w-[80%] w-full justify-center space-y-4 pb-28">
        {messages.map((msg, index) => (
          <div
          key={index}
          className={`flex items-end space-x-3 ${
            msg.username === user.userInfo.username ? "justify-end" : "justify-start"
          }`}
        >
            <div className="flex flex-col max-w-[70%]">
          <div className="flex flex-col space-y-1  relative">
            { (
              <span className="text-xs text-gray-500 ml-2">{msg.username}</span>
            )}
    
            <div
              className={`px-4 py-3 flex flex-row items-center rounded-2xl shadow transition-all duration-300 relative ${
                msg.username === user.userInfo.username
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
              onClick={() => {
                if ( msg.username === user.userInfo.username) {
                  setOpenDeleteIndex(index === openDeleteIndex ? null : index);
                }
              }}
            >
             
             {msg.username !== user.userInfo.username && (
      <img
        src={msg.imageUrl || "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"} // ajoute une fallback si vide
        alt="avatar"
        className="h-9 w-9 mr-3 rounded-full"
      />
    )}
    {msg.text && <div>{msg.text}</div>}
    {msg.username === user.userInfo.username && (
      <img
        src={msg.imageUrl || "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"} // ajoute une fallback si vide
        alt="avatar"
        className="h-9 w-9 ml-3 rounded-full"
      />
    )}

              {/* Icône 3 points affichée seulement pour tes messages */}
              {msg.username === user.userInfo.username  && (
  <button
  onClick={() => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce message ?");
    if (confirmDelete && msg._id) {
      deleteMsg(msg._id);
    }
  }}
  className="text-gray-400 hover:text-red-500 text-sm transition"
  title="Supprimer le message"
>
  <Trash2 className="size-5 ml-3" />
</button>
)}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
  {msg.date ? new Date(msg.date).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }) : ""}
</p>         </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[92%] md:w-[80%] bg-white border border-gray-300 shadow-md rounded-full flex items-center px-4 py-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tape un message..."
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 px-2"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition duration-300"
        >
         <SendHorizontal/>
        </button>
      </form>
      </motion.div>  );
};

export default Chat;
