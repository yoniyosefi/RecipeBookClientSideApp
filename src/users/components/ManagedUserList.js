import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import ManagedUserItem from './ManagedUserItem';



const ManagedUsersList = props=>{
    if(props.items.length===0){
        return(
            <Typography align="center" variant="h4">No users found</Typography>
        )
    } 

    return <Grid container spacing={3} style={{padding:24}}>
        {        
            props.items.map(user=>{
                return <ManagedUserItem 
                        key={user.id} 
                        id={user.id}
                        imagePath={process.env.REACT_APP_ASSET_URL+user.imagePath} 
                        name={user.firstName +' ' +user.lastName}
                        recipes={user.recipes}
                        userStatus={user.userStatus}
                        removeUserFromList={props.removeUserFromList}
                        />
            })
        }
    </Grid>
}

export default ManagedUsersList