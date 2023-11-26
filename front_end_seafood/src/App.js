import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Register from './components/RegisterUser';
import AdminLogin from './components/admin/LoginAdmin';
import Dashboard from './components/admin/Dashboard';
import Product from './components/admin/product/Product';
import CreateProduct from './components/admin/product/CreateProduct';
function App() {
  return (
  <div>
      <Router>
            <div>
              <Routes>
                  <Route path='/admin/index'exact Component={Dashboard}></Route>
                  <Route path='/admin/product'exact Component={Product}></Route>
                  <Route path='/admin/add-product'exact Component={CreateProduct}></Route>
                  <Route path='/register'exact Component={Register}></Route>
                  <Route path='/admin/login'exact Component={AdminLogin}></Route>
              </Routes>
            </div>
    </Router>
    </div>
  );
}

export default App;
