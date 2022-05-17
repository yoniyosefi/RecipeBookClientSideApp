import React ,{useContext} from 'react';
import { Grid, Card, CardHeader, CardActions, CardMedia, Button,ButtonGroup,
            CardContent, Typography ,IconButton, Collapse, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NavLink, Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import {AuthContext} from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import {ShoppingCartContext} from '../../shared/context/shopping-cart'; 
import ErrorMessage from '../../shared/components/ErrorMessage';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 250,
      minWidth:250
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },

  }));


const RecipeItem = props=>{
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();
    const auth= useContext(AuthContext);
    const shoppingCart = useContext(ShoppingCartContext);

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpenDialog = () => {
      setOpen(true);
    };
  
    const handleCloseDialog = () => {
      setOpen(false);
    };
    
    const handleDeleteHandler = async ()=>{
        setOpen(false);
        try{
            await sendRequest(`/api/recipes/${props.id}`,'DELETE',null ,{
                Authorization:'Bearer '+auth.token
              })
            props.onDelete(props.id);

        }catch(err){

        };
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
        const deleteDialog = (                
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{"Are you sure that you want to delete this recipe?"}</DialogTitle>
            <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
                CANCEL
            </Button>
            <Button onClick={handleDeleteHandler} color="primary" autoFocus>
                DELETE
            </Button>
            </DialogActions>
        </Dialog>)

        if(isLoading){
           return <CircularProgress color="primary"/>
        }
       
        return(<React.Fragment>
            <Grid item  >
                <Card className={classes.root}>
                {error&&<ErrorMessage>{error}</ErrorMessage>}
                <CardHeader
                    action={!shoppingCart.isInCart(props.id)&&props.ingredients&&
                      props.ingredients.length===0&& 
                      <IconButton aria-label="settings" onClick={props.addToCart}>
                        <AddShoppingCartIcon fontSize="large"/>
                      </IconButton>
                    }            
                    title={props.name}
                    subheader={props.authorName}
                />
                <CardMedia
                    className={classes.media}
                    image={props.image}
                    title={props.name}
                />
                <CardContent>
                    <Typography variant="body2" component="p">
                        {props.description}
                    </Typography>
                    <Typography variant="body1" component="p">
                        {props.price} - $
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                { auth.userId===props.creatorId&&     
                <ButtonGroup>
                            <Button
                                variant="outlined"
                                color="primary"
                                className={classes.button}
                                startIcon={<EditIcon />}
                            > <NavLink to={`/recipes/${props.id}`} style={{ textDecoration: 'none' }}> 
                               Edit
                            </NavLink>
                            </Button>
                         
                        {props.puchasedBySize===0&&
                        <Button
                            onClick={handleClickOpenDialog}
                            variant="outlined"
                            color="secondary"
                            className={classes.button}
                            startIcon={<DeleteIcon />}
                        >        Delete
                        </Button>}
                    </ButtonGroup>}
                  { props.ingredients&&props.ingredients.length>0&&
                  <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    >
                    <ExpandMoreIcon />
                    </IconButton>}
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                    <Link to={`/blog/${props.id}`}>GO TO BLOG</Link>  
                    <Typography variant="subtitle1">Ingredients:</Typography>
                    <ul>
                     {props.ingredients&&props.ingredients.map(ing=><li key={ing.number}>{ing.name}</li>)}
                    </ul>
                    <Typography variant="subtitle1">Innstructions:</Typography>
                    <ul>
                     {props.instructions&&props.instructions.map(ins=><li key={ins.number}>{ins.name}</li>)}
                    </ul>
                    </CardContent>
                </Collapse>
                {deleteDialog}
                </Card>
            </Grid>
            </React.Fragment>
        )
}

export default RecipeItem;