import axios from 'axios'
import { useEffect, useState } from 'react';
import BuyModal from './BuyModal.jsx'
import SellModal from './SellModal.jsx'

export default function Portfolio() {

    const [data, setData] = useState([]);
    const [prices, setPrices] = useState({});
    const [currentBalance, setCurrentBalance] = useState(0);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [ticker, setTicker] = useState('');
    const [current_price, setCurrentPrice] = useState(0);
    const [company, setCompany] = useState('');
    const [successBuyMessage, setSuccessBuyMessage] = useState(false);
    const [successSellMessage, setSuccessSellMessage] = useState(false);
    const [emptyResponse, setEmptyResponse] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [color, setColor] = useState('green');
    const toggleBuyModal = () => {
        setShowBuyModal(!showBuyModal);
    }
    const toggleSellModal = () => {
        setShowSellModal(!showSellModal);
    }
    const toggleBuyMessage = () => {
        setSuccessBuyMessage(!successBuyMessage);
    }
    const toggleSellMessage = () => {
        setSuccessSellMessage(!successSellMessage);
    }

    useEffect(() => {
        if (!successBuyMessage && !successSellMessage) {
        const fetchData = async () => {
                setIsLoading(true)
                const result = await axios.get('http://localhost:3000/portfolio');

                
                setCurrentBalance(result.data.current_balance);
                const combinedInvestments = {};
                const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));
                if (result.data.investments.length === 0) {
                    setEmptyResponse(true);
                }
                else {
                    setEmptyResponse(false);
                }
                result.data?.investments?.forEach(item => {

                    combinedInvestments[item.ticker] = item;

                });

                // Convert the combined investments object back into an array
                const combinedInvestmentsArray = Object.values(combinedInvestments);
                setData(combinedInvestmentsArray);
                
                // Fetch the current prices
                const pricePromises = combinedInvestmentsArray.map(async (item, index) => {
                    await delay(1000); // Wait for 1 second between each request
                    const priceResult = await axios.get(`http://localhost:3000/current_stock_price?ticker_name=${item.ticker}`);
                    return { ticker: item.ticker, price: priceResult.data.c, quantity: item.quantity };
                });
                if (pricePromises) {
                    const prices = await Promise.all(pricePromises);
                    setPrices(prices); // Store the prices as an array
                }
                setIsLoading(false);
            };

            fetchData();
            
        }
    }, [successBuyMessage, successSellMessage]);

    const buy = (item, currentPrice) => {
        
        setShowBuyModal(true);
        setTicker(item.ticker);
        setCurrentPrice(currentPrice);
        setCompany(item.company);
    }
    const sell = (item, currentPrice) => {
        
        setShowSellModal(true);
        setTicker(item.ticker);
        setCurrentPrice(currentPrice);
        setCompany(item.company);
    }
    useEffect(() => {
        if (successBuyMessage || successSellMessage) {
            const timer = setTimeout(() => {
                setSuccessBuyMessage(false);
                setSuccessSellMessage(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successBuyMessage, successSellMessage]);
    return (
        <div>
            <div className='d-flex justify-content-center align-items-center'>
                {successBuyMessage && (
                    <div className="container alert alert-success alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                        {ticker.toUpperCase()} bought successfully
                        <div
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={toggleBuyMessage}
                        />
                    </div>
                )}
                {successSellMessage && (
                    <div className="container alert alert-danger alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                        {ticker.toUpperCase()} sold successfully
                        <div
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={toggleSellMessage}
                        />
                    </div>
                )}
            </div>

            <div className="col-12 col-lg-10" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "2%", marginLeft: 'auto', marginRight: 'auto', marginBottom: '25%' }}>
                < div className="container-fluid" style={{marginTop:'-30px'}}>
                    <div className="col-12">
                        <h1>My Portfolio</h1>
                    </div>
                    {isLoading && (<div>
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status"></div>
                        </div>
                    </div>)}
                    {!isLoading && <div className="row">

                        <div className="col-12">
                            <h3 style={{ color: "#323232" }}>Money in Wallet : ${currentBalance ? (currentBalance).toFixed(2) : '0.00'}</h3>
                        </div>
                        {emptyResponse && (<div className="alert alert-warning alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                            Currently you don't have any stock in your portfolio.

                        </div>)}
                        {data?.map((item, index) => (
                            <div className="col-12 mt-3" key={index}>
                                <div className='container-fluid' style={{ backgroundColor: "#f5f5f5", padding: '0px', border: 'solid 1px', borderRadius: '7px' }}>
                                    <div className='row'>
                                        <div className='col-3 col-md-2 mx-3'>
                                            <h2>{item.ticker}</h2>
                                        </div>
                                        <div className='col-8  ms-0' style={{ marginTop: '6px' }}>
                                            <h4 style={{ color: "#555a5a" }}>{item.company}</h4>
                                        </div>
                                    </div>
                                    <hr className='m-0' />
                                    <div className='container-fluid mt-0' style={{ backgroundColor: 'white', paddingTop: "1%", paddingBottom: "1%", fontSize: '10px' }}>
                                        <div className='row'>
                                            <div className='col-6 col-md-4'>
                                                <h5>Quantity:</h5>
                                            </div>
                                            <div className='col-6 col-md-2'>
                                                <h5>{item.quantity.toFixed(2)}</h5>
                                            </div>
                                            <div className='col-6 col-md-4'>
                                                <h5>Change:</h5>
                                            </div>
                                            <div className='col-6 col-md-2' style={{ color: prices[index]?.price - (item.price / item.quantity) < 0 ? 'red' : prices[index]?.price - (item.price / item.quantity) > 0 ? 'green' : 'black' }}>
                                                <div className='row'>
                                                    <div className='col-1' >
                                                        {
                                                            prices[index]?.price - (item.price / item.quantity) > 0 ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                                                </svg>
                                                            ) : prices[index]?.price - (item.price / item.quantity) < 0 ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                                                </svg>
                                                            ) : null
                                                        }
                                                    </div>
                                                    <div className='col-1' >
                                                        <h5>{(prices[index]?.price - (item.price / item.quantity)).toFixed(2)}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-6 col-md-4'>
                                                <h5>Avg Cost / Share:</h5>
                                            </div>
                                            <div className='col-6 col-md-2'>
                                                <h5>{(item.price / item.quantity).toFixed(2)}</h5>
                                            </div>
                                            <div className='col-6 col-md-4'>
                                                <h5>Current Price:</h5>
                                            </div>
                                            <div className='col-6 col-md-2' style={{ color: prices[index]?.price - (item.price / item.quantity) < 0 ? 'red' : prices[index]?.price - (item.price / item.quantity) > 0 ? 'green' : 'black' }}>
                                                <h5>{prices[index]?.price.toFixed(2)}</h5>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-6 col-md-4'>
                                                <h5>Total Cost:</h5>
                                            </div>
                                            <div className='col-6 col-md-2'>
                                                <h5>{(parseFloat(item.price).toFixed(2))}</h5>
                                            </div>
                                            <div className='col-6 col-md-4'>
                                                <h5>Market Value:</h5>
                                            </div>
                                            <div className='col-6 col-md-2' style={{ color: prices[index]?.price - (item.price / item.quantity) < 0 ? 'red' : prices[index]?.price - (item.price / item.quantity) > 0 ? 'green' : 'black' }}>
                                                <h5>{(prices[index]?.price * item.quantity).toFixed(2)}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0' />
                                    <div className='row'>
                                        <div className='container'>
                                            <button className='btn btn-primary m-2' onClick={() => { buy(item, prices[index]?.price) }}>Buy</button>
                                            <button className='btn btn-danger' onClick={() => { sell(item, prices[index]?.price) }}>Sell</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                        <BuyModal showBuyModal={showBuyModal} toggleBuyModal={toggleBuyModal} toggleBuyMessage={toggleBuyMessage} currentBalance={currentBalance} ticker={ticker} latest_price={current_price} company={company} />
                        <SellModal showSellModal={showSellModal} toggleSellModal={toggleSellModal} toggleSellMessage={toggleSellMessage} currentBalance={currentBalance} ticker={ticker} latest_price={current_price} company={company} />
                    </div>}

                </div>
            </div>
        </div>
    )
}