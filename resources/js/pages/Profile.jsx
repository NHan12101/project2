import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Giả lập fetch data từ database
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&size=200&background=0D8ABC&color=fff',
        address: 'Quận 1, TP. Hồ Chí Minh',
        joinDate: '15/01/2024',
        totalProperties: 12,
        soldProperties: 5,
        rating: 4.8
      };

      const propertiesData = [
        {
          id: 1,
          title: 'Căn hộ cao cấp Vinhomes Central Park',
          price: '5,200,000,000',
          location: 'Bình Thạnh, TP.HCM',
          area: '85m²',
          bedrooms: 2,
          bathrooms: 2,
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
          status: 'Đang bán',
          views: 1250
        },
        {
          id: 2,
          title: 'Nhà phố hiện đại khu Thảo Điền',
          price: '15,000,000,000',
          location: 'Quận 2, TP.HCM',
          area: '200m²',
          bedrooms: 4,
          bathrooms: 3,
          image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop',
          status: 'Đang bán',
          views: 2340
        },
        {
          id: 3,
          title: 'Biệt thự view sông Saigon Pearl',
          price: '25,000,000,000',
          location: 'Bình Thạnh, TP.HCM',
          area: '350m²',
          bedrooms: 5,
          bathrooms: 4,
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
          status: 'Đã bán',
          views: 3120
        }
      ];

      setUser(userData);
      setEditForm(userData);
      setProperties(propertiesData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm(user);
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    // Simulate saving to database
    setUser(editForm);
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-info">
          <div className="avatar-section">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            <div className="avatar-badge">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="user-details">
            {!isEditing ? (
              <>
                <h1 className="user-name">{user.name}</h1>
                <p className="user-role">Thành viên từ {user.joinDate}</p>
                <div className="user-stats">
                  <div className="stat-item">
                    <i className="fas fa-home"></i>
                    <span>{user.totalProperties} BĐS</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-check"></i>
                    <span>{user.soldProperties} Đã bán</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-star"></i>
                    <span>{user.rating}/5.0</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="edit-form-inline">
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
            )}
          </div>
          <button className="edit-profile-btn" onClick={handleEditToggle}>
            <i className={`fas fa-${isEditing ? 'times' : 'edit'}`}></i>
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-card">
            <h3>Thông tin liên hệ</h3>
            {!isEditing ? (
              <>
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <label>Số điện thoại</label>
                    <p>{user.phone}</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <label>Địa chỉ</label>
                    <p>{user.address}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                  />
                </div>
                <button className="save-btn" onClick={handleSaveProfile}>
                  <i className="fas fa-save"></i> Lưu thay đổi
                </button>
              </div>
            )}
          </div>

          <div className="sidebar-card">
            <h3>Thống kê</h3>
            <div className="stats-list">
              <div className="stats-item">
                <span>Lượt xem</span>
                <strong>12,456</strong>
              </div>
              <div className="stats-item">
                <span>Yêu thích</span>
                <strong>234</strong>
              </div>
              <div className="stats-item">
                <span>Tin nhắn</span>
                <strong>89</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              <i className="fas fa-building"></i>
              Bất động sản của tôi
            </button>
            <button
              className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <i className="fas fa-heart"></i>
              Yêu thích
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <i className="fas fa-history"></i>
              Lịch sử
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'properties' && (
              <div className="properties-grid">
                {properties.map(property => (
                  <div key={property.id} className="property-card">
                    <div className="property-image">
                      <img src={property.image} alt={property.title} />
                      <span className={`property-status ${property.status === 'Đã bán' ? 'sold' : ''}`}>
                        {property.status}
                      </span>
                    </div>
                    <div className="property-details">
                      <h3>{property.title}</h3>
                      <p className="property-price">{property.price} VNĐ</p>
                      <p className="property-location">
                        <i className="fas fa-map-marker-alt"></i>
                        {property.location}
                      </p>
                      <div className="property-features">
                        <span><i className="fas fa-expand"></i> {property.area}</span>
                        <span><i className="fas fa-bed"></i> {property.bedrooms} PN</span>
                        <span><i className="fas fa-bath"></i> {property.bathrooms} WC</span>
                      </div>
                      <div className="property-footer">
                        <span className="views">
                          <i className="fas fa-eye"></i> {property.views} lượt xem
                        </span>
                        <div className="property-actions">
                          <button className="btn-icon"><i className="fas fa-edit"></i></button>
                          <button className="btn-icon"><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'favorites' && (
              <div className="empty-state">
                <i className="fas fa-heart"></i>
                <p>Chưa có bất động sản yêu thích</p>
              </div>
            )}
            {activeTab === 'history' && (
              <div className="empty-state">
                <i className="fas fa-history"></i>
                <p>Chưa có lịch sử xem</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;