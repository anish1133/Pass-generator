const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn =document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allcheckBox = document.querySelectorAll("input[type=checkbox]"); 
const symbols ='`~!@#$%^&*()_+=-{[}]\|;:,<.>/?';

let password ="";
let passwordLength = 10;
let checkCount = 0;

//set circle color  green; 
setIndicator("#ccc");

handleslider();
// UI par passwordlength reflect karwata hai.
function handleslider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    // or kuch bhi add karna hai !! --HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style .backgroundSize =  ((passwordLength -min)*100/(max-min)) +"% 100%" ;
    
      
}
function setIndicator(color){
    indicator.style.background =color;
    // shadow   --HW
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`; 
    
}

function getrandomInt(min , max){
   return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getrandomInt(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getrandomInt(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getrandomInt(65,90));
}

function generateSymbol() {
     const random = getrandomInt(0,symbols.length);
     return symbols.charAt(random);   
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper =true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum =true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }  
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    // to make copy wala span visbible
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000); 
}

function shufflePassword(array){
    // Fisher  Yates Method
    for (let i = array.length -1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0; 
    allcheckBox.forEach( (checkbox) =>{
        if(checkbox.checked) 
            checkCount++;   
})
   //special condition
   if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleslider();      
   }
}

allcheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleslider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',() => {
    //none of the checkbox are selected
    if(checkCount <= 0 ) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleslider();
    }

    // lets find the new password
    console.log("starting the journey");
    // remove old pasword
    password ="";

    // let's put the stuff mentioned by checkboxes
    /*
    if(uppercaseCheck.checked){
        password =generateUpperCase();
    }
    f(lowercaseCheck.checked){
        password =generatelowerCase();
    }
    f(numbersCheck.checked){
        password =generateRandomNumber();
    }
    f(symbolCheck.checked){
        password =generateSymbol();
    } */

    let funArr = [];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);
    if(symbolCheck.checked)
        funArr.push(generateSymbol);

        // compulsory addition
    
    for(let i =0 ;i<funArr.length;i++){
        password += funArr[i]();
    }
    console.log("Compulsory addition done");

    // remaining addition
    for(let i =0;i<passwordLength-funArr.length;i++){
        let randIndex = getrandomInt(0 , funArr.length);
        console.log("randon" + randIndex);
        password += funArr[randIndex]();
    }
    console.log("Remaining addition done");

    //suffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling  done");
   // show in UI

   passwordDisplay.value = password;
   console.log("UI addition done");
   // calculate strength
   calcStrength(); 
   console.log("strength addition done");
});