import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Footer from './Footer';


const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));



const mainFeaturedPost = {
  title: 'Welcome to recipe store',
  description:
    "Want to surprise the family or impress guests, go to the recipe store, And choose the recipe that suits you best",
  image: 'logo.jpg',
  imgText: 'main image description',
  linkText: 'Sign Un now…',
  linkAdress:"singUp"
};

const featuredPosts = [
  {
    title: 'Coocking School',
    description:
      "You don't have to be a trained chef to make insanely delicious food. The recipe store has all the easiest recipes, plus the coolest tricks and shortcuts to make cooking the most fun you've ever had.",
    image: "source.gif",
    imageText: 'Image Text',
  },
  {
    title: 'Craete recipes',
    description:
      'You can to create recipe, and begin to earn many for your informaion. Sing in now, and create recipes.',
    image: "chef.gif",
    imageText: 'Image Text',
  },
];



 const HomePage = ()=> {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
      
        <main style={{margin:'1rem'}}>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} ></FeaturedPost>
            ))}
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
          
          </Grid>
        </main>
      </Container>
      <Footer  description="Coocking it is all!" />
    </React.Fragment>
  );
}
export default HomePage;