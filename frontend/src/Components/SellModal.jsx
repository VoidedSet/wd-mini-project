import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios'




export default function SellModal(props) {
    if (!props?.showSellModal) {
        return <></>;
    }

    const [numStocks, setNumStocks] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [stocksToSell, setStocksToSell] = useState(0)
    const [stocksBought, setStocksBought] = useState(0)
    const [portfolioInfo, setPortfolioInfo] = useState([])
    const [currentBalance, setCurrentBalance] = useState(25000)
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const currentPrice = parseFloat(numStocks * props?.latest_price).toFixed(2)
        setTotalPrice(currentPrice);
    }, [numStocks]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3000/portfolio');
            
            setCurrentBalance((result.data.current_balance).toFixed(2));
            setPortfolioInfo(result.data.investments);
            result.data.investments.forEach((item) => {
                if (item.ticker === props?.ticker) {
                    setStocksBought(item.quantity); // Make sure this is the correct property
                    
                }
            });
        };
        fetchData();
        
    }, [])

    const handleNumStocksChange = (e) => {
        const { value } = e.target;
        if (value === '') {
            setNumStocks(''); // This will ensure the input clears on backspace
        } else {
            const numValue = parseInt(value, 10);
            setNumStocks(isNaN(numValue) ? 1 : Math.max(0, numValue));
            if (numValue > stocksBought || numValue <= 0) setShowAlert(true);
            else setShowAlert(false);
        }
    };

    const callBackend = () => {

        
        axios.post('http://localhost:3000/sell', { price: totalPrice, quantity: numStocks, ticker: props?.ticker, company: props?.company })
            .then((res) => {
                props.toggleSellModal();
                props.toggleSellMessage();
            }).catch((err) => {
                
            })
    }

    return (
        <>
            {/* SELL MODAL */}
            <Modal show={props?.showSellModal} onHide={props?.toggleSellModal} className='my-modal mx-auto' style={{ width: '95%', top: '1%', left: '2%' }}  >
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
                        {showAlert && numStocks > 0 && <p style={{ color: 'red' }}>You cannot sell the stocks that you don't have!</p>}
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        <p>Total: {totalPrice}</p>
                        <Button variant="success" onClick={callBackend} type='submit' disabled={showAlert || numStocks <= 0}>Sell</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}