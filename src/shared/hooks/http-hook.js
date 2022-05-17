import {useState,useCallback, useRef, useEffect} from 'react';


export const useHttpClient = ()=>{
    //loading page Or not
    const [isLoading,setIsLoading]= useState(false);

    //error
    const [error,setError]= useState('');

    const activeHttpRequest = useRef([]);

    const sendRequest = useCallback( async (url,method='GET', body=null,headers={})=>{
        const httpAbortCtrl = new AbortController();
        activeHttpRequest.current.push(httpAbortCtrl);
        setIsLoading(true);
        try{    
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+url,{
                method,
                body,
                headers,
                signal:httpAbortCtrl.signal
            })

        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
            reqCtrl=>reqCtrl!==httpAbortCtrl
        )
        setIsLoading(false);

        if(!response.ok){
            throw new Error(responseData.message ||'somthing went wrong try again later');
        }


        return responseData;    
        }catch(err){
            setError(err.message||'somthing went wrong try again later');
            setIsLoading(false);
            throw err;
        }

    } ,[])
    const clearError = ()=>{
        setError(null);
    }

    useEffect(()=>{
        return ()=>{
            activeHttpRequest.current.forEach(aborCtrl=>aborCtrl.abort())
        }
    },[]);

    return {isLoading,error,sendRequest,clearError}
}