import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';


class Home extends Component {

    render(){
        return(
            <Grid container spacing={1} style={{padding:10}}>
                {
                 <React.Fragment>
                     <img src="welcome.gif" style={{width: 300}}/>
                     <img src="source.gif" style={{width: 250}}/>
                 </React.Fragment>  
                }
            </Grid>
        )
    }


}
export default Home;