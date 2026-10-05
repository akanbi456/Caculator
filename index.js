
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

const buttons = document.querySelectorAll(".buttons button");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");
const themeBtn = document.getElementById("themeBtn");

let current = "";
let previous = "";
let operator = null;
let shouldReset = false;


/* =========================
   DISPLAY
========================= */

function updateDisplay() {

    currentDisplay.textContent =
        current === "" ? "0" : current;

    previousDisplay.textContent =
        previous && operator
            ? `${previous} ${getOperatorSymbol(operator)}`
            : "";
}


/* =========================
   OPERATOR SYMBOL
========================= */

function getOperatorSymbol(op) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[op] || op;
}




function inputNumber(number) {

    if (shouldReset) {
        current = "";
        shouldReset = false;
    }

    if (number === "." && current.includes(".")) {
        return;
    }

    if (current === "0" && number !== ".") {
        current = number;
    } else {
        current += number;
    }

    updateDisplay();
}



function chooseOperator(op) {

    if (current === "" && previous === "") {
        return;
    }

    if (current === "" && previous !== "") {
        operator = op;
        updateDisplay();
        return;
    }

    if (previous !== "" && operator) {
        calculate();
    }

    previous = current;
    operator = op;
    current = "";

    updateDisplay();
}



function calculate() {

    if (!previous || !operator || !current) {
        return;
    }

    const firstNumber = parseFloat(previous);
    const secondNumber = parseFloat(current);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {
                current = "Error";
                previous = "";
                operator = null;

                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;
    }

    result = Number(result.toFixed(10));

    addHistory(
        `${previous} ${getOperatorSymbol(operator)} ${current}`,
        result
    );

    current = String(result);

    previous = "";
    operator = null;

    shouldReset = true;

    updateDisplay();
}




function percentage() {

    if (!current) return;

    current = String(
        parseFloat(current) / 100
    );

    updateDisplay();
}

function clearCalculator() {

    current = "";
    previous = "";
    operator = null;
    shouldReset = false;

    updateDisplay();
}




function deleteNumber() {

    if (shouldReset) {
        current = "";
        shouldReset = false;
    }

    current = current.slice(0, -1);

    updateDisplay();
}



function addHistory(expression, result) {

    const empty = historyList.querySelector(".empty");

    if (empty) {
        empty.remove();
    }

    const item = document.createElement("div");

    item.className = "history-item";

    item.innerHTML = `
        <span class="history-expression">
            ${expression}
        </span>

        <span class="history-result">
            ${result}
        </span>
    `;

    historyList.prepend(item);
}



buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {

            if (!isNaN(value) || value === ".") {
                inputNumber(value);
            }

            else if (["+", "-", "*", "/"].includes(value)) {
                chooseOperator(value);
            }

            else if (value === "%") {
                percentage();
            }
        }

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteNumber();
        }

        if (action === "calculate") {
            calculate();
        }

    });

});




document.addEventListener("keydown", event => {

    const key = event.key;

    if (!isNaN(key) || key === ".") {
        inputNumber(key);
    }

    else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    else if (key === "Backspace") {
        deleteNumber();
    }

    else if (key === "Escape") {
        clearCalculator();
    }

    else if (key === "%") {
        percentage();
    }

});




clearHistoryBtn.addEventListener("click", () => {

    historyList.innerHTML =
        `<p class="empty">No calculations yet</p>`;

});




themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeBtn.textContent = "🌙";
    } else {
        themeBtn.textContent = "☀";
    }

});

