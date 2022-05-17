import React, { useState,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography, CardContent, 
        CardActions, ButtonGroup, Button, Divider, 
        Avatar, CardHeader, Badge, IconButton, Menu, MenuItem, 
        CardMedia, 
        Collapse} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
//import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import Fade from '@material-ui/core/Fade';
import EditPost from './EditPost';
import clsx from 'clsx';
import Comments from './Comments/comments';


const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      
      
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(360deg)',
    },

  }));

const PostItem = props=>{
    const classes = useStyles();
    const [like,setLike] = useState(props.likedByUser);
    const [likeCount,setLikeCount] = useState(props.likes)
    const [expanded, setExpanded] = React.useState(false);
    //context to auth
    const auth = useContext(AuthContext);
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();  
    const [openDialog, setOpenDialog] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  

    const handleClose = ()=>{
      setAnchorEl(false)
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    

    //onDeletePost
    const onDeletePost = async ()=>{
        setAnchorEl(null);
        props.removePost();
    }
    //open edit dialog
    const openEditPostDialog = () => {
        setAnchorEl(null);
        setOpenDialog(true);
      };
    //close dialog  
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    //send like
    const likeTuglle = async ()=>{
 
        try{
            const response = await sendRequest('/api/rooms/like',
                'POST',
                JSON.stringify({
                    like:!like,
                    postId:props.postId
                }),
                {
                    Authorization:'Bearer '+auth.token,
                    'Content-Type':'application/json'
                })
                if(response.like){
                    setLikeCount(prev=>prev+1)
                }else{
                    setLikeCount(prev=>prev-1)
                }
                setLike(response.like);
        }catch(err){
  
        }
    }

    return <Card className={classes.root} style={{margin:'1rem'}}>
                    <EditPost open={openDialog} 
                              handleCloseDialog={handleCloseDialog}
                              text={props.text}
                              imagePath={props.imagePath}
                              postId={props.postId}
                              editPost={props.editPost}/>
                    <Menu 
                        id="fade-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        >
                        <MenuItem  onClick={onDeletePost}>Delete Post</MenuItem>
                        <MenuItem  onClick={openEditPostDialog}>Edit Post</MenuItem>
                    </Menu>
              <CardHeader
                avatar={
                <Avatar alt="P" aria-label="recipe" 
                        src={props.creatorImage} />
                }
                action={
                    auth.userId==props.creatorId?
                    <IconButton  aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                      <MoreHorizOutlinedIcon />
                    </IconButton>:null
                  }
                title={props.creatorName}
                />
                <Divider/>
                <CardContent>
                    <Typography variant="body2" component="p" paragraph={true}>
                        {props.text}
                    </Typography>
                </CardContent>
                {props.imagePath&&
                <CardMedia
                    component="img"
                    image={props.imagePath}
                />}
                <Divider/>
                <CardContent>
                <Badge color="primary" badgeContent={likeCount}>
                     <ThumbUpOutlinedIcon />
                </Badge>
                </CardContent>
                <Divider/>
                <CardActions disableSpacing> 
                  <ButtonGroup size="small">
                      <Button 
                        onClick={likeTuglle}
                        color={like?"primary":"default"}
                        endIcon={<ThumbUpAltIcon/>}>
                          Like
                      </Button>
                      <Button className={clsx(classes.expand, {
                             [classes.expandOpen]: expanded,
                              })}
                              onClick={handleExpandClick}
                              aria-expanded={expanded}
                              aria-label="show more">
                        Comments
                      </Button>
                  </ButtonGroup>
                </CardActions>
                {expanded&&<Comments expanded={expanded} postId={props.postId}/>}
            </Card>
}

export default PostItem;