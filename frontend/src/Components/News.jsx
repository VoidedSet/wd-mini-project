import React from 'react';
import { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Modal } from 'react-bootstrap';
import '../static/Tabs.css';

export default function News({ toggle, newsItems }) {
    let newsItemPairs = [];

    // Properly group news items into pairs
    if (newsItems) {
        for (let i = 0; i < newsItems.length; i += 2) {
            const pair = newsItems.slice(i, i + 2);
            if (pair.every(item => item.image !== "")) {
                newsItemPairs.push(pair);
            }
            if (newsItemPairs.length > 9) break
        }
    }

    // Render empty fragment if no pairs exist
    if (newsItemPairs.length === 0) {
        return <></>;
    }

    // Handle Modal
    const [showModal, setShowModal] = useState(false);
    const [newsClicked, setNewsClicked] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [reRender, setReRender] = useState(false);
    const toggleModal = () => {
        setShowModal(!showModal);
        setReRender(!reRender);
        // setSelectedItem({});
    }

    const handleNewsClick = (index, idx) => {
        
        

        // const org_indx = index * 2 + idx;
        setSelectedItem(newsItemPairs[index][idx]);
        // 
        
        // setSelectedItem(item);
        // setNewsClicked(true);
        
        setShowModal(true);
    };

    // useEffect(() => {
    //     if (newsClicked) {
    //         // setSelectedItem(selectedItem);
    //         // 
    //         // setShowModal(true);
    //         handleNewsClick(selectedItem)
    //         setNewsClicked(false);
    //     }
    // }, [newsClicked]);

    // Convert Unix Timestamp
    function formatUnixTimestamp(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const formattedDate = date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formattedDate;
    }

    // Main component rendering
    return (
        <div key={reRender}>
            <div className={toggle === 2 ? "show-content" : "content"}>
                {/* <Container fluid > */}
                    {newsItemPairs.map((pair, index) => (
                        <Row key={index} style={{ marginBottom: index === newsItemPairs.length - 1 ? '50px' : '' }} >
                            {pair.map((item, idx) => (
                                <Col xs={12} md={6}>
                                    <Container fluid>
                                        <Row className="news p-3" type="button" onClick={() => handleNewsClick(index, idx)} stlye={{ textAlign: 'center', pointer:'cursor', height: 'auto', maxHeight: '10px'}}>
                                            <Col xs={12} md={3}>
                                                <img src={item.image} className="news-img" alt="" style={{ objectFit:'contain' }} />
                                            </Col>
                                            <Col xs={12} md={9} className="mt-3" style={{ maxHeight: '70px', overflow:'hidden' }}>
                                                {item.headline.length > 50 ? <p>{item.headline.slice(0, 100) + "..."}</p> : <p>{item.headline}</p>}
                                            </Col>
                                        </Row>

                                    </Container>
                                </Col>
                            ))}
                            <br /><br />
                        </Row>
                    ))}
                {/* </Container> */}
            </div>
            {(
                <Modal show={showModal} onHide={toggleModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div style={{ lineHeight: '1.2' }}>
                                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{selectedItem?.source} </span><br />
                                <span style={{ color: 'gray', fontSize: '15px', fontWeight: 'bold' }}>{formatUnixTimestamp(selectedItem?.datetime)}</span>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <span style={{ fontSize: '24px', lineHeight: '1.2', fontWeight: '600' }}>{selectedItem?.headline}</span><br />
                            {selectedItem?.summary?.length > 50 ? <span style={{ color: 'black', fontSize: '17px', lineHeight: '1.2' }}>{selectedItem?.summary?.slice(0, 150) + "..."}</span> : <span style={{ color: 'black', fontSize: '17px', lineHeight: '1.2' }}>{selectedItem?.summary}</span>}
                            <br /><span><span style={{ color: 'gray', lineHeight: '1.2', fontSize: '17px' }}>For more details click</span> <a href={selectedItem?.url} target='_blank'>here</a></span>
                        </div>
                        <br /><br />
                        <div style={{ border: '2px solid darkgray', borderRadius: '4px', padding: '15px' }}>
                            <p style={{ fontSize: '18px' }}>Share</p><br />
                            <div style={{ display: 'flex' }}>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedItem?.headline + " " + selectedItem?.url)}`} target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                                    </svg>
                                </a>
                                <p style={{ color: 'white' }}>kl</p>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedItem?.url)}`} target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="blue" className="bi bi-facebook" viewBox="0 0 16 16">
                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}
