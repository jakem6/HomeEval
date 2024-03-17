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
/////////////////////////////////////////////////////Single & Dual Picker Functionality//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    // Initialize picker containers
    document.querySelectorAll('.scroll-container').forEach(initPicker);

    const toggleButton = document.getElementById('DetachedHomestylePickerButton');
    const acceptButton = document.getElementById('AcceptDetachedHomestylePickerButton'); // The accept button
    const modalOverlay = document.getElementById('modalOverlay'); // The modal overlay element

    toggleButton.addEventListener('click', () => {
        document.querySelectorAll('.dual-picker-container, .single-picker-container').forEach(container => {
            container.classList.toggle('show-picker'); // Toggle the visibility class for pickers
        });
        modalOverlay.classList.toggle('show-overlay'); // Also toggle the visibility class for the overlay
    });

    acceptButton.addEventListener('click', () => {
        // Close the picker containers
        document.querySelectorAll('.dual-picker-container, .single-picker-container').forEach(container => {
            container.classList.remove('show-picker');
        });
        modalOverlay.classList.remove('show-overlay'); // Hide the overlay

        // Update the accept button's text with the selected item's data-value
        const highlightedItem = document.querySelector('.picker-item-highlighted');
        if (highlightedItem) {
            acceptButton.textContent = highlightedItem.getAttribute('data-value');
        }
    });
    
    function initPicker(picker) {
        let isDown = false;
        let startY;
        let scrollTop;

        // Setup mouse event listeners for drag-scroll functionality
        picker.addEventListener('mousedown', (e) => {
            isDown = true;
            startY = e.pageY - picker.offsetTop;
            scrollTop = picker.scrollTop;
        });

        picker.addEventListener('mouseleave', () => isDown = false);
        picker.addEventListener('mouseup', () => isDown = false);
        picker.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - picker.offsetTop;
            const walk = (y - startY) * 5; // Scroll speed adjustment
            picker.scrollTop = scrollTop - walk;
        });

        // Setup click event listener for each picker item
        picker.querySelectorAll('.picker-item').forEach(item => {
            item.addEventListener('click', () => {
                scrollToItem(picker, item);
            });
        });

        // Setup scroll event listener to highlight the current item
        picker.addEventListener('scroll', () => {
            highlightCurrentItem(picker);
        });

        // Initial highlight of the current item
        highlightCurrentItem(picker);
    }

    function highlightCurrentItem(picker) {
        const overlay = picker.querySelector('.picker-overlay');
        const items = Array.from(picker.querySelectorAll('.picker-item'));
        let closestItemIndex = null;
        let minDistance = Infinity;

        // Determine the closest item to the overlay center
        items.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const overlayRect = overlay.getBoundingClientRect();
            const overlayCenter = overlayRect.top + (overlayRect.height / 2) + window.scrollY;
            const itemCenter = itemRect.top + (itemRect.height / 2) + window.scrollY;
            const distance = Math.abs(itemCenter - overlayCenter);

            if (distance < minDistance) {
                closestItemIndex = index;
                minDistance = distance;
            }
        });

        // Reset classes for all items
        items.forEach(item => item.classList.remove('picker-item-highlighted', 'picker-item-effected'));

        // Highlight the closest item and apply a special effect to items 2 positions away
        if (closestItemIndex !== null) {
            const closestItem = items[closestItemIndex];
            closestItem.classList.add('picker-item-highlighted');

            // Apply special effect to items 2 positions away, if they exist
            [closestItemIndex - 2, closestItemIndex + 2].forEach(index => {
                if (index >= 0 && index < items.length) {
                    items[index].classList.add('picker-item-effected');
                }
            });
        }
    }

    function scrollToItem(container, item) {
        // Calculate the scroll position to center the item
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const centerPosition = itemRect.top + container.scrollTop - containerRect.top - (containerRect.height / 2) + (itemRect.height / 2);
        container.scrollTo({ top: centerPosition, behavior: 'smooth' });

        // Highlight the item after scrolling
        setTimeout(() => {
            highlightCurrentItem(container);
        }, 300); // Adjust delay as needed to match scroll behavior
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Sqft Picker////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const sqftPicker = document.getElementById('sqftPicker');

    // Generate square footage options dynamically
    const generateSqftOptions = () => {
        for (let sqft = 450; sqft <= 3500; sqft += 25) { // Adjust step/increment as needed
            const option = document.createElement('div');
            option.className = 'picker-item';
            option.setAttribute('name', 'SquareFootage');
            option.setAttribute('data-value', sqft);
            option.textContent = `${sqft} sqft`;
            sqftPicker.insertBefore(option, sqftPicker.children[sqftPicker.children.length - 1]);
        }
    };

    generateSqftOptions();

    // Reuse existing picker logic for sqftPicker with minor adjustments if necessary
    // This includes event listeners for 'mousedown', 'mousemove', 'mouseup', 'mouseleave', and 'scroll'
    // Ensure to replace 'picker' with 'sqftPicker' and adjust any specific logic for square footage picker

    // Example adjustment: You might want to adjust the scroll speed or the way options are generated based on your specific needs
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Lot Size Picker////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const lotSizePicker = document.getElementById('lotSizePicker');

    // Generate lot size options dynamically
    const generateLotSizeOptions = () => {
        for (let sqm = 250; sqm <= 15000; sqm += 250) { // Adjust step/increment as needed
            const option = document.createElement('div');
            option.className = 'picker-item';
            option.setAttribute('name', 'LotSize');
            option.setAttribute('data-value', sqm);
            option.textContent = `${sqm} sqm`;
            lotSizePicker.insertBefore(option, lotSizePicker.children[lotSizePicker.children.length - 1]);
        }
    };

    generateLotSizeOptions();

    // Reuse existing picker logic for lotSizePicker with adjustments for lot size specifics
    // This includes event listeners for 'mousedown', 'mousemove', 'mouseup', 'mouseleave', and 'scroll'
    // Ensure to replace any specific logic or references from the square footage picker to apply to the lot size picker
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
