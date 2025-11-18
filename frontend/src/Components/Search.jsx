import { Form, Container, Row, Col } from 'react-bootstrap';
import Tabs from './Tabs';
import CompanyInfo from './CompanyInfo';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import "../static/Search.css"


export default function Search(props) {

    const [ticker_name, setTickerName] = useState("");
    const [summary_info, setSummaryInfo] = useState("default");
    const [summary_chart, setSummaryChart] = useState({ results: [] });
    const [news_info, setNewsInfo] = useState([]);
    const [charts_info, setChartsInfo] = useState({ results: [] });
    const [insights_info, setInsightsInfo] = useState({ results: [] });
    const [url, setUrl] = useState("");
    const [dataValid, setDataValid] = useState(false);
    const [click, setClick] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let timeoutId = null;
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionSet, setIsSuggestionSet] = useState(false);
    const [autoSuggestLoader, setAutoSuggestLoader] = useState(true);
    const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
    const [hide, setHide] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const getSuggestionValue = suggestion => suggestion.displaySymbol;
    const navigate = useNavigate();
    let cancelTokenSource = axios.CancelToken.source();

    const currentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2); // months are 0-indexed
        const day = ('0' + now.getDate()).slice(-2);
        const dayIndex = now.getDay();

        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);

        const currentDate = `${year}-${month}-${day}`;
        const currentTime = `${hours}:${minutes}:${seconds}`;
        const currentDateTime = `${currentDate} ${currentTime}`;
        // setCurrentTime(currentDateTime);
        return {
            year: year,
            month: month,
            day: day,
            dayIndex: dayIndex,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            Date: currentDate,
            Time: currentTime,
            DateTime: currentDateTime
        }
    }

    function unixToOriginal(unixTimestamp = summary_info?.latest_price?.t) {
        const now = new Date(unixTimestamp * 1000);
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2); // months are 0-indexed
        const day = ('0' + now.getDate()).slice(-2);
        const dayIndex = now.getDay();

        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);

        const currentDate = `${year}-${month}-${day}`;
        const currentTime = `${hours}:${minutes}:${seconds}`;
        const currentDateTime = `${currentDate} ${currentTime}`;
        return {
            year: year,
            month: month,
            day: day,
            dayIndex: dayIndex,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            Date: currentDate,
            Time: currentTime,
            DateTime: currentDateTime
        }
    }

    const isMarketOpen = (now, last) => {
        let curr = new Date(now);
        let lastClosed = new Date(last);

        let differenceInMilliseconds = curr - lastClosed;
        let differenceInSeconds = differenceInMilliseconds / 1000;
        let differenceInMinutes = differenceInSeconds / 60;



        if (differenceInMinutes > 5) return false;
        else return true;
    }
    const last = unixToOriginal(summary_info?.latest_price?.t);
    const now = currentDate();

    useEffect(() => {
        const myData = JSON.parse(localStorage.getItem('myData'));

        const path = window.location.pathname;
        setUrl(path);

        let ishome = path.endsWith("/home");
        let isTicker = path.endsWith(`/${myData?.ticker_name}`);
        if (!ishome && !isTicker) {
            let storedTickerName = path.split("/search/")[1];

            setTickerName(storedTickerName);

            callBackend(storedTickerName);
        }
        else if (myData?.ticker_name && myData?.summary_info !== "default" && myData?.news_info.length > 0) {
            setTickerName(myData.ticker_name);
            setSummaryInfo(myData.summary_info);
            setSummaryChart(myData.summary_chart);
            setNewsInfo(myData.news_info);
            setChartsInfo(myData.charts_info);
            setInsightsInfo(myData.insights_info);
            setDataValid(true);
            setAutoSuggestLoader(false);
            setIsSuggestionSet(false)
            window.history.pushState({}, null, `/search/${myData.ticker_name}`);
        }
    }, []);

    const text_primary = {
        border: '1px solid white',
        borderRadius: '8px',
        color: 'white'
    }



    const renderSuggestion = (suggestion, { query, isHighlighted }) => (
        <div style={{
            backgroundColor: isHighlighted ? '#fafafa' : 'white',// Add this line to add some space between items
        }} className='render-suggestion'>
            <span>{suggestion.displaySymbol} | {suggestion.description}</span>
        </div>
    );
    const onSuggestionSelected = (event, { suggestion }) => {
        event.preventDefault();
        setIsSuggestionSet(true);



        setTickerName(suggestion.displaySymbol);
        setIsSuggestionSelected(true);

    };
    useEffect(() => {
        if (isSuggestionSet) {
            // setIsValid(false);
            callBackend(ticker_name);
        }
    }, [isSuggestionSet]);



    var callBackend = (storedTickerName) => {
        setHide(false);
        setClick(true);
        setIsLoading(true);
        setDataValid(false);
        if (storedTickerName !== "") {
            navigate(`/search/${storedTickerName}`);
            axios.get(`http://localhost:3000/summary?ticker_name=${storedTickerName}`)
                .then(response => {
                    setSummaryInfo(response.data);
                    setIsLoading(false);
                    if (response.data.peers.length > 0) {
                        setDataValid(true);
                    }
                    else {
                        setDataValid(false);
                    }
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
        }
        else{
            setTickerName("");
        }

    }

    var handleInputChange = (event, { newValue }) => {
        const inputValue = typeof newValue === 'string' ? newValue : event.target.value;
        setTickerName(inputValue);
        setClick(false);
        setIsSuggestionSet(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/search/${ticker_name}`);
        callBackend(ticker_name);
    };

    useEffect(() => {
        if (dataValid) {
            let context = { ticker_name, summary_info, summary_chart, news_info, charts_info, insights_info }
            // axios.get(`http://localhost:3000/news?ticker_name=${ticker_name}`)
            //     .then(response => {
            //         context.news_info = response.data;
            //         setNewsInfo(response.data);
            //     })
            //     .catch(error => {
            //         console.error('An error occurred:', error);
            //     });
            // axios.get(`http://localhost:3000/summary-charts?ticker_name=${ticker_name}`)
            //     .then(response => {
            //         setSummaryChart(response.data);
            //         context.summary_chart = response.data;
            //     })
            //     .catch(error => {
            //         console.error('An error occurred:', error);
            //     });
            // axios.get(`http://localhost:3000/charts?ticker_name=${ticker_name}`)
            //     .then(response => {
            //         setChartsInfo(response.data);
            //         context.charts_info = response.data;
            //     })
            //     .catch(error => {
            //         console.error('An error occurred:', error);
            //     });
            // axios.get(`http://localhost:3000/insights?ticker_name=${ticker_name}`)
            //     .then(response => {
            //         setInsightsInfo(response.data);
            //         context.insights_info = response.data;
            //     })
            //     .catch(error => {
            //         console.error('An error occurred:', error);
            //     });
            Promise.all([
                axios.get(`http://localhost:3000/news?ticker_name=${ticker_name}`),
                axios.get(`http://localhost:3000/summary-charts?ticker_name=${ticker_name}`),
                axios.get(`http://localhost:3000/charts?ticker_name=${ticker_name}`),
                axios.get(`http://localhost:3000/insights?ticker_name=${ticker_name}`)
            ]).then(([newsResponse, summaryChartResponse, chartsResponse, insightsResponse]) => {
                context.news_info = newsResponse.data;
                context.summary_chart = summaryChartResponse.data;
                context.charts_info = chartsResponse.data;
                context.insights_info = insightsResponse.data;

                setNewsInfo(newsResponse.data);
                setSummaryChart(summaryChartResponse.data);
                setChartsInfo(chartsResponse.data);
                setInsightsInfo(insightsResponse.data);

                localStorage.setItem('myData', JSON.stringify({ ...context }));
            }).catch(error => {
                console.error('An error occurred:', error);
            });
        }
    }, [dataValid]);


    useEffect(() => {
        const myData = JSON.parse(localStorage.getItem('myData'));
        const path = window.location.pathname;
        setUrl(path);

        let ishome = path.endsWith("/home");
        let isTicker = path.endsWith(`/${myData?.ticker_name}`)

        if (!ishome && !isTicker) {

            let storedTickerName = path.split("/search/")[1];

            setTickerName(storedTickerName);
            callBackend(storedTickerName);
        }
        else {
            // window.location.reload();

        }
        // else {
        //     setTickerName("")
        // }
    }, [window.location.pathname])

    function clearAll() {
        navigate("/search/home");
        setTickerName("");
        setHide(true);
        localStorage.setItem('myData', JSON.stringify({}));
    }


    useEffect(() => {
        // Set up a timer to refresh the page every 15 seconds
        const timer = setInterval(() => {

            // 
            // 
            // 
            // 
            // 
            if (ticker_name && window.location.pathname !== "/search/home") {
                setHide(false);
                // navigate(`/search/${ticker_name}`);



                if (ticker_name !== "") {

                    axios.get(`http://localhost:3000/current_stock_price?ticker_name=${ticker_name}`)
                        .then(response => {
                            let last_summary = summary_info;
                            last_summary.latest_price = response.data;


                            setSummaryInfo(last_summary);

                            setCurrentTime(currentDate().currentDateTime)
                        })
                        .catch(error => {
                            console.error('An error occurred:', error);
                        });
                }
            }
        }, 15000);

        // Clean up the timer when the component is unmounted
        return () => clearInterval(timer);
    }, [ticker_name, summary_info]); // Include ticker_name in the dependency array


    // // Save data to local storage
    // // const [ticker_name, setTickerName] = useState("");
    // // const [summary_info, setSummaryInfo] = useState("default");
    // // const [summary_chart, setSummaryChart] = useState({ results: [] });
    // // const [news_info, setNewsInfo] = useState([]);
    // // const [charts_info, setChartsInfo] = useState({ results: [] });
    // if (ticker_name && news_info.length > 0 && summary_info !== "default") {
    //     localStorage.setItem('myData', JSON.stringify({ ticker_name, summary_info, summary_chart, news_info, charts_info, insights_info }));
    // }
    return (
        <>
            <br />
            <p style={{ textAlign: 'center', fontSize: '30px', fontWeight: '400' }}>STOCK SEARCH</p><br />
            <Container className="search-container">
                <Row>
                    <Col className='search-bar'>
                        <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
                            <Form.Group>
                                <Autosuggest
                                    theme={{
                                        suggestionsContainer: {
                                            position: 'absolute',
                                            width: '100%',
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
                                            borderRadius: '4px',
                                            backgroundColor: 'white',
                                            padding: '10px',
                                            zIndex: '9999'
                                        },
                                        suggestionsList: {
                                            listStyleType: 'none',
                                            paddingLeft: '0'
                                        }
                                    }}
                                    renderSuggestionsContainer={({ containerProps, children, query }) => {
                                        return (!click && (suggestions.length > 0 || (autoSuggestLoader && ticker_name.length > 0))) && (
                                            <div {...containerProps} style={{ ...containerProps.style, maxHeight: '200px', overflow: 'auto' }}>
                                                {autoSuggestLoader && ticker_name.length > 0 && suggestions.length == 0 ?
                                                    <div className="d-flex">
                                                        <div className="spinner-border" role="status">
                                                        </div>
                                                    </div>
                                                    : children}
                                            </div>
                                        );
                                    }}


                                    suggestions={suggestions}
                                    // when you want to fetch something. Declare a variable to hold the timeout ID

                                    onSuggestionsFetchRequested={({ value }) => {
                                        if (!isSuggestionSelected) {
                                            // Cancel the previous delay
                                            clearTimeout(timeoutId);

                                            if (value.length > 0) {
                                                // Set a delay before fetching the suggestions
                                                timeoutId = setTimeout(() => {
                                                    setAutoSuggestLoader(true);
                                                    setSuggestions([]);
                                                    // Cancel the previous request
                                                    cancelTokenSource.cancel();
                                                    // Create a new CancelToken source
                                                    cancelTokenSource = axios.CancelToken.source();
                                                    axios.get(`http://localhost:3000/autocomplete?query=${value}`, {
                                                        cancelToken: cancelTokenSource.token
                                                    }).then(response => {
                                                        const filteredSuggestions = response.data.filter(suggestion =>
                                                            suggestion.type === 'Common Stock' && !suggestion.symbol.includes('.')
                                                        );
                                                        setSuggestions(filteredSuggestions);
                                                        setAutoSuggestLoader(false);
                                                    }).catch(error => {
                                                        if (axios.isCancel(error)) {

                                                        } else {
                                                            console.error('Failed to fetch suggestions:', error);
                                                            setAutoSuggestLoader(false);
                                                        }
                                                    });
                                                }, 100); // 300ms delay
                                            } else {
                                                setSuggestions([]);
                                                setAutoSuggestLoader(false);
                                            }
                                        } else {
                                            setSuggestions([]);
                                        }
                                    }}
                                    onSuggestionsClearRequested={() => {
                                        setSuggestions([]);
                                        setIsSuggestionSelected(false);
                                    }}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    onSuggestionSelected={onSuggestionSelected}
                                    // when nothing is entered in ticker name, give suggestions only when something is entered
                                    shouldRenderSuggestions={(value) => value !== undefined && value.trim().length > 0}
                                    inputProps={{
                                        placeholder: "Enter stock ticker symbol",
                                        value: ticker_name,
                                        onChange: handleInputChange,
                                        className: 'input-box',
                                    }}
                                />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className='icon'>
                        <svg type="button" onClick={() => { callBackend(ticker_name) }} style={{ marginTop: '8px' }} className="ms-auto bi bi-search" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </Col>
                    <Col className='icon'>
                        <svg type="button" onClick={clearAll} style={{ marginTop: '8px' }} className="mx-3 bi bi-x-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                    </Col>
                </Row>
            </Container>
            <br />
           <div>
                <CompanyInfo hide={hide} info={summary_info} ticker_name={ticker_name} dataValid={dataValid} click={click} isLoading={isLoading} last={last} now={now} isMarketOpen={isMarketOpen(now.DateTime, last.DateTime)} />
                <br />
                <Tabs hide={hide} info={summary_info} summary_chart={summary_chart} news={news_info} charts={charts_info} insights={insights_info} ticker_name={ticker_name} isValid={dataValid} isMarketOpen={isMarketOpen(now.DateTime, last.DateTime)} />
            </div>
        </>
    )
}