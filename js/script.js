// Set focus on the first text field
$("#name").focus();

////////// ”Job Role” section //////////
//to hide the "other-title input"
$('#other-title').hide();
//event change handler for job role changes
$('#title').on('change', (event) => {
  const $value = $(event.target).val();
  if ($value === 'other') {
    $('#other-title').show();
  } else {
    $('#other-title').hide();
  }
});

/////////// "T-shirt info" section ////////////
const $colorOptions = $('#color option');
const $punOptions = $colorOptions.slice(0,3);
const $heartOption = $colorOptions.slice(3,6);
const $colorSelect = $('#color')

//on page load hide the color drop down option.(for exceeds)
$('#colors-js-puns').hide();
// Remove the text in paranthesis using regex to display only color.
for (i = 0; i < $colorOptions.length; i += 1) {
  const color = $colorOptions[i].innerHTML;
  $colorOptions[i].innerHTML = color.replace(/\s*\(.*\)/,'' );
}

// When the form first loads update the color field to "Please select a T-Shirt theme"
// & hide the color options
const $designOption = '<option value="select-design">Please select a T-shirt theme</option>';
$colorSelect.html($designOption);

// Event change handler function for design theme to show appropriate colors
// in the drop down menu.
$('#design').on('change', (event) => {
  //Display the color drop down which was hidden on page load
  $('#colors-js-puns').show();
  const $value = $(event.target).val();
  if ($value === 'js puns') {
    $colorSelect.html($punOptions);
  } else if ($value === 'heart js') {
    $colorSelect.html($heartOption);
  } else {
    $colorSelect.html($designOption);
    $('#colors-js-puns').hide();
  }
  $colorSelect.prop('selectedIndex', 0);

});

///////////Activity section////////////
//Updating and displaying the total activity cost
//create an element to display the total activity cost.
const $totalCost = $("<span></span>");
let $totalActivityCost = 0;
const $checkboxes = $('[type="checkbox"]');

//append the variable to the activity section
$('.activities').append($totalCost);

//Listening for changes in the activity section
$('.activities').on('change', event => {
  const $input = $(event.target);
  const priceString = $input.attr('data-cost');
  const cost = parseInt(priceString.replace('$', ''));

  //If the input element is checked, add the cost of the currently clicked activity to the total cost variable, else subtract the cost.
  if ($input.is(':checked')) {
    $totalActivityCost += cost;
  } else {
    $totalActivityCost -= cost;
  }
  $totalCost.text(`Total Cost is: ${$totalActivityCost}`).show();

  // When an activity is checked, disable any conflicting activities without disabling the activity that was just checked.This can be done by looping over the checkboxes.
  const inputText = $input.parent().text();
  const startIndex = inputText.indexOf('—') + 1;
  const endIndex = inputText.indexOf(',');
  const dayAndNightTime = inputText.slice(startIndex, endIndex);

  for(let i = 0; i < $checkboxes.length; i++) {
    const activityText = $checkboxes.eq(i).parent().text();
    if (activityText.includes(dayAndNightTime) && activityText !== inputText) {
      if($input.is(':checked')) {
        $checkboxes.eq(i).attr("disabled", true);
        $checkboxes.eq(i).parent().css("color", "grey");
      } else {
        $checkboxes.eq(i).attr("disabled", false);
        $checkboxes.eq(i).parent().css("color", "black");
      }
    }
  }
});

/////Payment Section////////
// Initially when page loads the it should take you to credit card option, also hide select option

const $paymentType = $('#payment');
const $creditCard = $("#credit-card");
const $paypal = $("#paypal");
const $bitcoin = $("#bitcoin");

$('option:contains("Select Payment Method")').hide();
$paymentType.val("Credit Card");
$paypal.hide();
$bitcoin.hide();

$paymentType.on('change', (event) => {
  const $value = $(event.target).val().toLowerCase();
  if($value === "credit card") {
    $creditCard.show();
    $paypal.hide();
    $bitcoin.hide();
  } else if ($value === "paypal") {
    $creditCard.hide();
    $paypal.show();
    $bitcoin.hide();
  } else if ($value === "bitcoin"){
    $creditCard.hide();
    $paypal.hide();
    $bitcoin.show();
  }
});

///////Form validation/////////

// setting variables for the regular expressions so that the input in the form fields are as per the required pattern
const $name = $('#name');
const $email = $('#mail');
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z]+(\.[a-zA-Z]+)+$/
const cardNumberRegex = /^[0-9]{13,16}$/
const zipCodeRegex = /^[0-9]{5}$/
const cvvRegex = /^[0-9]{3}$/

//functions to return the correct regex values
const isEmailValid = (email) => {
   return emailRegex.test(email);
}

const isCardNumberValid = (cardNumber) => {
  return cardNumberRegex.test(cardNumber);
}

const isZipCodeValid = (zipCode) => {
  return zipCodeRegex.test(zipCode);
}

const isCvvValid = (cvv) => {
  return cvvRegex.test(cvv);
}

//-------Name validation--------
const validateName = () => {
  $name.css('border','none');
  $('.name-error-message').remove();
  const $nameValue = $('#name').val();
  if ($nameValue === '') {
    $name.css('border','2px solid red');
    $name.after("<span class='name-error-message'>Please enter your full name</span>");
    $('.name-error-message').css('color','red');
    return false;
  }
  return true;
}

//--------Email validation--------
const validateEmail = () => {
  $email.css('border','none');
  $('.invalid-email-message').remove();
  const $emailValue = $('#mail').val();
  if (!isEmailValid($emailValue)) {
    let errorMessage = 'Invalid email, the correct format is test@test.com'
    if ($emailValue === '') {
      errorMessage = 'Please enter your email, it cannot be blank'
    }
    $email.css('border','2px solid red');
    $email.after(`<span class='invalid-email-message'>${errorMessage}</span>`);
    $('.invalid-email-message').css('color','red');
    return false;
  }
  return true;
}

//--------Activity validation--------
// User must select at least one checkbox under the
//"Register for Activities" section of the form.
const validateActivity = () => {
  let checkedCount = 0
  $('.activities input').each((index, checkbox) => {
    if($(checkbox).is(':checked')) {
      checkedCount += 1;
    }
  })
  $('.invalid-activity-message').remove();
  if(checkedCount === 0) {
    const activityErrorMessage = 'Please select at least one activity'
    $('.activities').after(`<span class='invalid-activity-message'>${activityErrorMessage}</span>`)
    $('.invalid-activity-message').css('color','red');
    return false;
  }
  return true;
}
  //------ Payment validation----------
  //validate the fields for credit card
const validateCreditCard = () => {
  $('#cc-num').css('border','none');
  $('.invalid-card-message').remove();
  const cardNumber = $('#cc-num').val();
  if (!isCardNumberValid(cardNumber)) {
    const cardErrorMessage = 'Please enter 13-16 digit card number'
    $('#cc-num').after(`<span class='invalid-card-message'>${cardErrorMessage}</span>`)
    $('.invalid-card-message').css('color','red');
    $('#cc-num').css('border','2px solid red');
    return false;
  }
  return true;
}

const validateZipCode = () => {
  $('#zip').css('border','none');
  $('.invalid-zip-message').remove();
  const zipCode = $('#zip').val();
  if (!isZipCodeValid(zipCode)) {
    const zipErrorMessage = 'Please enter a 5 digit zipcode'
    $('#zip').after(`<span class='invalid-zip-message'>${zipErrorMessage}</span>`)
    $('.invalid-zip-message').css('color','red');
    $('#zip').css('border','2px solid red');
    return false;
  }
  return true;
}

const validateCvv = () => {
  $('#cvv').css('border','none');
  $('.invalid-cvv-message').remove();
  const cvvCode = $('#cvv').val();
  if (!isCvvValid(cvvCode)) {
    const cvvErrorMessage = 'Please enter a 3 digit cvv'
    $('#cvv').after(`<span class='invalid-cvv-message'>${cvvErrorMessage}</span>`)
    $('.invalid-cvv-message').css('color','red');
    $('#cvv').css('border','2px solid red');
    return false;
  }
  return true;
}

// When user hits the registor(submit) button then the required error messages are added or removed based on the input validation
$('form').on('submit', (event) => {
  let isFormValid = true;
  if (!validateName()) {
    isFormValid = false;
  }
  if (!validateEmail()) {
    isFormValid = false;
  }
  if (!validateActivity()) {
    isFormValid = false;
  }

  if ($('#payment').val().toLowerCase() === 'credit card') {
    if (!validateCreditCard()) {
      isFormValid = false;
    }
    if (!validateZipCode()) {
      isFormValid = false;
    }
    if (!validateCvv()) {
      isFormValid = false;
    }
  }
  if (!isFormValid) {
    event.preventDefault();
  }
});

//Real time validation for each field, to give error messages while the user inputs values in the fields (for exceeds)
$('#name').on('keyup', (event) => { validateName(); });
$('#mail').on('keyup', (event) => { validateEmail(); });
$('#cc-num').on('keyup', (event) => { validateCreditCard(); });
$('#zip').on('keyup', (event) => { validateZipCode(); });
$('#cvv').on('keyup', (event) => { validateCvv(); });
