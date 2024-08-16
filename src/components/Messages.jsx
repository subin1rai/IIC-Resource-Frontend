import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Message from "./Message";
import sendIcon from "../assets/sendMessageIcon.svg";

function Messages({ conversation }) {
  const user_id = conversation.user_id;
  const [newMessage, setNewMessage] = useState({
    message: "",
  });
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  const handleChange = (e) => {
    setNewMessage((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8898/api/messages/send/${user_id}`,
        newMessage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage({ message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8898/api/messages/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [user_id, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto px-2 py-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.receiverId === user_id ? "justify-end" : "justify-start"
            } p-2 rounded-md ${
              message.receiverId !== user_id ? "bg-gray-800" : ""
            }`}
          >
            <Message message={message} conversation={conversation} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="relative flex justify-start h-10 items-center bg-white rounded-md mt-2"
        onSubmit={handleSubmit}
      >
        <textarea
          name="message"
          cols="30"
          rows="10"
          className="h-full w-[90%] resize-none outline-none p-2 rounded-md"
          placeholder="Type your message"
          value={newMessage.message}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent adding a new line in the textarea
              handleSubmit(e); // Call the submit function
            }
          }}
        ></textarea>

        <button type="submit" className="right-1 z-20 top-2 absolute">
          <img src={sendIcon} alt="Send" className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
}

export default Messages;
