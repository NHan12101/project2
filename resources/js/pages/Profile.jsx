import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import './Profile.css';

export default function Profile({ user }) {
    const [activeTab, setActiveTab] = useState('properties');
    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        avatar: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const handleEditToggle = () => setIsEditing(!isEditing);
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile/update', {
            forceFormData: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <div className="profile-container">
            {/* Header Section */}
            <div className="profile-header">
                <div className="profile-banner"></div>
                <div className="profile-info">
                    <div className="avatar-section">
                        <img
                            src={
                                user.avatar_image_url
                                    ? `/${user.avatar_image_url}`
                                    : user.avatar
                                      ? user.avatar
                                      : '/images/default-avatar.jpg'
                            }
                            alt={user.name}
                            className="profile-avatar"
                        />
                        <div className="avatar-badge">
                            <i className="fas fa-check-circle"></i>
                        </div>
                    </div>

                    <div className="user-details">
                        {!isEditing ? (
                            <>
                                <h1 className="user-name">{user.name}</h1>
                                <p className="user-role">
                                    Thành viên từ {user.joinDate}
                                </p>
                                <div className="user-stats">
                                    <div className="stat-item">
                                        <i className="fas fa-home"></i>
                                        <span>{user.totalProperties} BĐS</span>
                                    </div>
                                    <div className="stat-item">
                                        <i className="fas fa-check"></i>
                                        <span>
                                            {user.soldProperties} Đã bán
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <i className="fas fa-star"></i>
                                        <span>{user.rating}/5.0</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="edit-form-inline"
                            >
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="edit-input"
                                />
                                {errors.name && (
                                    <div className="text-red-500 text-sm">
                                        {errors.name}
                                    </div>
                                )}
                            </form>
                        )}
                    </div>

                    <button
                        className="edit-profile-btn"
                        onClick={handleEditToggle}
                    >
                        <i
                            className={`fas fa-${isEditing ? 'times' : 'edit'}`}
                        ></i>
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
                                        <p>{user.phone || 'Chưa có'}</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <div>
                                        <label>Địa chỉ</label>
                                        <p>{user.address || 'Chưa có'}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} className="edit-form">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <div className="text-red-500 text-sm">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Ảnh đại diện</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData('avatar', e.target.files[0])
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="save-btn"
                                >
                                    <i className="fas fa-save"></i>{' '}
                                    {processing
                                        ? 'Đang lưu...'
                                        : 'Lưu thay đổi'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="profile-main">
                    <div className="tabs">
                        <button
                            className={`tab ${
                                activeTab === 'properties' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('properties')}
                        >
                            <i className="fas fa-building"></i>
                            Bất động sản của tôi
                        </button>
                        <button
                            className={`tab ${
                                activeTab === 'favorites' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            <i className="fas fa-heart"></i>
                            Yêu thích
                        </button>
                        <button
                            className={`tab ${
                                activeTab === 'history' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('history')}
                        >
                            <i className="fas fa-history"></i>
                            Lịch sử
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'properties' && (
                            <div className="empty-state">
                                <i className="fas fa-home"></i>
                                <p>Chưa có bất động sản nào</p>
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
}
