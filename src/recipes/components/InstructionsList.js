import React,{useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { IconButton, List, ListItem, ListItemSecondaryAction,
         ListItemText} from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';          
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';


const InstructionsList = props =>{
    
    const [instruction,setInstruction] = useState(''); 
    const [instructions,setInstructions]= useState(props.instructions||[]);
    
    const [updateInstructionMode, setUpdateInstructionMode] = useState(false);
    const [updateInstructionIndex,setUpdateInstructionIndex] = useState(-1);
    
  
    const deleteInstruction = (index)=>{
        let tmpInstructions = instructions.filter(ins=>{
            return ins.number !== index;
        })
        let tmpIndex=0;
        tmpInstructions.forEach(ins => {
            ins.number = tmpIndex;
            tmpIndex++;
        });
        setInstructions(tmpInstructions);
        props.onChangeInsructions(tmpInstructions);
    }

    const addOrUpdateInstruction = ()=>{
        const tempInstructions=[...instructions];
        const tmpInstruction = instruction;
        if(tmpInstruction.trim(' ') ===''){
            return;
        }
        if(!updateInstructionMode){
            tempInstructions.push({number:instructions.length,
                name:tmpInstruction})
            setInstructions([
                ...instructions,
                {
                    number:instructions.length,
                    name:tmpInstruction
                }
            ])
            props.onChangeInsructions(tempInstructions);
        }else{
            let tmpInstructions = [...instructions];
            tmpInstructions[+updateInstructionIndex].name =  tmpInstruction;
            setInstructions([
                ...tmpInstructions
            ])
            setUpdateInstructionMode(false);
            setUpdateInstructionIndex(-1);
            props.onChangeInsructions(tmpInstructions);
        }

        setInstruction('');
 
    }

    
    return(<div>
                {instructions.length<1&&<Typography variant="body1">You need to add at list one innstruction.</Typography>}
                <List>
                    {instructions.map((ins,index)=> (
                    <ListItem key={index}>
                        <ListItemText>
                            <Typography>
                                {ins.number+1}.-   {ins.name}
                            </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>                    
                            <IconButton edge="end" aria-label="update"  onClick={()=>{
                                setInstruction(ins.name)
                                setUpdateInstructionMode(true);
                                setUpdateInstructionIndex(ins.number)}}>
                             <UpdateIcon  color="primary"/>
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={()=>deleteInstruction(+ins.number)}>
                             <DeleteIcon color="secondary"/>
                            </IconButton>
                            
                        </ListItemSecondaryAction>
                    </ListItem>
                    ))}
                 </List>       
                    <TextField
                        value={instruction}
                        id="instruction"
                        label="Instruction"
                        name="instruction"
                        size="small"
                        onChange={event=>setInstruction(event.target.value)}
                    />
                    <IconButton color="secondary" onClick={()=>addOrUpdateInstruction()}>
                        <AddBoxIcon fontSize="large"  />
                    </IconButton>
                    </div>
    )
}


export default InstructionsList;