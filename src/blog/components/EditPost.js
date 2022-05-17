import React,{useContext} from 'react';
import {  Grid, Button, CircularProgress } from '@material-ui/core';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import ErrorMessage from '../../shared/components/ErrorMessage';
import ImageUpload from '../../shared/FormElements/ImageUpload';
import {useForm} from '../../shared/hooks/form-hook';
import Input from '../../shared/FormElements/Input';
import {VALIDATOR_REQUIRE} from '../../shared/util/validators';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const EditPost = props=>{
    const {isLoading,error,sendRequest} = useHttpClient();
    
    //hook for forms
    const [formState,inputHandler]= useForm({
        text:{value:props.text,isValid:true},
        image:{value:props.imagePath,isValid:true}    
     },true);

    //context to auth
    const auth = useContext(AuthContext);
    //update post
    const updatePost =async event=>{
        try{
          const formData = new FormData();
          formData.append('text',formState.inputs.text.value); 
          formData.append('image',formState.inputs.image.value);
          
         const resonseData=  await sendRequest(`/api/rooms/post/${props.postId}`,'PATCH',formData,{
            Authorization:'Bearer '+auth.token
          }) 
          props.editPost(resonseData.post);
          props.handleCloseDialog();
         }catch(err){
             console.log(err);
         }
  } 
    if(isLoading){
        return <CircularProgress/>
    }

    return   <Dialog open={props.open} onClose={props.handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Post</DialogTitle>
                <DialogContent>
                <Input  size="small"
                        required={true}
                        onInput={inputHandler}
                        id="text" 
                        label="text" 
                        name="text"
                        rowsMax={8}
                        helperText="Please add some text"
                        validators={[VALIDATOR_REQUIRE()]}
                        value={props.text}
                        valid={true}
                        multiline={true}/>
                <ImageUpload id="image" 
                             name="edit-post"
                             width='210' 
                             onInput={inputHandler}
                             imagePath={props.imagePath}/>
                </DialogContent>
                <DialogActions>
                <Button  color="primary" onClick= {props.handleCloseDialog}>
                    Cancel
                </Button>
                <Button color="secondary" onClick={updatePost} disabled={!formState.isValid}>
                    Save
                </Button>
                </DialogActions>
            </Dialog>
}

export default EditPost;