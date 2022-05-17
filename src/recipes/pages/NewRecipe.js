import React , {useState,useCallback,useContext}from 'react';
import {useHistory} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Divider, CircularProgress } from '@material-ui/core';
import Input from '../../shared/FormElements/Input';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH,VALIDATOR_MAXLENGTH,
    VALIDATOR_NUMBER,VALIDATOR_POSETIVE_NUMBER} from '../../shared/util/validators';
import Ingredientslist from '../components/Ingredientslist';
import InstructionsList from '../components/InstructionsList';
import { useForm } from "../../shared/hooks/form-hook";
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import ImageUpload from '../../shared/FormElements/ImageUpload';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { TextField } from '@material-ui/core';
//styles
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

const NewRecipe = ()=>{
   //hook to manage url req
   const {isLoading,error,sendRequest} = useHttpClient();
   const [formState,inputHandler]= useForm({
       name:{value:'',isValid:false},
       description:{value:'',isValid:false},
       image:{value:'',isValid:false} ,
       price:{value:'',isValid:false}   
    });

    //context to auth
    const auth = useContext(AuthContext);

    const [ingredients,setIngredients] = useState([]);
    const [instructions,setInstructions] =useState([]);

  

     const instructionListHandler =  useCallback(inst=>{
         const instructions = [...inst];
         setInstructions(instructions);
     },[])

    const ingredientListHandler =  useCallback(ings=>{
        const ingredients = [...ings]
        setIngredients(ingredients);
    },[])

    

    const historyPage = useHistory(); 
    const recipeSubmithandler = async event=>{
        event.preventDefault();
        try{
         const formData = new FormData();
         formData.append('name',formState.inputs.name.value);
         formData.append('ingredients', JSON.stringify(ingredients));
         formData.append('instructions', JSON.stringify(instructions));
         formData.append('description',formState.inputs.description.value);   
         formData.append('image',formState.inputs.image.value);
         formData.append('price', formState.inputs.price.value);
         formData.append('creator',auth.userId);
         await sendRequest('/api/recipes/','POST',formData,{
           Authorization:'Bearer '+auth.token
         })
         historyPage.push(`/${auth.userId}/recipes`);   
        }catch(err){
            console.log(err);
        }
    }

    const classes = useStyles();
    if(isLoading){
       return <CircularProgress color="primary"/>
    }
    return (
        <Card className={classes.paper}>
            <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography className={classes.typography} component="h1" variant="h5">
                    Add New Recipe
                </Typography>
                {error&&<ErrorMessage>{error}</ErrorMessage>}
                <form className={classes.form} noValidate onSubmit={recipeSubmithandler}>
                <Input autoFocus={true}
                         size="small" 
                         label="Name" 
                         required={true } 
                          id="name" 
                          name="name"
                          onInput={inputHandler}
                          helperText="Please enter valid name 5-20 characters"
                          validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(5),VALIDATOR_MAXLENGTH(20)]}
                          />
                <Input  size="small"
                    required={true}
                    onInput={inputHandler}
                    id="description" 
                    label="Description" 
                    name="description"
                    rowsMax={5}
                    helperText="Please enter valid description 30-300 characters"
                    validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(2),VALIDATOR_MAXLENGTH(300)]}
                    multiline={true}/>
                <Input
                      required={true}
                      fullWidth ={false}
                      size="small" 
                      id="price"
                      label="price"
                      name="price"
                      type="number"
                      helperText="Please enter valid price"
                      validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSETIVE_NUMBER()]}
                      onInput={inputHandler}/>
               <Divider color='#9c27b0'/>
                <Typography className={classes.typography}>Add Ingredient</Typography>
                    <Ingredientslist onChangeIngredients={ingredientListHandler}/>
                <Divider color='#9c27b0'/>
                <Typography className={classes.typography}>Add Instruction</Typography>
                    <InstructionsList  onChangeInsructions={instructionListHandler}/>
                <Divider color='#9c27b0'/>
                {!formState.inputs.image.isValid&&
                <Typography color="primary" variant="body2" align="center">
                                 Please add image</Typography>}
                 <ImageUpload id="image" onInput={inputHandler}/>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.submit}
                    disabled={!(formState.isValid&&( instructions.length>0&&ingredients.length>0))}
                    >
                    Submit
                </Button>
                </form>
            </div>
            </Container>
    </Card>
    
    )
}

export default NewRecipe;