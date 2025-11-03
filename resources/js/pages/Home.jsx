import { Head } from '@inertiajs/react';
import Chat from './Chat.jsx';
import Footer from './components/Footer/Footer.jsx';
import Header from './components/Headers/Header.jsx';
import Navbar from './components/Headers/Navbar/Navbar.jsx';
import MainContent from './components/Main-content/MainContent.jsx';

export default function Home() {
    return (
        <>
            <Head title={'StayHub | Home'} />
            <Navbar />
            <Header />
            <MainContent />
            <Chat />
            <Footer />
        </>
    );
}
