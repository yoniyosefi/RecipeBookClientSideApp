import {ShoppingCartContext} from '../../shared/context/shopping-cart'; 
import React ,{useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { Grid, Typography, CardActions, Button, ButtonGroup, CircularProgress, Dialog, DialogActions, DialogTitle, CardContent} from '@material-ui/core';
import {AuthContext} from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorMessage from '../../shared/components/ErrorMessage';


const useStyles = makeStyles((theme) => ({

  root: {
    maxWidth: 250,
    minWidth:250,
   
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
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));



const ShoppingCartItem =props=> {
    //hook to manage url req
    const {isLoading,error,sendRequest} = useHttpClient();
    const auth= useContext(AuthContext);
    const classes = useStyles();
    const shoppingCart = useContext(ShoppingCartContext);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handlePurchase = async () => {
        try{
            await sendRequest(`/api/users/cart/${props.id}`,'PATCH',
            null
            ,{
              Authorization:'Bearer '+auth.token
            })
            shoppingCart.removeProductFromCart(props.id);  
            setOpen(false);

           }catch(err){
            setOpen(false);
           }
          setOpen(false);
      };

    const onRemoveProductFromCart = async ()=>{
        try{
            await sendRequest(`/api/users/cart/${props.id}`,'DELETE',null ,{
                Authorization:'Bearer '+auth.token
              })
            shoppingCart.removeProductFromCart(props.id);

        }catch(err){

        };
    }
    if(!isLoading&&error){
        return <ErrorMessage>{error}</ErrorMessage>
    }
    if(isLoading){
        return <CircularProgress/>
    }
    const purchaseDialog =    (  <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">
                                        {`Do you Want to purchase ${props.name} recipe?` }
                                        </DialogTitle>
                                    <DialogActions>
                                    <Button onClick={handlePurchase} color="primary">
                                        CONTINUE
                                    </Button>
                                    <Button onClick={handleClose} color="secondary" autoFocus>
                                        ABORT
                                    </Button>
                                    </DialogActions>
                                </Dialog>)
    return (
        <Grid item >
              <Card className={classes.root} variant='outlined'> 
              {purchaseDialog}       
              <CardHeader
                  avatar={
                  <Avatar alt="P" aria-label="recipe" src={props.imagePath||'https://cdn.pixabay.com/photo/2014/04/03/10/32/businessman-310819_960_720.png'} className={classes.avatar}/>
                  }
                  title={<Typography  variant='h6'>{props.name}</Typography>}
                  subheader={<Typography  >{props.creator} </Typography>}
              />
              <CardContent>
                {props.price||'0'}-$
              </CardContent>
               <CardActions disableSpacing>                   

               <ButtonGroup>
                        <Button onClick={handleClickOpen}
                                variant="contained"
                                color="primary" 
                                > Purchase
                        </Button>
                        <Button
                                onClick={onRemoveProductFromCart}
                                variant="outlined"
                                color="secondary"
                                >  Remove
                        </Button>
                        </ButtonGroup>
                      </CardActions>
              </Card>
          </Grid>
        );
}

export default ShoppingCartItem;