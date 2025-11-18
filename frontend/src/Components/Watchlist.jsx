import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Watchlist() {
    const [data, setData] = useState([]);
    const [prices, setPrices] = useState({});
    const [positive, setPositive] = useState(false);
    const [emptyResponse, setEmptyResponse] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const fetchData = async () => {
        setIsLoading(true);
        const result = await axios.get('http://localhost:3000/watchlist');
        const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));
        
        if (result.data.length === 0) {
            setEmptyResponse(true);
        }
        else {
            setEmptyResponse(false);
        }
        setData(result.data);
        const pricePromises = result?.data.map(async (item, index) => {
            await delay(1000); // Wait for 1 second between each request
            const priceResult = await axios.get(`http://localhost:3000/current_stock_price?ticker_name=${item.ticker}`);
            return priceResult.data;
        });
        if (pricePromises) {
            const prices = await Promise.all(pricePromises);
            setPrices(prices); // Store the prices as an array
            
        }
        setIsLoading(false);
    };
    useEffect(() => {
        fetchData();

    }, [])
    const deleteStock = (ticker, event) => {
        // 
        axios.post('http://localhost:3000/deleteWatchlistItem', { ticker: ticker })
            .then((res) => {
                
                
                // navigate(`/watchlist`);
            }).catch((err) => {
                
            })
            fetchData();
        // here I want to rerender the component


    }
    const goToCompany = (ticker) => {
        
        navigate(`/search/${ticker.toUpperCase()}`);
    }
    return (
        <>


            <div className="container" style={{ marginBottom: '100px' }} >
                <h1 style={{ marginBottom: '20px' }}>My watchlist</h1>
                {emptyResponse && (<div className="alert alert-warning alert-dismissible fade show" role="alert" style={{ textAlign: 'center' }}>
                    Currently you don't have any stock in your watchlist.

                </div>)}
                {isLoading && (<div>
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                </div>)}
                {!isLoading && data.map((item, index) => {
                    const price = prices[index];
                    
                    return (
                        <div class="card" style={{ marginBottom: '20px' }}>

                            <svg type="button" style={{ marginTop: '10px', marginLeft: '10px', cursor: 'pointer' }} onClick={() => deleteStock(item.ticker)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">

                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>

                            <div class="row g-0"  type="button" onClick={() => { goToCompany(item.ticker) }}>
                                <div class="col-6">
                                    <div class="card-body">
                                        <h4 class="card-title">{item.ticker.toUpperCase()}</h4>
                                        <p class="card-text">{item.name} </p>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card-body">
                                        {price?.d > 0 ?
                                            <span>
                                                <span class="card-text" style={{ color: 'green' }}><h4>{price?.c.toFixed(2)}</h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-caret-up-fill" viewBox="0 0 16 16" />
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                                    </svg> {price?.d.toFixed(2)} ({price?.dp.toFixed(2)}%)
                                                </span>
                                            </span>
                                            : 
                                            <span>
                                                <span class="card-text" style={{ color: 'red' }}><h4>{price?.c.toFixed(2)}</h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-caret-up-fill" viewBox="0 0 16 16" />
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                                    </svg> {price?.d.toFixed(2)} ({price?.dp.toFixed(2)}%)
                                                </span>
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div >
        </>
    )
}
