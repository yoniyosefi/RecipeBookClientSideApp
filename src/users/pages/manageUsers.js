import React,{useEffect,useState,useContext} from 'react';
import ManagedUsersList from '../components/ManagedUserList';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHttpClient} from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';




const ManageUsers = ()=>{
    const auth = useContext(AuthContext);
     
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();

    //users list
    const [loadingUsers,setLoadingUsers] = useState([]);

    useEffect(()=>{
        const getUsers = async ()=>{
            try{
                const responseData =  await sendRequest('/api/users/');
                console.log(responseData.users)
                setLoadingUsers(responseData.users.filter(u=>{
                    return  u.userType!=='admin' ;
                    })); 

            }catch(err){
                
            }
        }
        getUsers();
    },[sendRequest,auth])
    
    //delete user handler
    const removeUserFromList = userId=>{
        setLoadingUsers(prevUsers =>prevUsers.filter(u=>u.id!==userId))
    }
    
    if(isLoading){
        return <CircularProgress color="primary"/>
    }
    return <React.Fragment> {error&&<Alert severity="error">{error}</Alert>}
                <ManagedUsersList items={loadingUsers} removeUserFromList={removeUserFromList}/></React.Fragment>
}

export default ManageUsers