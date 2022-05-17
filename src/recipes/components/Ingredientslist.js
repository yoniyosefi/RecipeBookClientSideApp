import React,{useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { IconButton, List, ListItem, ListItemSecondaryAction,
         ListItemText} from '@material-ui/core';
        
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';


const Ingredientslist = props =>{
    const [ingredient,setIngredient] = useState(''); 
    const [ingredients,setIngredients]= useState(props.ingredients||[]);
    
    
    
    

    const deleteIngredien = (index)=>{
        let tmpIngredints = ingredients.filter(ing=>{
            return ing.number !== index;
        })
        let tmpIndex=0;
        tmpIngredints.forEach(ing => {
            ing.number = tmpIndex;
            tmpIndex++;
        });
        setIngredients(tmpIngredints);
        props.onChangeIngredients(tmpIngredints);

    }

    const addIngredient = ()=>{
        const tempIngredients = [...ingredients];
        const tempIngredient = ingredient;
        if(tempIngredient.trim(' ') ===''){
            return;
        }
        tempIngredients.push({number:ingredients.length,
            name:tempIngredient})
        setIngredients(
            [
                ...ingredients,
                {
                    number:ingredients.length,
                    name:tempIngredient
                }
            ]
        )
        setIngredient('');
        props.onChangeIngredients(tempIngredients);
    }

    
    return(<div>
        {ingredients.length<1&&<Typography variant="body1">You need to add at list one ingrdient.</Typography>}
        <List>
            {ingredients.map((ing,index)=> (
            <ListItem key={index}>
                <ListItemText primary={ing.name}/>
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={()=>deleteIngredien(+ing.number)}>
                     <DeleteIcon color="secondary"/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>))}
        </List>    
            <TextField
                value={ingredient}
                id="ingredient"
                label="Ingredient"
                name="ingredient"
                size="small"
                onChange={event=>setIngredient(event.target.value)}
            />
            <IconButton color="secondary" onClick={()=>addIngredient()}>
                <AddBoxIcon fontSize="large" />
            </IconButton>
            </div>
    )
}


export default Ingredientslist;