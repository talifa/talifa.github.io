// // var input = document.querySelector("#phone1"),
// //   output = document.querySelector("#output");

// // var iti = window.intlTelInput(input, {
// //   nationalMode: true,
// //   initialCountry : 'RU',
// //   utilsScript: "js/utils.js" // just for formatting/placeholders etc
// // });

// // var handleChange = function() {
// //   var text = (iti.isValidNumber()) ? "Международный формат: " + iti.getNumber() : "Вводи номерок";
// //   var textNode = document.createTextNode(text);
// //   output.innerHTML = "";
// //   output.appendChild(textNode);
// // };

// // // listen to "keyup", but also "change" to update when the user selects a country
// // input.addEventListener('change', handleChange);
// // input.addEventListener('keyup', handleChange);



// // var input = document.querySelector("#phone1"),
// //     errorMsg = document.querySelector("#error-msg"),
// //     validMsg = document.querySelector("#valid-msg");

// // // here, the index maps to the error code returned from getValidationError - see readme
// // var errorMap = ["Кривой номер", "Кривой код страны", "Коротковато", "Длинновато", "Номер кривой"];


// $("#phone1").intlTelInput( {
//     // autoHideDialCode: false,
//     // autoPlaceholder: 'aggressive',
//     initialCountry: 'ru',
//     autoFormat: true,
//     preferredCountries: ['ru', 'de'],
//     separateDialCode: false,
//     nationalMode: false,
//     autoHideDialCode: false,
//     // formatOnDisplay: false,
//     utilsScript: "js/utils.js",
// 	  // customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
// 	  // 	console.log(selectedCountryPlaceholder);
// 	  //   return selectedCountryPlaceholder;
// 	  // },
// });

// // var reset = function() {
// //     input.classList.remove("error");
// //     errorMsg.innerHTML = "";
// //     errorMsg.classList.add("hide");
// //     validMsg.classList.add("hide");
// // };

// // // on blur: validate
// // input.addEventListener('blur', function() {
// //     reset();
// //     if (input.value.trim()) {
// //         if (iti.isValidNumber()) {
// //             validMsg.classList.remove("hide");
// //         } else {
// //             input.classList.add("error");
// //             var errorCode = iti.getValidationError();
// //             errorMsg.innerHTML = errorMap[errorCode];
// //             errorMsg.classList.remove("hide");
// //         }
// //     }
// // });

// // // on keyup / change flag: reset
// // input.addEventListener('change', reset);
// // input.addEventListener('keyup', reset);

// // var text = ("Международный формат: " + iti.getNumber());
// // console.log(text);


// // var mask1 = $("#phone1").attr('placeholder').replace(/[0-9]/g, 0);


// // $(document).ready(function() {
// //     // $('#phone1').mask('P0#', {
// //     //     'translation': {
// //     //         P: { pattern: /[0-9\+]/ }
// //     //     }
// //     // });
// //     $('#numb').mask('000 000 000 000 000', { reverse: true });
// // });

// // $("#phone1").on("countrychange", function(e, countryData) {
// // 	console.log('countrychange')
// //     // $("#phone1").val('');
// //     var mask2 = $("#phone1").attr('placeholder').replace(/[0-9]/g, 0);
// //     console.log($("#phone1").attr('placeholder'))
// //     console.log('setmask on countrychange', mask2);
// //     $("#phone1").unmask().mask(mask2);
// //     // $('#phone1').mask('P0#', {
// //     //     'translation': {
// //     //         P: { pattern: /[0-9\+]/ }
// //     //     }
// //     // });
// // });







// // var input2 = document.querySelector("#phone2");

// // window.intlTelInput(input2, {
// //     autoHideDialCode: false,
// //     autoPlaceholder: 'aggressive',
// //     initialCountry: 'RU',
// //     preferredCountries: ['RU', 'DE'],
// //     separateDialCode: false,
// //     utilsScript: "js/utils.js"
// // });

// // var mask3 = $("#phone2").attr('placeholder').replace(/[0-9]/g, 0);


// // $(document).ready(function() {
// //     $('#phone2').mask(mask3);
// //     $('#numb').mask('000 000 000 000 000', { reverse: true });
// // });
// // $("#phone2").on("countrychange", function(e, countryData) {

// //     var mask3 = $("#phone2").attr('placeholder').replace(/[0-9]/g, 0);
// //     console.log($("#phone2").attr('placeholder'))
// //     console.log(mask3);
// //     $('#phone2').mask(mask3)
// // });

var telInput = $("#phone1");

telInput.intlTelInput({
    utilsScript: "js/utils.js",
    preferredCountries: ['RU'],
    nationalMode: false,
    formatOnDisplay: true // SET THIS!!!
});

telInput.on("keyup change", function(event) {
    const formattedNumber = new libphonenumber.AsYouType().input(event.currentTarget.value);
    // console.log(formattedNumber)
    telInput.intlTelInput('setNumber', formattedNumber);
    $('#phone1').mask('P0#', {
        'translation': {
            P: { pattern: /[0-9\+]/ }
        }
    });
});
$(document).ready(function() {
    $('#numb').mask("000.000.000.000.000Z00 ₽", {
        reverse: true,
        translation: {
            Z: { pattern: /[\,]/ }
        }
    })

});


//     telInput.on("keyup change", resetIntlTelInput);
//         $('#phone1').mask('P0#', {
//         'translation': {
//             P: { pattern: /[0-9\+]/ }
//         }
//     });

//     function resetIntlTelInput() {
//       if (typeof intlTelInputUtils !== 'undefined') { // utils are lazy loaded, so must check
//           var currentText = telInput.intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
//           if (typeof currentText === 'string') { // sometimes the currentText is an object :)
//           	console.log(currentText)
//               telInput.intlTelInput('setNumber', currentText); // will autoformat because of formatOnDisplay=true
//           }
//       }
//     }
//     $(document).ready(function() {
//      $('#numb').mask('000 000 000 000 000', { reverse: true });
// });



new Cleave('.input-3', {
    numeral: true,
    numeralDecimalMark: ',',
    delimiter: ' ',
    stripLeadingZeroes: false,
    numeralDecimalScale: 3
});
new Cleave('.input-4', {
    numeral: true,
    numeralDecimalMark: ',',
    delimiter: ' ',
    prefix: '₽',
    noImmediatePrefix: true,
    rawValueTrimPrefix: true,
    stripLeadingZeroes: false,
    numeralDecimalScale: 3
});

new Cleave('.input-5', {
    numericOnly: true,
    blocks: [4, 4, 4, 4, 4],
    delimiter: '-',

});




var element = document.getElementById('input-3i');

var numberMask = new IMask(element, {
    mask: Number, // enable number mask

    // other options are optional with defaults below
    scale: 3, // digits after point, 0 for integers
    signed: false, // disallow negative
    thousandsSeparator: ' ', // any single char
    padFractionalZeros: false, // if true, then pads zeros at end to the length of scale
    normalizeZeros: true, // appends or removes zeros at ends
    radix: ',', // fractional delimiter
    mapToRadix: ['.'] // symbols to process as radix

    // additional number interval options (e.g.)
    // min: -1000000000000000,
    // max: 10000000000000000
});
var currencyMask = new IMask(
    document.getElementById('input-4i'), {
        mask: 'num ₽',
        lazy: false, 

        blocks: {
            num: {
                // nested masks are available!
                mask: Number,
                scale: 3,
                thousandsSeparator: ' '
            }
        }
    });
var numberMask = new IMask(
    document.getElementById('input-5i'), {
        mask: Number,
        signed: false,
        padFractionalZeros: false, // if true, then pads zeros at end to the length of scale
        normalizeZeros: false, // appends or removes zeros at ends
        max: 1000000000,
        thousandsSeparator: '-'
    });