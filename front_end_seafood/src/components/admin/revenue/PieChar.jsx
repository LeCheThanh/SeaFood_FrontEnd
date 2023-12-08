import React, { useState,useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {Chart as ChartJs} from 'chart.js/auto'
import AdminApiService from '../../../service/AdminApiService';
import { getRandomColor } from '../../../utils/getRandomColor';

function PieChar() {
    const[data,setData]=useState([{}]);
    useEffect(()=>{
        const fetchStatistics = async () => {
            const response = await AdminApiService.statistics();
            setData(response.data);
            console.log(response.data[0].product.name)
          };
        
          fetchStatistics().catch(error => {
            console.log(error);
          });
        }, []);
    
    const data1 = {
        labels: data.map(item => item.product && item.product.name),
        datasets: [
          {
            label: 'Số lượng',
            data: data.map(item=>item.totalSoldQuantity),
            backgroundColor: data.map(()=>getRandomColor()),
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
            text: 'Số lượng sản phẩm bán được',
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
  return (
    <Pie  data={data1}
    height={400}
    width={600}
    options={options}/>
  )
}

export default PieChar