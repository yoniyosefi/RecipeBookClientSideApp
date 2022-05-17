/*custom formInput validation useState
can get some validation params and checks 
the input valid can get type:{email|numeric} ,
required:{true|false} ,minLength,maxLength*/

import {useState} from 'react';


const checkValidity=(value, rules) =>{
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.type==='email') {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.type==='numeric') {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}

 const useFormInput = (validitinParams)=>{
    const [value, setValue]= useState('');
    const [validity, setValidity]= useState(false);
    const [tuched, setTuched] = useState(false);
    const inputChangeHandler = event =>{
        setTuched(true);
        setValue(event.target.value);
        if(!checkValidity(event.target.value,validitinParams)){
            setValidity(false);
        }else{
            setValidity(true);
        }
    }
    const initialValue= val =>{
        setValue(val);
    }
    return {value:value,validity:validity,tuched:tuched,onChange:inputChangeHandler ,onInitialValue:initialValue}
}

export default useFormInput;