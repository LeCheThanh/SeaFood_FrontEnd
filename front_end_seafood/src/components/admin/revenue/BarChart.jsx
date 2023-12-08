import React, { useState,useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJs} from 'chart.js/auto'
import AdminApiService from '../../../service/AdminApiService';

function BarChart() {
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
  
    const fetchMonthlySales = async () => {
      const salesPromises = [];
      for (let month = 1; month <= 12; month++) {
        const response = await AdminApiService.monthlySales(currentYear, month);
        salesPromises.push(response.data);
      }
      const salesData = await Promise.all(salesPromises);
      setMonthlySales(salesData);
    };
  
    fetchMonthlySales().catch(error => {
      console.log(error);
    });
  }, []);
  const data1 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'VND',
        data: monthlySales,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
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
        text: 'Doanh thu theo tháng',
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
      <Bar 
        data={data1}
        height={400}
        width={600}
        options={options}
      />

    </div>
  ) 
}

export default BarChart;