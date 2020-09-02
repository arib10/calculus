"use strict";
const withRespect = document.querySelector('.withRespect');
const equation = document.querySelector('.equation');
const answerBtn = document.querySelector('.answerBtn');
const resultPar = document.querySelector("#resultPar");
const errPar = document.querySelector(".err");
const checkBtn = document.querySelector(".checkBtn");
errPar.style.display = "block";
resultPar.style.display = "none";
document.getElementById("currentYear").innerHTML = ` - ${new Date().getFullYear()}.`;

const differentiate = (equation, respectTo) => {
    if (equation.indexOf(respectTo) > -1) {
        const indexOfRespect = equation.indexOf(respectTo) + 1;
        const equationLength = equation.toString().length;
        let coEfficient = equation.slice(0, indexOfRespect - 1);
        let equationPower = equation.slice(indexOfRespect, equationLength);
        let result = `${coEfficient * equationPower}${respectTo}<sup>${equationPower - 1}</sup>`;

        if (equationPower.toString().trim().length < 1) {
            equationPower = 1;
        }
        if(isNaN(Number(coEfficient))) {
            const letterArr = [];
            const numArr = [];
            for (const alpha of coEfficient.toString()) {
                if (isNaN(parseInt(alpha))) {
                    letterArr.push(alpha);
                }
                if (!isNaN(parseInt(alpha))) {
                    numArr.push(alpha);
                }
            }
            if (coEfficient === "" || coEfficient === null) {
                coEfficient = 1;
            } 
            if (coEfficient.toString().length >= 1) {
                coEfficient = parseInt(numArr.join(""));
                result = `${coEfficient * equationPower}${letterArr.join("")}${respectTo}<sup>${equationPower - 1}</sup>`;
            }

        }
        
        if(parseInt(equationPower) === 1) {
            result = `${coEfficient * equationPower}`;
        }
        if(parseInt(equationPower) === 2) {
            result = `${coEfficient * equationPower}${respectTo}`;
        }
        if(parseInt(result) > 0) {
            result = " +" + result;
        }
        return result;
    } else {
        return 0;
    }
}

equation.onkeyup = e => {
    e.target.value = e.target.value.toLowerCase();
    const value = e.target.value;
    if(value.includes("+")) {
        e.target.value = e.target.value.replace(" + ", " +");
    }
    if(value.includes("-")) {
        e.target.value = e.target.value.replace(" - ", " -");
    }
}

withRespect.onkeyup = e => {
    e.target.value = e.target.value.toLowerCase();
}

const removeZero = (text) => {
    if (text.toString().includes(" 0")) {
        return text.replace(/ 0/g, "");    
    } else if (text.toString().includes(" 0 ")) {
        return text.replace(/ 0 /g, "");    
    } else {
        return text;
    }
}
const removeFirstPlus = txt => {
    if(txt.startsWith("+")) {
        return txt.slice(1)
    } else if(txt.startsWith(" +")) {
        return txt.slice(2);
    } else if(txt.startsWith(" + ")) {
        return txt.slice(3);
    }
    return txt;
}
const popError = () => {
    errPar.style.display = "block";
    resultPar.style.display = "none";
    errPar.innerHTML = err;
}
const removeError = () => {
    errPar.style.display = "none";
    resultPar.style.display = "block";
}

const restructure = (equ, resp) => {
    const arr = equ.split(" ");
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].indexOf(resp)> -1) {
            const respIndex = arr[i].indexOf(resp) + 1;
            const myLength = arr[i].toString().length;
            let pow = arr[i].toString().slice(respIndex, myLength);
            arr[i] = arr[i].toString().slice(0, respIndex) + `<sup>${pow}</sup>`;
        }
    }
    return arr.join(" ");
}
checkBtn.onclick = () => {
    if (equation.value === "" || withRespect.value === "") {
        err = "Please Enter your equation and the letter you're differentiating with respect.";
        popError()
    } else {
        removeError();
        resultPar.style.display = "block";
        resultPar.innerHTML = `You mean the differentiation of :<br /> ${restructure(equation.value, withRespect.value)}, <br> \
        with respect to "${withRespect.value}"?`;
    }
}

let err = "";
answerBtn.onclick = () => {
    if (equation.value === "" || withRespect.value === "") {
        err = "Please Enter your equation and the letter you're differentiating with respect.";
        popError()
    } else {
        removeError();
    }
    const equArray = equation.value.split(" ");
    const answer = [];
    equArray.forEach(element => {
        answer.push(differentiate(element, withRespect.value));
    });

    for (let i = 0; i < answer.length; i++) {
        if(answer[i].toString().startsWith(' +')) {
            answer[i] = " + " + answer[i].slice(2);
        }
        if(answer[i].toString().startsWith('-')) {
            answer[i] = " - " + answer[i].slice(1);
        }
        if(answer[i] === " 0") {
            delete answer[i];
        }
    }
    
    let answerStr = answer.join(" ");
    if(equation.value.indexOf("  ") > -1 || answerStr.toString().indexOf("NaN") > -1) {
        err = "Invalid Equation";
        popError();
    } else {
        resultPar.style.display = "block";
        resultPar.innerHTML = `&part;y/&part;x = ${removeZero(removeFirstPlus(answerStr))}`;
    }
}
