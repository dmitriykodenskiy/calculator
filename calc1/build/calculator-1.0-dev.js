var inputHandler = {
  listenInput: function listenInput() {
    try {
      // Variables
      var inputExpander = document.getElementById('inputExpander'),
          input = document.getElementById('textInput');

      if (input) {
        // Listen typing
        input.addEventListener('input', function (e) {
          var input = e.target;

          if (inputExpander) {
            inputHandler.autoHeight(input, inputExpander);
          }

          inputHandler.validateInput(input, e); // Get result

          if (e.inputType === 'insertLineBreak') {
            inputHandler.getResult(input);
          }
        }); // Listen focus

        input.addEventListener('focus', function (e) {
          if (inputExpander) {
            inputHandler.autoHeight(e.target, inputExpander);
          }
        }); // Listen paste

        input.addEventListener('paste', function (e) {
          e.preventDefault();
        });
      }
    } catch (error) {
      console.error('Caught an error: ' + error);
    }
  },
  listenControllers: function listenControllers() {
    try {
      // Variables
      var controllers = document.getElementById('controllers'),
          inputExpander = document.getElementById('inputExpander'),
          input = document.getElementById('textInput'); // Listen click

      controllers.addEventListener('click', function (e) {
        var button = e.target;
        input.focus();
        var result = input.value;

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

        input.value = result; // Get result

        if (button.hasAttribute('data-result')) {
          inputHandler.getResult(input);
        }

        if (inputExpander) {
          inputHandler.autoHeight(input, inputExpander);
        }

        inputHandler.validateInput(input);
      });
    } catch (error) {
      console.error('Caught an error: ' + error);
    }
  },
  autoHeight: function autoHeight(input, helperBlock) {
    var text = input.value;
    helperBlock.textContent = text, inputStyles = getComputedStyle(input);
    helperBlock.style.cssText += "width: ".concat(inputStyles.width, "; font-family: ").concat(inputStyles.fontFamily, "; font-size: ").concat(inputStyles.fontSize, ";");
    input.style.cssText += text ? "height: ".concat(helperBlock.clientHeight, "px;") : "height: 40px;";
  },
  validateInput: function validateInput(input, event) {
    // Remove non-math symbols, limit the number of characters, 
    // override previous non-digit symbol and remove other non-formated input
    // Match RegExps
    var doubleZeroDigitStart = "[+*\\/\\-]0\\d",
        doubleZeroDigitStart_compiled = new RegExp(doubleZeroDigitStart, 'gi'),
        doubleNonDigit = "\\D{2,}",
        doubleNonDigit_compiled = new RegExp(doubleNonDigit, 'gi'),
        doublePeriod = "\\d+\\.\\d+\\.",
        doublePeriod_compiled = new RegExp(doublePeriod, 'gi'); // Replace RegExps

    var nonDigitStringStart = "^[+*\\/.]",
        digitsOrMath = "[^\\d+\\-*\\/.]",
        doubleZeroStringStart = "^0\\d"; // Test RegExps

    var digitCheck = new RegExp("\\d+", 'gi'); // Combined RegExps

    var replaceToEmpty = new RegExp("".concat(nonDigitStringStart, "|").concat(digitsOrMath), 'gi'),
        replaceToZero = new RegExp("".concat(doubleZeroStringStart), 'gi'),
        match = new RegExp("".concat(doubleZeroDigitStart, "|").concat(doubleNonDigit, "|").concat(doublePeriod), 'gi');
    var validSymbols = input.value.replace(replaceToEmpty, '').replace(replaceToZero, '0'),
        overridingSymbols = validSymbols.match(match),
        validatedInput = validSymbols;

    if (overridingSymbols) {
      overridingSymbols.forEach(function (element) {
        if (doubleZeroDigitStart_compiled.test(element) || doublePeriod_compiled.test(element)) {
          validatedInput = validatedInput.replace(element, element.slice(0, -1));
        }

        if (doubleNonDigit_compiled.test(element)) {
          validatedInput = validatedInput.replace(element, element.slice(-1));
        }
      });
    }

    validatedInput = validatedInput.slice(0, 150);
    input.value = validatedInput; // Handle result value

    if (event) {
      if (digitCheck.test(event.target.getAttribute('data-value'))) {
        inputHandler.checkResult(input, true);
      } else if (digitCheck.test(event.data)) {
        inputHandler.checkResult(input, false);
      }

      input.removeAttribute('data-resultInput');
    }
  },
  checkResult: function checkResult(input, controller_input) {
    if (input.hasAttribute('data-resultInput')) {
      if (controller_input) {
        input.value = '';
      } else {
        input.value = input.value.slice(-1);
      }
    }
  },
  getResult: function getResult(input) {
    input.value = input.value.replace(/\D+$/, '');

    var compileStringToCode = function compileStringToCode(value) {
      return Function("\"use strict\";return (".concat(value, ")"))();
    };

    input.value = compileStringToCode(input.value).toFixed(6).replace(/0+$|\.0+$/g, '');
    input.setAttribute('data-resultInput', '');
  }
}; // Launch the functions

inputHandler.listenInput();
inputHandler.listenControllers();