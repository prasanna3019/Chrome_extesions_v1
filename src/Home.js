import {useState} from 'react';
import { Link } from "react-router-dom";
import ListObjectSchema from "./ListObjectSchema";
import QueryCompass from "./QueryCompass";
import ResultQuery from "./ResultQuery";
import Start from './Start'

const Home = () => {

const [initPage, setInitPage] = useState(true)
const [files, setFiles] = useState(null);
const [token, setToken] = useState(null)
const [query, setQuery] = useState("Select ") 
const [loading, setLoading] = useState(false)
const [result, setResult] = useState([])
const [err, setErr] = useState(null)


    return(

            <div>
                {initPage ? (
                    <Start setInitPage={setInitPage} setFiles={setFiles} setToken={setToken}/>
                ) : (
                   
                    <div className="wrapper">
                        <div className="left">
                            <ListObjectSchema 
                                setQuery={setQuery} 
                                files={files} 
                                token={token}
                                setResult={setResult}
                            />
                        </div>
                        <div className="up">
                            <QueryCompass 
                                query={query} 
                                setQuery={setQuery} 
                                files={files} 
                                setLoading={setLoading}
                                loading={loading}
                                setResult={setResult}
                                setErr={setErr}
                                token={token}
                                setInitPage={setInitPage}
                            />
                        </div>
                        <div className="down">
                            <ResultQuery 
                                loading={loading} 
                                result={result}
                            />
                        </div>
                    </div>
 
                )}


            </div>
        )

       
    
}

export default Home;