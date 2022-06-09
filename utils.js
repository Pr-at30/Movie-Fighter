/* ----------------------------------------------------------*/

/* In this method we are calling fetchdata every 
time the user changes the input by any char  */

// input.addEventListener('input', (event) => {
//     fetchdata(event.target.value);
// })   

/* ----------------------------------------------------------*/


/* ----------------------------------------------------------*/
/* We need to call fetchdata only when we do not enter
anything for say half a second 
This is debouncing      
*/

/* 

const input = document.querySelector('input');
let timeoutId;

const onInput = event => {
    if(timeoutId)
    {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        fetchdata(event.target.value);
    },500)
};

input.addEventListener('input', onInput);  

*/

const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {   // Returns a new function with the debouncer as a shield
        if(timeoutId)
        {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(()=>{
            func.apply(null,args);
        },delay);
    };
};
