import React,{useState,useCallback,useEffect,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import { Typography, Button, Card, Container, Divider ,CircularProgress} from '@material-ui/core';
import Input from '../../shared/FormElements/Input';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH,VALIDATOR_MAXLENGTH,VALIDATOR_NUMBER,VALIDATOR_POSETIVE_NUMBER} from '../../shared/util/validators';
import { makeStyles } from '@material-ui/core/styles';
import Ingredientslist from '../components/Ingredientslist';
import InstructionsList from '../components/InstructionsList';
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


const UpdateRecipe = ()=>{
      const classes = useStyles();
      //context to auth
      const auth = useContext(AuthContext);
      //hook to manage url req
      const {isLoading,error,sendRequest} = useHttpClient();  
      const [loadedRecipe,setLoadedRecipe]= useState();

      const [ingredients,setIngredients] = useState([]);
      const [instructions,setInstructions] =useState([]); 

      const recipeId = useParams().recipeId;
      const [formState,inputHandler,setFormData]= useForm(
            {
            name:{value:'',isValid:false},
            description:{value:'',isValid:false},
            image:{value:'',isValid:false},
            price:{value:'',isValid:true}
            },true);  

      const historyPage = useHistory();

      useEffect(()=>{
        const fetchRecieps =async ()=>{
            try{
                const responsData = await sendRequest(`/api/recipes/${recipeId}`,'GET',null,
                {
                  Authorization:'Bearer '+auth.token
                }
                );
                setLoadedRecipe(responsData.recipe);
                setFormData( {
                    name:{value:responsData.recipe.name,isValid:true},
                    description:{value:responsData.recipe.description,isValid:true},
                    image:{value:responsData.recipe.imagePath,isValid:true},
                    price:{value:responsData.recipe.price,isValid:true}
                        },true)
                setIngredients(responsData.recipe.ingredients);
                setInstructions(responsData.recipe.instructions);  
            }catch(err){

            }
        }
        fetchRecieps();
      },[sendRequest,recipeId,setFormData,setIngredients,setInstructions,auth.token]);      


       const instructionListHandler =  useCallback(inst=>{
            const instructions = [...inst];
            setInstructions(instructions);
          },[])
       
        const ingredientListHandler =  useCallback(ings=>{
            const ingredients = [...ings]
            setIngredients(ingredients);
           },[])

      const updateRecipeSubmitHandler =async event=>{
            event.preventDefault();
            try{
              const formData = new FormData();
              formData.append('name',formState.inputs.name.value);
              formData.append('ingredients', JSON.stringify(ingredients));
              formData.append('instructions', JSON.stringify(instructions));
              formData.append('description',formState.inputs.description.value);   
              formData.append('image',formState.inputs.image.value);
              formData.append('price',formState.inputs.price.value);
              await sendRequest(`/api/recipes/${recipeId}`,'PATCH',formData,{
                Authorization:'Bearer '+auth.token
              })
              historyPage.push(`/${auth.userId}/recipes`);   
             }catch(err){
                 console.log(err);
             }
      } 

      if(!loadedRecipe&&error){
        return(<ErrorMessage>{error}</ErrorMessage>)
      }
      if(isLoading){
          return <CircularProgress color="primary"/>
      }
      return (
          <React.Fragment>
          {!isLoading&&loadedRecipe&& <Card className={classes.paper}>
            <Container component="main" maxWidth="xs">
                <div >
                <Typography className={classes.typography} component="h1" variant="h5">
                    Edit Recipe
                </Typography>
                  <form className={classes.form} noValidate onSubmit={updateRecipeSubmitHandler}>
                    <Input autoFocus={true}
                            size="small" 
                            label="Name" 
                            required={true } 
                            id="name" 
                            name="name"
                            onInput={inputHandler}  
                            helperText="Please enter valid name 5-20 characters"
                            validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(5),VALIDATOR_MAXLENGTH(20)]}
                            value={loadedRecipe.name}
                            valid={true}

                            />
                    <Input  size="small"
                        required={true}
                        onInput={inputHandler}
                        id="description" 
                        label="Description" 
                        name="description"
                        rowsMax={5}
                        helperText="Please enter valid description 30-300 characters"
                        validators={[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(30),VALIDATOR_MAXLENGTH(300)]}
                        multiline={true}
                        value={loadedRecipe.description}
                        valid={true}
                        />
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
                      value={loadedRecipe.price}
                      valid={true}
                      onInput={inputHandler}/>
                    <Divider color='#9c27b0'/>
                    <Typography className={classes.typography}>Add Ingredient</Typography>
                    <Ingredientslist ingredients={[...loadedRecipe.ingredients]}
                        onChangeIngredients={ingredientListHandler}/>    
                    <Divider color='#9c27b0'/>  
                    <InstructionsList instructions={[...loadedRecipe.instructions]}
                        onChangeInsructions={instructionListHandler}/>  
                    <Divider color='#9c27b0'/>    
                    <ImageUpload id="image" onInput={inputHandler} imagePath={'http://localhost:3030/'+loadedRecipe.imagePath}/>
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
          </Card>}
          </React.Fragment>
      )

    }
    


export default UpdateRecipe;