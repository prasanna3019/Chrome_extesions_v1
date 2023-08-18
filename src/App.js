import { MemoryRouter as Router, Route} from "react-router-dom";
import Home from "./Home";
import './App.css';

function App() {
  return (

    <Router>
    <div style={{width:"800px", height:"600px"}}>
      <Route path="/" exact component={Home} />
    </div>
  </Router>

  );
}

export default App;
