import React, {Component} from 'react';
import '../App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subDays from "date-fns/subDays";
import { NavLink } from 'react-router-dom';
import Popup from './Popup'

/**
 * Description: Generates buttons corresponding to arrays returned from server 
 * 
 * @param {Array}         list         an array of attributes 
 * @param {Function} handleClick       a call to handle click when Buttons is called
 */
function Buttons({ list, handleClick }) {
  const style={
    display: 'inline-block',
    textAlign: 'center',
    border: '1px solid black',
    padding: '10px',
    margin: '10px',
    color: 'purple',
    backgroundColor: 'aliceblue',
    width: '30%',
    
  }
  return (
    <div>
        {list && list.map(item =>
            <button key={item.key}
            style={style}
            onClick={() => handleClick(item.key)}
            className={item.isSelected ? "active" : ""}
            >
                {/* <p>{item.key}</p> */}
                <p>{item.name}</p>
                <p>${item.price}.00</p>
                {/* <p>{item.ingredients}</p> */}
            </button>
        )}
    </div>
  );
};

/**
 * Description: 
 * 
 *
 */
class Cupcakes extends Component {
    constructor() {
      super();

      this.state = {
          bases: [],
          frostings: [],
          toppings: [],
          isToggleOn: true,
          cupcakes: [], 
          startDate: new Date(),  
          price: '',
          showPopup: false
      }
  };

  /**
 * Description: Executes functions immediately after Component is rendered  
 * 
 * @param none
 */
  componentDidMount() {
    this.getBases();
    this.getFrostings();
    this.getToppings(); 
    this.postOrder(); 
  }

 /**
 * Description: Makes an API call to return a list of cupcake bases from server  
 * 
 * @param none
 */
  getBases() {
    fetch('http://localhost:4000/cupcakes/bases')
    .then(results => results.json())
    .then(results => {
        const finalResults = results.bases.map(resObj => {
            resObj["isSelected"] = false; 
            return resObj;
          })
          return finalResults; 
        })
    .then(finalResults => this.setState({'bases': finalResults})
  )} 

 /**
 * Description: Makes an API call to return a list of cupcake frostings from server  
 * 
 * @param none
 */
  getFrostings() {
    fetch('http://localhost:4000/cupcakes/frostings')
    .then(results => results.json())
    .then(results => {
      const finalResults = results.frostings.map(resObj => {
          resObj["isSelected"] = false; 
          return resObj;
        })
        return finalResults; 
      })
    .then(results => this.setState({'frostings': results}))
  }

/**
 * Description: Makes an API call to return a list of cupcake toppings from server  
 * 
 * @param none
 */
  getToppings() {
    fetch('http://localhost:4000/cupcakes/toppings')
    .then(results => results.json())
    .then(results => {
      const finalResults = results.toppings.map(resObj => {
          resObj["isSelected"] = false; 
          return resObj;
        })
        return finalResults; 
      })
    .then(results => this.setState({'toppings': results}))
  }

 /**
 * Description: Determines what buttons have been selected by the user (single-selection only)  
 * 
 * @param {String} type a string value that iterates through an array   
 */
  handleSingleSelected = type => key => {
    this.setState(state => ({
      [type]: state[type].map(item => ({
        ...item,
        isSelected: item.key === key,
      }))
    }));
  };

/**
 * Description: Determines what buttons have been selected by the user (multi-selection only)  
 * 
 * @param {String} type a string value that iterates through an array   
 */
  handleMultiSelected = type => key => {
    this.setState(state => ({
      [type]: state[type].map(item => {
        if (item.key === key) {
          return {
            ...item,
            isSelected: !item.isSelected,
          };
        }
        return item;
      })
    }));
  };

/**
 * Description: Prints the prices of each item selected by the user  
 * 
 * @param none
 */
 getSelected(type) {
   return type.filter(({ isSelected }) => isSelected);
 }

 /**
 * Description: Prints the prices of each item selected by the user  
 * 
 * @param none
 */
  printPrice() {
    let { bases, frostings, toppings } = this.state;

    //Filters for those values selected by the user 
    const selectedBase = this.getSelected(bases); 
    const selectedFrosting = this.getSelected(frostings); 
    const selectedToppings = this.getSelected(toppings); 

    let basePrice = 0;
    let frostingPrice = 0;
    let toppingsPrices = []; 
    let deliveryCost = 1.50; 
    let salesTax = .0875; 

    selectedBase.map(item => {
      basePrice = item.price; 
      return (
        basePrice
      );
    })
    selectedFrosting.map(item => {
      frostingPrice = item.price; 
      return (
        frostingPrice
      );
    })
    selectedToppings.map(item => {
      toppingsPrices.push(item.price); 
        return (
          toppingsPrices
        )
    })

    let toppingsPrice = toppingsPrices.reduce((a,b) => a + b, 0) 

    return (
      <ul>
      <li>Cupcake Price: ${(basePrice+frostingPrice+toppingsPrice).toFixed(2)}</li>
      <li>Sales Tax (IL): ${(salesTax*(basePrice+frostingPrice+toppingsPrice)).toFixed(2)}</li>
      <li>Delivery Charge: ${deliveryCost.toFixed(2)}</li>
      <li>Subtotal: ${(deliveryCost+basePrice+frostingPrice+toppingsPrice).toFixed(2)}</li>
      <li>Total: ${(
        (salesTax*(basePrice+frostingPrice+toppingsPrice))+
        (deliveryCost+basePrice+frostingPrice+toppingsPrice)
      ).toFixed(2)}</li>
      </ul>
    )
  }

 /**
 * Description: Adds selected values to a cupcake object  
 * 
 * @param none
 */
  handleAddToCart = () => {
    let { bases, frostings, toppings, cupcakes } = this.state;

    //Filters for those values selected by the user 
    const selectedBase = this.getSelected(bases); 
    const selectedFrosting = this.getSelected(frostings); 
    const selectedToppings = this.getSelected(toppings);

    if(selectedBase.length != 0 && selectedFrosting.length != 0 && selectedToppings != 0) {
      const cupcakeDec = {
        base: selectedBase[0].key,
        toppings: selectedToppings.map(topping => topping.key),
        frosting: selectedFrosting[0].key
      } 

      const updatedCupcakes = [...cupcakes, cupcakeDec]
      this.setState({cupcakes: updatedCupcakes})
    }
    else {
      alert("You have not built a cupcake and your cart is empty"); 
    }
  }

getSingleValue(arr) {
  arr.map(item => {
    return item; 
  });
}

/**
 * Description: Prints attributes selected by the user   
 * 
 * @param none
 */
  printCupcake = () => {
    let { bases, frostings, toppings } = this.state;

    //Filters for those values selected by the user 
    const selectedBase = this.getSelected(bases); 
    const selectedFrosting = this.getSelected(frostings); 
    const selectedToppings = this.getSelected(toppings); 
    
    let base = ""; 
    let frosting = "";
    let topping = [];

    //Map functions return single values from arrays from selected items
    selectedBase.map(item => {
      base = item.name; 
      return (
        base
      );
    })
    selectedFrosting.map(item => {
      frosting = item.name; 
      return (
        frosting
      )
    })
    selectedToppings.map(item => {
        topping.push(item.name); 
        return (
          topping
        )
    })
 
    return (
    <div>
      <div>
        <ul>
        <li>{base}</li>
        <li>{frosting}</li>
        {topping.map(topping =>
          <li>{topping}</li>
        )}
        </ul>
        </div>
    </div>
    );
  }

/**
 * Description: Updates the state of startDate when selected by the user 
 * 
 * @param {Object} date holds a date
 */
  handleDateChange = date => {
    this.setState({
      startDate: date
    });
  };

/**
 * Description: Sends a post request with object to the server
 * 
 * @param none 
 */
  postOrder = () => {
    let {cupcakes, startDate} = this.state;

    const today = new Date()
    const tomorrow = new Date(today.getTime() + 86400000);

    const startDateDate = startDate.getDate();
    const tommorowDateDate = tomorrow.getDate();

    if(cupcakes.length != 0 && startDateDate >= tommorowDateDate) {
      const goodOrder = {
        order: {
          cupcakes: cupcakes,
          delivery_date: startDate.toISOString()
        }
      } 

    fetch('http://localhost:4000/cupcakes/orders', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(goodOrder),
      }).then(response => response.json())
      .then(response => {console.log(response)})
    }
  }

togglePopup() {  
    this.setState({  
         showPopup: !this.state.showPopup  
    });  
}
 
/**
 * Description: Renders the Cupcakes component (buttons, cart)
 * 
 * @param none
 */
  render() { 

    const {bases, frostings, toppings, startDate, cupcakes, showPopup } = this.state;

    const today = new Date(); 
    const tomorrow = new Date(today.getTime() + 86400000);

    return (   
      <div>

      <div className="objects col-md-7">
        <h1 style={{fontSize:'30px'}}>Choose a base</h1>
        <Buttons on 
         list={bases}
         handleClick={this.handleSingleSelected("bases")}
        />
        <h1 style={{fontSize:'30px'}}>Choose a frosting</h1>
        <Buttons
         list={frostings}
         handleClick={this.handleSingleSelected("frostings")}
        />
        <h1 style={{fontSize:'30px'}}>Choose toppings</h1>
        <Buttons
         list={toppings}
         handleClick={this.handleMultiSelected("toppings")}
         />
      </div>

      <div className="summary">
        <h1 style={{fontSize:'30px'}}>Price</h1>
        {this.printPrice()}

        <h1 style={{fontSize:'30px'}}>Your cupcake</h1>
        {this.printCupcake()}

        <button onClick={this.handleAddToCart}>Add to Cart</button>

        <h1 style={{fontSize:'30px'}}>Choose a delivery date</h1>

        <DatePicker
        selected={startDate}
        onChange={this.handleDateChange}
        minDate={tomorrow}
        excludeDates={[new Date(), subDays(new Date(), 1)]}
        />

        <div>
        <button onClick={
        startDate.getDate() < tomorrow.getDate() ? 
        this.togglePopup.bind(this) 
        : this.postOrder  
        }>Place Order</button>
        </div>

        <div>
        <NavLink to="/orders">See Orders</NavLink>
        </div>
        
        {showPopup ?
        <Popup  
          text='Delivery date must be at least 24 hours from now'  
          openPopup={this.togglePopup.bind(this)}
          closePopup={this.togglePopup.bind(this)}  
        />  
        : null}

      </div>
      </div>
   
    );
  }
}

export default Cupcakes;

