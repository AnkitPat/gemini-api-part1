import { IconButton, Input, LinearProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Context } from '../../components/context';
import {useParams} from 'react-router-dom';
import ChatItem from './component/ChatItem';

const SingleConversation = () => {
    const  {list, updateList} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    const [text, setText] = useState('')
    const params = useParams()
    const id = params.id
    const item = useMemo(() => {
        return list.find(item => item.id === Number(id))
    }, [JSON.stringify(list), id]);

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

    const callApi = useCallback(() => {
        setLoading(true);
        setText('');
        fetch(`http://localhost:3001/sendMessage?message=${text}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({history: item.conversation.slice(0, item.conversation?.length - 1)})

        }).then(response => response.json())
        .then(response => {
            setLoading(false);
            updateList({
                type: 'update-chat',
                id: Number(id),
                name: text,
                message: {
                    parts: [{text: response?.message}],
                    role: 'model'
                }
            })
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

  return (
    <div className='App'>
      <div className='chat-list-container'>
        <h2>Conversation Name: {item?.name ?? 'New Chat'}</h2>
        <div className='chat-list' ref={containerRef}>
            {renderChat}
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

export default SingleConversation
