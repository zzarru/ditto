import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import { useRecoilValue } from "recoil";
import { UserSelector } from "../../recoil/user/userSelector";
import axiosInstance from "../../api/axiosConfig";

const ChatRoom = ({ room, stompClient, setIsOnChat }) => {
  const isActive = room.isActive;
  const roomId = room.roomId;
  const roomName = room.name;
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState("");
  const user = useRecoilValue(UserSelector);
  const senderId = user.memberId;
  const sender = user.nickname;

  const updateChatList = async () => {
    const res = await axiosInstance.get(`/chat/list/${roomId}`);
    setChatList(res.data.data);
  };

  const stompSubscribe = () => {
    if (stompClient !== null) {
      stompClient.subscribe(
        `/sub/chat/room/${roomId}`,
        (response) => {
          const message = JSON.parse(response.body);
          setChatList((prevChatList) => [...prevChatList, message]);
          const chatWindow = document.getElementById("chatWindow");
          chatWindow.scrollTop = chatWindow.scrollHeight;
        },
        { id: "chat" },
      );
    }
  };

  const stompUnsubscribe = () => {
    stompClient.unsubscribe("chat");
  };

  const readChats = async () => {
    await axiosInstance.post(`/chat/list/${roomId}`);
  };

  useEffect(() => {
    updateChatList();
    stompSubscribe();
    return () => {
        readChats();
        stompUnsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    const element = document.querySelector(".bottom");
    if (element) {
      element.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [chatList]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (message != "") {
      const request = {
        type: "TALK",
        roomId: roomId,
        sender: sender,
        senderId: senderId,
        content: message,
        isRead: false,
      };
      stompClient.send(`/pub/chat/message`, {}, JSON.stringify(request));
      setMessage("");
    }
  };

  return (
    <div className=" flex flex-col chatting h-screen bg-white w-full">
      <div onClick={() => setIsOnChat(false)}>
        <Header title={roomName} className="fixed" />
      </div>

      <div className="h-[70%]" style={{ overflowY: "scroll" }}>
        <ul className="w-full pt-5" id="chatWindow">
          {chatList &&
            chatList.length > 0 &&
            chatList.map((chat, index) => (
              <li
                key={index}
                className={`chatbox ${
                  user.memberId === chat.senderId ? "text-right" : "text-left"
                }`}
              >
                {user.memberId !== chat.senderId && ( // 이 부분 추가
                  <div className="chat_user_name text-md font-bold mt-5 ml-5 mr-8">
                    {chat.sender}
                  </div>
                )}
                <div
                  className={`inline-block ${
                    user.memberId === chat.senderId
                      ? "bg-gray-100"
                      : "bg-mainColor"
                  } px-4 py-2 my-1 rounded-3xl border max-w-xs max-h-96 whitespace-pre-wrap ml-5 mr-5`}
                  style={{
                    maxHeight: "auto",
                    maxWidth: "auto",
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                >
                  {chat.content}
                </div>
              </li>
            ))}
          <li className="bottom"></li>
        </ul>
      </div>

      {isActive ? (
        <div
          className=" bg-gray-100 rounded-full"
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            height: "3rem",
          }}
        >
          {/* 채팅 입력 */}
          <input
            type="text"
            className="w-full h-full bg-transparent py-4 pl-4 pr-16"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            style={{ borderRadius: "10px", flexShrink: 0 }}
          />
          {/* 전송 버튼 */}
          <div
            className="inline-block absolute mr-5 top-1/2 transform -translate-y-1/3"
            onClick={handleSendMessage}
            style={{ right: "0%" }}
          >
            전송
          </div>
        </div>
      ) : (
        <div style={{ bottom: 20 }}>상대방이 나가서 비활성된 방입니다.</div>
      )}
    </div>
  );
};

export default ChatRoom;
