import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from './components/Headers/Navbar/Navbar';
import './Blogs.css';

const BlogDetail = ({ postId }) => {
  // Fake database
  const allBlogPosts = {
    1: {
      id: 1,
      title: 'Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất',
      author: 'Trần Văn Bình',
      date: '15/12/2025',
      readTime: '6 phút',
      intro: 'Tổng hợp đầy đủ các gói lãi suất vay mua nhà từ các ngân hàng lớn tại Việt Nam.',
      sections: [
        {
          title: 'Lãi Suất Vay Mua Nhà Hiện Nay',
          content: [
            'Lãi suất vay mua nhà hiện dao động từ 6,5% - 9,5%/năm.',
            'Nhiều ngân hàng đang có chính sách hỗ trợ vay mua nhà.'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
      tags: ['Vay mua nhà', 'Lãi suất', 'Ngân hàng']
    },

    2: {
      id: 2,
      title: 'Nhà Ở Xã Hội Tiếp Tục Tăng Giá Mạnh',
      author: 'Nguyễn Nam',
      date: '05/11/2025',
      readTime: '5 phút',
      intro: 'Nhà ở xã hội đang thiết lập mặt bằng giá mới trên thị trường.',
      sections: [
        {
          title: 'Nhà Ở Xã Hội Trong Cuộc Đua Tăng Giá',
          content: [
            'Giá nhà ở xã hội tăng mạnh do nguồn cung hạn chế.',
            'Nhu cầu mua nhà giá rẻ ngày càng cao.'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
      tags: ['Nhà ở xã hội', 'Thị trường', 'Đầu tư']
    }
  };

  const currentPost = allBlogPosts[postId];

  const relatedPosts = [
    { id: 1, title: 'Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất', date: '12/2025' },
    { id: 2, title: 'Nhà Ở Xã Hội Tiếp Tục Tăng Giá Mạnh', date: '11/2025' }
    
  ];

  if (!currentPost) {
    return <div>Không tìm thấy bài viết</div>;
  }

  return (
    <div className="blog-detail-wrapper">
      <Navbar />

      <div className="blog-detail-container">
        {/* MAIN */}
        <div className="blog-detail-main">
          <h1 className="blog-detail-title">{currentPost.title}</h1>

          <div className="blog-detail-meta">
            <p>
              Đăng bởi <strong>{currentPost.author}</strong> • {currentPost.date} • {currentPost.readTime}
            </p>
          </div>

          <p className="blog-intro">{currentPost.intro}</p>

          {currentPost.sections.map((section, i) => (
            <div key={i} className="blog-section">
              <h2>{section.title}</h2>
              {section.content.map((text, j) => (
                <p key={j}>{text}</p>
              ))}

              {i === 0 && (
                <div className="blog-featured-image">
                  <img src={currentPost.image} alt={currentPost.title} />
                </div>
              )}
            </div>
          ))}

          {/* TAGS */}
          <div className="blog-tags">
            <span className="tag-label">Khám phá thêm:</span>
            {currentPost.tags.map((tag, index) => (
              <Link
                key={index}
                href={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="blog-tag"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="blog-sidebar">
          <h3 className="sidebar-title">Bài viết được xem nhiều nhất</h3>

          <div className="related-posts">
            {relatedPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className={`related-post-item ${post.id === postId ? 'active-post' : ''}`}
              >
                <span className="post-number">{index + 1}</span>
                <div className="post-info">
                  <h4>{post.title}</h4>
                  <p className="post-date-small">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetail;
