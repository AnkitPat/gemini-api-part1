import logo from './logo.svg';
import './App.css';
import { useCallback, useMemo, useState } from 'react';
import {CircularProgress} from '@mui/material'

function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [enteredText, setEnteredText] = useState('');
  const callGemini = useCallback(() => {
    setLoading(true);
    fetch(`http://localhost:3001/generateContent?text=${enteredText}`).then(response => response.json()).then(finalResponse => {
      console.log(finalResponse);
      setResponse(finalResponse)
      setLoading(false);
      setEnteredText('');
    }).catch(_ => {
      setLoading(false)
      setResponse('')
      setEnteredText('');
    })
  }, [enteredText]);

  const changeEventCallback = useCallback((event) => {
    setEnteredText(event.target?.value ?? '');
  }, [])
  
  const buttonText = useMemo(() => {
    return loading? <CircularProgress size={10} /> : 'Hit!!';
  }, [loading]);

  return (
    <div className="App">
      <div className='container'>
        <span>Please enter any text. When done click on Hit</span>
        <input value={enteredText} type='text' placeholder='Enter any question you like to ask?' onChange={changeEventCallback} />
        <button onClick={callGemini}>{buttonText}</button>
        <p>{response?.message}</p>
      </div>
    </div>
  );
}

export default App;
