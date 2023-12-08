import React,{useState, useEffect} from 'react'
import Sidebar from '../Sidebar';
import Nav from '../Nav';
import BarChart from './BarChart';
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminApiService from '../../../service/AdminApiService';
import PieChar from './PieChar';
import LineChar from './LineChar';

function Revenue() {
    const [toggle, setToggle] = useState(true);
    const Toggle = ()=>{
        setToggle(!toggle);
    }
  return (
    
    <div className='container-fluid bg-secondary min-vh-100'>
    <div className='row'>
       {toggle && <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
            <Sidebar></Sidebar>
        </div>}
        {toggle && <div className='col-4 col-md-2'></div>}
        <div className='col'>
            <div className='px3'>
                <Nav Toggle={Toggle}></Nav>
                <div className='container-fluid'>
                    <div className='row g-3 my-2'>
                    </div>
                </div>  
              <div className='container bg-white rounded'>
                <div className='container row'>
                    <div className='col-6'>
                        <BarChart  />
                    </div>
                    <div className='col-6'>
                        <PieChar  />  
                    </div>
                </div>
                <div className='container'>
                <LineChar  /> 
                </div>
                       
           </div>
            </div>
        </div>
    </div>
    
</div>
  )
}

export default Revenue