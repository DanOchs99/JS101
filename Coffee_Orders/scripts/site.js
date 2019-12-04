// on load, show the coffee orders
const url = "http://dc-coffeerun.herokuapp.com/api/coffeeorders/";
const container = document.getElementById('container');
const orderButton  = document.getElementById('orderButton');
const searchButton = document.getElementById('searchButton');
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

searchButton.addEventListener('click',() => {
    let request = new XMLHttpRequest();
    let emailURL = url + emailTextBox.value;
    request.open('GET',emailURL);
    request.onload = function() {
        console.log(request.responseText);
        if (request.responseText == 'null') {
            coffeeTextBox.value = `${emailTextBox.value} was not found.`;
        }
        else {
            let order = JSON.parse(this.responseText);
            coffeeTextBox.value = order.coffee;
        }
        
        updateOrders();
    }
    request.send();
});

deleteButton.addEventListener('click',() => {
    let request = new XMLHttpRequest();
    let emailURL = url + emailTextBox.value;
    request.open('DELETE',emailURL);
    request.onload = function() {
        emailTextBox.value = '';
        coffeeTextBox.value = '';
        updateOrders();
    }
    request.send();
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
            ordersHTML += `<div class="cust"><div class="email">${orders[keys[i]].emailAddress}</div><div class="coffee">${orders[keys[i]].coffee}</div></div>`
        }
        container.innerHTML = ordersHTML;
    }
    request.send();
}

updateOrders();