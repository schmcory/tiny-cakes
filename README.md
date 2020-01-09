# The Sweetest Client

This is an implementation of two prototype screens for Tinycakes, LLC.
The application was built using create-react-app.

Please navigate to the client folder (tiny-cakes-master > client) and run npm install and then npm start. 

### The Cupcake Customization Screen

1. Click on one base, one frosting, and one or more toppings to make a cupcake. 
Each cupcake is printed on the side menu below the price. 

2. The price breakdown and completed cupcake update automatically when the user selects different items. 

3. When the user completes a cupcake, they should click the "Add to Cart" button. 
This adds a single cupcake to the cart. The user can then add another cupcake to their cart. 
If the user does not include at least one base, one frosting, and one or more toppings when constructing their cupcake the user will recieve an error alert. 

3. The user can then choose a delivery date at least 24 hours into the future (today is excluded). 
If the user tries to place the order with the current date, a popup window will instruct them to choose a date at least 24 hours from now.   

4. The user should then click the "Place Order" button. 
This posts the order to localhost:4000/orders. 

5. To see the orders page, the user should click the "See Orders" button. 

### The Cupcake Order Management Screen

1. The user is displayed their orders in a table ordered by delivery
   time, soonest first, by default. 

2. The user is able to sort orders by delivery time, either ascending,
   or descending, by clicking the date column (click the "Date" header). 
   This toggles the menu back and forth. 

3. The user can filter orders by cupcake component by clicking the "Search Data" field. 
   The user can select which component they want to filter for (e.g. "Peanut Butter Base"). 
