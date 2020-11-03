var inputHandler={listenInput:function(){try{var t=document.getElementById("inputExpander"),e=document.getElementById("textInput");e&&(e.addEventListener("input",function(e){var n=e.target;t&&inputHandler.autoHeight(n,t),inputHandler.validateInput(n,e),"insertLineBreak"===e.inputType&&inputHandler.getResult(n)}),e.addEventListener("focus",function(e){t&&inputHandler.autoHeight(e.target,t)}),e.addEventListener("paste",function(t){t.preventDefault()}))}catch(t){console.error("Caught an error: "+t)}},listenControllers:function(){try{var t=document.getElementById("controllers"),e=document.getElementById("inputExpander"),n=document.getElementById("textInput");t.addEventListener("click",function(t){var a=t.target;n.focus();var u=n.value;a.hasAttribute("data-value")&&(inputHandler.validateInput(n,t),u=n.value+a.getAttribute("data-value")),a.hasAttribute("data-clear")&&(u=""),a.hasAttribute("data-backwards")&&(u=u.slice(0,-1)),n.value=u,a.hasAttribute("data-result")&&inputHandler.getResult(n),e&&inputHandler.autoHeight(n,e),inputHandler.validateInput(n)})}catch(t){console.error("Caught an error: "+t)}},autoHeight:function(t,e){var n=t.value;e.textContent=n,inputStyles=getComputedStyle(t),e.style.cssText+="width: ".concat(inputStyles.width,"; font-family: ").concat(inputStyles.fontFamily,"; font-size: ").concat(inputStyles.fontSize,";"),t.style.cssText+=n?"height: ".concat(e.clientHeight,"px;"):"height: 40px;"},validateInput:function(t,e){var n=new RegExp("[+*\\/\\-]0\\d","gi"),a=new RegExp("\\D{2,}","gi"),u=new RegExp("\\d+\\.\\d+\\.","gi"),i=new RegExp("\\d+","gi"),l=new RegExp("".concat("^[+*\\/.]","|").concat("[^\\d+\\-*\\/.]"),"gi"),r=new RegExp("".concat("^0\\d"),"gi"),c=new RegExp("".concat("[+*\\/\\-]0\\d","|").concat("\\D{2,}","|").concat("\\d+\\.\\d+\\."),"gi"),d=t.value.replace(l,"").replace(r,"0"),o=d.match(c),s=d;o&&o.forEach(function(t){(n.test(t)||u.test(t))&&(s=s.replace(t,t.slice(0,-1))),a.test(t)&&(s=s.replace(t,t.slice(-1)))}),s=s.slice(0,150),t.value=s,e&&(i.test(e.target.getAttribute("data-value"))?inputHandler.checkResult(t,!0):i.test(e.data)&&inputHandler.checkResult(t,!1),t.removeAttribute("data-resultInput"))},checkResult:function(t,e){t.hasAttribute("data-resultInput")&&(t.value=e?"":t.value.slice(-1))},getResult:function(t){t.value=t.value.replace(/\D+$/,"");var e;t.value=(e=t.value,Function('"use strict";return ('.concat(e,")"))()).toFixed(6).replace(/0+$|\.0+$/g,""),t.setAttribute("data-resultInput","")}};inputHandler.listenInput(),inputHandler.listenControllers();