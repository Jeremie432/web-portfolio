
// Select the chart
const chart = document.querySelector(".chart");

// Create canvas
const canvas = document.createElement("canvas");
canvas.width = 200;
canvas.height = 200;

// Append the canvas
chart.appendChild(canvas);

// Drawing on canvas
const ctx = canvas.getContext("2d");

// Finess of the circle 
ctx.lineWidth = 30;

// Radius of the circle
const R = 60;

function Piechart(colorise, ratio, anticlockwise){

    ctx.strokeStyle = colorise;
    ctx.beginPath();
    ctx.arc( canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise);
    ctx.stroke();
}

function updateChart( income, outcome){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ratio = income / (income+outcome);

    Piechart("#95B524", - ratio, true);
    Piechart("#F0624D", 1 - ratio, false);
}



