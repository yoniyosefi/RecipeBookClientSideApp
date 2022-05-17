import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import UserItem from './UserItem';



const UsersList = props=>{
    if(props.items.length===0){
        return(
            <Typography align="center" variant="h4">No users found</Typography>
        )
    } 

    return <Grid container spacing={3} style={{padding:12}}>
        {        
            props.items.map(user=>{
                return <UserItem 
                        key={user.id} 
                        id={user.id}
                        imagePath={process.env.REACT_APP_ASSET_URL+user.imagePath} 
                        name={user.firstName +' ' +user.lastName}
                        recipes={user.recipes.length}
                        />
            })
        }
    </Grid>
}

export default UsersList