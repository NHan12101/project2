import React, { useState } from 'react';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import('./Blogs.css');
import { Link } from '@inertiajs/react';
const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'market', name: 'Thị trường' },
    { id: 'guide', name: 'Hướng dẫn' },
    { id: 'investment', name: 'Đầu tư' },
    { id: 'legal', name: 'Pháp lý' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Xu hướng thị trường bất động sản 2025',
      excerpt: 'Phân tích chi tiết về những xu hướng nổi bật của thị trường bất động sản trong năm 2025 và những cơ hội đầu tư tiềm năng.',
      category: 'market',
      author: 'Nguyễn Văn A',
      date: '15/10/2025',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop',
      readTime: '5 phút'
    },
    {
      id: 2,
      title: 'Hướng dẫn mua nhà lần đầu cho người trẻ',
      excerpt: 'Những bước cơ bản và lưu ý quan trọng dành cho người trẻ muốn sở hữu căn nhà đầu tiên của mình.',
      category: 'guide',
      author: 'Trần Thị B',
      date: '12/10/2025',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=500&fit=crop',
      readTime: '7 phút'
    },
    {
      id: 3,
      title: 'Đầu tư bất động sản: Căn hộ hay đất nền?',
      excerpt: 'So sánh chi tiết giữa đầu tư căn hộ và đất nền, phân tích ưu nhược điểm của từng loại hình.',
      category: 'investment',
      author: 'Lê Văn C',
      date: '10/10/2025',
      image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=500&fit=crop',
      readTime: '6 phút'
    },
    {
      id: 4,
      title: 'Thủ tục pháp lý khi mua bán nhà đất',
      excerpt: 'Tổng hợp đầy đủ các thủ tục pháp lý cần thiết trong quá trình mua bán bất động sản.',
      category: 'legal',
      author: 'Phạm Thị D',
      date: '08/10/2025',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop',
      readTime: '8 phút'
    },
    {
      id: 5,
      title: 'Phân tích thị trường bất động sản TP.HCM',
      excerpt: 'Đánh giá tổng quan về tình hình thị trường bất động sản tại TP.HCM trong quý 3 năm 2025.',
      category: 'market',
      author: 'Hoàng Văn E',
      date: '05/10/2025',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
      readTime: '10 phút'
    },
    {
      id: 6,
      title: 'Bí quyết đàm phán giá khi mua nhà',
      excerpt: 'Những chiến lược đàm phán hiệu quả giúp bạn có được mức giá tốt nhất khi mua bất động sản.',
      category: 'guide',
      author: 'Võ Thị F',
      date: '02/10/2025',
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=500&fit=crop',
      readTime: '5 phút'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
     

      {/* Header */}
      <div className="blog-header">
        <h1>Blog Bất Động Sản</h1>
        <p>Cập nhật tin tức và kiến thức về thị trường bất động sản</p>
      </div>

      {/* Featured Post */}
      <div className="featured-post">
        <div className="featured-image">
          <img src={featuredPost.image} alt={featuredPost.title} />
          <span className="featured-badge">Nổi bật</span>
        </div>
        <div className="featured-content">
          <div className="post-category">{categories.find(c => c.id === featuredPost.category)?.name}</div>
          <h2>{featuredPost.title}</h2>
          <p>{featuredPost.excerpt}</p>
          <div className="post-meta">
            <span><User size={16} /> {featuredPost.author}</span>
            <span><Calendar size={16} /> {featuredPost.date}</span>
            <span>⏱️ {featuredPost.readTime}</span>
          </div>
          <button className="read-more-btn">
            <Link href="/blogsdetail">ĐỌC BÀI VIẾT →</Link>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <Tag size={16} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="blog-grid">
        {filteredPosts.map(post => (
          <article key={post.id} className="blog-card">
            <div className="blog-card-image">
              <img src={post.image} alt={post.title} />
              <div className="blog-card-category">
                {categories.find(c => c.id === post.category)?.name}
              </div>
            </div>
            <div className="blog-card-content">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="blog-card-meta">
                <div className="meta-info">
                  <span><User size={14} /> {post.author}</span>
                  <span><Calendar size={14} /> {post.date}</span>
                </div>
                <span className="read-time">⏱️ {post.readTime}</span>
              </div>
              <button className="card-read-btn">
                Xem chi tiết <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="no-results">
          <p>Không tìm thấy bài viết phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default Blog;