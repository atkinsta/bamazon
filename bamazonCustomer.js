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
            choices: ["Show all items", "Search by Department", "Search by Product Name"]
        }
    ]).then(function (response) {
        switch (response.action) {
            case "Show all items":
                return listItems();
            case "Search by Department":
                return searchDepartment();
            case "Search by ProductName":
                return searchProduct();
        }
    })
}

function listItems() {
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
        inquirer.prompt([
            {
                name: "selection",
                message: "Which product would you like to buy?",
                type: "input"
            },
            {
                name: "quantity",
                message: "How many would you like to buy?",
                type: "input"
            }
        ]).then(function (results) {
            connection.query("SELECT * FROM products WHERE itemid = ?", results.selection, function (err, product) {
                if (err) throw err;
                if (product[0].stock > results.quantity) {
                    console.log("\nYou purchased %i %s, new stock is %i", results.quantity, product[0].productname, (product[0].stock - results.quantity));
                    console.log("Your total cost is: $%i\n", results.quantity * product[0].price);
                    connection.query("UPDATE products SET stock = ? WHERE itemid = ?", [(product[0].stock - results.quantity), results.selection], function (err) {
                        console.log("Updated item.");
                        inquirer.prompt([
                            {
                                name: "continue",
                                message: "Would you like to purchase another item?",
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
                }
                else {
                    console.log("Insufficient Quantity!");
                    mainLoop();
                }
            });
        });
    });
}

function searchDepartment() {
    inquirer.prompt([
        {
            name: "department",
            message: "Which department would you like to search from?",
            type: "list",
            choices: ["Home", "Food and Produce", "Video Games", "Outdoor", "Clothing"]
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE department = ?", answer.department, function (err, res) {
            let table = new Table({
                head: ["Product ID", "Product Name", "Department", "Price", "Quantity"],
            })
            res.forEach(item => {
                table.push(
                    [item.itemid, item.productname, item.department, "$" + item.price, item.stock]
                )
            });
            
            console.log(table.toString());
            inquirer.prompt([
                {
                    name: "selection",
                    message: "Which product would you like to buy?",
                    type: "input"
                },
                {
                    name: "quantity",
                    message: "How many would you like to buy?",
                    type: "input"
                }
            ]).then(function (results) {
                connection.query("SELECT * FROM products WHERE itemid = ?", results.selection, function (err, product) {
                    if (err) throw err;
                    if (product[0].stock > results.quantity) {
                        console.log("\nYou purchased %i %s, new stock is %i", results.quantity, product[0].productname, (product[0].stock - results.quantity));
                        console.log("Your total cost is: $%i\n", results.quantity * product[0].price);
                        connection.query("UPDATE products SET stock = ? WHERE itemid = ?", [(product[0].stock - results.quantity), results.selection], function (err) {
                            console.log("Updated item.");
                            inquirer.prompt([
                                {
                                    name: "continue",
                                    message: "Would you like to purchase another item?",
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
                    }
                    else {
                        console.log("Insufficient Quantity!");
                        mainLoop();
                    }
                });
            });
        });
    });
}