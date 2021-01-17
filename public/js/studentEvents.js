/* ================================================
 * UI CONTROLER
 * ================================================ */
const UICtrl = (function() {
  /* PRIVATE VAR & METHODS
   * ================================ */

  // -------- GATHER UI SELECTORS --------
  const UISelectors = {
    formSubmitButton: "button[type='submit']",
    formTriggerModalButton: "#triggerModuleSelectionModal",
    cardModuleSelectionTable: "#allTaughtModules",
    alertCardProfile: "#cardProfileMessage",
    alertCardModulesSelection: "#cardModulesSelection",
    linkTabProfile: "#profile-list",
    linkTabModule: "#module-list",
    sortTableHeader: ".column--sort",
    tableHeaderCheckbox: ".check-column",
    tableRowCheckbox: ".check-row",
    switchButton: ".btn--switch"
    // icon_arrowTableModulesTitleColumn: ""
  };

  /* PUBLIC METHODS
   * ================================ */
  return {
    getUISelectors: function() {
      return UISelectors;
    },
    showFormValidationMessages: function(position, message) {
      // console.log(position);
      // console.log(position.nextElementSibling);
      // console.log(position.querySelector(".invalid-field"));
      // console.log(position.nextElementSibling.classList());
      // if (
      //   !position.querySelector(".invalid-field") ||
      //   (position.querySelector("textarea") &&
      //     !position.querySelector(".invalid-field"))
      // ) {

      // }

      // --- Built & Insert An Feedback Message ----
      const div = document.createElement("div");
      div.className = "form-text error-feedback";
      div.innerHTML = `${message}`;
      position.insertAdjacentElement("beforeend", div);
    },
    sortTableColumn: function(table, columnIndex) {
      // Initialize variables
      let rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;

      // // Get the table to be sorted
      // console.log(table);
      // // table = document.querySelector(UISelectors.modulesTable);

      // Set sort to start
      switching = true;

      // Set the sorting direction to ascending
      dir = "asc";

      // Main loop that runs until table is sorted
      while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows
         * (except the first, which contains table headers):
         */
        for (i = 1; i < rows.length - 1; i++) {
          // Start by saying there should be no switching:
          shouldSwitch = false;

          /* Get the two elements you want to compare, one from current row
           * and one from the next:
           */
          x = rows[i].getElementsByTagName("TD")[columnIndex];
          y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

          /* Check if the two rows should switch place, based on the direction,
           * asc or desc:
           */
          if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              // If so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              // If so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
           * and mark that a switch has been done:
           */
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);

          switching = true;

          // Each time a switch is done, increase this count by 1:
          switchcount++;
        } else {
          /* If no switching has been done AND the direction is "asc",
           * set the direction to "desc" and run the while loop again.
           */
          if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
          }
        }
      }

      // Renumbering the table
      let counter = 1;
      for (const key of table.rows) {
        if (key.children[0].innerText !== "#") {
          key.children[0].innerText = counter;
          counter++;
        }
      }
    },
    switchChekboxes: function(headerCheckbox, rowCheckboxes, switchButton) {
      if (headerCheckbox.checked) {
        let action = true;
        /* CHECKS THOSE ROW CHECKBOXES WHICH ARE ENABLED AND ENABLES THE
         * "switchButton" ACCORDINGLY
         * ----------------------------------------------- */
        rowCheckboxes.forEach(function(checkbox) {
          if (checkbox.disabled === false) {
            checkbox.checked = true;
            action = false;
          }
        });
        switchButton.disabled = action;
      } else {
        /* UNCHECK ALL ROW CHECKBOXES & DISABLE "switchButton"
         * ----------------------------------------------- */
        rowCheckboxes.forEach(function(checkbox) {
          checkbox.checked = false;
        });
        switchButton.disabled = true;
      }
    },
    switchChekbox: function(elements, switchButton) {
      // ------------ INITIALIZE VARIABLES ------------
      let typeCheckbox = false;
      let enableButton = false;

      // ------------ GET THE ELEMENT TYPE ------------
      for (element of elements) {
        if (element.type === "checkbox") {
          typeCheckbox = true;
          if (element.checked === true) {
            enableButton = true;
            break;
          }
        }
      }

      // ------------ SWITCH BUTTON ------------
      if (typeCheckbox) {
        if (enableButton) {
          switchButton.disabled = false;
        } else {
          switchButton.disabled = true;
        }
      }
    }
  };
})();

/* ================================================
 * APPLICATION CONTROLER
 * ================================================ */
const App = (function(UICtrl) {
  /* PRIVATE VAR & METHODS
   * ================================ */
  // Get UI Selectors
  const UISelectors = UICtrl.getUISelectors();

  const loadEventListeners = function() {
    // ---------------- Alert Messages ----------------
    if (document.querySelector(UISelectors.alertCardProfile)) {
      document.querySelector(UISelectors.linkTabProfile).click();
    }
    if (document.querySelector(UISelectors.alertCardModulesSelection)) {
      document.querySelector(UISelectors.linkTabModule).click();
    }

    // ---------------- Form Validation ----------------
    const formSubmitButtons = document.querySelectorAll(
      UISelectors.formSubmitButton
    );
    formSubmitButtons.forEach(button => {
      button.addEventListener("click", formValidation);
    });

    // ---------------- Sort Table Columns ----------------
    const tableSortColumns = document.querySelectorAll(
      UISelectors.sortTableHeader
    );
    tableSortColumns.forEach(column => {
      column.addEventListener("click", sortTable);
    });

    // ---------------- Switch Table Rows Checkboxes ----------------
    const tableHeaderCheckboxes = document.querySelectorAll(
      UISelectors.tableHeaderCheckbox
    );
    tableHeaderCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("click", switchTableChecboxes);
    });
    // ---------------- Switch Table Row Checkbox ----------------
    const tableRowCheckboxes = document.querySelectorAll(
      UISelectors.tableRowCheckbox
    );
    tableRowCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("click", switchTableRowCheckbox);
    });

    // -------- Disable Modal Table Rows For Selected Table Rows --------
    const trigerModalButton = document.querySelector(
      UISelectors.formTriggerModalButton
    );
    trigerModalButton.addEventListener("click", disableSelectedTableRows);

    // @@@@@@@@@@@@@@@@ SAMPLE CODE @@@@@@@@@@@@@@@@

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  };

  // Load event listeners when the DOM content is loaded
  document.addEventListener("DOMContentLoaded", loadEventListeners);

  /* ------------------------------------------------
   * EVENTS
   * ------------------------------------------------ */
  // @@@@@@@@@@@@@@@@ SAMPLE CODE @@@@@@@@@@@@@@@@

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  const formValidation = function(e) {
    /* GATHER ALL NECESSERY DOM ELEMENTS
     * ----------------------------------------------- */
    const form = e.target.closest("form");

    /* GET THE DEFAULTS BROWSER INVALID FIELDS && FIELDS FEEDBACK MESSAGES
     * ------------------------------------------------------------------- */
    const invalidFieldsExceptCKEditor = form.querySelectorAll(":invalid");
    const invalidFeedback = form.querySelectorAll(".error-feedback");

    // console.log(invalidFieldsExceptCKEditor);
    // console.log(invalidFeedback);

    /* RESET FEEDBACK MESSAGES
     * ----------------------------------------------- */
    for (let i = 0; i < invalidFeedback.length; i++) {
      // Remove any feedback messages if exist
      invalidFeedback[i].parentNode.removeChild(invalidFeedback[i]);
    }

    /* GET ALL INVALID FIELDS
     * ----------------------------------------------- */
    const textareas = form.querySelectorAll("textarea");
    const allInvalidFields = [];
    for (let i = 0; i < invalidFieldsExceptCKEditor.length; i++) {
      allInvalidFields[i] = invalidFieldsExceptCKEditor[i];
    }

    let j = allInvalidFields.length;
    for (let i = 0; i < textareas.length; i++) {
      let textareaID = textareas[i].getAttribute("id");
      if (CKEDITOR.instances[textareaID]) {
        let ckeditorText = CKEDITOR.instances[textareaID].getData();
        if (ckeditorText === "") {
          allInvalidFields[j] = textareas[i];
          j += 1;
        }
      }
    }

    /* CANCEL SUBMITION IN CASE OF INVALID FIELDS
     * ----------------------------------------------- */
    if (allInvalidFields.length > 0) {
      // console.log(allInvalidFields);
      e.preventDefault();
    }

    /* SHOW VALIDATION MESSAGE
     * ----------------------------------------------- */
    for (let i = 0; i < allInvalidFields.length; i++) {
      let invalidFieldID = allInvalidFields[i].getAttribute("id");
      let label = form.querySelector(`label[for='${invalidFieldID}']`);
      let labelText = label.textContent;
      let position = allInvalidFields[i].closest(".form-group");
      let message = "";
      let invalidFieldTagName = allInvalidFields[i].tagName;
      let invalidFieldType = allInvalidFields[i].type;

      if (invalidFieldTagName === "INPUT" && invalidFieldType === "time") {
        message = `Please provide a valid &ldquo;${labelText}&rdquo;`;
        if (allInvalidFields[i].closest("td")) {
          position = allInvalidFields[i].closest("td");
        }
      } else if (invalidFieldTagName === "INPUT") {
        message = `Please provide a valid &ldquo;${labelText}&rdquo;`;
      } else if (invalidFieldTagName === "SELECT") {
        message = `Please select a valid &ldquo;${labelText}&rdquo;`;
      } else if (
        invalidFieldTagName === "TEXTAREA" &&
        labelText !== "Write a few words about youself"
      ) {
        message = `Please provide a small &ldquo;${labelText}&rdquo;`;
      } else {
        message = `Please provide a small &ldquo;Bio&rdquo;`;
      }

      // Show the validation message
      UICtrl.showFormValidationMessages(position, message);
    }
  };

  const sortTable = function(e) {
    /* TOGGLE THE SORT ICON SYMBOL OF SELECTED COLUMN
     * ----------------------------------------------- */
    const header = e.target.closest("th");
    const iconArrow = header.querySelector("i");
    if (iconArrow.classList.contains("fa-angle-down")) {
      iconArrow.className = "fas fa-angle-up";
    } else {
      iconArrow.className = "fas fa-angle-down";
    }

    /* FIND THE RIGHT COLUMN TO SORT
     * ----------------------------------------------- */
    const headers = e.target.closest("tr").children;
    const selectedHeaderTitle = header.textContent;
    let index = 0;
    let columnIndex;

    for (const key of headers) {
      if (key.textContent === selectedHeaderTitle) {
        // Get the selected column index
        columnIndex = index - 1;
      }
      index++;
    }

    /* SORT THE TABLE COLUMN
     * ----------------------------------------------- */
    const table = e.target.closest("table");
    UICtrl.sortTableColumn(table, columnIndex);
  };

  const switchTableChecboxes = function(e) {
    const header = e.target.closest("th");

    if (e.target.type === "checkbox") {
      /* GATHER FUNCTION PARAMETERS
       * ----------------------------------------------- */
      const headerCheckbox = header.querySelector("input[type='checkbox']");

      const table = e.target.closest("table");
      const rowCheckboxes = table.querySelectorAll(
        UISelectors.tableRowCheckbox
      );

      const form = e.target.closest("form");
      const switchButton = form.querySelector(UISelectors.switchButton);

      // -------- SWITCH TABLE CHECKBOXES --------
      UICtrl.switchChekboxes(headerCheckbox, rowCheckboxes, switchButton);
    }
  };

  const switchTableRowCheckbox = function(e) {
    if (e.target.type === "checkbox") {
      /* GATHER FUNCTION PARAMETERS
       * ----------------------------------------------- */
      const table = e.target.closest("table");
      const rowCheckboxes = table.querySelectorAll(
        UISelectors.tableRowCheckbox
      );

      const form = e.target.closest("form");
      const switchButton = form.querySelector(UISelectors.switchButton);

      // -------- SWITCH TABLE CHECKBOXES --------
      UICtrl.switchChekbox(rowCheckboxes, switchButton);
    }
  };

  const disableSelectedTableRows = function(e) {
    const triggerModalButton = e.target;
    /* GET THE TABLE IDS WHICH WILL BE COMPARED
     * ----------------------------------------------- */
    const form = triggerModalButton.closest("form");
    const tableID = form.querySelector("table").getAttribute("id");
    const modalTableID = document
      .querySelector(UISelectors.cardModuleSelectionTable)
      .getAttribute("id");

    /* GET CHECKBOXES FROM THE TABLES
     * ----------------------------------------------- */
    const tableCheckboxes = document.querySelectorAll(
      `#${tableID} tbody .custom-control-input`
    );
    const modalTableCheckboxes = document.querySelectorAll(
      `#${modalTableID} tbody .custom-control-input`
    );

    /* DISABLE MODAL TABLE ROWS
     * ----------------------------------------------- */
    tableCheckboxes.forEach(tableCheckbox => {
      modalTableCheckboxes.forEach(modalTableCheckbox => {
        if (tableCheckbox.value === modalTableCheckbox.value) {
          // Disable Row Chekbox
          modalTableCheckbox.setAttribute("disabled", "");

          // Grey Row
          let tr = modalTableCheckbox.closest("tr");
          tr.classList.add("text-muted");
        }
      });
    });
  };

  /* PUBLIC METHODS
   * ================================ */
  return {
    // Initialize Events
    init: function() {
      console.log("Student events is running...");
    }
  };
})(UICtrl);

/* ================================================
 * INITIALIZE APP
 * ================================================ */
App.init();
