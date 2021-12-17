// Element
const Balance = document.querySelector(".balance .value");
const Income_Total = document.querySelector(".income-total");
const Outcome_Total = document.querySelector(".outcome-total");
const Income = document.querySelector("#income");
const Expense = document.querySelector("#expense");
const All = document.querySelector("#all");
const List_Income = document.querySelector("#income .list");
const List_Expense = document.querySelector("#expense .list");
const List_All = document.querySelector("#all .list");

// Button
const Expense_Button = document.querySelector(".tab1");
const Income_Button = document.querySelector(".tab2");
const All_Button = document.querySelector(".tab3");

// Input
const Expense_Add = document.querySelector(".add-expense");
const Expense_Title = document.getElementById("expense-title-input");
const Expense_Amount = document.getElementById("expense-amount-input");

const Income_Add = document.querySelector(".add-income");
const Income_Title = document.getElementById("income-title-input");
const Income_Amount = document.getElementById("income-amount-input");

// Variables
let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

// Local storage
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// EVENT LISTENERS
Expense_Button.addEventListener("click", function(){
    show(Expense);
    hide( [Income, All] );
    active( Expense_Button );
    inactive( [Income_Button, All_Button] );
})
Income_Button.addEventListener("click", function(){
    show(Income);
    hide( [Expense, All] );
    active( Income_Button );
    inactive( [Expense_Button, All_Button] );
})
All_Button.addEventListener("click", function(){
    show(All);
    hide( [Income, Expense] );
    active( All_Button );
    inactive( [Income_Button, Expense_Button] );
})

// Erreur Message
Expense_Add.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!Expense_Title.value || !Expense_Amount.value ) 
    alert("Title and Rs must be filled up")
})

Expense_Add.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!Expense_Title.value || !Expense_Amount.value ) return;

    // SAVE THE ENTRY TO ENTRY_LIST
    let expense = {
        type : "expense",
        title : Expense_Title.value,
        amount : parseInt(Expense_Amount.value)
    }
    ENTRY_LIST.push(expense);

    updateUI();
    clearInput( [Expense_Title, Expense_Amount] )
})

Income_Add.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!Income_Title.value || !Income_Amount.value ) 
    alert("Error")
})

Income_Add.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!Income_Title.value || !Income_Amount.value ) 
    return;

    // SAVE THE ENTRY TO ENTRY_LIST
    let income = {
        type : "income",
        title : Income_Title.value,
        amount : parseInt(Income_Amount.value)
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput( [Income_Title, Income_Amount] )
})

List_Income.addEventListener("click", deleteOrEdit);
List_Expense.addEventListener("click", deleteOrEdit);
List_All.addEventListener("click", deleteOrEdit);

// HELPERS

function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if( targetBtn.id == DELETE ){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT ){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);

    updateUI();
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "income"){
        Income_Amount.value = ENTRY.amount;
        Income_Title.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        Expense_Amount.value = ENTRY.amount;
        Expense_Title.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI(){
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    // DETERMINE SIGN OF BALANCE
    let sign = (income >= outcome) ? "Rs" : "-Rs";

    // UPDATE UI
    Balance.innerHTML = `<small>${sign}</small>${balance}`;
    Outcome_Total.innerHTML = `<small>Rs</small>${outcome}`;
    Income_Total.innerHTML = `<small>Rs</small>${income}`;

    clearElement( [List_Expense, List_Income, List_All] );

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "expense" ){
            showEntry(List_Expense, entry.type, entry.title, entry.amount, index)
        }else if( entry.type == "income" ){
            showEntry(List_Income, entry.type, entry.title, entry.amount, index)
        }
        showEntry(List_All, entry.type, entry.title, entry.amount, index)
    });

    updateChart(income, outcome);

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: Rs${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if( entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
    return income - outcome;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}
function show(element){
    element.classList.remove("hide");
}

function hide( elements ){
    elements.forEach( element => {
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive( elements ){
    elements.forEach( element => {
        element.classList.remove("active");
    })
}