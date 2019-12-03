// on load, show the coffee orders
const url = "http://dc-coffeerun.herokuapp.com/api/coffeeorders/";
const emailURL = "http://dc-coffeerun.herokuapp.com/api/coffeeorders/emailaddress";
const container = document.getElementById('container');
const orderButton  = document.getElementById('orderButton');
const deleteButton = document.getElementById('deleteButton');
const emailTextBox = document.getElementById('emailTextBox');
const coffeeTextBox = document.getElementById('coffeeTextBox');

orderButton.addEventListener('click',() => {
    let request = new XMLHttpRequest();
    request.open('POST',url);
    request.setRequestHeader("Content-Type", "application/json");
    let body = { emailAddress: emailTextBox.value, coffee: coffeeTextBox.value};
    request.onload = function() {
        updateOrders();
    }
    request.send(JSON.stringify(body))
});

deleteButton.addEventListener('click',() => {
    let request = new XMLHttpRequest();
    request.open('DELETE',emailURL);
    request.setRequestHeader("Content-Type", "application/json");
    let body = { emailAddress: emailTextBox.value };
    request.onload = function() {
        updateOrders();
    }
    request.send(JSON.stringify(body))
});

function updateOrders() {
    request = new XMLHttpRequest();
    request.open('GET',url);
    request.onload = function() {
        let orders = JSON.parse(this.responseText);
        // debugging print...
        //console.log(orders);
        keys = Object.keys(orders);
        ordersHTML = '';
        for (let i=0; i<keys.length; i++) {
            ordersHTML += `<div>${orders[keys[i]].emailAddress}     ${orders[keys[i]].coffee}</div>`
        }
        container.innerHTML = ordersHTML;
    }
    request.send();
}

updateOrders();