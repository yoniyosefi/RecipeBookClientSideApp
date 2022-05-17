import React from 'react';
import CommentItem from './commentItem';
import { Grid } from '@material-ui/core';

const CommentsList = props=>{
    return(
        <div style={{margin:'1rem'}}>
            <Grid>
            {props.messages&&props.messages.map((message)=>{
                return <CommentItem key={message._id} 
                        text={message.text} 
                        firstName={message.user.firstName}
                        lastName={message.user.lastName}/>
            })}
            </Grid>
        </div>

    )
}

export default CommentsList;