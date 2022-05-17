import React,{useState,useEffect,useContext} from 'react';
import {useHistory} from 'react-router-dom';import { Typography, Button, Card, Container, Divider ,CircularProgress} from '@material-ui/core';
import Input from '../../shared/FormElements/Input';
import {VALIDATOR_REQUIRE,VALIDATOR_MAXLENGTH} from '../../shared/util/validators';
import { makeStyles } from '@material-ui/core/styles';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import ImageUpload from '../../shared/FormElements/ImageUpload';
import ErrorMessage from '../../shared/components/ErrorMessage';



const useStyles = makeStyles((theme) => ({
    input: {
        display: 'none',
      },
    paper: {
      marginTop: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    card: {
        margin: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    typography: {
      margin: theme.spacing(2),

    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));


const UpdateUser=() =>{

    const classes = useStyles();
    //context to auth
    const auth = useContext(AuthContext);
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();  
    const [loadedUser,setLoadedUser]= useState();

   
    const [formState,inputHandler,setFormData]= useForm(
          {
          firstName:{value:'',isValid:false},
          lastName:{value:'',isValid:false},
          image:{value:'',isValid:false},
          },true);  

    const historyPage = useHistory();

    useEffect(()=>{
      const getUserDetails =async ()=>{
        const responsData = await sendRequest(`/api/users/${auth.userId}`,'GET',null,
        {
          Authorization:'Bearer '+auth.token
        }
        );
        if(responsData&&responsData.user){
          setLoadedUser(responsData.user);
          setFormData({                 
              firstName:{value:responsData.user.firstName,isValid:true},
              lastName:{value:responsData.user.lastName,isValid:true},
              image:{value:responsData.user.imagePath,isValid:true}
                  },true);
              }
      }
      getUserDetails();
    },[]);      



    const updateRecipeSubmitHandler =async event=>{
          event.preventDefault();
          try{
            const formData = new FormData();
            formData.append('firstName',formState.inputs.firstName.value);
            formData.append('lastName',formState.inputs.lastName.value);   
            formData.append('image',formState.inputs.image.value);
            await sendRequest(`/api/users/${auth.userId}`,'PATCH',formData,{
              Authorization:'Bearer '+auth.token
            })
            historyPage.push(`/${auth.userId}/recipes`);   
           }catch(err){
               console.log(err);
           }
    } 

    if(!isLoading&&error){
      return <ErrorMessage>{error}</ErrorMessage>
    }
    if(isLoading){
        return <CircularProgress color="primary"/>
    }
    return (
        <React.Fragment>
        {!isLoading&&loadedUser&& <Card className={classes.paper}>
          <Container component="main" maxWidth="xs">
              <div >
              <Typography className={classes.typography} component="h1" variant="h5">
                  Edit User
              </Typography>
                <form className={classes.form} noValidate onSubmit={updateRecipeSubmitHandler}>
                  <Input autoFocus={true}
                          size="small" 
                          label="firstName" 
                          required={true } 
                          id="firstName" 
                          name="firstName"
                          onInput={inputHandler}  
                          helperText="Please enter valid name!"
                          validators={[VALIDATOR_REQUIRE(),VALIDATOR_MAXLENGTH(20)]}
                          value={loadedUser.firstName}
                          valid={true}
                          />
                  <Input autoFocus={true}
                          size="small" 
                          label="lastName" 
                          required={true } 
                          id="lastName" 
                          name="lastName"
                          onInput={inputHandler}  
                          helperText="Please enter valid name!"
                          validators={[VALIDATOR_REQUIRE(),VALIDATOR_MAXLENGTH(20)]}
                          value={loadedUser.lastName}
                          valid={true}
                          />
                  <Divider color='#9c27b0'/>   
                  <ImageUpload id="image" onInput={inputHandler} imagePath={'http://localhost:3030/'+loadedUser.imagePath}/>
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      className={classes.submit}
                      disabled={!(formState.isValid)}
                      >
                      Submit
                  </Button>
              </form>
              </div>
          </Container>
        </Card>}
        </React.Fragment>
    )

  }


export default UpdateUser;