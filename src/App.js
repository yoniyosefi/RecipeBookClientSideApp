import React,{useState,useCallback,useEffect} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import Users from './users/pages/users';
import NewRecipe from './recipes/pages/NewRecipe';
import MenuAppBar from './shared/components/AppBar';
import UserRecipes from './recipes/pages/UserRecipes';
import UpdateRecipe from './recipes/pages/UpdateRecipe';
import Login from './users/pages/login';
import SingUp from './users/pages/singUp';
import {AuthContext} from './shared/context/auth-context';
import {useAuth} from './shared/hooks/auth-hook';
import ManageUsers from './users/pages/manageUsers';
import ShoppingCart from './shopping-list/pages/ShoppingCart';
import {ShoppingCartContext} from './shared/context/shopping-cart'; 
import {useHttpClient} from './shared/hooks/http-hook';
import UpdateUser from './users/pages/updateUser';
import Room from './blog/pages/room';
import Home from './home/Home';
import HomePage from './home/HomePage';


function App() {
 
  const {token,userId,userType,login,logout} = useAuth();
  const {isLoading,error,sendRequest} = useHttpClient();
  const [cart,setCart]= useState([]);
  const [totalPrice,setTotalPrice] = useState(0);

  useEffect( ()=>{
        const fecthcart = async ()=>{
                  if(!token){
                    return;
                  }
                  try{
                    const responseData =  await sendRequest(`/api/users/cart`,'GET',null,{
                      Authorization:'Bearer '+ token
                    }
                    ); 
                    console.log(responseData);
                    if(responseData.recipes&&responseData.recipes.length>0){
                      setCart([...responseData.recipes]);
                      setTotalPrice(responseData.recipes.reduce((total,recipe)=>total+=recipe.price,0));
                    }else{
                      setCart([]);
                    }
                  }catch(err){

                  }
                }
        fecthcart();        
  },[sendRequest,token])

  const addProductToCart = useCallback(product =>{

    const newCart = [...cart];
    newCart.push(product);
    setCart(newCart);
    setTotalPrice(prevTotalPrice=>prevTotalPrice+product.price);
  },[cart]); 

  const removeProductFromCart = useCallback(productId =>{
    console.log(productId);
    const cartTmp = [...cart];
    const item =cartTmp.filter(item=>item.id===productId)
    const newCart = cartTmp.filter(item=>item.id!==productId);

    setCart(newCart);
    setTotalPrice(prevTotalPrice=>prevTotalPrice-item[0].price);
  },[cart]);
 
  const isInCart = useCallback(productId =>{
    const cartTmp = [...cart];
    return cartTmp.find(item=>item.id===productId)?true:false;
  },[cart]);
 
  let routes;
  if(token){
    routes=(<Switch>
              <Route path="/" exact>
                <HomePage/>
              </Route>
              <Route path="/users" exact>
                <Users/>
              </Route>
              <Route path="/:userId/recipes" exact>
                  <UserRecipes/>
              </Route>
              <Route path="/recipes/new" exact>
                  <NewRecipe/>
              </Route>
              <Route path="/recipes/:recipeId" exact>
                  <UpdateRecipe/>
              </Route>
              <Route path='/shoppingList' exact>
                  <ShoppingCart/>
              </Route>
              <Route path="/updateUser" exact>
                <UpdateUser/>
              </Route>
              <Route path='/blog/:recipeId' exact>
                <Room/>
              </Route>
              {userType==='admin'&&
                <Route path="/manageUsers" exact>
                <ManageUsers/>
              </Route>}
              <Redirect to="/"/>
              </Switch>)
  }else{
    routes=(<Switch>
              <Route path="/" exact>
              <HomePage/>
              </Route>
              <Route path="/users" exact>
                <Users/>
              </Route>
            <Route path='/blog/1' exact>
                <Room/>
              </Route>
            <Route path="/:userId/recipes" exact>
                <UserRecipes/>
            </Route>
            <Route path="/login" exact>
                <Login/>
            </Route>
            <Route path="/singUp" exact>
                <SingUp/>
            </Route>
            <Redirect to="/login"/>
            </Switch>)
  }

  return  <AuthContext.Provider value={{
                          isLoggedIn:!!token,
                          token:token,
                          userType:userType,
                          login:login,
                          logout:logout,
                          userId:userId
                          }}       
                          >
          <ShoppingCartContext.Provider value={{
                              cart:cart,
                              totalPrice:totalPrice,
                              addProductToCart:addProductToCart,
                              removeProductFromCart:removeProductFromCart,
                              isInCart:isInCart
                                        }}>             
              <Router>
                <MenuAppBar>
                  {routes}
                </MenuAppBar>
              </Router>
          </ShoppingCartContext.Provider> 
         </AuthContext.Provider>
}

export default App;
