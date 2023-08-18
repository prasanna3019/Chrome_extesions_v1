import {useState, useEffect} from 'react';
import axios from "axios";
import Logout from './assets/images/logout.png'
const QueryCompass = ({query, setQuery, files, setLoading, loading, setResult, setErr, token, setInitPage}) => {
    const [offset, setNumoffset] = useState('');
    const [Limit, setNumLimit] = useState('');

  const handleClick = () => {
    setQuery("Select ")
    setResult([])
    setInitPage(true)
  } 

// Create datalake JOB
const jobs = async (q,t,f) => {
// q = query, t = token, f = ionapi file

	const url = f.iu + "/" + f.ti + "/DATAFABRIC/compass/v2/jobs/?queryExecutor=datalake"
	const settings = {
							method:"POST",
							headers:{'content-Type':'text/plain',
							'Access-Control-Allow-Origin': 'chrome-extension://jcegbkbhjghopehiejbaiohjppehdnbo',
							'Authorization':'Bearer '+t},
							data:q
					}
	
	const r = await axios(url,settings)
	return r.data
}
// Check the status of the JOB
const checkStatus = async (p,t,f) => {
// p = path, t = token, f = ionapi file	

	const url =  f.iu + "/" + f.ti + "/DATAFABRIC/compass/v2/" + p + "/?timeout=0&queryExecutor=datalake"
    let status = null;
    // check job status
    while(true){
        try {
            const json = await axios(url,{
                method: 'GET',
                headers:{ 
                    'Authorization': 'Bearer ' + t,
                    'Content-Type':'text/plain'
                  }      
            })
            status = json.data.status
            console.log(status)
            if(status === "FINISHED"){
                break;
            }
            if(status === "FAILED"){
                break;
                //throw new Error(status)
            }
        } catch (error) {
            status = "CATCH"
        }
    }

	return status	
}
// read the data returned by the JOB
const getData = async (q,t,f) => {
// q = queryId, t = token, f = ionapi file	
   var url

   let recSet = null;
   if(Limit)
   {
    console.log(Limit+"in if")
    if (offset)
            {var url =  f.iu + "/" + f.ti + "/DATAFABRIC/compass/v2/jobs/" + q + "/result/?offset="+offset+"&limit="+Limit+"&queryExecutor=datalake"}
    else 
            {var url =  f.iu + "/" + f.ti + "/DATAFABRIC/compass/v2/jobs/" + q + "/result/?offset=0&limit="+Limit+"&queryExecutor=datalake"}
   }
   else
   {
   if (offset)
           {var url =  f.iu + "/" + f.ti + "/DATAFABRIC/compass/v2/jobs/" + q + "/result/?offset="+offset+"&limit=1000&queryExecutor=datalake"}
   else 
           {var url =  f.iu + "/" + f.ti + "/DATAFABRIC/compass/v2/jobs/" + q + "/result/?offset=0&limit=1000&queryExecutor=datalake"}
    }

   try {
    const json = await axios(url,{
        method: 'GET',
        headers:{ 
            'Authorization': 'Bearer ' + t,
            'accept':'application/x-ndjson'
          }      
    })
    if(json.data != ""){
        try {
            recSet = json.data.split("\n")
        } catch (error) {
            recSet = [JSON.stringify(json.data)]
        }
        
    } else {
        recSet = ["{\"Result\":\"NO DATA\"}"]
    }
    
    } catch (error) {
        recSet = [`{"ERROR":"${error}"}`]
    }

   return recSet
	
}

const runQuery = async (q) => {

  setLoading(true)

	 let retJob = {}
	 let status = ""
	 let retData = null
//----------------------------------------------------------
	// Create Job
	try{
		retJob = await jobs(q,token,files)
		//console.log("location ",retJob.location)
		//console.log("queryId ", retJob.queryId)		
	}catch(error){
		setResult([`{"ERROR":"${error}"}`])
	}
//----------------------------------------------------------	
	//Check Status
	try{
		status = await checkStatus(retJob.location,token,files)
		//console.log("status ", status)
	}catch(error){
		setResult([`{"ERROR":"${error}"}`])
	}
//----------------------------------------------------------	
	// if status OK then gerData
	if(status=== "FAILED" || status === "CATCH"){
		setResult([`{"ERROR":"${status}"}`])
    } else {
		retData = await getData(retJob.queryId,token,files)
		//console.log(retData)
		setResult(retData)		
	}
	
	setLoading(false)
}

    return(
        <div>
          <img src={Logout} height="20px" width="20px" style={{float:"left", paddingRight:"20px", margin:"10px", cursor:"pointer"}} onClick={handleClick}/>
          <form>
          <textarea  style={{margin:"20px auto", fontWeight:"bold"}} value={query} onChange={(e)=>setQuery(e.target.value)} rows={15} cols={80}/>
          <br></br>
          </form>
          <div className="input-group">
                <label htmlFor="Offest" style={{backgroundColor: "#36B0D7",margin: 8, color:"white", borderRadius:"5px", padding:"5px 5px", fontWeight:"bold"}}>Offset :</label>
                <input type="number" name="offset" value={offset} onChange={(e,limit=5) => setNumoffset(e.target.value.slice(0,limit))} pattern='[0-9]' placeholder="Enter Offest number "/>
                <label htmlFor="Limit" style={{backgroundColor: "#36B0D7", color:"white",margin: 8, borderRadius:"5px", padding:"5px 5px", fontWeight:"bold"}}>Limit  :</label>
                <input type="number" name="Limit" value={Limit} onChange={(e,limit=5) => setNumLimit(e.target.value.slice(0,limit))} pattern='[0-9]' placeholder="Enter Limit"/>
          </div>
          <br></br>
          <button style={{ backgroundColor: "#36B0D7", color:"white", borderRadius:"5px", padding:"5px 5px", fontWeight:"bold"}} hidden={loading} onClick={()=>runQuery(query)}>Run Query</button>
          <br></br>
        
        </div>
    )
}

export default QueryCompass;