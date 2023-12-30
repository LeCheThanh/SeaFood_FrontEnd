import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state)=>state.auth.login?.currentUser);
    const token = user?.token;
    const searchParams = new URLSearchParams(location.search);
    const paymentMethod = searchParams.get('paymentMethod');
    console.log(paymentMethod);
    useEffect( () => {
        const processCashOrder = async () => {
            try {
                const orderCode = searchParams.get('orderCode');
                const response = await axios.get('http://localhost:8080/api/payment/cashResult', {
                    params: { orderCode }
                });
    
                if(response.data === 'Đơn hàng đã được xử lý thành công') {
                    navigate('/order/success');
                } else {
                    navigate('/order/failure');
                }
            } catch (error) {
                console.error('Cash payment processing error:', error);
                navigate('/order/failure');
            }
        }
     
        if (paymentMethod === 'cash') {
            processCashOrder();
        } 
        else if (paymentMethod === 'vnpay') {
            // Gọi API GET để xử lý kết quả thanh toán vnpay như bạn đã làm
      
        const orderCode = searchParams.get('orderCode');
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
        const vnp_Amount=searchParams.get('vnp_Amount');
        const vnp_PayDate = searchParams.get('vnp_PayDate');
        // Lấy thêm các tham số khác nếu cần
       

        // Gọi API GET để xử lý kết quả thanh toán
         axios.get('http://localhost:8080/api/payment/vnpayResult', { 
            params: { orderCode, vnp_ResponseCode,vnp_TransactionNo,vnp_Amount,vnp_PayDate },
            headers: {
                Authorization: `Bearer ${token}`
              }})
            .then(response => {
                if(response.status === 200) {
                    navigate('/order/success');
                } else {
                    navigate('/order/failure');
                }
            })
            .catch(error => {
                console.error('Payment processing error:', error);
                navigate('/order/failure');
            });
        }else if(paymentMethod === 'momo'){
            const orderCode = searchParams.get('orderCode');
            const resultCode = searchParams.get('resultCode');
            const partnerCode = searchParams.get('partnerCode');
            const amount=searchParams.get('amount');
            const message = searchParams.get('message');
            const responseTime = searchParams.get('responseTime');
            const transId = searchParams.get('transId');
            axios.get('http://localhost:8080/api/payment/momoResult', { 
                params: { orderCode, resultCode,partnerCode,amount,message,responseTime,transId },
                headers: {
                    Authorization: `Bearer ${token}`
                  }})
                .then(response => {
                    if(response.status === 200) {
                        navigate('/order/success');
                    } else {
                        navigate('/order/failure');
                    }
                })
                .catch(error => {
                    console.error('Payment processing error:', error);
                    navigate('/order/failure');
                });


        }
    }, [navigate, location.search]);

    return (
        <div>Loading...</div> // Hiển thị giao diện tạm thời
    );
};

export default PaymentResult;
