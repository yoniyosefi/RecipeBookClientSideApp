import React,{useContext} from 'react';
import { Typography, Button, Card ,CardActions,CardContent,Grid ,Box, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import RecipeItem from './RecipeItem';
import {AuthContext} from '../../shared/context/auth-context';
import {ShoppingCartContext} from '../../shared/context/shopping-cart'; 
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorMessage from '../../shared/components/ErrorMessage';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
      
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });


const RecipesList = props=>{
    const classes = useStyles();
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();
    const auth= useContext(AuthContext);
    const shoppingCart = useContext(ShoppingCartContext);
    
    
    const addProductToCart= async recipe=>{
      try{
         await sendRequest('/api/users/addCart',
            'POST',
            JSON.stringify({
                recipeId:recipe.id
            }),{
              Authorization:'Bearer '+auth.token,
              'Content-Type':'application/json'
            })

            shoppingCart.addProductToCart(recipe);
            }catch(err){

            }

        }
        
    if(isLoading){
      return <CircularProgress/>
    }    
    if(props.items.length===0&&auth.userId===props.userId){
        return <Box mt={3}><Card className={classes.root} variant="outlined" >
                    <CardContent>
                    <Typography variant="h6" component="h2">
                        No recipes found, 
                        Would you like to add? 
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <NavLink to='/recipes/new' style={{ textDecoration: 'none' }}><Button variant="outlined" color="primary">Add Recipe</Button></NavLink>
                    </CardActions>
                </Card>
                </Box> 
    }
    if(props.items.length===0&&auth.userId!==props.userId){
      return <Box mt={3}><Card className={classes.root} variant="outlined" >
              <CardContent>
                <Typography variant="h6" component="h2">
                    No recipes found
                </Typography>
              </CardContent>
          </Card>
          </Box> 
    }
    return(  <Grid container spacing={2}  style={{padding:12}} >
          {error&&<ErrorMessage>{error}</ErrorMessage>}
            {
            props.items.map(recipe=>{
                    return <RecipeItem  
                            authorName={recipe.authorName}
                            key={recipe.id}
                            name={recipe.name}
                            description={recipe.description}
                            id={recipe.id}
                            onDelete={props.onDeleteRecipe}
                            image={process.env.REACT_APP_ASSET_URL+recipe.imagePath}
                            creatorId={recipe.creator}
                            price={recipe.price}
                            instructions={recipe.instructions}
                            ingredients={recipe.ingredients}
                            puchasedBySize={recipe.purchasedBy.length}
                            addToCart={()=>addProductToCart(recipe)}
                            />

                })
            }
        </Grid>)
}

export default RecipesList;