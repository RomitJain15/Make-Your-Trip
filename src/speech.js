import { useState, useEffect, useRef } from 'react';

export const useSpeechToText = () => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.onstart = () => {
      console.log('Voice is activated, you can speak to microphone.');
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prevMessage => prevMessage + ' ' + transcript);
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current.start();
      }
    };

    recognitionRef.current.onspeechend = () => {
      setIsListening(false);
    };
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  return { message, setMessage, toggleListen, isListening };
};