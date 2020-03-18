var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "7348502509Mf!",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  
  console.log("connection "+ connection.threadId);
  setTimeout(userPromptOne, 1000);
  display();
  
});

// function which displays the table from mySQL
function display() {
  //this performs the behavior of the lightning bolt
  connection.query("select * from products", function(err, results){
    if(err){
      console.log(err);
    }
    console.table(results);
  })
}
function userPromptOne() {
      
    inquirer.prompt([
      {
        type: "input",
        message: "What is the ID of the item you'd like to buy?",
        name: "itemId"
      },
      {
        type: "number",
        message: "How many units to buy?",
        name: "units"
      }
    ]).then(function(userInput){
      console.log(userInput);
      connection.query("select stock_quantity from products where item_id = " + userInput.itemId,function(err, results){
        //user regular parentheses to set the conditions
        console.log(results[0].stock_quantity);
        if (userInput.units > results[0].stock_quantity) {
          console.log("Insufficient quantity!");
        }
        else {
          console.log("You bought " + userInput.units);
          var updateQuantity = results[0].stock_quantity - userInput.units
          connection.query("UPDATE products set ? WHERE ?", 
          [{//FIRST QUESTION MARK = SET
            stock_quantity: updateQuantity
          },
        { //SECOND QUESTION MARK = WHERE
          item_id: userInput.itemId
          }], function(err){
            if (err) throw err
            console.log("The new quantity is: " + updateQuantity);
          }) 
        
        }
        
        var updateQuantity = results[0].stock_quantity - userInput.units
        connection.query("UPDATE products SET ? WHERE ?", 
        [{//FIRST QUESTION MARK = SET
          stock_quantity: updateQuantity
        },
      { //SECOND QUESTION MARK = WHERE
        item_id: userInput.itemId
        }]) 
      
      }
      );
    })
  }