import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes,Navigate  } from 'react-router-dom';
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
import CreateUser from './components/admin/user/CreateUser';
import Revenue from './components/admin/revenue/Revenue';
import Home from './components/Home';
import Login from './components/Login';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import ProductDetailPage from './components/ProductDetailPage';
import UserPage from './components/UserPage';
import CheckOut from './components/CheckOut';
import OrderSuccess from './components/OrderSuccess';
import NotFound from './components/NotFound';
import PaymentResult from './components/PaymentResult';
import { useSelector } from 'react-redux';
import withAdminAuth from './path/withAdminAuth ';
function App() { 
  const AdminDashboard = withAdminAuth(Dashboard);
  const AdminProduct = withAdminAuth(Product);
  const AdminCreateProduct = withAdminAuth(CreateProduct);
  const AdminProductDetail = withAdminAuth(ProductDetail);
  const AdminCategories = withAdminAuth(Categories);
  const AdminCreateCategory = withAdminAuth(CreateCategory);
  const AdminOrder = withAdminAuth(Orders);
  const AdminUser = withAdminAuth(Users);
  const AdminCreateUser = withAdminAuth(CreateUser);
  const AdminRevenuer = withAdminAuth(Revenue);
  return (
    <div>
        <Router>
              <div>
                <Routes>
                    <Route path="/" exact Component={Home}></Route>
                    <Route path='/register'exact Component={Register}></Route>
                    <Route path="/login" exact Component={Login}></Route>
                    <Route path="/products" exact Component={ProductPage}></Route>
                    <Route path="/cart" exact Component={CartPage}></Route>
                    <Route path="/product/:slug" exact Component={ProductDetailPage}></Route>
                    <Route path="/user/info" exact Component={UserPage}></Route>
                    <Route path="/checkout" exact Component={CheckOut}></Route>
                    <Route path="/order/success" exact Component={OrderSuccess}></Route>
                    <Route path="/payment-result" exact Component={PaymentResult}  ></Route>
                    

      
                    <Route path='/admin/login'exact Component={AdminLogin}></Route>
                    <Route path="/admin" exact Component={AdminDashboard}></Route>
                    <Route path='/admin/dashboard'exact Component={AdminDashboard}></Route>
                    <Route path='/admin/products'exact Component={AdminProduct}></Route>
                    <Route path='/admin/product/add-product'exact Component={AdminCreateProduct}></Route>
                    <Route path='/admin/product/product-detail/:id'exact Component={AdminProductDetail}></Route>
                    <Route path='/admin/categories'exact Component={AdminCategories}></Route>
                    <Route path='/admin/category/add-category'exact Component={AdminCreateCategory}></Route>
                    <Route path='/admin/orders'exact Component={AdminOrder}></Route>
                    <Route path='/admin/users'exact Component={AdminUser}></Route>
                    <Route path='/admin/user/create'exact Component={AdminCreateUser}></Route>
                    <Route path='/admin/revenue'exact Component={AdminRevenuer}></Route>
                    


                    <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
      </Router>
      </div>
    );
}

export default App;
