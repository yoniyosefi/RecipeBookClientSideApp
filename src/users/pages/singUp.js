import React,{useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, Grid } from '@material-ui/core';
import Input from '../../shared/FormElements/Input';
import {VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,VALIDATOR_MAXLENGTH,VALIDATOR_EMAIL} from '../../shared/util/validators';
import { useForm } from "../../shared/hooks/form-hook";
import { Link } from 'react-router-dom';
import {AuthContext} from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/FormElements/ImageUpload';
import ErrorMessage from '../../shared/components/ErrorMessage';


const userStyles = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,  
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

const SingUp=(props)=>{
    const classes = userStyles();
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();

    //Let you access to global isLoggedIn state and the functions
    const auth = useContext(AuthContext);
    //set form data 
    const [formState,inputHandler]= useForm({
        firstName:{value:'',isValid:false},
        lastName:{value:'',isValid:false},
        email:{value:'',isValid:false},
        password1:{value:'',isValid:false},
        password2:{value:'',isValid:false},
        image:{value:null,isValid:false}
    });
    
    //submits the sing in
    const onSubmitLogin = async (event)=>{
        event.preventDefault();
        try{
            const formData = new FormData();
            formData.append('firstName',formState.inputs.firstName.value);
            formData.append('lastName',formState.inputs.lastName.value);
            formData.append('email',formState.inputs.email.value);
            formData.append('password',formState.inputs.password1.value);
            formData.append('image',formState.inputs.image.value);
            const response = await sendRequest('/api/users/singup', 'POST',formData);
            auth.login(response.userId,response.token,response.userType);   
        }catch(err){
            
        }

    }
    

 
    
    let fromSingUp= ( <Card className={classes.paper}><Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        {error&&<ErrorMessage severity="error">{error}</ErrorMessage>}
                        <form className={classes.form} noValidate onSubmit={(event)=>onSubmitLogin(event)} >
                        <Input 
                          autoFocus ={true}
                          size="small" 
                          label="First Name" 
                          required={true} 
                          id="firstName" 
                          name="firstName"
                          onInput={inputHandler}
                          helperText="Please enter valid name!"
                          validators={[VALIDATOR_REQUIRE(),VALIDATOR_MAXLENGTH(20)]}
                          />
                        <Input 
                          size="small" 
                          label="Last Name" 
                          required={true} 
                          id="lastName" 
                          name="lastName"
                          onInput={inputHandler}
                          helperText="Please enter valid name!"
                          validators={[VALIDATOR_REQUIRE(),VALIDATOR_MAXLENGTH(20)]}
                          />
                        <Input 
                          type="email"
                          size="small" 
                          label="Email Address" 
                          required={true} 
                          id="email" 
                          name="email"
                          onInput={inputHandler}
                          helperText="Please enter valid email!"
                          validators={[VALIDATOR_REQUIRE(),VALIDATOR_EMAIL()]}
                          />

                        <Input
                            size="small" 
                            type="password"
                            variant="outlined"
                            margin="normal"
                            required={true}
                            name="password1"
                            label="Password"
                            id="password1"
                            helperText={"Password have at list {6} charactor!"}
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(6)]}
                            />
                         <Input
                            size="small" 
                            type="password"
                            variant="outlined"
                            margin="normal"
                            required={true}
                            name="password2"
                            label="Re-Password"
                            id="password2"
                            helperText={"Password have at list {6} charactor!"}
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(6)]}
                            />
                             {!formState.inputs.image.isValid&&
                             <Typography color="primary" variant="body2" align="center">
                                 Please add image</Typography>}
                            <ImageUpload id="image" onInput={inputHandler}/>
                            {formState.inputs.password1.value!==formState.inputs.password2.value &&
                             <Typography color="error" variant="body2" align="center">
                                 Passwords not match!</Typography>}
                            <Grid container>
                            <Grid item>
                                <Link to="/login" variant="body2">
                                {"Already have an account? Sign in"}
                                </Link>
                            </Grid>
                            </Grid>        
                            <Button 
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={!formState.isValid}
                            >
                            Sign UP
                            </Button>
                        </form>
                        </div>
                    </Container></Card>)
        if(isLoading){
            fromSingUp=<CircularProgress color="primary"/>
        }
    return(
       <div>
        {fromSingUp}
       </div>
    );
}



export default SingUp;