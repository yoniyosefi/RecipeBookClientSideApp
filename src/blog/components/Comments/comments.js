import React , {useEffect,useContext,useState} from 'react';
import { CardContent, Collapse, TextField } from '@material-ui/core';
import io from "socket.io-client";
import {AuthContext} from '../../../shared/context/auth-context';
import CommentsList from './commentsList';

let socket;
const Comments = props=>{
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);

    //context to auth
    const auth = useContext(AuthContext);

    useEffect(()=>{
        socket= io(process.env.REACT_APP_BACKEND_URL);
        socket.emit('join',{userId:auth.userId,postId:props.postId},()=>{

        })
        return () => socket.disconnect();
    },[]);

    useEffect(()=>{
        socket.on('prevComments',(data)=>{
            console.log(data.comments);
            setMessages([...data.comments]);
        });
    },[messages]);

    useEffect(()=>{
        socket.on('message',(data)=>{
            console.log(data)
            setMessages([...messages,data]);
        });
    },[messages]);
    const sendMessage = e=>{
        if(message.trim()===''){
            return;
        }
        if(message){
            socket.emit('sendComment',message,()=>setMessage(''));
        }

    }
    
    return(
        <Collapse in={props.expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <div style={{margin:'1rem'}}>
                    <TextField variant="outlined" multiline
                    rows={2} value={message} 
                    onChange={(event)=>setMessage(event.target.value)}/>
                    <button type="button" onClick={sendMessage}>SEND</button>
                </div>
                <CommentsList messages={messages}/>
            </CardContent>
        </Collapse>
    )
}

export default Comments;