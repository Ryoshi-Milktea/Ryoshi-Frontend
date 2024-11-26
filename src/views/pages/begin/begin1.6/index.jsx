import "./index.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

async function getCityList() {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1', {
      method: 'GET',
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map(city => ({
      name: city.name,
      id: city.code,
    }));
  } catch (error) {
    console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    return null;
  }
}

async function getWardList(cityId) {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${cityId}&limit=-1`, {
      method: 'GET',
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map(ward => ({
      name: ward.name,
      id: ward.code,
    }));
  } catch (error) {
    console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    return null;
  }
}

async function getTownList(wardId) {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${wardId}&limit=-1`, {
      method: 'GET',
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map(town => ({
      name: town.name,
      id: town.code,
    }));
  } catch (error) {
    console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    return null;
  }
}

function Begin1_6() {
  const navigate = useNavigate();

  const [city, setCity] = useState(null); // Khởi tạo city với null
  const [ward, setWard] = useState(null); 
  const [town, setTown] = useState(null); 

  const [nameCities, setNameCities] = useState([]);
  const [nameWards, setNameWards] = useState([]);
  const [nameTowns, setNameTowns] = useState([]);

  const [cityId, setCityId] = useState('');

  //Lấy danh sách thành phố
  useEffect(() => {
    const fetchCities = async () => {
      const cities = await getCityList();
      if (cities) {
        setNameCities(cities);
      }
    };

    fetchCities(); // Gọi hàm bất đồng bộ
  }, []);

  const handleCityChange = (e) => {
    const selectedId = e.target.value; // Lấy id đã chọn
    const selectedCity = nameCities.find(city => city.id === selectedId); // Tìm đối tượng thành phố dựa trên id

    setCity(selectedCity); // Cập nhật city với object
    setCityId(selectedId); // Cập nhật cityId
  };

  // useEffect để lấy danh sách quận huyện khi cityId thay đổi
  useEffect(() => {
    const fetchWards = async () => {
      if (cityId) { // Kiểm tra cityId có giá trị
        const wards = await getWardList(cityId);
        if (wards) {
          setNameWards(wards); // Cập nhật danh sách quận huyện
        }
      }
    };

    fetchWards(); // Gọi hàm bất đồng bộ
  }, [cityId]); // Chạy lại effect khi cityId thay đổi

  const handleWardChange = (e) => {
    const selectedId = e.target.value; // Lấy id đã chọn
    const selectedWard = nameWards.find(ward => ward.id === selectedId); 

    setWard(selectedWard); // Cập nhật ward
  };

  // useEffect để lấy danh sách phường/xã khi wardId thay đổi
  useEffect(() => {
    const fetchTowns = async () => {
      if (ward) { // Kiểm tra ward có giá trị
        const towns = await getTownList(ward.id); // Sử dụng ward.id để lấy danh sách phường/xã
        if (towns) {
          setNameTowns(towns); // Cập nhật danh sách phường/xã
        }
      }
    };

    fetchTowns(); // Gọi hàm bất đồng bộ
  }, [ward]); // Chạy lại effect khi ward thay đổi

  const [children_ages, setChildrenAges] = useState([]); // Trạng thái chứa giá trị của các chip đã chọn

  const handleChipClick = (ageRange) => {
    setChildrenAges([ageRange]); // Đặt trạng thái thành mảng chỉ chứa chip được chọn
  };

  const ageRanges = [
    "0-1歳",
    "1-3歳",
    "3-6歳",
    "6-12歳",
    "12-15歳",
    "15+歳"
  ];

  // State để lưu giá trị input
  const [address, setAddress] = useState('');

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI1NDU3OTQsImV4cCI6MTczNTEzNzc5NH0.OAkbvzKUhceuKw_PbMPhTtDOVqSHJ2_6Y-wksCpydBg'; // Thay thế bằng token thực tế
  const userId = 1

  const handleNextClick = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Tạo body cho yêu cầu API
    const body = {
      address: address + ", " + town + ", " + ward + ", " + city, 
      children_ages: children_ages[0]
    }

    try {
      // Gửi yêu cầu POST đến API
      const response = await fetch('http://localhost:8000/api/v1/users/' + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Thêm Bearer Token vào header
        },
        body: JSON.stringify(body),
      });

      // Kiểm tra phản hồi từ server
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Nếu gửi thành công, chuyển đến trang tiếp theo
      navigate("/user/begin2");
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className="begin1-container">
      <div className="begin1-6-content">
        <div className="flex-item-1">
          <h1 className="begin1-title">あなたの位置を選択してください</h1>
          <div className="begin1-6-form-section">
            <form>
              <div className="begin1-6-form-item">
                <div class="begin1-6-form-item">
                  <select
                    className="input-field"
                    value={city ? city.id : ''} // Hiển thị id của city nếu có
                    onChange={handleCityChange} // Gọi hàm xử lý
                  >
                    <option value="">県/市</option>
                    {nameCities.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div class="begin1-6-form-item">
                  <select
                    className="input-field"
                    value={ward ? ward.id : ''}
                    onChange={handleWardChange} // Cập nhật giá trị ward
                  >
                    <option value="">区/郡</option>
                    {nameWards.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div class="begin1-6-form-item">
                  <select
                    className="input-field"
                    value={town ? town.id : ''}
                    onChange={(e) => setTown(e.target.value)} // Cập nhật giá trị town
                  >
                    <option value="">町/村</option>
                    {nameTowns.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="begin1-6-form-item">
                <input
                  type="text"
                  placeholder="具体的な住所を入力してください"
                  className="input-field"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)} // Cập nhật giá trị address
                />
              </div>
            </form>
          </div>
        </div>
        <div className="flex-item-1">
          <h1 className="begin1-title">関心のあるお子様の年齢を選択してください</h1>
          <div className="begin1-6-options-section">
            <div className="age-options-grid">
              {ageRanges.map((ageRange, index) => (
                <div
                  key={index}
                  className={`chip-fixed-width chips-wrapper ${
                    children_ages.includes(ageRange) ? "selected" : ""
                  }`}
                  onClick={() => handleChipClick(ageRange)}
                >
                  <input
                  type="checkbox"
                  id={ageRange}
                  className="d-none"
                  checked={children_ages.includes(ageRange)} // Đánh dấu checkbox nếu chip được chọn
                  readOnly
                />
                <label htmlFor={ageRange}>{ageRange}</label>
                </div>
              ))}
            </div>
            <div class="button-wrapper begin1-6-submit-button" onClick={handleNextClick}>
              <input type="checkbox" id="button" class="d-none"/>
              <label for="button" class="btn d-flex align-items-center justify-content-center">次のステップ</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Begin1_6;
