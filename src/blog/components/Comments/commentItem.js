import React from 'react';
import { Paper, Typography } from '@material-ui/core';

const CommentItem = props=>{
    return<Paper style={{margin:'0.5rem'},{maxWidth:'200px'}}>
        <Typography 
            style={{margin:'0.5rem'},{fontWeight:'bold'}}            
            variant="body1" >
                {props.firstName} {props.lastName}
        </Typography>
        <Typography style={{margin:'0.5rem'}} variant="body2" >{props.text}</Typography>
    </Paper>
}



export default CommentItem;