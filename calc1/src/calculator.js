const inputHandler = {
  listenInput: ()=>{
    try {
      // Variables
      const inputExpander = document.getElementById('inputExpander'),
      input = document.getElementById('textInput');

      if (input) {
        // Listen typing
        input.addEventListener('input', (e)=>{
          const input = e.target;

          if (inputExpander) {
            inputHandler.autoHeight(input, inputExpander);
          }
          inputHandler.validateInput(input, e);

          // Get result
          if (e.inputType === 'insertLineBreak') {
            inputHandler.getResult(input);
          }
        });

        // Listen focus
        input.addEventListener('focus', (e)=>{
          if (inputExpander) {
            inputHandler.autoHeight(e.target, inputExpander);
          }
        })

        // Listen paste
        input.addEventListener('paste', (e)=>{
          e.preventDefault();
        })
      }
      
    } catch (error) {
      console.error('Caught an error: ' + error);
    }
  },
  listenControllers: ()=>{
    try {
      // Variables
      const controllers = document.getElementById('controllers'),
      inputExpander = document.getElementById('inputExpander'),
      input = document.getElementById('textInput');

      // Listen click
      controllers.addEventListener('click', (e)=>{
        const button = e.target;
        
        input.focus();

        let result = input.value;


        if (button.hasAttribute('data-value')) {
          inputHandler.validateInput(input, e);
          result = input.value + button.getAttribute('data-value');
        }
        
        if (button.hasAttribute('data-clear')) {
          result = '';
        }

        if (button.hasAttribute('data-backwards')) {
          result = result.slice(0, -1);
        }
        
        input.value = result;
        
        // Get result
        if (button.hasAttribute('data-result')){
          inputHandler.getResult(input);
        }

        if (inputExpander) {
          inputHandler.autoHeight(input, inputExpander);
        }

        inputHandler.validateInput(input);
      })
    } catch (error) {
      console.error('Caught an error: ' + error);
    }
  },
  autoHeight: (input, helperBlock)=>{
    const text = input.value;
    helperBlock.textContent = text,
    inputStyles = getComputedStyle(input);

    helperBlock.style.cssText += `width: ${inputStyles.width}; font-family: ${inputStyles.fontFamily}; font-size: ${inputStyles.fontSize};`;
    input.style.cssText += text ? `height: ${helperBlock.clientHeight}px;` : `height: 40px;`;
  },
  validateInput: (input, event)=>{
    // Remove non-math symbols, limit the number of characters, 
    // override previous non-digit symbol and remove other non-formated input

    // Match RegExps
    const doubleZeroDigitStart = `[+*\\/\\-]0\\d`,
    doubleZeroDigitStart_compiled = new RegExp(doubleZeroDigitStart, 'gi'),
    doubleNonDigit = `\\D{2,}`,
    doubleNonDigit_compiled = new RegExp(doubleNonDigit, 'gi'),
    doublePeriod = `\\d+\\.\\d+\\.`,
    doublePeriod_compiled = new RegExp(doublePeriod, 'gi');

    // Replace RegExps
    const nonDigitStringStart = `^[+*\\/.]`,
    digitsOrMath = `[^\\d+\\-*\\/.]`,
    doubleZeroStringStart = `^0\\d`;

    // Test RegExps
    const digitCheck = new RegExp(`\\d+`, 'gi');

    // Combined RegExps
    const replaceToEmpty = new RegExp(`${nonDigitStringStart}|${digitsOrMath}`, 'gi'),
    replaceToZero = new RegExp(`${doubleZeroStringStart}`, 'gi'),
    match = new RegExp(`${doubleZeroDigitStart}|${doubleNonDigit}|${doublePeriod}`, 'gi');
    
    let validSymbols = input.value.replace(replaceToEmpty, '').replace(replaceToZero, '0'),
    overridingSymbols = validSymbols.match(match),
    validatedInput = validSymbols;
    
    if (overridingSymbols) {
      overridingSymbols.forEach(element => {
        if (doubleZeroDigitStart_compiled.test(element) || doublePeriod_compiled.test(element)) {
          validatedInput = validatedInput.replace(element, element.slice(0, -1));
        } 
        if(doubleNonDigit_compiled.test(element)){
          validatedInput = validatedInput.replace(element, element.slice(-1));
        }
      });
    } 
    
    validatedInput = validatedInput.slice(0, 150);
    
    input.value = validatedInput;

    // Handle result value
    if (event) {
      if (digitCheck.test(event.target.getAttribute('data-value'))) {
        inputHandler.checkResult(input, true);
      } else if(digitCheck.test(event.data)){
        inputHandler.checkResult(input, false);
      }
      input.removeAttribute('data-resultInput');
    }
  },
  checkResult: (input, controller_input)=>{
    if (input.hasAttribute('data-resultInput')) {
      if (controller_input) {
        input.value = '';
      } else {
        input.value = input.value.slice(-1);
      }
    }
  },
  getResult: (input) => {
    input.value = input.value.replace(/\D+$/, '');

    const compileStringToCode = (value)=>{
      return Function(`"use strict";return (${value})`)();
    }

    input.value = compileStringToCode(input.value).toFixed(6).replace(/0+$|\.0+$/g, '');
    input.setAttribute('data-resultInput', '');
  }
}

// Launch the functions

inputHandler.listenInput();
inputHandler.listenControllers();