import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/RegisterUser';
import AdminLogin from './components/admin/LoginAdmin';
function App() {
  return (
  <div>
      <Router>
            <div className="container">
              <Routes>
                  <Route path='/register'exact Component={Register}></Route>
                  <Route path='/admin/login'exact Component={AdminLogin}></Route>
              </Routes>
            </div>
    </Router>
    </div>
  );
}

export default App;
