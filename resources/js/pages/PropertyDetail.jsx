import React, { useState } from 'react';
import './PropertyDetail.css';
import { 
  MapPin, Home, Maximize, Bed, Bath, Car, Calendar, 
  Phone, Mail, Share2, Heart, ChevronLeft, ChevronRight,
  Building2, DollarSign, TrendingUp, Shield, Clock,
  CheckCircle, MessageCircle, Video, Star
} from 'lucide-react';

export default function PropertyDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const property = {
    id: 1,
    title: 'Biệt thự sang trọng hiện đại tại Thảo Điền',
    price: '15,000,000,000',
    pricePerM2: '60,000,000',
    type: 'Bán',
    status: 'Sẵn sàng',
    address: '123 Đường Xuân Thủy, Phường Thảo Điền, Quận 2, TP.HCM',
    description: 'Biệt thự cao cấp với thiết kế hiện đại, không gian thoáng đãng, đầy đủ tiện nghi. Vị trí đắc địa gần trường học quốc tế, siêu thị, bệnh viện. Khu vực an ninh 24/7, môi trường sống xanh mát.',
    area: '250',
    landArea: '300',
    bedrooms: 4,
    bathrooms: 3,
    floors: 3,
    parking: 2,
    direction: 'Đông Nam',
    furnished: 'Đầy đủ',
    yearBuilt: 2022,
    legalStatus: 'Sổ hồng riêng',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200'
    ],
    features: [
      'Hồ bơi riêng',
      'Sân vườn rộng rãi',
      'Phòng gym',
      'Hệ thống smart home',
      'Camera an ninh',
      'Điều hòa trung tâm',
      'Bếp hiện đại',
      'Ban công rộng'
    ],
    nearby: [
      { name: 'Trường THPT Thảo Điền', distance: '500m' },
      { name: 'Vincom Mega Mall', distance: '1km' },
      { name: 'Bệnh viện FV', distance: '2km' },
      { name: 'Công viên Gia Định', distance: '1.5km' }
    ],
    agent: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.8,
      properties: 45
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đã gửi thông tin thành công!');
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Stayhub</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600">Trang chủ</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Mua</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Thuê</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Liên hệ</a>
            </nav>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Đăng tin
            </button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <img 
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-96 md:h-[600px] object-cover"
            />
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              {currentImageIndex + 1} / {property.images.length}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-full transition ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="bg-white/90 p-3 rounded-full hover:bg-white transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="bg-white p-4">
            <div className="flex gap-2 overflow-x-auto">
              {property.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-24 h-20 object-cover rounded cursor-pointer transition ${
                    index === currentImageIndex ? 'ring-2 ring-blue-600' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {property.type}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {property.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatPrice(property.price)} VNĐ
                  </span>
                  <span className="text-gray-500">
                    ({formatPrice(property.pricePerM2)} VNĐ/m²)
                  </span>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Maximize className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{property.area}m²</div>
                  <div className="text-sm text-gray-600">Diện tích</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Phòng ngủ</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Phòng tắm</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Car className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{property.parking}</div>
                  <div className="text-sm text-gray-600">Chỗ đỗ xe</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Số tầng</div>
                    <div className="font-semibold">{property.floors} tầng</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Năm xây</div>
                    <div className="font-semibold">{property.yearBuilt}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Hướng</div>
                    <div className="font-semibold">{property.direction}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Pháp lý</div>
                    <div className="font-semibold">{property.legalStatus}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Nội thất</div>
                    <div className="font-semibold">{property.furnished}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Đất</div>
                    <div className="font-semibold">{property.landArea}m²</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Mô tả
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                      activeTab === 'features'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Tiện ích
                  </button>
                  <button
                    onClick={() => setActiveTab('location')}
                    className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                      activeTab === 'location'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Vị trí
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Mô tả chi tiết</h3>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Tiện ích nổi bật</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Tiện ích lân cận</h3>
                    <div className="space-y-3">
                      {property.nearby.map((place, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{place.name}</span>
                          </div>
                          <span className="text-gray-600">{place.distance}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-400" />
                      <span className="ml-2 text-gray-500">Bản đồ tích hợp</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Agent Info & Contact */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-xl p-6 shadow-md lg:sticky lg:top-24">
              <div className="text-center mb-6">
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {property.agent.name}
                </h3>
                <p className="text-gray-600 mb-2">Môi giới BĐS</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{property.agent.rating}</span>
                  <span className="text-gray-500">({property.agent.properties} BĐS)</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <a 
                  href={`tel:${property.agent.phone}`}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <Phone className="w-5 h-5" />
                  {property.agent.phone}
                </a>
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-white text-blue-600 border-2 border-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <Mail className="w-5 h-5" />
                  Gửi email
                </button>
                <button className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 font-semibold">
                  <MessageCircle className="w-5 h-5" />
                  Chat Zalo
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 font-semibold">
                  <Video className="w-5 h-5" />
                  Xem online
                </button>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="border-t pt-6">
                  <h4 className="font-bold mb-4">Để lại thông tin</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Họ và tên"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Số điện thoại"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tin nhắn của bạn..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Gửi yêu cầu
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">Thông tin hữu ích</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Giờ làm việc</div>
                    <div className="text-gray-600">8:00 - 18:00 (T2-T7)</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Đảm bảo pháp lý</div>
                    <div className="text-gray-600">Giấy tờ đầy đủ, rõ ràng</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Hỗ trợ vay</div>
                    <div className="text-gray-600">Tư vấn ngân hàng miễn phí</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Bất động sản tương tự</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                <img
                  src={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=${item}`}
                  alt="Property"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Biệt thự cao cấp Quận {item + 1}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{10 + item} tỷ VNĐ</p>
                  <p className="text-gray-700 mb-4">Diện tích: {200 + item * 50}m², {3 + item} phòng ngủ</p>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Quận {item + 1}, TP.HCM</span>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">Stayhub</span>
              </div>
              <p className="text-gray-400">Nền tảng bất động sản hàng đầu Việt Nam</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Về chúng tôi</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white">Đối tác</a></li>
                <li><a href="#" className="hover:text-white">Tuyển dụng</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white">Chính sách</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@Stayhub.vn</li>
                <li>Hotline: 1900 1234</li>
                <li>Địa chỉ: TP. Hồ Chí Minh</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StayHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}