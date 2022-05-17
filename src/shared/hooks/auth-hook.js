import {useState,useCallback,useEffect} from 'react';

let logoutTimer;
export const useAuth = ()=>{
    const [token,setToken] = useState(null);
    const [userType,setUserType] = useState(null);
    const [userId,setUserId] = useState();
    const [tokenExperationDate,setTokenExperationDate] =useState()
    
    
 
    const login = useCallback((userId,token,userType,expiration)=>{
      setToken(token);
      setUserId(userId);
      setUserType(userType);
      const tokenExperation = expiration||new Date(new Date().getTime()+1000*60*60);
      setTokenExperationDate(tokenExperation);
      localStorage.setItem('userData',JSON.stringify({userId:userId,
                                                      token:token,
                                                      userType:userType,
                                                      expiration:tokenExperation.toISOString()
                                                    }))
    },[])
    
    
    const logout = useCallback(()=>{
      setToken(null);
      setTokenExperationDate(null);
      setUserId(null);
      localStorage.removeItem('userData');
    },[])
    
    useEffect(()=>{
      if(token&&tokenExperationDate){
        const reminingTime = tokenExperationDate.getTime()- new Date().getTime();
        logoutTimer= setTimeout(logout,reminingTime);
      }else{
        clearTimeout(logoutTimer);
      }
    },[token,logout,tokenExperationDate])
    
    useEffect(()=>{
      const storeData= JSON.parse(localStorage.getItem('userData'));
      if(storeData&&storeData.token&&new Date(storeData.expiration)>new Date()){
        login(storeData.userId,storeData.token,storeData.userType,new Date(storeData.expiration));
      }
    },[login])

    return{token,userId,userType,login,logout}
}
