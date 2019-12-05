const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const logoffButton = document.getElementById('logoffButton');
const userDisplay = document.getElementById('userDisplay');
const createListButton = document.getElementById('createListButton');
const viewListButton = document.getElementById('viewListButton');
const deleteListButton = document.getElementById('deleteListButton');
const listInputBox = document.getElementById('listInputBox');
const lists = document.getElementById('lists');
const container = document.getElementById('container');
const addItemButton = document.getElementById('addItemButton');
const deleteItemButton = document.getElementById('deleteItemButton');
const itemInputBox = document.getElementById('itemInputBox');
const items = document.getElementById('items');

let appUser = {};

function simulateClickLogoff() {
    let event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
         
    var cancelled = !logoffButton.dispatchEvent(event);
    if (cancelled) {
        // A handler called preventDefault
    }
}

function updateListData(snapshot_val) {
    if (snapshot_val != null) {
        let userLists = [];
        for (let key in snapshot_val) {
            userLists.push(key);
        }
        userListsHTML = userLists.map(item => `<option value="${item}"></option>`)
        lists.innerHTML = userListsHTML.join(' ');
    }
    else {
        lists.innerHTML = '';
    }
}

signUpButton.addEventListener('click',() => {
    // user hit the Sign Up button
    let email = 'user2@nowhere.org';
    let password = 'BlahBlah';

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.code);
        console.log(error.message);
      });
});

signInButton.addEventListener('click',() => {
    // user hit the Sign In button
    let email = 'nobody@nowhere.org';
    let password = 'BlahBlah';

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.code);
        console.log(error.message);
      });
});

logoffButton.addEventListener('click',() => {
    // user hit the Logoff button
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        userDisplay.innerHTML = user.email;
        appUser = user;
        //console.log(`User ${user.email} is signed in`);
        createListButton.style.display = 'inline-block';
        viewListButton.style.display = 'inline-block';
        deleteListButton.style.display = 'inline-block';
        listInputBox.style.display = 'inline-block';

        let userListsRef = firebase.database().ref(user.uid);
        userListsRef.on('value', (snapshot) => {
            updateListData(snapshot.val());
        });
    } else {
        // No user is signed in.
        userDisplay.innerHTML = 'Please sign in.'
        appUser = {};
        //console.log('No user is signed in')
        createListButton.style.display = 'none';
        viewListButton.style.display = 'none';
        deleteListButton.style.display = 'none';
        listInputBox.style.display = 'none';
    }
});

createListButton.addEventListener('click',() => {
    // make a new list - NOTE this will overwrite with empty if this list exists!
    listName = listInputBox.value;
    let root = firebase.database().ref();
    root.child(appUser.uid).child(listName).set({0: 'empty'});
});

viewListButton.addEventListener('click',() => {
    // view list in UI
    let viewListRef = firebase.database().ref(`${appUser.uid}/${listInputBox.value}`);
    viewListRef.on('value', (snapshot) => {
        // update the list view
        container.style.display = 'block';
        let snapshot_val = snapshot.val();
        if (snapshot_val != null) {
            let listItems = [];
            for (let key in snapshot_val) {
                listItems.push(snapshot_val[key]);
                }
            if (listItems[0] != 'empty') {
                let displayItemsHTML = listItems.map(item => `<div class='listItem'>${item}</div>`);
                container.innerHTML = `<div class='listTitle'>${listInputBox.value}</div>${displayItemsHTML.join(' ')}`;
                let listItemsHTML = listItems.map(item => `<option value="${item}"></option>`);
                items.innerHTML = listItemsHTML.join(' ');
            }
            else {
                container.innerHTML = `<div class='listTitle'>${listInputBox.value}</div>`;
                items.innerHTML = '';
            }
            addItemButton.style.display = 'inline-block';
            deleteItemButton.style.display = 'inline-block';
            itemInputBox.style.display = 'inline-block';
        }
        else {
            container.innerHTML = `<div>List ${listInputBox.value} not found.</div>`;
            items.innerHTML = '';
            addItemButton.style.display = 'none';
            deleteItemButton.style.display = 'none';
            itemInputBox.style.display = 'none';
        }
    });        
});

deleteListButton.addEventListener('click',() => {
    // delete list from database
});    

addItemButton.addEventListener('click',() => {
    // add an item to list
    let maxkey = -1;
    let nextkey = -1;
    let viewListRef = firebase.database().ref(`${appUser.uid}/${listInputBox.value}`);
    viewListRef.once('value', (snapshot) => {
        snapshot_val = snapshot.val();
        for (let key in snapshot_val) {
            if (key > maxkey) {
                maxkey = key;
            }
        }
        if ((maxkey == 0) && (snapshot_val[0] == 'empty')) {
            nextkey = 0;
        }
        else {
            nextkey = maxkey + 1;
        }
    });
    itemObj = {};
    itemObj[nextkey] = itemListBox.value;
    viewListRef.set(itemObj);
});

deleteItemButton.addEventListener('click',() => {
    // delete an item from list

});


// start with user logged off on page refresh
simulateClickLogoff();
