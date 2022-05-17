import React , {useContext} from 'react';
import { Grid, Card,CardHeader} from '@material-ui/core';
import ShoppingCartItem from './ShoppingCartItem';




const ShoppingCartList =props=> {
    console.log(props.items)
    
  return  <Grid container spacing={1} style={{padding:24}}>
           { props.items.map(recipe=>{
               console.log(recipe);
              return  <ShoppingCartItem
                            key={recipe.id}
                            id={recipe.id}
                            name={recipe.name}
                            price={recipe.price}
                            creator={recipe.authorName}
                            imagePath={process.env.REACT_APP_ASSET_URL+recipe.imagePath}/>
            })}
            <Card>
                Total Price:{props.totalPrice}
            </Card>
        </Grid>
}

export default ShoppingCartList;