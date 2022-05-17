import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { Grid, Typography, CardActionArea} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({

  root: {
    maxWidth: 270,
    minWidth:270,
   
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

const UserItem = props => {
  const classes = useStyles();
  return (
  <Grid item  >
    <Link component={RouterLink} to={`/${props.id}/recipes`} style={{ textDecoration: 'none' }}>
        <CardActionArea>
        <Card className={classes.root} variant='outlined'>
        <CardHeader
            avatar={
            <Avatar alt="P" aria-label="recipe" src={props.imagePath||'https://cdn.pixabay.com/photo/2014/04/03/10/32/businessman-310819_960_720.png'} className={classes.avatar}/>
            }
            title={<Typography  variant='h6'>{props.name}</Typography>}
            subheader={<Typography  >{props.recipes} - Recipes</Typography>}
        />
        </Card>
        </CardActionArea>
    </Link>
    </Grid>
  );
}


export default UserItem