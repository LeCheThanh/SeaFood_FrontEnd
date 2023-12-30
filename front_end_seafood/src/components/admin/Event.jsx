    import React, { useEffect, useState } from 'react'
    import Sidebar from './Sidebar';
    import Nav from './Nav';
    import { Link } from 'react-router-dom';
    import { toast, ToastContainer } from 'react-toastify';
    import { formatDate } from '../../utils/formatDate';
    import { format } from 'date-fns';
    import {startOfDay, addDays,addMinutes, setHours, setMinutes, getDay } from 'date-fns';
    import { Modal, Button } from 'react-bootstrap';
    import axios from 'axios';
    import DatePicker from 'react-datepicker';
    import moment from 'moment-timezone';

    function Event() {
        const [toggle, setToggle] = useState(true);
        const Toggle = () => {
          setToggle(!toggle);
        };
        const [events, setEvents] = useState([]); // Dữ liệu cho tất cả các sự kiện
        const [activeEvents, setActiveEvents] = useState([]); // IDs của các sự kiện đang active
        const [variants, setVariants] = useState([]); // State cho danh sách các productVariant
        useEffect(()=>{
            // fetch('http://localhost:8080/api/events/all')
            // .then(response => response.json())
            // .then(data => setEvents(data));
          // Fetch các sự kiện đang active
          fetch('http://localhost:8080/api/events/active')
            .then(response => response.json())
            .then(data => setActiveEvents(data.map(event => event.id))); // Lưu ý: Giả sử rằng mỗi sự kiện có một 'id' duy nhất

            const fetchProductVariants = async () => {
              try {
                const { data } = await axios.get('http://localhost:8080/api/product/variant/all');
                setVariants(data); // Giả sử response trả về mảng các productVariant
                console.log(data)
              } catch (error) {
                console.error(error);
              }
            };
            fetchProductVariants();
            fetchEvent();
        }, []);
        const fetchEvent= async ()=>{
          try{

            const response = await axios.get('http://localhost:8080/api/events/all');
            setEvents(response.data);
          }catch(err){
            console.log(err);
          }
        };

        const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
      const ordersPerPage = 10; // Số lượng đơn hàng trên mỗi trang
      const indexOfLastOrder = currentPage * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      const currentCategories = events.slice(indexOfFirstOrder, indexOfLastOrder);

      const [eventById,setEventById] = useState({});  
      const [showModalUpdate, setShowModalUpdate] = useState(false);
      const openModalUpdate = () =>{
        setShowModalUpdate(true);
      }
      const closeModalUpdate = () => {
        setShowModalUpdate(false);
      };
      const [eventUpdateRequest,setEventUpdateRequest] = useState({
        startTime: new Date(),
        endTime: new Date(),
        discountRate: 0,
        name:'',
        productVariantIds: []
      });
      const getEventById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/events/${id}`);
            const eventData = response.data;
            setEventById(eventData);
            setEventUpdateRequest({ // Cập nhật dữ liệu form với thông tin sự kiện
                nameEvent: eventData.name,
                startTime: new Date(eventData.startTime),
                endTime: new Date(eventData.endTime),
                discountRate: eventData.discountRate,
                productVariantIds: eventData.productVariants.id // Giả sử bạn có thông tin này trong sự kiện
            });

       
            const variantSelection = {};
            eventData.productVariants.forEach(variant => {
                variantSelection[variant.id] = true; // Sửa ở đây
            });
            setCheckedVariants(variantSelection);
            openModalUpdate();
            
        } catch (err) {
            console.log(err);
        }
    };
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventUpdateRequest({ ...eventUpdateRequest, [name]: value });
    };
      const handleUpdateSubmit = async () => {
      try {
        const formattedStartTime = moment(eventUpdateRequest.startTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');
        const formattedEndTime = moment(eventUpdateRequest.endTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');
        const formattedEventData = {
          ...eventUpdateRequest,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        };
          const response = await axios.put(`http://localhost:8080/api/events/${eventById.id}`, formattedEventData);
          if (response.status === 200) {
              // Handle successful update
              closeModalUpdate();
              toast.success('Sự kiện cập nhật thành công!');
              fetchEvent();
              // Refresh or update your events list here if necessary
          } else {
              // Handle other statuses or errors
              toast.error("có lỗi xảy ra");
          }
      } catch (error) {
          console.error('Error updating event:', error);
          toast.error(error.response.data);
      }
      };
      const handleVariantChange = (e) => {
        // Lấy tất cả các option đã được chọn
        const selectedVariants = Array.from(e.target.selectedOptions, option => option.value);
        setEventUpdateRequest({ ...eventUpdateRequest, productVariantIds: selectedVariants });
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
          setEventUpdateRequest({ ...eventUpdateRequest, productVariantIds: selectedVariants });
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
        if (getDay(eventUpdateRequest.endTime) === getDay(eventUpdateRequest.startTime)) {
          const thirtyMinutesLater = addMinutes(eventUpdateRequest.startTime, 30);
          if (getDay(thirtyMinutesLater) !== getDay(eventUpdateRequest.startTime)) {
            return setHours(setMinutes(new Date(), 0), 0);
          }
          return thirtyMinutesLater;
        }
        return setHours(setMinutes(new Date(), 0), 0);
      };

      const [minEndDate, setMinEndDate] = useState(currentDate);
      const handleDateChange = (name, date) => {
        setEventUpdateRequest({ ...eventUpdateRequest, [name]: date });

        if (name === "startTime") {
          const hour = date.getHours();
          const minute = date.getMinutes();
          const thirtyMinutesLater = addMinutes(date, 30);

          // Cập nhật endTime và minEndDate khi startTime quá muộn trong ngày
          if (hour >= 23 && minute >= 30) {
            const nextDay = startOfDay(addDays(date, 1));
            setEventUpdateRequest(prev => ({ ...prev, endTime: nextDay }));
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
          setEventUpdateRequest(prev => ({ ...prev, [name]: date }));
        }
      };
      return (
        <div className="container-fluid bg-secondary min-vh-100">
        <div className="row">
          {toggle && (
            <div className="col-4 col-md-2 bg-white vh-100 position-fixed">
              <Sidebar />
            </div>
          )}
          {toggle && <div className="col-4 col-md-2"></div>}
          <div className="col">
            <div className="px3">
              <Nav Toggle={Toggle} />
              <div className="container-fluid">
                <div className="row g-3 my-2"></div>
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to="/admin/event/add-event">
                  <button type="button" className="btn btn-primary">
                    Thêm sự kiện
                  </button>
                </Link>
              </div>
              {events && events.length > 0 ? (
                <div>
                  <table className="table caption-top bg-white rounded mt-2" style={{ verticalAlign: 'middle' }}>
                    <caption className="text-white fs-4">Danh sách sự kiện</caption>
                    <thead className="text-center">
                      <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Tên sự kiện</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Ngày bắt đầu</th>
                        <th scope="col">Ngày kết thúc</th>
                        <th scope="col">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {currentCategories.map((event, index) => (
                        <tr key={event.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{event.name}</td>
                          {activeEvents.includes(event.id) ?
                            <p className='bg-success text-white p-2 d-inline-block'>Active <i className="bi bi-check"></i></p> :
                            <p className='bg-danger text-white p-2 d-inline-block'>Nonactive <i class="bi bi-x"></i></p>}
                          <td>{format(new Date(event.startTime), 'dd/MM/yyyy HH:mm')}</td>
                          <td>{format(new Date(event.endTime), 'dd/MM/yyyy HH:mm')}</td>

                          <td>
                          <button class="btn btn-outline-primary" onClick={() => getEventById(event.id)}><i class="bi bi-pencil-fill"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Hiển thị nút Previous */}
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {/* Hiển thị số trang */}
                  {Array.from({ length: Math.ceil(events.length / ordersPerPage) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      disabled={currentPage === index + 1}
                    >
                      {index + 1}
                    </button>
                  ))}

                  {/* Hiển thị nút Next */}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(events.length / ordersPerPage)}
                  >
                    Next
                  </button>
                </div>
              ) : (
                <p>Loading.....</p>
              )}
            </div>
            <Modal show={showModalUpdate} onHide={closeModalUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi Tiết Sự Kiện</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {eventById ? (
                            <form onSubmit={(e) => {e.preventDefault(); handleUpdateSubmit();}}>
                                <div className="form-group">
                                    <label>Tên Sự Kiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={eventUpdateRequest.nameEvent}
                                        onChange={handleInputChange}
                                        name="nameEvent"
                                    />
                                </div>

                                <div className="form-group">
                                      <label>Ngày Bắt Đầu:</label>
                                      <DatePicker 
                                          selected={eventUpdateRequest.startTime}
                                          onChange={(date) => setEventUpdateRequest({...eventUpdateRequest, startTime: date})}
                                          showTimeSelect
                                          dateFormat="Pp"
                                          className="form-control"
                                          minDate={currentDate} // Chỉ định thời gian tối thiểu là thời gian hiện tại
                                          minTime={getMinTime(eventUpdateRequest.startTime)} // Chỉ định thời gian tối thiểu trong ngày là thời gian hiện tại
                                          maxTime={setHours(setMinutes(new Date(), 59), 23)} // Chỉ định thời gian tối đa trong ngày là cuối ngày
                                      />
                                  </div>

                                  <div className="form-group">
                                      <label>Ngày Kết Thúc:</label>
                                      <DatePicker 
                                          selected={eventUpdateRequest.endTime}
                                          onChange={(date) => setEventUpdateRequest({...eventUpdateRequest, endTime: date})}
                                          showTimeSelect
                                          dateFormat="Pp"
                                          className="form-control"
                                          minDate={minEndDate} // Không cho phép endTime trước startTime
                                          minTime={getMinTimeForEndTime()}
                                          maxTime={setHours(setMinutes(new Date(), 59), 23)}
                                      />
                                  </div>
                                  <div className="form-group">
                                    <label>Discount:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={eventUpdateRequest.discountRate}
                                        onChange={handleInputChange}
                                        name="discountRate"
                                    />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Chọn biến thể sản phẩm:</label>
                                  <Button variant="primary" onClick={() => setShowModal(true)} className="d-block">
                                      Chọn biến thể
                                    </Button>
                                </div>

                                <Modal.Footer>
                                    <Button variant="secondary" onClick={closeModalUpdate}>
                                        Đóng
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Lưu Thay Đổi
                                    </Button>
                                </Modal.Footer>
                            </form>
                        ) : (
                            <p>Đang tải thông tin sự kiện...</p>
                        )}
                        </Modal.Body>
                    </Modal>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Chọn sản phẩm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {variants.map(variant => (
                                <div key={variant.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={variant.id}
                                        checked={!!checkedVariants[variant.id]} // Kiểm tra dựa trên state checkedVariants
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
                                Đóng
                            </Button>
                            <Button variant="primary" onClick={handleSaveVariants}>
                                Lưu Thay Đổi
                            </Button>
                        </Modal.Footer>
                    </Modal>

            <ToastContainer />
          </div>
        </div>
      </div>
      )
    }

    export default Event