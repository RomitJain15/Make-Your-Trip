import { ChatContainer, MainContainer, Message, MessageInput, MessageList, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import React, { useState } from 'react';

const ChatGPT = ({ onSave }) => {
  const [messages, setMessages] = useState([
    {
      message: 'Hello! How can I help you today?\nEnter 1 to Add new holiday\nEnter 2 to ask a question',
      sender: 'ChatGPT',
      direction: 'incoming'
    }
  ]);
  const [typing, setTyping] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [userAskingQuestion, setUserAskingQuestion] = useState(false);

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  //chatgpt
  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing'
    }
    if (message === '1') {
      setUserMessage('addHoliday')
      setMessages(
        [...messages, newMessage, {
          message: "Sure! Please enter the name of the city you are interested in:",
          sender: "ChatGPT",
          direction: 'incoming'
        }]
      );
      setUserAskingQuestion(true);
      return;
    }
    else if (message === '2') {
      setUserMessage('');
      setMessages(
        [...messages, newMessage, {
          message: "Hello! I'm your tourist guide today. Where would you like to go exploring?",
          sender: "ChatGPT",
          direction: 'incoming'
        }]
      );
      setUserAskingQuestion(true);
      return;
    }
    else {
      if (userAskingQuestion == false) {
        setMessages(
          [...messages, newMessage, {
            message: "Invalid Input.\nPlease enter 1 to Add new holiday\n2 to ask a question",
            sender: "ChatGPT",
            direction: 'incoming'
          }]
        );
        return;
      }
    }
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await (processMessageToChatGPT(newMessages))
  };

  async function processMessageToChatGPT(chatMessage) {
    let apiMessages = chatMessage.map((messageObject) => {
      let role = "";
      if (messageObject.sender == "ChatGPT") {
        role = "assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message }
    }
    );

    const systemMessage = {
      role: "system",
      content: "I am a travel agent and i always give my responses relating to tourist destinations. When user enters a city i respond by creating a json object without linebreak for storing in mongodb with following fields: city, country, duration, description, price as number, deal(boolean), and if deal is true then dealDetails, and i dont provide any other text. If the user asks for multiple cities then make it a json object as an array as [ {},{} etc.]. If the user asks for a question, i respond as a tourist guide and dont answer in json"
    }

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      // model: "Travel",
      messages: [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      console.log("CHATGPT", data);
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages(
        [...chatMessage, {
          message: data.choices ? data.choices[0].message.content : "Something went wrong. Please try again.",
          sender: "ChatGPT",
          direction: 'incoming'
        }]
      );
      if (userMessage === 'addHoliday') {
        if (data.choices) {
          onSave(data.choices[0].message.content);
        }
        setUserMessage('');
        setUserAskingQuestion(false);
      }
      setTyping(false);
    });
  }



  return (

    <div className='GPT'>
      <div style={{ position: 'relative', height: '500px' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content='ChatGPT is typing...' /> : null}
            >
              {messages.map((message, index) => {
                return <Message key={index} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type Message Here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );

};

export default ChatGPT;