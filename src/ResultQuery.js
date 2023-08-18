import {useState,useEffect} from 'react';
import ScaleLoader from "react-spinners/ScaleLoader";
import MUIDataTable from "mui-datatables";

const ResultQuery = ({loading, result}) => {    

const[head, setHead] = useState([])
const[data, setData] = useState([])

  const options = {
    filterType: "dropdown",
    selectableRows: "none",
    responsive: "standard"
  }; 

useEffect(()=> {

    setData([])
    setHead([])
    if(result.length>0) {
        const columns = Object.keys(JSON.parse(result[0]));
        console.log("keys = ", Object.keys(result[0]));
        const values = result.map(item =>
          Object.entries(JSON.parse(item)).map(entry => entry[1])
        );
        console.log("values = ", values); 
        setData(values)
        setHead(columns)    
    }
    
},[result])

    return(
        <>
        {loading ? (
            <div style={{display:"flex", alignItems:"center", flexDirection:"column", height:"100vh"}}>
                <ScaleLoader color={"#36B0D7"} loading={loading} height={70} width={6} radius={2} margin={2} />
                <p style={{color:"#36B0D7", fontWeight:"bold"}}>Fetching Data...</p>
            </div>
        ):(
            <>
                <div style={{margin:"15px"}}>
                    {result.length>0 &&(
                        <MUIDataTable 
                            title={"REPORT"} 
                            data={data} 
                            columns={head} 
                            options={options}
                        />
                    )}
                </div>
            </>
        )}
 
        </>
    )
}

export default ResultQuery;