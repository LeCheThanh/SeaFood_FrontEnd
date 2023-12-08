import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import {Chart as ChartJs} from 'chart.js/auto'
import AdminApiService from '../../../service/AdminApiService';

function LineChar() {
    const [dataCash, setDataCash] = useState([]);
    const [dataMomo,setDataMomo] = useState([]);
    const [dataVnpay,setDataVnpay] = useState([]);
    const paymentMethods = ['cash', 'momo', 'vnpay'];
    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
      
        const fetchMonthlySales = async () => {
          const salesPromises = [];
          for (let month = 1; month <= 12; month++) {
            const monthSalesPromises = paymentMethods.map(async (method) => {
                const response = await AdminApiService.getOrderByMethod(currentYear, month, method);
                return response.data;
              });
              const monthSalesData = await Promise.all(monthSalesPromises);
              salesPromises.push(monthSalesData);
          }
          const salesData = await Promise.all(salesPromises);

          setDataCash(salesData.map((sales) => sales[0]));
          setDataMomo(salesData.map((sales) => sales[1]));
          setDataVnpay(salesData.map((sales) => sales[2]));
        };
      
        fetchMonthlySales().catch(error => {
          console.log(error);
        });
      }, []);
    const data1 = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Momo',
            data: dataMomo,
            borderColor: 'rgba(255, 19, 115, 0.4)',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
          },
          {
            label: 'VnPay',
            data: dataVnpay,
            borderColor: 'rgba(57, 153, 255, 0.5)',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
          },
          {
            label: 'Cash',
            data: dataCash,
            borderColor: 'rgba(0, 255, 97, 0.5)',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
          },
        ],
      };
      
    
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Doanh thu theo phương thức thanh toán',
          },
          
        },
        maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
              legend: {
                labels: {
                  fontSize: 25,
                },
              },
      };
    
      return(
        <div>
          <Line 
            data={data1}
            height={400}
            width={600}
            options={options}
          />
    
        </div>
      ) 
    }
export default LineChar