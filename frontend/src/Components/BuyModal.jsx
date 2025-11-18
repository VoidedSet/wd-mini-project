import { Container, Row, Col, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import '../static/Tabs.css'
import { useState, useEffect } from 'react'
import axios from 'axios'


export default function BuyModal(props) {
    if (!props?.showBuyModal) {
        return <></>;
    }

    const [totalPrice, setTotalPrice] = useState(0)
    const [numStocks, setNumStocks] = useState(0)
    const [showAlert, setShowAlert] = useState(false);



    useEffect(() => {
        const currentPrice = parseFloat(numStocks * props?.latest_price).toFixed(2)
        setTotalPrice(currentPrice);
        if (currentPrice > props?.currentBalance || numStocks <= 0) {
            
            setShowAlert(true);
        } else setShowAlert(false);
    }, [numStocks]);

    const handleNumStocksChange = (e) => {
        const { value } = e.target;
        if (value === '') {
            setNumStocks(''); // This will ensure the input clears on backspace
        } else {
            const numValue = parseInt(value, 10);
            setNumStocks(isNaN(numValue) ? 0 : Math.max(0, numValue));
        }
    };

    const hide = (e) => {
        e.preventDefault();
        props.toggleBuyModal();
    }

    const updateNumStocks = (delta) => {
        setNumStocks(prevNumStocks => Math.max(0, prevNumStocks + delta));
    };

    const callBackend = () => {
        axios.post('http://localhost:3000/buy', { price: totalPrice, quantity: numStocks, ticker: props?.ticker, company: props?.company })
            .then((res) => {
                props.toggleBuyModal();
                props.toggleBuyMessage()

            }).catch((err) => {
                
            })
    }

    return (
        <>
            {/* BUY MODAL */}

            <Modal show={props?.showBuyModal} onHide={props?.toggleBuyModal} className='my-modal' style={{ width: '95%', top: '1%', left: '2%' }}>
                <Modal.Dialog style={{ width: '100%', height: '100%' }}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ padding: '0px' }}>{props?.ticker}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{ lineHeight: '0.4' }}>Current Price: {props?.latest_price.toFixed(2)}</p>
                        <p style={{ lineHeight: '0.4' }}>Money in wallet: ${props?.currentBalance.toFixed(2)}</p>
                        <InputGroup className="mb-3">
                            <Form.Label className="mb-0" style={{ marginRight: '10px', lineHeight: '0.4', marginTop: '15px' }}>Quantity:</Form.Label>
                            <FormControl
                                aria-label="Quantity"
                                value={numStocks}
                                onChange={handleNumStocksChange}
                                type="number"
                                style={{ borderRadius: '5px' }}
                            />
                        </InputGroup>

                        {showAlert && numStocks > 0 && <p style={{ color: 'red' }}>Not enough money in wallet!</p>}
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between" style={{ padding: '0px', paddingLeft: '12px' }}>
                        <p>Total: {totalPrice}</p>
                        <Button variant="success" onClick={callBackend} type='submit' disabled={totalPrice > props?.currentBalance || numStocks <=0 }>Buy</Button>
                    </Modal.Footer>

                </Modal.Dialog>
            </Modal>
        </>
    )
}