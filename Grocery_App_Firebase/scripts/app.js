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

const userName = document.getElementById('userName');
const password = document.getElementById('password');

let appUser = {};
let viewListRef = {};

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
            userLists.push(snapshot_val[key].name);
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
    firebase.auth().createUserWithEmailAndPassword(userName.value, password.value).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        userDisplay.innerHTML = `Sign Up failed - ${error.message}`;
        //console.log(error.code);
        //console.log(error.message);
      });
});

signInButton.addEventListener('click',() => {
    // user hit the Sign In button
    firebase.auth().signInWithEmailAndPassword(userName.value, password.value).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        userDisplay.innerHTML = `Sign In failed - ${error.message}`;
        //console.log(error.code);
        //console.log(error.message);
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
        userName.style.display = 'none';
        userName.value = '';
        password.style.display = 'none';
        password.value = '';
        //console.log(`User ${user.email} is signed in`);
        createListButton.style.display = 'inline-block';
        viewListButton.style.display = 'inline-block';
        deleteListButton.style.display = 'inline-block';
        listInputBox.style.display = 'inline-block';
        container.style.display = 'block';
        container.innerHTML = '';
        listInputBox.value = '';
        itemInputBox.value = '';

        let userListsRef = firebase.database().ref(appUser.uid);
        userListsRef.on('value', (snapshot) => {
            updateListData(snapshot.val());
        });
    } else {
        // No user is signed in.
        userDisplay.innerHTML = 'Please sign in.'
        appUser = {};
        userName.style.display = 'block';
        password.style.display = 'block';
        //console.log('No user is signed in')
        createListButton.style.display = 'none';
        viewListButton.style.display = 'none';
        deleteListButton.style.display = 'none';
        listInputBox.style.display = 'none';
        container.style.display = 'none';
        addItemButton.style.display = 'none';
        deleteItemButton.style.display = 'none';
        itemInputBox.style.display = 'none';
    }
});

createListButton.addEventListener('click',() => {
    // make a new list
    listName = listInputBox.value;
    let root = firebase.database().ref();
    listObj = {name: listName};
    root.child(appUser.uid).push().set(listObj);
});

viewListButton.addEventListener('click',() => {
    // view list in UI
    let userListsRef = firebase.database().ref(appUser.uid);
    let listKey = '';
    userListsRef.once('value', (snapshot) => {
        snapshot_val = snapshot.val();
        for (let key in snapshot_val) {
            if (snapshot_val[key].name == listInputBox.value) {
                listKey = key;
            }
        }
        if (listKey != '') {
            viewListRef = firebase.database().ref(`${appUser.uid}/${listKey}`);
            viewListRef.on('value', (snapshot) => {
                // update the list view when the list changes
                let snapshot_val = snapshot.val();
                if (snapshot_val != null) {
                    let listItems = [];
                    for (let key in snapshot_val) {
                        if (key != 'name') {
                            listItems.push(snapshot_val[key]);
                        }
                    }
                    if (listItems.length > 0) {
                        let displayItemsHTML = listItems.map(item => `<div class='listItem'>${item}</div>`);
                        container.innerHTML = `<div class='listTitle'>${snapshot_val.name}</div>${displayItemsHTML.join(' ')}`;
                        listItemsUnique = [];
                        let found = false;
                        for (let i=0; i<listItems.length; i++) {
                            found = false;
                            for (let j=0; j<listItemsUnique.length; j++) {
                                if (listItems[i]==listItemsUnique[j]) {
                                    found = true;
                                }
                            }
                            if (!found) {
                                listItemsUnique.push(listItems[i]);
                            }
                        }
                        let listItemsHTML = listItemsUnique.map(item => `<option value="${item}"></option>`);
                        items.innerHTML = listItemsHTML.join(' ');
                    }
                    else {
                        container.innerHTML = `<div class='listTitle'>${snapshot_val.name}</div>`;
                        items.innerHTML = '';
                    }
                    addItemButton.style.display = 'inline-block';
                    deleteItemButton.style.display = 'inline-block';
                    itemInputBox.style.display = 'inline-block';
                }
            });
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
    viewListRef.remove();
    listInputBox.value = '';
    container.innerHTML = '';
    items.innerHTML = '';
    addItemButton.style.display = 'none';
    deleteItemButton.style.display = 'none';
    itemInputBox.value = '';
    itemInputBox.style.display = 'none';
});

addItemButton.addEventListener('click',() => {
    // add an item to list
    viewListRef.push(itemInputBox.value);
});

deleteItemButton.addEventListener('click',() => {
    // delete an item from list
    let delkey = '';    
    viewListRef.once('value', (snapshot) => {
        snapshot_val = snapshot.val();
        for (let key in snapshot_val) {
            if (snapshot_val[key] == itemInputBox.value) {
                delkey = key;
            }
        }
    });
    if (delkey != '') {
        viewListRef.child(delkey).remove();
        itemInputBox.value = '';
    }
});


// start with user logged off on page refresh
simulateClickLogoff();
