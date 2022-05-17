import React,{useEffect,useState,useContext} from 'react';
import UsersList from '../components/UsersList';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useHttpClient} from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorMessage from '../../shared/components/ErrorMessage';




const Users = ()=>{
    const auth = useContext(AuthContext);

    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();

    //users list
    const [loadingUsers,setLoadingUsers] = useState([]);
    useEffect(()=>{
        const getUsers = async ()=>{
            try{
                const responseData =  await sendRequest('/api/users/');     
                setLoadingUsers(responseData.users.filter(u=>{
                   return  u.id!== auth.userId;
                }));
            }catch(err){
                
            }
        }
        getUsers();
    },[sendRequest,auth])

    if(isLoading){
        return <CircularProgress color="primary"/>
    }
    return <React.Fragment> {error&&<ErrorMessage severity="error">{error}</ErrorMessage>}
              <UsersList items={loadingUsers}/>
           </React.Fragment>
}

export default Users;