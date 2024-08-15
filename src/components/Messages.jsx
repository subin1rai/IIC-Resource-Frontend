import React, { useEffect, useState } from "react";
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

      // Update the messages state with the newly sent message
      setMessages((prevMessages) => [...prevMessages, response.data]);

      // Clear the message input after sending
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

  return (
    <div className="h-full flex flex-col gap-3 py-2">
      <div className="gap-3 flex flex-col h-[90%] justify-end overflow-auto">
        {/* Render messages dynamically here */}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div className="relative flex justify-start h-10 items-center bg-white rounded-md">
        <textarea
          name="message"
          cols="30"
          rows="10"
          className="h-full w-[90%] resize-none outline-none p-2 rounded-md"
          placeholder="Type your message"
          value={newMessage.message} // Bind the state to the textarea value
          onChange={handleChange}
        ></textarea>

        <button className="right-1 z-20 top-2 absolute" onClick={handleSubmit}>
          <img src={sendIcon} alt="Send" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default Messages;
