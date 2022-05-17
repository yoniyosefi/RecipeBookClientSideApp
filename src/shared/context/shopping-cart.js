import {createContext} from 'react';

export const ShoppingCartContext= createContext({
    cart:[],
    totalPrice:0,
    addProductToCart:()=>{},
    removeProductFromCart:()=>{},
    isInCart:()=>{}
});