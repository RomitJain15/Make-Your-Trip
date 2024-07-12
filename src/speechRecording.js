import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useSpeechToText } from './speech';

const SpeechRecorder = () => {
  const { message, setMessage, toggleListen, isListening } = useSpeechToText(); // Include setMessage here
  const { transcript } = useSpeechToText();
  return (
    <Grid>
      <div>
      <TextField

multiline
rows={10}
style={{ width: '15em' }}
value={message}
variant="outlined"
onChange={e => setMessage(e.target.value)}
/>

<Button
variant="contained"
color={isListening ? "secondary" : "primary"}
onClick={toggleListen}
startIcon={isListening ? <StopIcon /> : <MicIcon />}
>

{isListening ? 'Stop' : 'Start'}

</Button>
      </div>
    </Grid>
  );
}

export default SpeechRecorder;