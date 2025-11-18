import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import '../static/Header.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Headers() {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();
    const navbar = {
        backgroundColor: '#2424ab',
        color: 'white'
    };

    useEffect(() => {
        const path = location.pathname;
        
        if (path === '/search/home') {
            setActiveTab('home');
        } else if (path === '/portfolio') {
            setActiveTab('portfolio');
        } else {
            setActiveTab('home');
        }
    }, [location]);

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="custom-navbar">
                <Navbar.Brand className="custom-brand" style={{paddingLeft: '1%'}}>Stock Search</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggle" />
                <Navbar.Collapse id="responsive-navbar-nav" className="custom-collapse">
                    <Nav className="ms-auto">
                        <Nav.Link eventKey={1} onClick={() => setActiveTab('home')} className={`custom-link ${activeTab === 'home' ? 'text-primary' : 'text-secondary'}`} as={Link} to="/search/home">
                            Search
                        </Nav.Link>
                        <Nav.Link eventKey={2} onClick={() => setActiveTab('login')} className={`custom-link ${activeTab === 'login' ? 'text-primary' : 'text-secondary'}`} as={Link} to="/login">
                            Login
                        </Nav.Link>
                        <Nav.Link eventKey={3} onClick={() => setActiveTab('signup')} className={`custom-link ${activeTab === 'signup' ? 'text-primary' : 'text-secondary'}`} as={Link} to="/signup">
                            Signup
                        </Nav.Link>
                        <Nav.Link eventKey={4} onClick={() => setActiveTab('portfolio')} className={`custom-link ${activeTab === 'portfolio' ? 'text-primary' : 'text-secondary'}`} as={Link} to="/portfolio">
                            Portfolio
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}