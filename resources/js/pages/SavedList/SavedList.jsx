import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Chat from '../Chat.jsx';
import classes from './SavedList.module.css';

export default function SavedList({ savedPosts, auth }) {
    const [listings, setListings] = useState(savedPosts || []);
    const currentUserId = auth?.user?.id;

    const handleRemoveFavorite = async (postId) => {
        try {
            await axios.post('/favorites/remove', {
                post_id: postId
            });
            setListings(listings.filter(listing => listing.id !== postId));
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Không thể xóa tin đăng khỏi danh sách yêu thích.');
        }
    };

    const handleStartChat = async (receiverId) => {
        try {
            const res = await axios.post('/conversations/start', {
                receiver_id: receiverId,
            });
            const conversationId = res.data.conversation_id;
            router.visit(`/chatbox?open=${conversationId}`);
        } catch (err) {
            console.error('Error starting conversation:', err);
            alert('Không thể bắt đầu cuộc trò chuyện.');
        }
    };

    const handleCardClick = (postId) => {
        router.visit(`/properties/${postId}`);
    };

    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return price;
    };

    const formatTime = (createdAt) => {
        const now = new Date();
        const postDate = new Date(createdAt);
        const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
        
        if (diffInMinutes < 60) return `${diffInMinutes} Phút Trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} Giờ Trước`;
        return `${Math.floor(diffInMinutes / 1440)} Ngày Trước`;
    };

    return (
        <>
            <Head title="StayHub | Tin đăng đã lưu" />
            <Navbar />
            <Chat />
            
            <div className="main-contain">
                <div className={classes.breadcrumb}>
                    <span onClick={() => router.visit('/')} style={{ cursor: 'pointer' }}>
                       StayHub
                    </span>
                    <span className={classes.separator}>»</span>
                    <span>Tin đăng đã lưu</span>
                </div>

                <h1 className={classes.pageTitle}>
                    Tin đăng đã lưu ({listings.length} / 100)
                </h1>

                {listings.length > 0 ? (
                    <div className={classes.listingsGrid}>
                        {listings.map((listing) => (
                            <div key={listing.id} className={classes.listingCard}>
                                <div 
                                    className={classes.listingImageWrapper}
                                    onClick={() => handleCardClick(listing.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img 
                                        src={listing.images && listing.images.length > 0 
                                            ? `/storage/${listing.images[0].image_path}` 
                                            : '/images/placeholder.jpg'
                                        } 
                                        alt={listing.title} 
                                        className={classes.listingImage} 
                                    />
                                    <div className={classes.imageCount}>
                                        {listing.images?.length || 0}
                                    </div>
                                </div>

                                <div className={classes.listingContent}>
                                    <h3 
                                        className={classes.listingTitle}
                                        onClick={() => handleCardClick(listing.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {listing.title}
                                    </h3>
                                    <p className={classes.listingPrice}>
                                        {formatPrice(listing.price)}
                                    </p>

                                    <div className={classes.listingMeta}>
                                        <span className={classes.ownerBadge}>
                                            {listing.user?.name || 'Cá Nhân'}
                                        </span>
                                        <span className={classes.postedTime}>
                                            {formatTime(listing.created_at)}
                                        </span>
                                        <span className={classes.location}>
                                            {listing.location || 'Không xác định'}
                                        </span>
                                    </div>

                                    <div className={classes.listingActions}>
                                        {currentUserId !== listing.user?.id && (
                                            <button 
                                                className={classes.chatButton}
                                                onClick={() => handleStartChat(listing.user?.id)}
                                            >
                                                Chat
                                            </button>
                                        )}
                                        <button 
                                            className={`${classes.favoriteButton} ${classes.active}`}
                                            onClick={() => handleRemoveFavorite(listing.id)}
                                            aria-label="Xóa khỏi danh sách yêu thích"
                                        >
                                            <Heart fill="#ef4444" color="#ef4444" size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={classes.emptyState}>
                        <p>Bạn chưa có tin đăng nào được lưu</p>
                        <button 
                            className={classes.exploreButton}
                            onClick={() => router.visit('/')}
                        >
                            Khám phá tin đăng
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}