//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////FORM NAVIGATION///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const multiStepForm = document.querySelector("[data-multi-step]")
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")]
let currentStep = formSteps.findIndex(step => {
  return step.classList.contains("active")
})

if (currentStep < 0) {
  currentStep = 0
  showCurrentStep()
}

multiStepForm.addEventListener("click", e => {
  let incrementor
  if (e.target.matches("[data-next]")) {
    incrementor = 1
  } else if (e.target.matches("[data-previous]")) {
    incrementor = -1
  }

  if (incrementor == null) return

  const inputs = [...formSteps[currentStep].querySelectorAll("input")]
  const allValid = inputs.every(input => input.reportValidity())
  if (allValid) {
    currentStep += incrementor
    showCurrentStep()
  }
})

formSteps.forEach(step => {
  step.addEventListener("animationend", e => {
    formSteps[currentStep].classList.remove("hide")
    e.target.classList.toggle("hide", !e.target.classList.contains("active"))
  })
})

function showCurrentStep() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep)
  })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////Form Submission/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('myForm');

  form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent default form submission behavior

      // Collect form data
      const formData = new FormData(form);

      // Send the form data to the webhook using fetch
      fetch(form.action, {
          method: 'POST',
          body: formData,
      })
      .then(response => {
          if (response.ok) {
              // If the submission was successful, redirect the user
              window.location.href = 'https://jakeblack.ca';
          } else {
              // Handle server errors or unsuccessful submission
              alert('Form submission failed.');
          }
      })
      .catch(error => {
          // Handle network errors
          console.error('Error submitting form:', error);
          alert('Form submission failed due to a network error.');
      });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////Property Type Button Data being included in submission data///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  const propertyTypeButtons = document.querySelectorAll('.propertytypebutton-wrapper .propertytypebutton');
  const propertyTypeInput = document.getElementById('propertyType');

  propertyTypeButtons.forEach(button => {
    button.addEventListener('click', function() {
      propertyTypeInput.value = this.id; // Sets the hidden input's value to the ID of the clicked button
    });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////Required field error message/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////Script for progress bar/////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  const totalSteps = document.querySelectorAll('.circle').length - 1; // Adjusted for 7 movements for 8 steps
  let currentStep = 1;
  localStorage.setItem('currentStep', currentStep.toString());

  function updateSteps() { // Renamed from updateProgressBar for clarity
      const steps = document.querySelectorAll('.step');
      steps.forEach((step, index) => {
          const circle = step.querySelector('.circle');
          const stepText = step.querySelector('.step-text');
          if (index < currentStep - 1) {
              // Previous steps
              circle.classList.add('circle-completed');
              circle.classList.remove('active');
              stepText?.classList.add('step-text-completed');
              stepText?.classList.remove('active');
          } else if (index === currentStep - 1) {
              // Current step
              circle.classList.add('active');
              circle.classList.remove('circle-completed');
              stepText?.classList.add('active');
              stepText?.classList.remove('step-text-completed');
          } else {
              // Future steps
              circle.classList.remove('active', 'circle-completed');
              stepText?.classList.remove('active', 'step-text-completed');
          }
      });
  }

  function changeStep(stepChange) {
      currentStep += stepChange;
      currentStep = Math.max(1, Math.min(currentStep, totalSteps + 1));
      localStorage.setItem('currentStep', currentStep.toString());
      updateSteps(); // Update call to reflect function renaming
  }

  // Event listeners for step changes
  document.querySelectorAll('[data-next]').forEach(button => {
      button.addEventListener('click', () => changeStep(1));
  });

  document.querySelectorAll('[data-previous]').forEach(button => {
      button.addEventListener('click', () => changeStep(-1));
  });

  updateSteps(); // Initial update on DOMContentLoaded
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////Dropdown Function//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
  document.querySelectorAll('.dropdown').forEach(function(dropdown) {
    var inputBox = dropdown.querySelector('.input-box');

    inputBox.onclick = function() {
      this.classList.toggle('open');
      let list = this.nextElementSibling;
      if (list.style.maxHeight) {
        list.style.maxHeight = null;
        list.style.boxShadow = null;
      } else {
        list.style.maxHeight = list.scrollHeight + 'px';
        list.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.15),0 1px 3px 1px rgba(0, 0, 0, 0.1)';
      }
    };
  
    var radios = dropdown.querySelectorAll('.dropdown input[type="radio"]');
    radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        inputBox.textContent = this.nextElementSibling.textContent;
        inputBox.classList.add('selected'); // Add 'selected' class to indicate selection
        inputBox.click(); // Optionally close the dropdown
      });
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////*SLIDER Color+value FUNCTION*////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateSliderValue(value) {
  const slider = document.getElementById('slider-custom');
  const max = slider.max;
  const min = slider.min;

  // Calculate the value's percentage of the total range
  const valuePercentage = ((value - min) / (max - min)) * 100;

  // Update the --slider-value-percentage variable to reflect the current value
  document.documentElement.style.setProperty('--slider-value-percentage', `${valuePercentage}%`);

  // Update the output element with the current value
  const output = document.getElementById('sliderValue');
  output.value = `${value} sqft`; // Assuming you want to display the value in an output element
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////Spinner Element//////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
  // Function to update spinner values based on the increment/decrement action
  function updateSpinner(container, isIncrement) {
      const numberSpan = container.querySelector('.number');
      let currentValue = parseInt(container.querySelector('input[type="hidden"]').value, 10); // Use the hidden input's value
      const min = parseInt(container.getAttribute('min'), 10);
      const max = parseInt(container.getAttribute('max'), 10);
      const step = parseInt(container.getAttribute('step'), 10);
      let newValue = isIncrement ? currentValue + step : currentValue - step;
      
      // Ensure newValue is within the defined bounds
      newValue = Math.max(min, Math.min(newValue, max));
      // Update the hidden input's value along with the display text
      container.querySelector('input[type="hidden"]').value = newValue; // Update hidden input value

      // Determine the type of spinner (bedroom or bathroom) and set appropriate label
      let labelText = '';
      if (container.classList.contains('bedroom-input')) {
          labelText = ' Bedroom(s)';
      } else if (container.classList.contains('bathroom-input')) {
          // Use the container's ID to differentiate between full and half bathrooms
          const containerId = container.id;
          if (containerId.includes('full')) {
              labelText = ' Full-Bathroom(s)';
          } else if (containerId.includes('half')) {
              labelText = ' Half-Bathroom(s)';
          }
      }

      // Update the display with the new value and the corresponding label text
      numberSpan.textContent = `${newValue}${labelText}`;
  }

  // Attach click event listeners to all spinner buttons
  document.querySelectorAll('.spinner-container .spinner-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Determine if the action is increment or decrement based on the presence of the 'plus' or 'minus' class
        const isIncrement = button.querySelector('.plus') !== null; // True if 'plus' is found, false otherwise
        const container = button.closest('.bedroom-input, .bathroom-input');
        updateSpinner(container, isIncrement);
    });
  });  
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelectorAll('.spinner-btn').forEach(button => {
  button.addEventListener('click', function() {
    const container = button.closest('.bedroom-input, .bathroom-input');
    if (container) {
      container.classList.add('completed');
    }
  });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Radio "Switch" Function////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  // Function to position the switch according to the checked radio button
  function positionSwitch() {
    document.querySelectorAll('.radio').forEach(fieldset => {
      const checkedRadio = fieldset.querySelector('input[type="radio"]:checked');
      if (checkedRadio) {
        const switchElement = fieldset.querySelector('.switch');
        const selectedLabel = checkedRadio.closest('label');
        
        // Calculate and set the switch's position and size
        switchElement.style.width = `${selectedLabel.offsetWidth}px`;
        switchElement.style.height = `${fieldset.clientHeight}px`;
        switchElement.style.left = `${selectedLabel.offsetLeft}px`;
      }
    });
  }

  // Initial positioning of the switch
  positionSwitch();

  // Attach event listeners to radio buttons for dynamic updates
  document.querySelectorAll('.radio input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', positionSwitch);
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////Homestyle Dropdowns + Condo Fee & Lot Rent Showing///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  // Select the button by its ID
  const MiniHomeMobileHomeButton = document.getElementById('Mini-Home-Mobile-Home');
  
  // Select the label that needs to be shown/hidden
  const lotRentInput = document.getElementById('LotRentInput');
  
  // Add an event listener to the button
  MiniHomeMobileHomeButton.addEventListener('click', function() {
    // Toggle the display style between 'none' and 'flex'
    if (lotRentInput.style.display === 'none') {
      lotRentInput.style.display = 'flex'; // Show the label if it's hidden
    } else {
      lotRentInput.style.display = 'none'; // Hide the label if it's visible
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
  // Select the button by its ID
  const CondoApartmentButton = document.getElementById('Condo-Apartment');
  
  // Select the label that needs to be shown/hidden
  const CondoFeesInput = document.getElementById('CondoFeesInput');
  
  // Add an event listener to the button
  CondoApartmentButton.addEventListener('click', function() {
    // Toggle the display style between 'none' and 'flex'
    if (CondoFeesInput.style.display === 'none') {
      CondoFeesInput.style.display = 'flex'; // Show the label if it's hidden
    } else {
      CondoFeesInput.style.display = 'none'; // Hide the label if it's visible
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', function() {
  // Select the "Detached" button
  const detachedButton = document.getElementById('Detached');
  
  // Select the dropdown div
  const DetachedHomestyleDropdown = document.getElementById('DetachedHomestyle');
  
  // Add an event listener to the button
  detachedButton.addEventListener('click', function() {
      // Check if the dropdown is already visible
      if (DetachedHomestyleDropdown.style.display === 'none') {
          // Show the dropdown
          DetachedHomestyleDropdown.style.display = 'block';
      } else {
          // Optional: Hide the dropdown if it's already visible and the button is clicked again
          DetachedHomestyleDropdown.style.display = 'none';
      }
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
  // Select the "Detached" button
  const SemidetachedButton = document.getElementById('Semi-detached');
  
  // Select the dropdown div
  const SemiDetachedHomestyleDropdown = document.getElementById('SemiDetachedHomestyle');
  
  // Add an event listener to the button
  SemidetachedButton.addEventListener('click', function() {
      // Check if the dropdown is already visible
      if (SemiDetachedHomestyleDropdown.style.display === 'none') {
          // Show the dropdown
          SemiDetachedHomestyleDropdown.style.display = 'block';
      } else {
          // Optional: Hide the dropdown if it's already visible and the button is clicked again
          SemiDetachedHomestyleDropdown.style.display = 'none';
      }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
