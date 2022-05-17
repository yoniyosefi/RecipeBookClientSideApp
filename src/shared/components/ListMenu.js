import React , {useContext} from 'react';
import {withRouter} from 'react-router-dom';
import PeopleIcon from '@material-ui/icons/People';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { Divider} from '@material-ui/core';
import {AuthContext} from '../context/auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt ,faSignInAlt,faUsersCog ,faUserEdit} from '@fortawesome/free-solid-svg-icons';
import HomeIcon from '@material-ui/icons/Home';

const ListMenu = props =>{
    const auth = useContext(AuthContext);

    return(
        <div>
        <List >
        <NavLink to='/' exact style={{ textDecoration: 'none' }} onClick={props.onClick()}>
            <ListItem selected={props.location.pathname ==='/'} >
                <ListItemIcon> <HomeIcon /></ListItemIcon>
                <ListItemText primary='Home' />
            </ListItem>
          </NavLink>   
        {auth.isLoggedIn&&        
          <NavLink to={`/${auth.userId}/recipes`} style={{ textDecoration: 'none' }} onClick={props.onClick()}>
            <ListItem selected={props.location.pathname ===`/${auth.userId}/recipes`}>
                <ListItemIcon> <LibraryBooksIcon /></ListItemIcon>
                <ListItemText primary='My Recipes' />
            </ListItem>
          </NavLink>    }
          <NavLink to='/users' exact style={{ textDecoration: 'none' }} onClick={props.onClick()}>
            <ListItem selected={props.location.pathname ==='/users'} >
                <ListItemIcon> <PeopleIcon /></ListItemIcon>
                <ListItemText primary='Users' />
            </ListItem>
          </NavLink>
          {auth.isLoggedIn&&
            <NavLink to='/updateUser' exact style={{ textDecoration: 'none' }} onClick={props.onClick()}>
            <ListItem selected={props.location.pathname ==='/updateUser'} >
                <ListItemIcon> <FontAwesomeIcon icon={faUserEdit} /></ListItemIcon>
                <ListItemText primary='Update User' />
            </ListItem>
          </NavLink>}
          {auth.userType==='admin'&&auth.isLoggedIn&&
            <NavLink to='/manageUsers' exact style={{ textDecoration: 'none' }} onClick={props.onClick()}>
            <ListItem selected={props.location.pathname ==='/manageUsers'} >
                <ListItemIcon> <FontAwesomeIcon icon={faUsersCog} size="lg"/></ListItemIcon>
                <ListItemText primary='Manage Users' />
            </ListItem>
          </NavLink>}
          
          {auth.isLoggedIn&&    
          <NavLink to='/recipes/new' style={{ textDecoration: 'none' }} onClick={props.onClick()}>
            <ListItem selected={props.location.pathname ==='/recipes/new'}>
                <ListItemIcon> <NoteAddIcon/></ListItemIcon>
                <ListItemText primary='Add Recipe' />
            </ListItem>
          </NavLink>}
          <Divider/>
          {!auth.isLoggedIn&&  
          <NavLink to='/login' style={{ textDecoration: 'none' }} onClick={props.onClick()}>
            <ListItem selected={props.location.pathname ==='/login'}>
                <ListItemIcon> <FontAwesomeIcon icon={faSignInAlt} size="lg"/></ListItemIcon>
                <ListItemText primary='Login' />
            </ListItem>
          </NavLink> }
          {!auth.isLoggedIn&&  
          <NavLink to='/singUp' style={{ textDecoration: 'none' }} onClick={props.onClick()}>
            <ListItem selected={props.location.pathname ==='/singUp'}>
                <ListItemIcon> <FontAwesomeIcon icon={faSignInAlt} size="lg"/></ListItemIcon>
                <ListItemText primary='SingUp' />
            </ListItem>
          </NavLink>   }   
          {auth.isLoggedIn&&  
            <ListItem onClick={auth.logout}>
                <ListItemIcon> <FontAwesomeIcon icon={faSignOutAlt} size="lg"/></ListItemIcon>
                <ListItemText primary='Logout' />
            </ListItem>
            }   
        </List>
      </div>
    )
}

export default withRouter(ListMenu);