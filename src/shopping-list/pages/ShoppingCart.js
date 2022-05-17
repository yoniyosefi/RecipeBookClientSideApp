import React,{useContext} from 'react';
import {ShoppingCartContext} from '../../shared/context/shopping-cart'; 
import ShoppingCartList from '../components/ShoppingCartList';

const ShoppingCart =()=> {
  const shoppingCart = useContext(ShoppingCartContext);

  return <ShoppingCartList items={shoppingCart.cart} totalPrice={shoppingCart.totalPrice}/>
}

export default ShoppingCart;