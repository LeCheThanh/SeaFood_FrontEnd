import React from 'react'
import './style.css'
function Sidebar() {
  return (
    <div className='bg-white sidebar'>
        <div className='m-2'>
            <i className='bi bi-bootstrap-fill me-2 fs-4'></i>
            <span className='brand-name fs-4'>PTseaFood</span>
        </div>
        <hr className='text-dark' />
        <div className='list-group list-group-flush'>
            <a className='list-group-item list-group-item py-2'>
                <i className='bi bi-speedometer2 fs-5 me-3'></i>
                <span>Dashboard</span>
            </a>
            <a className='list-group-item list-group-item py-2'>
                <i className='bi bi-house fs-5 me-3'></i>
                <span>Home</span>
            </a>
            <a className='list-group-item list-group-item py-2'>
                <i className='bi bi-table fs-5 me-3'></i>
                <span>Products</span>
            </a>
            <a className='list-group-item list-group-item py-2'>
                <i className='bi bi-list-ul fs-5 me-3'></i>
                <span>Categories</span>
            </a>
            <a className='list-group-item list-group-item py-2'>
                <i className='bi bi-receipt fs-5 me-3'></i>
                <span>Orders</span>
            </a>
            <a className='list-group-item list-group-item py-2'>
                <i className='bi bi-people-fill fs-5 me-3'></i>
                <span>Users</span>
            </a>
            <a className='list-group-item list-group-item py-2'>
                <i className='bi bi-power fs-5 me-3'></i>
                <span>Logout</span>
            </a>
        </div>
    </div>
  )
}

export default Sidebar