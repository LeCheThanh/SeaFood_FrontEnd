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
import ProductDetail from './components/admin/product/ProductDetail';
import Categories from './components/admin/category/Categories';
import CreateCategory from './components/admin/category/CreateCategory';
import Orders from './components/admin/order/Orders';
import Users from './components/admin/user/Users';
function App() {
  return (
  <div>
      <Router>
            <div>
              <Routes>
                  <Route path="/admin" exact Component={Dashboard}></Route>
                  <Route path='/admin/dashboard'exact Component={Dashboard}></Route>
                  <Route path='/admin/products'exact Component={Product}></Route>
                  <Route path='/admin/product/add-product'exact Component={CreateProduct}></Route>
                  <Route path='/admin/product/product-detail/:id'exact Component={ProductDetail}></Route>
                  <Route path='/admin/categories'exact Component={Categories}></Route>
                  <Route path='/admin/category/add-category'exact Component={CreateCategory}></Route>
                  <Route path='/admin/orders'exact Component={Orders}></Route>
                  <Route path='/admin/users'exact Component={Users}></Route>
                  <Route path='/admin/login'exact Component={AdminLogin}></Route>
                  <Route path='/register'exact Component={Register}></Route>
              </Routes>
            </div>
    </Router>
    </div>
  );
}

export default App;
