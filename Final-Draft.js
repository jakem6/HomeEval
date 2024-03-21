//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////Form Submission To HOOK + Redirect//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission behavior

        const formData = new FormData(form);
        let customFormattedData = '';

        for (const [key, value] of formData.entries()) {
            if (value) { // Ensure you only include fields with values
                customFormattedData += `name="${key}" ${value}\n`; // Construct the data string
            }
        }

        // Debugging: Log the custom formatted string to ensure it's correct
        console.log(customFormattedData);

        // Send the custom-formatted data as a text/plain content type
        fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain' // Change this if the server expects a different content type
            },
            body: customFormattedData
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////Form Navagation Cards///////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  const multiStepForm = document.querySelector("[data-multi-step]");
  const formSteps = Array.from(multiStepForm.querySelectorAll("[data-step]"));
  let currentStep = formSteps.findIndex(step => step.classList.contains("active"));

  // Initialize current step
  if (currentStep < 0) {
      currentStep = 0;
  }
  showCurrentStep();

  multiStepForm.addEventListener("click", e => {
      let incrementor;
      if (e.target.matches("[data-next]")) {
          incrementor = 1;
      } else if (e.target.matches("[data-previous]")) {
          incrementor = -1;
      }

      if (incrementor == null) return;

      const inputs = Array.from(formSteps[currentStep].querySelectorAll("input"));
      const allValid = inputs.every(input => input.reportValidity());

      if (allValid) {
          currentStep += incrementor;
          currentStep = Math.max(0, Math.min(currentStep, formSteps.length - 1)); // Ensure currentStep is within bounds
          showCurrentStep();
      }
  });

  function showCurrentStep() {
      formSteps.forEach((step, index) => {
          const isActive = index === currentStep;
          step.classList.toggle("active", isActive);
          step.classList.toggle("hide", !isActive);
      });
      updateProgressBar(currentStep + 1); // Adding 1 to match progress bar steps which start from 1
  }

  function updateProgressBar(stepNumber) {
      const progressSteps = document.querySelectorAll('.progress-container .step');
      progressSteps.forEach((step, index) => {
          const circle = step.querySelector('.circle');
          const stepText = step.querySelector('.step-text');
          if (index < stepNumber - 1) {
              circle.classList.add('circle-completed');
              circle.classList.remove('active');
              stepText?.classList.add('step-text-completed');
              stepText?.classList.remove('active');
          } else if (index === stepNumber - 1) {
              circle.classList.add('active');
              circle.classList.remove('circle-completed');
              stepText?.classList.add('active');
              stepText?.classList.remove('step-text-completed');
          } else {
              circle.classList.remove('active', 'circle-completed');
              stepText?.classList.remove('active', 'step-text-completed');
          }
      });
  }

  // Initial display update
  showCurrentStep();
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
/////////////////////////////////////////////////////Property type Dynamic Page//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.propertytypebutton').forEach(button => {
      button.addEventListener('click', function() {
          document.querySelectorAll('.input-test').forEach(div => {
              div.setAttribute('hidden', '');
          });
          
          // Use the data-target-id attribute to find the matching div
          const targetId = this.getAttribute('data-target-id');
          const matchingDiv = document.getElementById(targetId);
          if (matchingDiv) {
              matchingDiv.removeAttribute('hidden');
          }
      });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////Required field error message/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////Dropdown Function + adds check icon//////////////////////////////////
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
          list.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 1px rgba(0, 0, 0, 0.1)';
      }
  };

  var radios = dropdown.querySelectorAll('.dropdown input[type="radio"]');
  radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
          // Clear previous selection text and icon
          inputBox.innerHTML = `<span>${this.nextElementSibling.textContent}</span> <i class="bi bi-check-lg"></i>`;
          inputBox.classList.add('selected'); // Add 'selected' class to indicate selection
          
          // Optionally close the dropdown
          inputBox.click();
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////*Acres or sqmt being shown*////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    // Listen for changes on any input
    document.querySelectorAll('input').forEach((radio) => {
        input.addEventListener('change', (event) => {
            showRelatedContainer(event.target.id);
        });

        // For checkboxes, also trigger on 'click' for immediate feedback
        input.addEventListener('click', (event) => {
            if (input.type !== 'radio' && input.type !== 'text') {
                showRelatedContainer(event.target.id);
            }
        });
    });

    function showRelatedContainer(inputId) {
        // Find and show the container related to the input
        const relatedContainer = document.querySelector(`.hidden-container[data-related-input="${inputId}"]`);
        if (relatedContainer) {
            relatedContainer.hidden = false;
        }
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Radio "Switch" Function////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  function positionSwitch() {
      document.querySelectorAll('.radio').forEach(fieldset => {
          const checkedRadio = fieldset.querySelector('input[type="radio"]:checked');
          if (checkedRadio) {
              const switchElement = fieldset.querySelector('.switch');
              const selectedLabel = checkedRadio.closest('label');

              // Calculate and set the switch's position and size
              switchElement.style.width = `${selectedLabel.offsetWidth}px`;
              switchElement.style.height = `${selectedLabel.offsetHeight}px`; // Adjusted to match label height
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

  // Adjust switch on window resize
  window.addEventListener('resize', positionSwitch);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Radio "Tile" Adding checkmark beside selected////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  const radioButtons = document.querySelectorAll('.radio-tiles input[type="radio"]');

  radioButtons.forEach(radio => {
      radio.addEventListener('change', (event) => {
          // First, remove any existing icons from all radio tiles
          document.querySelectorAll('.radio-tiles .bi-check-lg').forEach(icon => {
              icon.remove();
          });

          // Then, check if the current radio button is selected
          if (radio.checked) {
              // Create a new icon element
              let icon = document.createElement('i');
              icon.className = 'bi bi-check-lg';
              
              // Find the corresponding label's span for the checked radio button
              let labelSpan = radio.parentElement.querySelector('.radio-tile span');
              
              // Append the icon to the label's span
              labelSpan.appendChild(icon);
          }
      });
  });
});
