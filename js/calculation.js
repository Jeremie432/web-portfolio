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
const Expense_Button = document.querySelector(".nav1");
const Income_Button = document.querySelector(".nav2");
const All_Button = document.querySelector(".nav3");

// Input Expense
const Expense_Add = document.querySelector(".add-expense");
const Expense_Title = document.getElementById("expense-title-input");
const Expense_Amount = document.getElementById("expense-amount-input");

// Input Income
const Income_Add = document.querySelector(".add-income");
const Income_Title = document.getElementById("income-title-input");
const Income_Amount = document.getElementById("income-amount-input");

// Variables
let LIST_ENTRY;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

// Local storage
LIST_ENTRY = JSON.parse(localStorage.getItem("list_entry")) || [];
updateUI();

// Click event 
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

// Error message condition when empty
Expense_Add.addEventListener("click", function(){
    if(!Expense_Title.value || !Expense_Amount.value ) 
    alert("Title and Rs must not be empty")
})

Expense_Add.addEventListener("click", function(){
    if(!Expense_Title.value || !Expense_Amount.value )
    return;

    // Save the value for the entry
    let expense = {
        type : "expense",
        title : Expense_Title.value,
        amount : parseInt(Expense_Amount.value)
    }
    LIST_ENTRY.push(expense);

    updateUI();
    Input_clear( [Expense_Title, Expense_Amount] )
})

// Error message condition when empty
Income_Add.addEventListener("click", function(){
    if(!Income_Title.value || !Income_Amount.value ) 
    alert("Title and Rs must not be empty")
})

Income_Add.addEventListener("click", function(){
    if(!Income_Title.value || !Income_Amount.value ) 
    return;

    // This is to save the entry
    let income = {
        type : "income",
        title : Income_Title.value,
        amount : parseInt(Income_Amount.value)
    }
    LIST_ENTRY.push(income);

    updateUI();
    Input_clear( [Income_Title, Income_Amount] )
})

List_Income.addEventListener("click", deleteOrEdit);
List_Expense.addEventListener("click", deleteOrEdit);
List_All.addEventListener("click", deleteOrEdit);

// delete or edit
function deleteOrEdit(event){
    const Button_target = event.target;

    const entry = Button_target.parentNode;

    if( Button_target.id == DELETE ){
        deleteEntry(entry);
    }else if(Button_target.id == EDIT ){
        Entry_edit(entry);
    }
}

function deleteEntry(entry){
    LIST_ENTRY.splice( entry.id, 1);

    updateUI();
}

// Edit any entry
function Entry_edit(entry){
    console.log(entry)
    let ENTRY = LIST_ENTRY[entry.id];

    if(ENTRY.type == "income"){
        Income_Amount.value = ENTRY.amount;
        Income_Title.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        Expense_Amount.value = ENTRY.amount;
        Expense_Title.value = ENTRY.title;
    }

    deleteEntry(entry);
}

// Update
function updateUI(){
    income = calculateTotal("income", LIST_ENTRY);
    outcome = calculateTotal("expense", LIST_ENTRY);
    balance = Math.abs(calculateBalance(income, outcome));

    // balance sign if it is positive or negative
    let sign = (income >= outcome) ? "Rs" : "-Rs";

    // To update values
    Balance.innerHTML = `<small>${sign}</small>${balance}`;
    Outcome_Total.innerHTML = `<small>Rs</small>${outcome}`;
    Income_Total.innerHTML = `<small>Rs</small>${income}`;

    clearElement( [List_Expense, List_Income, List_All] );

    LIST_ENTRY.forEach( (entry, index) => {
        if( entry.type == "expense" ){
            showEntry(List_Expense, entry.type, entry.title, entry.amount, index)
        }else if( entry.type == "income" ){
            showEntry(List_Income, entry.type, entry.title, entry.amount, index)
        }
        showEntry(List_All, entry.type, entry.title, entry.amount, index)
    });

    updateChart(income, outcome);

    localStorage.setItem("list_entry", JSON.stringify(LIST_ENTRY));
}

// Display all entries
function showEntry(list, type, title, amount, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: Rs${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

// To clear all data
function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

// Calculate the total value for balance
function calculateTotal(type, list){
    let Totalbalance = 0;

    list.forEach( entry => {
        if( entry.type == type ){
            Totalbalance += entry.amount;
        }
    })

    return Totalbalance;
}

// Balance remaining 
function calculateBalance(income, outcome){
    return income - outcome;
}

// Clear input
function Input_clear(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}

// function for navigation bar
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