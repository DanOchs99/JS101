let displayStarters = true;
let displayEntrees = true;
let displayDesserts = true;
let startersEl = document.getElementById("starters");
let entreesEl = document.getElementById("entrees");
let dessertsEl = document.getElementById("desserts");
let startersHeading = `<div id="stHeading" >Starters</div>
                       <hr id="stRule" >`;
let entreesHeading = `<div id="enHeading" >Entrees</div>
                      <hr id="enRule" >`;
let dessertsHeading = `<div id="deHeading" >Desserts</div>
                       <hr id="deRule" >`;
let starters = dishes.filter((dish) => dish.course=='Starters' );
let entrees = dishes.filter((dish) => dish.course=='Entrees' );
let desserts = dishes.filter((dish) => dish.course=='Desserts' );

let startersItems = starters.map((dish)=>createItemHTML(dish));
let startersHTML = startersHeading + startersItems.join(' ');
startersEl.innerHTML = startersHTML;

let entreesItems = entrees.map((dish)=>createItemHTML(dish));
let entreesHTML = entreesHeading + entreesItems.join(' ');
entreesEl.innerHTML = entreesHTML;

let dessertsItems = desserts.map((dish)=>createItemHTML(dish));
let dessertsHTML = dessertsHeading + dessertsItems.join(' ');
dessertsEl.innerHTML = dessertsHTML;

function createItemHTML(dish) {
    return `<div class="dish">
              <img class="dishpic" src="${dish.imageURL}" />
              <div class="dishinfo" >
                <div>${dish.title}</div>
                <div>${dish.description}</div>
              </div>
              <div class="dishprice" >
                ${dish.price}
              </div>
            </div>`
}

function startersClicked(button) {
    displayStarters = !displayStarters;

    if (displayStarters) {
        button.style.backgroundColor = "steelblue";
        startersEl.style.display = "flex";
    }
    else {
        button.style.backgroundColor = "gray";
        startersEl.style.display = "none";
    }
}

function entreesClicked(button) {
    displayEntrees = !displayEntrees;

    if (displayEntrees) {
        button.style.backgroundColor = "steelblue";
        entreesEl.style.display = "flex";
    }
    else {
        button.style.backgroundColor = "gray";
        entreesEl.style.display = "none";
    }
}

function dessertsClicked(button) {
    displayDesserts = !displayDesserts;

    if (displayDesserts) {
        button.style.backgroundColor = "steelblue";
        dessertsEl.style.display = "flex";
    }
    else {
        button.style.backgroundColor = "gray";
        dessertsEl.style.display = "none";
    }
}

