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
    document.querySelectorAll('.spinner-grid-containers .spinner-btn').forEach(button => {
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
////////////////////////////////////////////////////Picker (Apple Ui Slider)////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////Single & Dual Picker Functionality//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-container').forEach(initPicker);

    // Initialize each picker's toggle and accept functionality
    initPickerControls('Bedrooms');
    initPickerControls('Bathrooms');
    initPickerControls('YearBuilt');

    function initPickerControls(pickerName) {
        const toggleButton = document.getElementById(`${pickerName}PickerButton`);
        const acceptButton = document.getElementById(`Accept${pickerName}PickerButton`);
        const modalOverlay = document.getElementById('modalOverlay');
        const pickerContainer = document.getElementById(`${pickerName}-picker-container`);

        toggleButton.addEventListener('click', () => {
            pickerContainer.classList.toggle('show-picker');
            modalOverlay.classList.toggle('show-overlay');
        });

        acceptButton.addEventListener('click', () => {
            pickerContainer.classList.remove('show-picker');
            modalOverlay.classList.remove('show-overlay');

            const highlightedItem = pickerContainer.querySelector('.picker-item-highlighted');
            if (highlightedItem) {
                acceptButton.textContent = highlightedItem.getAttribute('data-value');
            }
        });
    }    
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
