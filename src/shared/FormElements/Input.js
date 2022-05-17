import React, {useReducer,useEffect} from 'react';
import { TextField } from '@material-ui/core';
import {validate} from '../util/validators';

const inputReducer = (state,action)=>{
    switch(action.type){
        case 'CHANGE':
            return{
                ...state,
                value:action.val,
                isValid:validate(action.val, action.validators)
             }
        case 'TOUCH':
            return{
                ...state,
                isTouched:true
            }     
        default:
            return state;     
    }
}

const Input = props=>{
    const validators = props.validators||[];
    const [inputState,dispatch]=useReducer(inputReducer,
        {value:props.value||'',isValid:props.valid||false,isTouched:false});
    const onChangeHandler = event =>{
        dispatch({type:'CHANGE',val:event.target.value, validators:validators});
    }
    const onTouchedhandler = event =>{
        dispatch({type:'TOUCH',val:event.target.value, validators:validators});
    }

    const {id,onInput} = props;
    const {value,isValid}= inputState;

    useEffect(()=>{
        onInput(id, value,isValid);
    },[id,onInput,value,isValid]);

    return (<TextField
                    type={props.type}
                    value={inputState.value}
                    error={!inputState.isValid&&inputState.isTouched}
                    variant={props.variant||"outlined"}
                    margin="normal"
                    id={props.name}
                    label={props.label}
                    name={props.name}
                    autoFocus={props.autoFocus || false}
                    size={props.size}
                    rowsMax={props.rowsMax|| 3}
                    fullWidth = {props.fullWidth || true}  
                    required={props.required || false}
                    multiline={props.multiline}
                    helperText={!inputState.isValid&&inputState.isTouched && props.helperText}
                    onChange={onChangeHandler}
                    onBlur={onTouchedhandler}

                />)
}

export default Input;