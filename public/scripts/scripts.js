"use strict";

// Find wrapper HTMLElement
var wrapper = document.querySelector('.article'); // Replace the whole wrapper with its own contents

wrapper.outerHTML = wrapper.innerHTML;