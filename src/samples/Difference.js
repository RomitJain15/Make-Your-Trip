import React, { useState } from 'react';
import { diffWordsWithSpace } from 'diff';
import { Grid, TextField, Button, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import {policy} from './policy';

const Difference = () => {
  const [doc1, setDoc1] = useState(policy?.description);
  const [doc2, setDoc2] = useState('');
  const [diff, setDiff] = useState([]);

  const findDiff = () => {
    const differences = diffWordsWithSpace(doc1, doc2);
    setDiff(differences);
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6">Document 1</Typography>
        <TextField
          multiline
          rows={10}
          variant="outlined"
          value={doc1}
          onChange={e => setDoc1(e.target.value)}
          placeholder="Enter document 1"
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6">Document 2</Typography>
        <TextField
          multiline
          rows={10}
          variant="outlined"
          value={doc2}
          onChange={e => setDoc2(e.target.value)}
          placeholder="Enter document 2"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={findDiff}>
          Find Differences
        </Button>
      </Grid>

        <Grid item xs={12} style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
  {diff.map((part, index) => (
    <Chip
      key={index}
      label={part.value}
      style={{
        margin: '2px',
        textDecoration: part.removed ? 'line-through' : 'none',
        backgroundColor: part.added ? '#c8e6c9' : part.removed ? '#ffcdd2' : '#f0f0f0',
        fontWeight: part.added || part.removed ? 'bold' : 'normal',
      }}
    />
  ))}
</Grid>
    </Grid>
  );
};

export default Difference;