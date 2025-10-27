import Footer from './components/Footer/Footer.jsx';
import Header from './components/Headers/Header.jsx';
import Navbar from './components/Headers/Navbar/Navbar.jsx';
import MainContent from './components/Main-content/MainContent.jsx';

export default function Home() {
    return (
        <>
            <Navbar />
            <Header />
            <MainContent />
            <Footer />
        </>
    );
}
