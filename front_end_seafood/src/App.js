import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/RegisterUser';
function App() {
  return (
  <div>
      <Router>
            <div className="container">
              <Routes>
                  <Route path='/register'exact Component={Register}></Route>
              </Routes>
            </div>
    </Router>
    </div>
  );
}

export default App;
