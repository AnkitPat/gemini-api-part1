import { useContext, useMemo } from "react";
import { Context } from "../../components/context";
import SingleChatItem from "./component/SingleChatItem";
import {Fab} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';

const ConversationList = () => {
    const {list, updateList} = useContext(Context)
    const navigate = useNavigate()

    const lastItemId = useMemo(() => {
        return list?.length ? list[list.length-1]?.id : 0
    }, [list]);


    return (
        <div className="App conversation-list-container">

            <div className="conversation-list">
                <h2>Conversation List</h2>
                {list.map((item, index)=> <SingleChatItem chat={item} index={index}/>)}
            </div>
            <Fab color="secondary" aria-label="edit" onClick={() => {
                updateList({
                    id: lastItemId+1,
                    type: 'add-new-chat'
                })
                navigate(`/chat/${lastItemId+1}`)
            }}>
                <EditIcon />
            </Fab>
        </div>
    )
}

export default ConversationList;