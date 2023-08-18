import {useState, useEffect} from 'react';
import Logout from './assets/images/logout.png'
const QueryCompass = ({query, setQuery, files, setLoading, loading, setResult, setErr, token, setInitPage}) => {

  const handleClick = () => {
    setQuery("Select ")
    setResult([])
    setInitPage(true)
  } 

const runQuery = (q) => {

  setLoading(true)

  const obj = {
    token:token,
    q:q, // query
 // url:"https://mingle-ionapi.inforcloudsuite.com/MINGLETEST1_DEV/IONSERVICES/datalakeapi/v1/compass/jobs?resultFormat=text/csv",
    host: files.iu, //"https://mingle-ionapi.inforcloudsuite.com",
    resource:"/" + files.ti + "/IONSERVICES/datalakeapi/v1/compass/jobs?resultFormat=application%2Fx-ndjson"
  }
     fetch('http://localhost:3000/test',{
       method: 'POST',
       headers:{'content-Type':'application/json'},
       body:JSON.stringify(obj)
     })
     .then(res => res.json())
     .then(json => {
       setLoading(false)
       console.log("data :", json.data)
       console.log("err :", json.error)
       if(json.error){
         setErr(json.error)
       } else if(json.data){
         setResult(json.data)
       } else {
         setResult({"Response":"NO DATA"})
       }
    
     })
     .catch(err => {
       setErr({"Error":err})
       console.log(err)
     })

}

    return(
        <div>
          <img src={Logout} height="20px" width="20px" style={{float:"left", paddingRight:"20px", margin:"10px", cursor:"pointer"}} onClick={handleClick}/>
          <form>
          <textarea  style={{margin:"20px auto", fontWeight:"bold"}} value={query} onChange={(e)=>setQuery(e.target.value)} rows={15} cols={80}/>
          <br></br>
          </form>

          <button style={{ backgroundColor: "#36B0D7", color:"white", borderRadius:"5px", padding:"5px 5px", fontWeight:"bold"}} hidden={loading} onClick={()=>runQuery(query)}>Run Query</button>
          <br></br>
        
        </div>
    )
}

export default QueryCompass;