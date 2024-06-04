import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import $ from 'jquery';

const METHOD_GET = {method: "GET"};

const SearchCars = () => {
    const [cars, setCars] = useState([]);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [dealer, setDealer] = useState('');
    const [message, setMessage] = useState('');

    let curr_url = window.location.href;
    let root_url = curr_url.substring(0,curr_url.indexOf("searchcars"));
    let params = useParams();
    let id =params.id;
    let dealer_url = `${root_url}djangoapp/get_inventory/${id}`;
    let fetch_url = `${root_url}djangoapp/dealer/${id}`;
    



    const fetchDealer = async () => {
        const res = await fetch(fetch_url, METHOD_GET);
        const retobj = await res.json();
        if(retobj.status === 200) {
            setDealer(retobj.dealer[0]);
        }
    };

    const populateMakesAndModels = (cars) => {
        let makes = new Set();
        let models = new Set();
        cars.forEach(car => {
            makes.add(car.make);
            models.add(car.model);
        });
        setMakes(Array.from(makes));
        setModels(Array.from(models));
    }

    const fetchCars = async () => {
        const res = await fetch(dealer_url, METHOD_GET);
        const retobj = await res.json();
        if(retobj.status === 200) {
            setCars(retobj.cars);
            populateMakesAndModels(retobj.cars);
        }
    };

    const setCarsMatchingCriteria = async(matching_cars)=> {
        let cars = Array.from(matching_cars);
        
        let makeIdx = $('#make').prop('selectedIndex');
        let yearIdx = $('#year').prop('selectedIndex');
        let mileageIdx = $('#mileage').prop('selectedIndex');
        let priceIdx = $('#price').prop('selectedIndex');

        if(makeIdx)cars = cars.filter(car => car.make === $('#make').val());
        if(yearIdx)cars = cars.filter(car => car.year === parseInt($('#year').val()));
        if(mileageIdx) {
            switch($('#mileage').val()) {
                case '50000':
                    cars = cars.filter(car => car.mileage <= 50000);
                    break;
                case '100000':
                    cars = cars.filter(car => car.mileage > 50000 && car.mileage <= 100000);
                    break;
                case '150000':
                    cars = cars.filter(car => car.mileage > 100000 && car.mileage <= 150000);
                    break;
                case '200000':
                    cars = cars.filter(car => car.mileage > 150000 && car.mileage <= 200000);
                    break;
                default:
                    cars = cars.filter(car => car.mileage > 200000);
                    break;
            }
        }
        if(priceIdx) {
            switch($('#price').val()) {
                case '20000':
                    cars = cars.filter(car => car.price <= 20000);
                    break;
                case '40000':
                    cars = cars.filter(car => car.price > 20000 && car.price <= 40000);
                    break;
                case '60000':
                    cars = cars.filter(car => car.price > 40000 && car.price <= 60000);
                    break;
                case '80000':
                    cars = cars.filter(car => car.price > 60000 && car.price <= 80000);
                    break;
                default:
                    cars = cars.filter(car => car.price > 80000);
                    break;
            }
        }
        if (cars.length === 0) setMessage('No cars match the criteria');
        setCars(cars);
    };

    const SearchCarsByMake = async () => {
        let make = $('#make').val();
        let seach_url = `${dealer_url}?make=${make}`;
        const res = await fetch(seach_url, METHOD_GET);
        const retobj = await res.json();
        if(retobj.status === 200) {
            setCarsMatchingCriteria(retobj.cars);
        }
    };

    const SearchCarsByModel = async () => {
        let model = $('#model').val();
        let seach_url = `${dealer_url}?model=${model}`;
        const res = await fetch(seach_url, METHOD_GET);
        const retobj = await res.json();
        if(retobj.status === 200) {
            setCarsMatchingCriteria(retobj.cars);
        }
    };

    const SearchCarsByYear = async () => {
        let year = $('#year').val();
        let seach_url = (year !== 'all')? `${dealer_url}?year=${year}`: dealer_url;
        const res = await fetch(seach_url, METHOD_GET);
        const retobj = await res.json();
        if(retobj.status === 200) {
            setCarsMatchingCriteria(retobj.cars);
        }
    }

    const SearchCarsByMileage = async () => {
        let mileage = $('#mileage').val();
        let seach_url = (mileage !== 'all')? `${dealer_url}?mileage=${mileage}`: dealer_url;
        const res = await fetch(seach_url, METHOD_GET);
        const retobj = await res.json();
        if(retobj.status === 200) {
            setCarsMatchingCriteria(retobj.cars);
        }
    };

    const SearchCarsByPrice = async () => {
        let price = $('#price').val();
        let seach_url = (price !== 'all')? `${dealer_url}?price=${price}`: dealer_url;
        const res = await fetch(seach_url, METHOD_GET);
        const retobj = await res.json();
        if(retobj.status === 200) {
            setCarsMatchingCriteria(retobj.cars);
        }
    };

    const reset = () => {
        let selects = document.querySelectorAll('select');
        selects.forEach(select => select.selectedIndex = 0);
        fetchCars();
    };

    useEffect(() => {
        fetchDealer();
        fetchCars();
    },[]);

    return (
        <div>
          <Header />
          <h1 style={{ marginBottom: '20px'}}>Cars at {dealer.full_name}</h1>
          <div>
          <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Make</span>
          <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="make" id="make" onChange={SearchCarsByMake}>
            {makes.length === 0 ? (
              <option value=''>No data found</option>
            ):(
              <>
              <option disabled defaultValue> -- All -- </option>
              {makes.map((make, index) => (
                <option key={index} value={make}>
                  {make}
                </option>
              ))}
            </>
            )        
            }
          </select>
          <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Model</span>
          <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="model" id="model" onChange={SearchCarsByModel}>
          {models.length === 0 ? (
            <option value=''>No data found</option>
          ) : (
            <>
              <option disabled defaultValue> -- All -- </option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </>
          )}      
          </select>
          <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Year</span>
          <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="year" id="year" onChange={SearchCarsByYear}>
              <option selected value='all'> -- All -- </option>
              <option value='2024'>2024 or newer</option>
              <option value='2023'>2023 or newer</option>
              <option value='2022'>2022 or newer</option>
              <option value='2021'>2021 or newer</option>
              <option value='2020'>2020 or newer</option>
          </select>
          <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Mileage</span>
          <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="mileage" id="mileage" onChange={SearchCarsByMileage}>
            <option selected value='all'> -- All -- </option>
              <option value='50000'>Under 50000</option>
              <option value='100000'>50000 - 100000</option>
              <option value='150000'>100000 - 150000</option>
              <option value='200000'>150000 - 200000</option>
              <option value='200001'>Over 200000</option>
          </select>
          <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Price</span>
          <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="price" id="price" onChange={SearchCarsByPrice}>
              <option selected value='all'> -- All -- </option>
              <option value='20000'>Under 20000</option>
              <option value='40000'>20000 - 40000</option>
              <option value='60000'>40000 - 60000</option>
              <option value='80000'>60000 - 80000</option>
              <option value='80001'>Over 80000</option>
          </select>
          <button style={{marginLeft: '10px', paddingLeft: '10px'}} onClick={reset} className='btn btn-primary'>Reset</button>
          </div>
          <div style={{ marginLeft: '10px', marginRight: '10px' , marginTop: '20px'}} >
            {cars.length === 0 ? (
              <p style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }}>{message}</p>
            ) : (
              <div>
                <hr/>
                {cars.map((car) => (
                  <div>
                  <div key={car._id}>
                    <h3>{car.make} {car.model}</h3>
                    <p>Year: {car.year}</p>
                    <p>Mileage: {car.mileage}</p>
                    <p>Price: {car.price}</p>
                  </div>
                  <hr/>
                  </div>
                )
            )}
              </div>
            )}
          </div>
          <a href={`/dealer/${id}`} className='btn btn-primary'>Back to Dealer</a>
        </div>
      );
};

export default SearchCars;