import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '10px 10px 0 10px',
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#c3d6f7',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '10px 10px 10px 0',
  },
}));

const ChatItem = ({ message, sender }) => {
  const classes = useStyles();

  return (
    <div className={sender ? classes.sender : classes.receiver}>
      <Typography variant="body1" component="div">
            {message}
      </Typography>
    </div>
  );
};

export default ChatItem;
