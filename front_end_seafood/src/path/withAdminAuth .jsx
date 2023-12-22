import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const withAdminAuth = WrappedComponent => {
    const RequiresAuth = props => {
        const admin = useSelector(state => state.authAdmin.loginAdmin?.currentUser);

        if (!admin) {
            // Chuyển hướng đến trang đăng nhập hoặc trang không có quyền
            return <Navigate to="/admin/login" />;
        }

        return <WrappedComponent {...props} />;
    };

    return RequiresAuth;
};

export default withAdminAuth;
