import React,{useContext} from 'react';
import {  Grid, Button, CircularProgress } from '@material-ui/core';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import ErrorMessage from '../../shared/components/ErrorMessage';
import ImageUpload from '../../shared/FormElements/ImageUpload';
import {useForm} from '../../shared/hooks/form-hook';
import Input from '../../shared/FormElements/Input';
import {VALIDATOR_REQUIRE} from '../../shared/util/validators';

const Post = props=>{
    const {isLoading,error,sendRequest} = useHttpClient();
    //hook for forms
    const [formState,inputHandler]= useForm({
        text:{value:'',isValid:false},
        image:{value:'',isValid:true}    
     });

    //context to auth
    const auth = useContext(AuthContext);
    //post handler
    const  onAddPosthandler = async ()=>{
        try{
            const formData = new FormData();
            formData.append('text',formState.inputs.text.value);
            formData.append('image',formState.inputs.image.value);
            formData.append('roomId',props.roomId);
            const responseData =await sendRequest('/api/rooms/addPost/','POST',               
            formData,
            {
                Authorization:'Bearer '+auth.token,
            })
            console.log(responseData.posts)
            props.addPosthandler(responseData.posts);
            inputHandler('image','',true)
           }catch(err){
               console.log(err);
           }

    } 


    if(isLoading){
        return <CircularProgress/>
    }

    return <div style={{margin:'2rem'}}>
            <Grid>
            {error&&<ErrorMessage>{error}</ErrorMessage>}
            <Input  size="small"
                    required={true}
                    onInput={inputHandler}
                    id="text" 
                    label="text" 
                    name="text"
                    rowsMax={8}
                    helperText="Please add some text"
                    validators={[VALIDATOR_REQUIRE()]}
                    multiline={true}/>
                    <ImageUpload id="image" width='210' onInput={inputHandler}/>
            </Grid>
            <Button onClick={onAddPosthandler}>
                POST
            </Button>
            </div>
}

export default Post;