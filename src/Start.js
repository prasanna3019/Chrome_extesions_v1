/*global chrome*/
import logo from './assets/images/infor-ai.png';
import {useState} from 'react';

const Start = ({setInitPage, setFiles, setToken}) => {

    const[disableBtn, setDisableBtn] = useState(true)
    const[result, setResult] = useState()

const handleClick = () => {
    const ionapi = {
        "pu":result.pu,
        "ot":result.ot,
        "ci":result.ci,
        "cs":result.cs,
        "oa":result.oa,
        "ru":result.ru
    }
   //make a call to background script to get the ION API token
   chrome.runtime.sendMessage({message: "login", file:JSON.stringify(ionapi)}, (response) => {
    console.log(response.message);
    setToken(response.message)
    setInitPage(false)
  });

}


const handleChange = e => {
    setDisableBtn(true)
    if(e.target.files.length == 0) return;
    const file = e.target.files[0];
    const filename = file.name
    let last_dot = filename.lastIndexOf('.')
    let ext = filename.slice(last_dot + 1)
    if( ext !== 'ionapi') {
        alert('Wrong file type, select file of type .ionapi');    
        e.target.value = "";
        return;
    }
    const fileReader = new FileReader();
    console.log("e.target", e.target.files[0].name);
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
        const jsonres = JSON.parse(e.target.result)
        if ("saak" in jsonres){
            alert('Wrong IONAPI file, select Webapp')
            return;            
        } else {
            setResult(jsonres)
            setFiles(jsonres);
            setDisableBtn(false)
        }
      
    };
  };

    return(
        <p style={{display:"flex", alignItems:"center", flexDirection:"column", justifyContent:"center", height:"100vh"}}>
            <img src={logo} alt="Infor Applied Innovation"/>
            <h3>Infor Applied Innovation</h3>
        <h1 style={{ backgroundColor: "#36B0D7", color:"white", padding:"10px 10px"}}>Mini Compass DataLake OAuth2</h1>
        <h2 style={{ backgroundColor: "#36B0D7", color:"white", padding:"10px 10px"}}>Upload ION API File (Webapp)</h2>

        <input type="file" onChange={handleChange} accept=".ionapi" style={{margin:"10px auto"}}/>
        <button disabled={disableBtn} onClick={handleClick} style={{ backgroundColor: "#36B0D7", color:"white", borderRadius:"5px", padding:"5px 5px", fontWeight:"bold", margin:"10px"}}>Authorize App</button>
        <br />
        <p>Copyright &copy; 2021</p>
        </p>
    )
}

export default Start;