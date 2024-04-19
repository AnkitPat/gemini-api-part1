import { IconButton, Input, LinearProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Context } from '../../components/context';
import {useParams} from 'react-router-dom';
import ChatItem from './component/ChatItem';

const SingleConversationStream = () => {
    const  {list, updateList} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const [streamData, setStreamData] = useState('');

    const [text, setText] = useState('')
    const params = useParams()
    const id = params.id
    const item = useMemo(() => {
        return list.find(item => item.id === Number(id))
    }, [JSON.stringify(list), id]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //           const response = await fetch('http://localhost:3001/sendmessagestream?message=Tell me about india', {
    //             body: JSON.stringify({history: []}),
    //             method: 'POST'
    //           });
    //           const reader = response.body.getReader();
    //           let result = '';
              
    //           const processStream = async () => {
    //             while (true) {
    //               const { done, value } = await reader.read();
    //               if (done) break;
    //               result += new TextDecoder().decode(value);
    //               console.log(result, value, done)
    //               setStreamData(result);
    //             }
    //           };
              
    //           processStream();
    //         } catch (error) {
    //           console.error('Error fetching data:', error);
    //         }
    //       };
      
    //       fetchData();
    // }, []);

    const renderChat = useMemo(() => {
        return item.conversation?.map(chat => {
            return <ChatItem message={chat.parts?.[0]?.text} sender={chat.role === 'user'} />
        })
    }, [item?.conversation?.length])

    useEffect(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, [item?.conversation?.length]);

      
     const streamDataUpdate = useCallback((text) => {
        return new Promise(resolve => {
            let index = 0;
            console.log(index, text);
            const interval = setInterval(() => {
                if (index < text.length) {
                    setStreamData(prev => {
                        if (prev) return prev + text[index]
                        return text[index]
                    });
                    index++;
                } else {
                clearInterval(interval);
                resolve()
                }
            }, 10);
        })

     }, [setStreamData]); 
    const callApi = useCallback(() => {
        setLoading(true);
        setText('');
        fetch(`http://localhost:3001/sendmessagestream?message=${text}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({history: item.conversation.slice(0, item.conversation?.length - 1)})
        })
        // }).then(response => response.json())
        .then(response => {
            const reader = response.body.getReader();
            let result = '';
            
            const processStream = async () => {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        setStreamData('')
                        updateList({
                            type: 'update-chat',
                            id: Number(id),
                            name: text,
                            message: {
                                parts: [{text: result}],
                                role: 'model'
                            }
                        })
                        break;
                    }
                    result += new TextDecoder().decode(value);
                    await streamDataUpdate(new TextDecoder().decode(value))
                }
            };
            
            processStream();
            setLoading(false);
            
        }).catch(_ => {
            setLoading(false)
        })
    }, [text, item])

    const sendCallback = useCallback(() => {
        updateList({
            type: 'update-chat',
            id: Number(id),
            name: text,
            message: {
                parts: [{text}],
                role: 'user'
            }
        })
        callApi()
    }, [text, id])

    const showProgress = useMemo(() => {
        return loading ? <LinearProgress/> : <></>
    }, [loading]);

    const streamDataRes = useMemo(() => {
        if (!streamData?.length) return <></>
        return <ChatItem message={streamData} sender={false} />
    }, [streamData]);

  return (
    <div className='App'>
      <div className='chat-list-container'>
        <h2>Conversation Name: {item?.name ?? 'New Chat'}</h2>
        <div className='chat-list' ref={containerRef}>
            {renderChat}
            {streamDataRes}
        </div>
        
        <div className='input'>
            {showProgress}
            <div className='chat-input'>
                <Input disabled={loading} value={text} onKeyDown={event => {
                    if (event.key ===  'Enter') {
                        sendCallback()
                    }
                }} onChange={event => setText(event.target?.value)} id="my-input" aria-describedby="my-helper-text" />
                <IconButton disabled={loading} onClick={() => {
                    sendCallback()
                }}
                >
                    <SendIcon/>
                </IconButton>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SingleConversationStream
