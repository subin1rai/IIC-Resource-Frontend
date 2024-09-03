import React, { useEffect, useState } from "react";
import chat from "../assets/chatIcon.svg";
import closeIcon from "../assets/whiteClose.svg";
import backIcon from "../assets/whiteBack.svg";
import Messages from "./Messages";
import Conversations from "./Conversations";
import axios from "axios";
import { useSelector } from "react-redux";

const Chat = () => {
  const [chatBoxVisibility, setChatBoxVisibility] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userConversations, setUserConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [initials, setInitials] = useState("");

  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;
  const role = userInfo.role;

  const handleChatBoxVisibility = () => {
    setChatBoxVisibility(!chatBoxVisibility);
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/message/allUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (role === "departmenthead") {
          setUserConversations(
            response.data.allUser.filter(
              (user) => user.role === "admin" || user.role === "superadmin"
            )
          );
        } else if (role === "superadmin" || role === "admin") {
          setUserConversations(
            response.data.allUser.filter(
              (user) => user.role === "departmenthead"
            )
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (chatBoxVisibility) {
      getUsers();
    }
  }, [chatBoxVisibility, token]);

  const filteredConversations = userConversations.filter((conversation) =>
    conversation.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <img
        src={chat}
        alt="Chat"
        className="w-16 h-16 cursor-pointer"
        onClick={handleChatBoxVisibility}
      />

      {chatBoxVisibility && (
        <div className="absolute bg-background h-[500px] w-[380px] -bottom-0.5 -right-0.5 rounded-md overflow-hidden">
          <div className="h-12 w-full bg-button px-3 flex justify-between items-center sticky">
            <h3 className="flex items-center h-full gap-2 justify-center">
              {selectedConversation ? (
                <>
                  <img
                    src={backIcon}
                    alt="back"
                    className="h-5 w-5 cursor-pointer"
                    onClick={handleBackToConversations}
                  />
                  <span className="font-semibold text-white">
                    {selectedConversation.user_name}
                  </span>
                </>
              ) : (
                <p className="font-medium text-white px-1">Conversations</p>
              )}
            </h3>
            <img
              src={closeIcon}
              alt="Close"
              className="cursor-pointer w-6 h-6"
              onClick={() => setChatBoxVisibility(false)}
            />
          </div>
          <div className="flex w-full h-[455px] flex-col overflow-auto gap-1 p-2">
            {selectedConversation ? (
              <Messages
                conversation={selectedConversation}
                onBack={handleBackToConversations}
              />
            ) : (
              <>
                {userConversations.length > 0 && (
                  <input
                    type="text"
                    placeholder="Search Conversations"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2 p-2  outline-none rounded-md"
                  />
                )}
                {filteredConversations.map((conversation) => (
                  <div
                    onClick={() => handleConversationClick(conversation)}
                    key={conversation.user_id}
                    className="flex flex-col "
                  >
                    <Conversations conversation={conversation} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
