import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Modal } from 'react-bootstrap';
import moment from 'moment-timezone';
import {startOfDay, addDays,addMinutes, setHours, setMinutes, getDay } from 'date-fns';

const EventForm = () => {
  const [eventData, setEventData] = useState({
    startTime: new Date(),
    endTime: new Date(),
    discountRate: 0,
    productVariantIds: []
  });

  const [variants, setVariants] = useState([]); // State cho danh sách các productVariant

  useEffect(() => {
    // Fetch productVariants từ API của bạn
    const fetchProductVariants = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/product/variant/all');
        setVariants(data); // Giả sử response trả về mảng các productVariant
        console.log(data)
      } catch (error) {
        console.error(error);
      }
    };
    const fetch = ()=>{
      const { data } =  axios.get('http://localhost:8080/api/events/active');
    }

    fetchProductVariants()
    fetch();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleVariantChange = (e) => {
    // Lấy tất cả các option đã được chọn
    const selectedVariants = Array.from(e.target.selectedOptions, option => option.value);
    setEventData({ ...eventData, productVariantIds: selectedVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    //   const formattedStartTime = moment(eventData.startTime).tz('Asia/Ho_Chi_Minh').format();
    // const formattedEndTime = moment(eventData.endTime).tz('Asia/Ho_Chi_Minh').format();
    const formattedStartTime = moment(eventData.startTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndTime = moment(eventData.endTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');
      // Đảm bảo rằng dữ liệu gửi đi đúng định dạng mà API backend mong đợi
      const formattedEventData = {
        ...eventData,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        productVariantIds: eventData.productVariantIds
      };

      const response = await axios.post('http://localhost:8080/api/events', formattedEventData);
      console.log(response.data);
      // Bạn có thể chuyển hướng người dùng sau khi thêm thành công hoặc hiển thị thông báo
    } catch (error) {
      console.error(error);
      // Xử lý lỗi ở đây, ví dụ hiển thị thông báo lỗi
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [checkedVariants, setCheckedVariants] = useState({});
  const handleCheckVariant = (variantId) => {
    setCheckedVariants(prevCheckedVariants => ({
      ...prevCheckedVariants,
      [variantId]: !prevCheckedVariants[variantId]
    }));
  };
  const handleSaveVariants = () => {
    const selectedVariants = Object.entries(checkedVariants)
      .filter(([_, isChecked]) => isChecked)
      .map(([id, _]) => id);
    setEventData({ ...eventData, productVariantIds: selectedVariants });
    setShowModal(false);
  };
  const currentDate = new Date();
  const getMinTime = (date) => {
    if (getDay(date) === getDay(new Date())) {
      // Nếu ngày được chọn là ngày hiện tại, giới hạn giờ không được là quá khứ
      return currentDate;
    }
    // Nếu là ngày khác, cho phép tất cả giờ trong ngày
    return setHours(setMinutes(new Date(), 0), 0);
  };
  const getMinTimeForEndTime = () => {
    if (getDay(eventData.endTime) === getDay(eventData.startTime)) {
      const thirtyMinutesLater = addMinutes(eventData.startTime, 30);
      if (getDay(thirtyMinutesLater) !== getDay(eventData.startTime)) {
        return setHours(setMinutes(new Date(), 0), 0);
      }
      return thirtyMinutesLater;
    }
    return setHours(setMinutes(new Date(), 0), 0);
  };

  const [minEndDate, setMinEndDate] = useState(currentDate);
  const handleDateChange = (name, date) => {
    setEventData({ ...eventData, [name]: date });

    if (name === "startTime") {
      const hour = date.getHours();
      const minute = date.getMinutes();
      const thirtyMinutesLater = addMinutes(date, 30);

      // Cập nhật endTime và minEndDate khi startTime quá muộn trong ngày
      if (hour >= 23 && minute >= 30) {
        const nextDay = startOfDay(addDays(date, 1));
        setEventData(prev => ({ ...prev, endTime: nextDay }));
        setMinEndDate(nextDay); // Cập nhật minEndDate
      } else if (getDay(thirtyMinutesLater) !== getDay(date)) {
        // Nếu thêm 30 phút vào startTime là ngày tiếp theo, cũng cập nhật minEndDate
        setMinEndDate(startOfDay(addDays(date, 1)));
      } else {
        // Nếu không, giữ minEndDate là ngày hiện tại hoặc ngày của startTime
        setMinEndDate(date);
      }
    } else if (name === "endTime") {
      // Cập nhật endTime bình thường
      setEventData(prev => ({ ...prev, [name]: date }));
    }
  };
  return (
    <>
    <form onSubmit={handleSubmit}>
      <h2>Create New Event</h2>
      <div>
        <label>Start Time:</label>
        <DatePicker
          selected={eventData.startTime}
          onChange={(date) => handleDateChange('startTime', date)}
          showTimeSelect
          dateFormat="Pp"
          minDate={currentDate} // Chỉ định thời gian tối thiểu là thời gian hiện tại
          minTime={getMinTime(eventData.startTime)} // Chỉ định thời gian tối thiểu trong ngày là thời gian hiện tại
          maxTime={setHours(setMinutes(new Date(), 59), 23)} // Chỉ định thời gian tối đa trong ngày là cuối ngày
        />
      </div>
      <div>
        <label>End Time:</label>
        <DatePicker
          selected={eventData.endTime}
          onChange={(date) => handleDateChange('endTime', date)}
          showTimeSelect
          dateFormat="Pp"
          minDate={minEndDate} // Không cho phép endTime trước startTime
          minTime={getMinTimeForEndTime()}
          maxTime={setHours(setMinutes(new Date(), 59), 23)}
        />
      </div>
      <div>
        <label>Discount Rate:</label>
        <input
          type="number"
          name="discountRate"
          value={eventData.discountRate}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Product Variants:</label>
         <Button variant="primary" onClick={() => setShowModal(true)}>
          Choose Variants
        </Button>
      </div>
      <button type="submit">Add Event</button>
    </form>
     <Modal show={showModal} onHide={() => setShowModal(false)}>
     <Modal.Header closeButton>
       <Modal.Title>Select Product Variants</Modal.Title>
     </Modal.Header>
     <Modal.Body>
       {variants.map(variant => (
         <div key={variant.id} className="form-check">
           <input
             className="form-check-input"
             type="checkbox"
             value={variant.id}
             checked={!!checkedVariants[variant.id]}
             onChange={() => handleCheckVariant(variant.id)}
           />
           <label className="form-check-label">
             {variant.name}/{variant.product.name}
           </label>
         </div>
       ))}
     </Modal.Body>
     <Modal.Footer>
       <Button variant="secondary" onClick={() => setShowModal(false)}>
         Close
       </Button>
       <Button variant="primary" onClick={handleSaveVariants}>
         Save Changes
       </Button>
     </Modal.Footer>
   </Modal>
   </>
  );
};

export default EventForm;
