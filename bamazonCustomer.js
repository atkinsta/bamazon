let inquirer = require("inquirer");
let mysql = require("mysql");
let Table = require("cli-table2");

let table = new Table({
    head: ["Product ID", "Product Name", "Department", "Price", "Quantity"],
})

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
                    connection.query("UPDATE products WHERE")

                }
            });
        });
    });
}