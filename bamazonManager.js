let inquirer = require("inquirer");
let mysql = require("mysql");
let Table = require("cli-table2");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Contected as ID " + connection.threadID);
    mainLoop();
});

function mainLoop() {
    inquirer.prompt([
        {
            name: "action",
            message: "What would you like to do?",
            type: "list",
            choices: ["View Products for Sale", "View Low Stock Items", "Add to Inventory", "Add Item to Sell"]
        }
    ]).then(function (response) {
        switch (response.action) {
            case "View Products for Sale":
                return listItems();
            case "View Low Stock Items":
                return viewLowStock();
            case "Add to Inventory":
                return addInventory();
            case "Add Item to Sell":
                return addItem();
            default:
                console.log("Something went very wrong here...")
                connection.end();
                break;
        }
    })
}

function listItems() {
    itemsTable(function () {
        inquirer.prompt([
            {
                name: "continue",
                message: "Would you like to perform more maintenance?",
                type: "confirm"
            }
        ]).then(function (results) {
            if (results.continue) {
                mainLoop();
            }
            else {
                connection.end();
            }
        });
    });
}

function viewLowStock() {
    connection.query("SELECT * FROM products WHERE stock < 11", function (err, res) {
        if (err) throw err;
        let table = new Table({
            head: ["Product ID", "Product Name", "Department", "Price", "Quantity"],
        });
        res.forEach(item => {
            table.push(
                [item.itemid, item.productname, item.department, "$" + item.price, item.stock]
            )
        });
        console.log(table.toString());
        inquirer.prompt([
            {
                name: "continue",
                message: "Would you like to perform more maintenance?",
                type: "confirm"
            }
        ]).then(function (results) {
            if (results.continue) {
                mainLoop();
            }
            else {
                connection.end();
            }
        });
    });
}

function addInventory() {
    itemsTable(function () {
        inquirer.prompt([
            {
                name: "selection",
                message: "Which product would you like to add to?",
                type: "input"
            },
            {
                name: "quantity",
                message: "How many would you like to add?",
                type: "input"
            }
        ]).then(function (results) {
            connection.query("SELECT * FROM products WHERE itemid = ?", results.selection, function (err, product) {
                if (err) throw err;
                console.log("\nYou added %i to %s, new stock is %i", results.quantity, product[0].productname, (parseInt(product[0].stock) + parseInt(results.quantity)));
                connection.query("UPDATE products SET stock = ? WHERE itemid = ?", [(parseInt(product[0].stock) + parseInt(results.quantity)), results.selection], function (err) {
                    if (err) throw err;
                    console.log("Updated item.");
                    inquirer.prompt([
                        {
                            name: "continue",
                            message: "Would you like to do more maintenance?",
                            type: "confirm"
                        }
                    ]).then(function (answer) {
                        if (answer.continue) {
                            mainLoop();
                        }
                        else {
                            connection.end();
                        }
                    })
                });
            });
        });
    });
}

function addItem() {
    inquirer.prompt([
        {
            name: "item",
            message: "What item would you like to add?",
            type: "input"
        },
        {
            name: "department",
            message: "Which department is this going in?",
            type: "input"
        },
        {
            name: "price",
            message: "What is the price of this item?",
            type: "input"
        },
        {
            name: "stock",
            message: "How many are you adding?",
            type: "input"
        }
    ]).then(function (results) {
        connection.query("INSERT INTO products SET ?", 
        [{productname: results.item,
         department: results.department,
         price: results.price,
         stock: results.stock}]
        );
        console.log("Added product to list");
        inquirer.prompt([
            {
                name: "continue",
                message: "Would you like to perform more maintenance?",
                type: "confirm"
            }
        ]).then(function (results) {
            if (results.continue) {
                mainLoop();
            }
            else {
                connection.end();
            }
        });
    })
}

function itemsTable(callback) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        let table = new Table({
            head: ["Product ID", "Product Name", "Department", "Price", "Quantity"],
        });
        res.forEach(item => {
            table.push(
                [item.itemid, item.productname, item.department, "$" + item.price, item.stock]
            )
        });
        console.log(table.toString());
        callback();
    });
}