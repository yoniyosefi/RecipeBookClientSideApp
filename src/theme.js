import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';    
import { pink } from '@material-ui/core/colors';



const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: pink,
    background: {
            default: "#757575"
          
    }
  },
  status: {
    danger: 'orange',
  },
});

export default theme;