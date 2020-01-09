import React, {Component} from 'react';
import '../App.css';
import Multiselect from 'multiselect-dropdown-react';

/**
 * Description: 
 * 
 * @param none 
 */
class Orders extends Component {
    constructor(props) {
      super(props);
      this.state = {
        cupcakesArray: [{
          name: 'Peanut Butter Base',
          value: 'BASE.peanutButterBase'
        },
        {
            name: 'Lemon Bar Base',
            value:'BASE.lemonbarBase'
        },
        {
          name: 'Chocolate Base',
          value:'BASE.chocolateBase'
        },
        {
          name: 'Vanilla Base',
          value: 'BASE.vanillaBase'

        },
        {
          name: 'Red Velvet Base',
          value: 'BASE.redVelvetBase'

        },
        {
            name: 'Vanilla Frosting',
            value: 'FROSTING.vanillaFrosting'
        },
        {
          name: 'Chocolate Frosting',
          value: 'FROSTING.chocolateFrosting'

        },
        {
          name: 'Espresso Butter Cream Frosting',
          value: 'FROSTING.espressoButtercreamFrosting'

        },
        {
          name: 'Red Velvet Frosting',
          value: 'FROSTING.redVelvetFrosting'

        }, 
        {
          name: 'Sprinkles',
          value: 'TOPPING.sprinkles'
        },
        {
          name: 'Coconut Flakes',
          value: 'TOPPING.coconutFlakes'
        },
        {
          name: 'Strawberries',
          value: 'TOPPING.strawberries'
        },
        {
          name: 'Gummy Bears',
          value: 'TOPPING.gummyBears'
        },
        {
          name: 'Chocolate Chips',
          value: 'TOPPING.chocolateChips'
        },
        {
          name: 'Cocoa Powder',
          value: 'TOPPING.cocoaPowder'
        }
        ], 
        ordersObject: {},
        sortingOrder: 'DESC',
      };
     
      this.sortThenSetData.bind(this);
      this.selectOption = this.selectOption.bind(this); 
    }

  /**
   * Description: Executes function immediately after Component is rendered 
   * 
   * @param none 
   */
    componentDidMount() {
      this.getOrders(); 
    }

   /**
   * Description: Renders table data for recent orders made by user (from API call)
   * 
   * @param {Array} orders array of objects 
   * ex: [id: 000000 , delivery_date: 2020-01-09T12:01:13.969Z, cupcakes: [base: peanutButterBase, vanillaFrosting, sprinkles]] 
   */
    renderTableData(orders) {
      const date = new Date(); 
      
      return (
          <tbody>
            {orders && orders.map(item =>
            date.toISOString() <= item.delivery_date && item.cupcakes != "" &&
                    <tr key={item.id}>  
                      <td>{item.delivery_date}</td>
                      <td>
                        {item.cupcakes.map((subitem =>
                            <ul>
                            <li>{subitem.base}</li>
                            <li>{subitem.frosting}</li>
                            {subitem.toppings.map((subsubitem =>
                                <li>{subsubitem}</li>
                            ))}
                            </ul>
                          ))}
                      </td>
                    </tr>
            )}
          </tbody>
      );
    }

   /**
   * Description: Makes an API call to return a list of cupcake bases from server 
   * 
   * @param none 
   */
    getOrders() {
      fetch('http://localhost:4000/cupcakes/orders')
      .then(results => results.json())
      .then(ordersObject => this.sortThenSetOnInitialLoad(ordersObject.orders, 'delivery_date', false))
    }

   /**
   * Description: sorts the data returned from the API when the component reders
   * 
   * @param {Object}  data          an array of objects returned from the API   
   * @param {String}  sortedKey     a string containing the key to be sorted on (delivery_date)
   * @param {Boolean} toggleOrder   a boolean to test if the toggleOrder is on
   */
    sortThenSetOnInitialLoad(data, sortedKey, toggleOrder) {
      const sortedData = this.doSort(data, sortedKey, toggleOrder);

      let sortingOrder = this.state.sortingOrder;
      if(toggleOrder) {
        sortingOrder = (sortingOrder === 'ASC' ? 'DESC' : 'ASC');    
      }

      this.setState({
        originalData: data,
        data: sortedData,
        sortingOrder 
      });
    }

   /**
   * Description: This function allows the user to sort the menu based on date
   * 
   * @param {Object}  data          an array of objects returned from the API   
   * @param {String}  sortedKey     a string containing the key to be sorted on (delivery_date)
   * @param {Boolean} toggleOrder   a boolean to test if the toggleOrder is on
   */
    doSort(data, sortedKey, toggleOrder) { 
      let sortingOrder = this.state.sortingOrder;
      if(toggleOrder) {
        sortingOrder = (sortingOrder === 'ASC' ? 'DESC' : 'ASC');    
      }
      if(sortingOrder === 'DESC') {
          data.sort((a,b) => b[sortedKey].localeCompare(a[sortedKey]))
        }
      else {
          sortingOrder = 'ASC'; 
          data.sort((a,b) => a[sortedKey].localeCompare(b[sortedKey]))
      }

      return data;
    }

   /**
   * Description: This function allows the user to sort the menu based on date
   * 
   * @param {Object}  data          an array of objects returned from the API   
   * @param {String}  sortedKey     a string containing the key to be sorted on (delivery_date)
   * @param {Boolean} toggleOrder   a boolean to test if the toggleOrder is on
   */
    sortThenSetData(data, sortedKey, toggleOrder) {   
        const sortedData = this.doSort(data, sortedKey, toggleOrder);
        let sortingOrder = this.state.sortingOrder;

        if(toggleOrder) {
          sortingOrder = (sortingOrder === 'ASC' ? 'DESC' : 'ASC');    
        }

        this.setState({ 
          data: sortedData,
          sortingOrder 
        }) 
    }

   /**
   * Description: Tests to see if a value is includes in an array 
   * 
   * @param {Array} selections    an array of selected items from menu drop-down
   * @param {type}  targetValue   one of the array's attributes 
   */
    containsTypeValue(selections, targetValue) {
      return selections.includes(targetValue);
    }

  /**
   * Description: Tests an intersection of two arrays and then returns the value
   * 
   * @param {Array} selections    an array of selected items from menu drop-down
   * @param {Array} array         one of the array's attributes  
   */
    containsAtLeastOneTypeValueMatch(selections, array) {  
      let selectedItem = ""; 
      const selected = selections.filter(value => array.includes(value));
      if(selected.length != 0) {
        selected.map(item => {
          selectedItem = item;  
        })
        return (
          selectedItem
        )
      }
    }

   /**
   * Description: Splits a string and returns the value at position 0
   * 
   * @param {String} value a string variable ex: BASES.toppings
   */
    getType(value) {
      return value.split('.')[0];
    }

   /**
   * Description: Splits a string and returns the value at position 1
   * 
   * @param {String} value a string variable ex: BASES.toppings 
   */
    getTargetValue(value) {
      return value.split('.')[1];
    }

   /**
   * Description: 
   *    Maps over the cupcakes array to test if at least one element matches selected
   *    Tests if user has selected one or more items from menu-dropdown
   *    Calls functions to test if the selected item is included in the cupcakes array 
   * @param {Array} selections  an array of selections made by the user 
   */
    selectOption(selections) {
      const {originalData} = this.state;

      const filteredOriginalData = originalData.filter(order => {
        const {cupcakes} = order;

        return cupcakes.some(cupcake => {
          const baseSelections = selections.filter(selection => this.getType(selection) === 'BASE')
          .map(this.getTargetValue);
          const frostingSelections = selections.filter(selection => this.getType(selection) === 'FROSTING')
          .map(this.getTargetValue);
          const toppingSelections = selections.filter(selection => this.getType(selection) === 'TOPPING')
          .map(this.getTargetValue); 

          if(baseSelections.length === 0 && toppingSelections.length === 0) {
            return this.containsTypeValue(frostingSelections, cupcake.frosting);
          }

          if(frostingSelections.length === 0 && toppingSelections.length === 0) {
            return this.containsTypeValue(baseSelections, cupcake.base);
          }

          if(frostingSelections.length === 0 && baseSelections.length === 0) {
            const returnValue = this.containsAtLeastOneTypeValueMatch(toppingSelections, cupcake.toppings);
            return this.containsTypeValue(toppingSelections, returnValue);  
          }

          return this.containsTypeValue(frostingSelections, cupcake.frosting) 
          && this.containsTypeValue(baseSelections, cupcake.base)
          && this.containsTypeValue(toppingSelections, cupcake.toppings);
        });
      }).map(order => {
        const {cupcakes} = order; 
        const filteredCupcakes = cupcakes.filter(cupcake => {
          const baseSelections = selections.filter(selection => this.getType(selection) === 'BASE').map(this.getTargetValue);;
          const frostingSelections = selections.filter(selection => this.getType(selection) === 'FROSTING').map(this.getTargetValue);
          const toppingSelections = selections.filter(selection => this.getType(selection) === 'TOPPING').map(this.getTargetValue);

          if(baseSelections.length === 0 && toppingSelections.length === 0) {
            return this.containsTypeValue(frostingSelections, cupcake.frosting);
          }

          if(frostingSelections.length === 0 && toppingSelections.length === 0) {
            return this.containsTypeValue(baseSelections, cupcake.base);
          }

          if(frostingSelections.length === 0 && baseSelections.length === 0) {
            const returnValue = this.containsAtLeastOneTypeValueMatch(toppingSelections, cupcake.toppings);
            return this.containsTypeValue(toppingSelections, returnValue);  
          }

          return this.containsTypeValue(frostingSelections, cupcake.frosting) 
          && this.containsTypeValue(baseSelections, cupcake.base)
          && this.containsAtLeastOneTypeValueMatch(toppingSelections, cupcake.toppings);
        }); 

        return {
          id: order.id,
          delivery_date: order.delivery_date, 
          cupcakes: filteredCupcakes
        };
      });
      
      const data = this.doSort(filteredOriginalData, 'delivery_date', false);

      this.setState({
        data
      });
    }
     
  /**
   * Description: Renders the Orders component (table)
   * 
   * @param none 
   */
    render() { 

      let {data, cupcakesArray} = this.state;

      return ( 
        <table className="zui-table"> 
        <thead>
        <tr>
        <th>ORDERS</th>
        <th><Multiselect options={cupcakesArray} onSelectOptions={this.selectOption}/></th>
        </tr>
          <tr>
            <th onClick={() => this.sortThenSetData(data, 'delivery_date', true)}>Date</th>
            <th>Description</th>
            
          </tr>
        </thead>
            {this.renderTableData(data)}
        </table>
      );
      
    }
  }

  export default Orders; 