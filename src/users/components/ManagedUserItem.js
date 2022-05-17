import React,{useContext,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { Grid, Typography, CardActions, Button, ButtonGroup, CircularProgress, Dialog, DialogActions, DialogTitle} from '@material-ui/core';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorMessage from '../../shared/components/ErrorMessage';
import {AuthContext} from '../../shared/context/auth-context';

const useStyles = makeStyles((theme) => ({

  root: {
    maxWidth: 250,
    minWidth:250,
   
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const ManagedUserItem = props => {
  //checks if user is blocked
  const [block,setBlock] = useState(props.userStatus==='block');
  //set dialog
  const [open,setOpen]=useState(false);

  //hook to manage url req
  const {isLoading,error,sendRequest} = useHttpClient();
  const classes = useStyles();
  //auth contex
  const auth = useContext(AuthContext);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const blockUserHandler = async ()=>{
    try{
      await sendRequest(`/api/users/block/${props.id}`,'PATCH',null ,{
        Authorization:'Bearer '+auth.token
      })
      setBlock(true);
    }catch(err){

    };
  }

  const unBlockUserHandler = async ()=>{
    try{
      await sendRequest(`/api/users/unBlock/${props.id}`,'PATCH',null ,{
        Authorization:'Bearer '+auth.token
      })
      setBlock(false);
    }catch(err){

    };
  }

  const deleteUserHandler =async ()=>{
    try{
        await sendRequest(`/api/users/${props.id}`,'DELETE',null ,{
          Authorization:'Bearer '+auth.token
        })
        props.removeUserFromList(props.id);
    }catch(err){

    };
  }

  const onToAdminHandler = async ()=>{
    try{
      await sendRequest(`/api/users/toAdmin/${props.id}`,'PATCH',null ,{
        Authorization:'Bearer '+auth.token
      })
      setBlock(false);
      props.removeUserFromList(props.id);
    }catch(err){

    };
  }
  const deleteDialog = (                
    <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Are you sure that you want to delete this user?"}</DialogTitle>
        <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
            CANCEL
        </Button>
        <Button onClick={deleteUserHandler} color="primary" autoFocus>
            DELETE
        </Button>
        </DialogActions>
    </Dialog>)
    
  if(isLoading){
      return <CircularProgress color="primary"/>
  }
  
  return (
  <Grid item  >
        {deleteDialog}
        <Card className={classes.root} variant='outlined'>
        {error&&<ErrorMessage>{error}</ErrorMessage>}
        <CardHeader
            avatar={
            <Avatar alt="P" aria-label="recipe" src={props.imagePath||'https://cdn.pixabay.com/photo/2014/04/03/10/32/businessman-310819_960_720.png'} className={classes.avatar}/>
            }
            title={<Typography  variant='h6'>{props.name}</Typography>}
            subheader={<Typography  >{props.recipes.length} - Recipes</Typography>}
           />

           <CardActions disableSpacing>  
            <ButtonGroup size="small">  
                        {!block&&      
                        <Button
                            onClick={onToAdminHandler}
                            variant="contained"
                            color="primary"
                        >  To Admin
                        </Button>   }
            {block&&          
                        <Button
                            onClick={unBlockUserHandler}
                            variant="outlined"
                            color="default"
                        >  Unblock
                        </Button> }    
            {!block&&          
                        <Button
                            onClick={blockUserHandler}
                            variant="outlined"
                            color="default"
                        >  Block
                        </Button> }
           {props.recipes.length===0&&                  
                        <Button
                            onClick={handleClickOpenDialog}
                            variant="outlined"
                            color="secondary"
                        >  Delete
                        </Button>}   
                        </ButtonGroup>                        
                </CardActions>
        </Card>
    </Grid>
  );
}


export default ManagedUserItem