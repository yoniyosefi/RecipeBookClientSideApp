import React,{useEffect,useState,useContext} from 'react';
import RecipesList from '../components/RecipesList';
import {useParams} from 'react-router-dom';
import {useHttpClient} from '../../shared/hooks/http-hook';
import Alert from '@material-ui/lab/Alert';
import { CircularProgress } from '@material-ui/core';
import {AuthContext} from '../../shared/context/auth-context';


const UserRecipes = ()=>{
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();
    const [loadedRecipes,setLoadedRecipes] = useState([]);
    const userId =useParams().userId;
    //context to auth
    const auth = useContext(AuthContext);
    //recipe delete
    const recipeDeleteHandler = recipeId=>{
        setLoadedRecipes(prevRecipes =>prevRecipes.filter(r=>r.id!==recipeId))
    }
    

    useEffect(()=>{
        const fecheRecipe = async ()=>{
            try{
                let responseData;
                if(auth.isLoggedIn){
                    responseData= await  sendRequest(`/api/recipes/user/auth/${userId}`,'GET',null,
                    { Authorization:'Bearer '+auth.token });
                }else{
                    responseData= await  sendRequest(`/api/recipes/user/${userId}`);
                }
                responseData.recipes.map(r=>r["authorName"]=responseData.user.firstName+' '+responseData.user.lastName)
                console.log(responseData.recipes)
                setLoadedRecipes(responseData.recipes);
            }catch(err){

            }
        }
        fecheRecipe();
    },[sendRequest,userId,auth.isLoggedIn]);

    if(isLoading){
        return <CircularProgress  color="primary"/>
    }
    return <React.Fragment>
            {error&&<Alert severity="error">{error}</Alert>}
            <RecipesList 
            items={loadedRecipes} 
            onDeleteRecipe={recipeDeleteHandler}
            userId={userId}
            />
           </React.Fragment>
}

export default UserRecipes;