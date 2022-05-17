import React,{useContext} from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import PostItem from './PostItem';
import {AuthContext} from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';

const PostList = props=>{
    //context to auth
    const auth = useContext(AuthContext);
    //hook to send http req
    const {isLoading,error,sendRequest} = useHttpClient();  
    //delet post
    const onRemovePost= async (post)=>{
        console.log(post)
        try{
            await sendRequest(`/api/rooms/post/${post.id}`,
                'DELETE',null ,{
                    Authorization:'Bearer '+auth.token
                  })
            props.removePost(post.id)
        }catch(err){
  
        }
    }

    if(isLoading){
        return <CircularProgress/>
    }
    return <div style={{margin:'1rem'}}>
             <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                >
                {props.items.map(post=>{
                    return <PostItem key={post.id}
                                 likedByUser={post.likes.some(id=> id==auth.userId)}
                                 removePost={()=>onRemovePost(post)}
                                 editPost={props.editPost}
                                 postId={post.id}
                                 text={post.text}
                                 imagePath={post.imagePath?process.env.REACT_APP_ASSET_URL+post.imagePath:null}
                                 editPostHandler={postEdit=>props.onEditPostHandler(postEdit)}
                                 creatorId={post.creator.id}
                                 likes={post.likes?post.likes.length:0} 
                                 creatorImage={ process.env.REACT_APP_ASSET_URL+post.creator.imagePath} 
                                 creatorName={post.creator.firstName+' '+post.creator.lastName} />
                })}
             </Grid>
            </div>
}

export default PostList;