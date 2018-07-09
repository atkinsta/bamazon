# Bamazon
## Homework 10, a CLI that simulates an online store.

This CLI which uses Inquirer, MySQL, and Node simulates an online store. Customers can see all items or search by department. They can then select an item to purchase and it will give them their total. 

Managers can easily manage the store. They are able to view all items currently being sold, check which items have fewer than 10 in stock, restock items, and add a new product completely. Below are some examples of this CLI working. 

### Example of a customer interacting with Bamazon:
*Click on Gif to start it from the beginning*

![Gif of Customer Using Bamazon](https://imgur.com/iDxF4yJ.gif)


### Example of the program updating quantities and avoiding overselling
*Click on Gif to start it from the beginning*

![Overselling and quantity demonstration](https://imgur.com/I1W62ef.gif)

### Example of a manager interacting with Bamazon.
*Click on Gif to start it from the beginning*

![Manager using Bamazon](https://imgur.com/1YL1cgR.gif)

Overview of technologies used in this project:
* Inquirer - Allows interaction with the CLI and prompts the user for various information at different stages.
* cli-tables2 - Formats and displays the mysql results in a visually pleasing and ordered way.
* mysql - Retrieves, updates, and queries the database for relevant products. 
* node - allows us to require dependancies and run javascript from the command line. 
