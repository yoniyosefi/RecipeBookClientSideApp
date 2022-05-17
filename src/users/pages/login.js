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
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH,VALIDATOR_EMAIL} from '../../shared/util/validators';
import { useForm } from "../../shared/hooks/form-hook";
import { Link} from 'react-router-dom';
import {AuthContext} from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
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

const Login=(props)=>{
    const classes = userStyles();
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();
    
    //conect the form to the auth state
    const auth = useContext(AuthContext);
    
    //from state
    const [formState,inputHandler]= useForm({email:{value:'',isValid:false},password:{value:'',isValid:false}});
    
    //submit login form
    const onSubmitLogin = async (event)=>{
        event.preventDefault();
        try{
            const response = await sendRequest('/api/users/login',
                'POST',
                JSON.stringify({
                    email:formState.inputs.email.value,
                    password:formState.inputs.password.value
                }),
                {
                    'Content-Type':'application/json'
                })
                //console.log(response.user.id)
                auth.login(response.userId,response.token,response.userType);   
        }catch(err){
  
        }
        
    }
   

    let fromLogin= ( <Card className={classes.paper}>
                      <Container component="main" >
                        <CssBaseline />
                        <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        {error&&<ErrorMessage>{error}</ErrorMessage>}
                        <form className={classes.form} noValidate onSubmit={(event)=>onSubmitLogin(event)} >
                        <Input autoFocus={true}
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
                            name="password"
                            label="Password"
                            id="password"
                            helperText={"Password have at list {6} charactor!"}
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(6)]}
                            />
                            <Grid container>
                            <Grid item>
                                <Link to="/singUp" variant="body2">
                                {"Don't have an account? Sign Up"}
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
                            Sign In
                            </Button>
                        </form>
                        </div>
                    </Container></Card>)
        if(isLoading){
            fromLogin=<CircularProgress color="primary"/>
        }
    return(
       <div>
        {fromLogin}
       </div>
    );
}



export default Login;






