import {useNavigate} from 'react-router-dom';
import ChatIcon from '@material-ui/icons/Chat';
import {ListItem, ListItemIcon, ListItemText} from '@mui/material'

const SingleChatItem = ({index, chat}) => {
    const navigate = useNavigate()
  return (
    <ListItem key={index} button onClick={() => navigate(`/chat/${chat.id}`)}>
      <ListItemIcon>
        <ChatIcon />
      </ListItemIcon>
      <ListItemText primary={chat.name} />
    </ListItem>
  )
}

export default SingleChatItem;