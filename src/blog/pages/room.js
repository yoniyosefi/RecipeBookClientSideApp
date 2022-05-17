import React,{useEffect,useState,useContext} from 'react';
import {useParams} from 'react-router-dom';
import {  Paper, Grid, Card, CardMedia, Typography, CardActionArea, CardContent, TextField, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Post from '../components/post';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import PostList from '../components/PostList';
import ErrorMessage from '../../shared/components/ErrorMessage';

const useStyles = makeStyles({
    root: {
      minWidth:250,
      margin:'10px'
    },
  });

const Room = ()=>{
    const recipeId = useParams().recipeId;
    const classes = useStyles();
    //context to auth
    const auth = useContext(AuthContext);
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();  
    const [loadedRecipe,setLoadedRecipe]= useState();   
    const [room,setRoom] = useState();
    const [posts,setPosts] = useState([]);

    useEffect(()=>{
        const fetchReciep =async ()=>{
            try{
                const responsData = await sendRequest(`/api/rooms/${recipeId}`,'GET',null,
                {
                  Authorization:'Bearer '+auth.token
                }
                );
                setRoom(responsData.room)
                setLoadedRecipe(responsData.recipe);
                setPosts(responsData.posts);
            }catch(err){

            }
        }
        fetchReciep();
      },[sendRequest,recipeId,auth.token]);
      //update the dom when adding post
      const addPost = posts =>{
        if(!posts){
            return;
        }
        const newPosts = [...posts];
        setPosts([...newPosts])
        }
      //remove post
      const onRemovePostHandler = postId=>{
            if(!postId){
                return
            }
            setPosts(prevPosts=>prevPosts.filter(p=>p.id!==postId));

        }  
      //edit post   
      const onEditPost =  post=>{
          if(!post){
              return;
          }
          const tmpPosts = [...posts];
          const index= tmpPosts.findIndex(p=>p.id===post.id);
          tmpPosts[index] = post;
          setPosts(tmpPosts);
      }  

    if(isLoading){
        return <CircularProgress>Moshe</CircularProgress>
    }  
    
    return <Grid container >
                {!isLoading&&error&&<ErrorMessage>{error}</ErrorMessage>}
                {!isLoading&&loadedRecipe&&
                <Paper>
                    <Card className={classes.root}>
                      <CardActionArea>               
                        <CardMedia
                            component="img"
                            alt="Contemplative Reptile"                            
                            image={process.env.REACT_APP_ASSET_URL+loadedRecipe.imagePath}
                            title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {loadedRecipe.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" component="p">
                                    {loadedRecipe.description}
                                </Typography>
                            </CardContent>    
                        </CardActionArea> 
                    </Card>
                    <Post roomId={room.id}
                         addPosthandler={addPost}/>
                    {posts&&<PostList items={posts} 
                                     removePost={onRemovePostHandler}
                                     editPost={onEditPost}/>}
                </Paper>}
            </Grid>
}

export default Room;