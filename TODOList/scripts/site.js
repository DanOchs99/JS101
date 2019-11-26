function Task(name) {
    // Task class definition for TODO list items
    this.name = name;
    this.completed = false;
}

function writeJSON() {
    let obj = {};
    obj.pending = [];
    for (let i=0; i<pending_tasks.length;i++) {
        let str = JSON.stringify(pending_tasks[i]);
        obj.pending.push(str);
    }
    obj.completed = [];
    for (let i=0; i<completed_tasks.length;i++) {
        let str = JSON.stringify(completed_tasks[i]);
        obj.completed.push(str);
    }
    let outJSON = JSON.stringify(obj);
    sessionStorage.setItem("todoJSON", outJSON);
}

function readJSON() {
    let inJSON = sessionStorage.getItem("todoJSON");
    if (inJSON != null) {
        // rebuild arrays from stored list
        let obj = JSON.parse(inJSON);
        for (x in obj.pending) {
            let t_obj = JSON.parse(obj.pending[x]);
            task = new Task(t_obj.name);
            task.completed = t_obj.completed;
            pending_tasks.push(task);
        }
        for (x in obj.completed) {
            let t_obj = JSON.parse(obj.completed[x]);
            task = new Task(t_obj.name);
            task.completed = t_obj.completed;
            completed_tasks.push(task);
        }

        // rebuild the HTML lists
        for (let i=0;i<pending_tasks.length;i++) {
            el = `<div class="taskItem" draggable="true" ondragstart="drag(event);" ondragover="allowDrop(event);" ondrop="drop(event);" >
              <input type="checkbox" onClick="onComplete(this);" />
              <label>${pending_tasks[i].name}</label>
              <button onClick="onRemove(this);">Remove</button>
              </div>`
            let ptasksList = document.getElementById("pendingTasksList");
            ptasksList.insertAdjacentHTML('beforeend',el);
        }
        for (let i=0;i<completed_tasks.length;i++) {
            el = `<div class="taskItem" draggable="true" ondragstart="drag(event);" ondragover="allowDrop(event);" ondrop="drop(event);" >
              <input type="checkbox" onClick="onComplete(this);" checked />
              <label>${completed_tasks[i].name}</label>
              <button onClick="onRemove(this);">Remove</button>
              </div>`
            let ptasksList = document.getElementById("completedTasksList");
            ptasksList.insertAdjacentHTML('beforeend',el);
        }
        // display no items if either list is empty...
        let emptyPending = document.getElementById("pendingEmpty");
        if (pending_tasks.length==0) {
            emptyPending.style.display = "block";
        }
        else {
            emptyPending.style.display = "none";
        }
        let emptyCompleted = document.getElementById("completedEmpty");
        if (completed_tasks.length==0) {
            emptyCompleted.style.display = "block";
        }
        else
        {
            emptyCompleted.style.display = "none";
        }
    }
}

function onAdd() {
    // onAdd adds a new task to the Pending tasks list

    // get task trying to add
    let taskName = document.getElementById("taskName");

    // if no task name provided then do nothing
    if (taskName.value.trim().length > 0) {
        // create a new task item & add to array
        let task = new Task(taskName.value);
        pending_tasks.push(task);

        // create HTML item for this task
        el = `<div class="taskItem" draggable="true" ondragstart="drag(event);" ondragover="allowDrop(event);" ondrop="drop(event);" >
              <input type="checkbox" onClick="onComplete(this);" />
              <label>${taskName.value}</label>
              <button onClick="onRemove(this);">Remove</button>
              </div>`
        ptasksList = document.getElementById("pendingTasksList")
        ptasksList.insertAdjacentHTML('beforeend',el);
        
        // ensure the 'No pending tasks.' box is off
        let emptyPending = document.getElementById("pendingEmpty");
        emptyPending.style.display = "none";
    }
    // clear the input text box
    taskName.value = '';

    writeJSON();
}

function onRemove(button) {
    // get the parent and the task to be removed
    let parent_el = button.parentElement.parentElement;
    let remove_el = button.parentElement;

    // find the element index
    let index = -1;
    let c = parent_el.children;
    for (let i=0; i<c.length; i++) {
        if (c[i].isSameNode(remove_el)) {
            index = i;
        }
    }
    // remove from the array
    if (parent_el.id=='pendingTasksList') {
        // remove task from the pending items list
        pending_tasks.splice(index,1);
    }
    else
    {
        // remove task from the completed items list
        completed_tasks.splice(index,1);
    }

    // remove from the HTML
    parent_el.removeChild(remove_el);

    // display no items if either list is empty
    if (pending_tasks.length==0) {
        let emptyPending = document.getElementById("pendingEmpty");
        emptyPending.style.display = "block";
    }
    if (completed_tasks.length==0) {
        let emptyCompleted = document.getElementById("completedEmpty");
        emptyCompleted.style.display = "block";
    }

    writeJSON();
}

function onComplete(checkbox) {
    // get the parent and the task to be (un)completed
    let parent_el = checkbox.parentElement.parentElement;
    let update_el = checkbox.parentElement;
    
    // find the element index
    let index = -1;
    let c = parent_el.children;
    for (let i=0; i<c.length; i++) {
        if (c[i].isSameNode(update_el)) {
            index = i;
        }
    }
    
    if (checkbox.checked == true) {
        // we are completing a task
        let task = pending_tasks[index];
        pending_tasks.splice(index,1);
        task.completed = true;
        completed_tasks.push(task);
        let newList = document.getElementById("completedTasksList");
        newList.appendChild(update_el); 
    }
    else
    {
        // we are un-completing a task
        let task = completed_tasks[index];
        completed_tasks.splice(index,1);
        task.completed = false;
        pending_tasks.push(task);
        let newList = document.getElementById("pendingTasksList");
        newList.appendChild(update_el); 
    }

    // display no items if either list is empty...
    let emptyPending = document.getElementById("pendingEmpty");
    if (pending_tasks.length==0) {
        emptyPending.style.display = "block";
    }
    else {
        emptyPending.style.display = "none";
    }
    let emptyCompleted = document.getElementById("completedEmpty");
    if (completed_tasks.length==0) {
        emptyCompleted.style.display = "block";
    }
    else
    {
        emptyCompleted.style.display = "none";
    }

    writeJSON();
}

// drag & drop stuff
function drag(ev) {
    console.log('Start drag:');
    console.log(ev.target.innerHTML);

    //ev.dataTransfer.setData("task", ev.target);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    console.log('Attempt drop:');
    console.log(ev.target.innerHTML);

    //let el = ev.dataTransfer.getData("task");
    // do the swap here...
}

// create empty task lists to start
let pending_tasks = [];
let completed_tasks = [];

// add event listener to the Add Task button
let taskAddBtn = document.getElementById("taskAddButton");
taskAddBtn.addEventListener('click',onAdd);

// see if saved todo list exists
readJSON();

