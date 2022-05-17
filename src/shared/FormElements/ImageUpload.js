import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));


const ImageUpload= props=>{
    const classes = useStyles()
 
    const [file,setFile] =useState();
    const [prevUrl,setPrevUrl] = useState(props.imagePath||false);
    const [isValid ,setIsValid] = useState(false);

    const pickedHandler=event=>{
        let fileIsValid = isValid;
        let pickedFile;
        if(event.target.files && event.target.files.length ===1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
            }else{
            setIsValid(false);  
            fileIsValid = false;   
            }
            props.onInput(props.id,pickedFile, fileIsValid);
         }      

    useEffect(()=>{
        if(!file){
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = ()=>{
            setPrevUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    },[file])


    return<React.Fragment>
                        <input accept=".jpg,.png,.jpeg" 
                            className={classes.input} 
                            id={props.name||"icon-button-file"} 
                            type="file" 
                            onChange={pickedHandler}/>
                        <label htmlFor={props.name ||"icon-button-file"}>
                            <IconButton color="primary"  component="span">
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    { prevUrl && <img src={prevUrl} alt=""  style={{width:'250px'}}/>}
          </React.Fragment>
}

export default ImageUpload;