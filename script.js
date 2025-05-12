// Calculator state
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let resetScreen = false;
let calculationPerformed = false;

// DOM elements
const display = document.querySelector('.display');
const previousOperand = document.querySelector('.previous-operand');
const errorDisplay = document.querySelector('.error');
const numberButtons = document.querySelectorAll('.btn-number');
const operatorButtons = document.querySelectorAll('.btn-operator');
const equalsButton = document.querySelector('.btn-equals');
const clearButton = document.querySelector('.btn-clear');
const deleteButton = document.querySelector('.btn-delete');

// Event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => appendNumber(button.textContent));
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => setOperation(button.textContent));
});

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
document.addEventListener('keydown', handleKeyboardInput);

// Basic math operations
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero!");
    }
    return a / b;
}

// Main operation function
function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    
    switch (operator) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '×': return multiply(a, b);
        case '÷': return divide(a, b);
        default: return null;
    }
}

// Helper functions
function appendNumber(number) {
    if (display.value === '0' || resetScreen || calculationPerformed) {
        display.value = '';
        resetScreen = false;
        calculationPerformed = false;
    }
    
    if (number === '.' && display.value.includes('.')) return;
    
    display.value += number;
    updatePreviousOperand();
}

function setOperation(operator) {
    if (display.value === '') return;
    
    if (currentOperator !== null && !resetScreen) {
        evaluate();
    }
    
    firstOperand = display.value;
    currentOperator = operator;
    resetScreen = true;
    errorDisplay.textContent = '';
    updatePreviousOperand();
}

function evaluate() {
    if (currentOperator === null || resetScreen) return;
    if (display.value === '') return;
    
    secondOperand = display.value;
    
    try {
        let result = operate(currentOperator, firstOperand, secondOperand);
        result = roundResult(result);
        display.value = result;
        firstOperand = result;
        calculationPerformed = true;
        currentOperator = null;
        errorDisplay.textContent = '';
        updatePreviousOperand();
    } catch (error) {
        errorDisplay.textContent = error.message;
        clear();
    }
}

function roundResult(number) {
    return Math.round(number * 100000) / 100000;
}

function clear() {
    display.value = '0';
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    resetScreen = false;
    calculationPerformed = false;
    errorDisplay.textContent = '';
    previousOperand.textContent = '';
}

function deleteNumber() {
    if (calculationPerformed) {
        clear();
        return;
    }
    
    display.value = display.value.toString().slice(0, -1);
    if (display.value === '') {
        display.value = '0';
    }
    updatePreviousOperand();
}

function updatePreviousOperand() {
    if (currentOperator) {
        previousOperand.textContent = `${firstOperand || ''} ${currentOperator} ${!resetScreen ? display.value : ''}`;
    } else {
        previousOperand.textContent = '';
    }
}

function handleKeyboardInput(e) {
    // Number keys (0-9)
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
        e.preventDefault();
    }
    // Operator keys
    else if (['+', '-', '*', '/'].includes(e.key)) {
        const operatorMap = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        setOperation(operatorMap[e.key]);
        e.preventDefault();
    }
    // Enter key for equals
    else if (e.key === 'Enter') {
        evaluate();
        e.preventDefault();
    }
    // Backspace for delete
    else if (e.key === 'Backspace') {
        deleteNumber();
        e.preventDefault();
    }
    // Escape for clear
    else if (e.key === 'Escape') {
        clear();
        e.preventDefault();
    }
}

// Initial setup
clear();