import Header from './components/Headers/Header.jsx';
import MainContent from './components/Main-content/MainContent.jsx';

// Nhận props từ Inertia (Laravel gửi qua)
export default function Home({ auth }) {
    return (
        <>
            {/* Truyền auth xuống Header */}
            <Header auth={auth} />
            <MainContent />
        </>
    );
}
