// Click "Profile" link on "dashboard/faculty-or-student" url
const profileClick = function() {
  window.onload = function() {
    document.getElementById("profile-list").click();
  };
};

// Click "Dashboard" link on on "dashboard/faculty-or-student" url
const dashboardClick = function() {
  window.onload = function() {
    document.getElementById("dashboard-list").click();
  };
};

// Click "Courseworks Calendar" link on on "dashboard/faculty" url
const courseworksCalendarClick = function() {
  window.onload = function() {
    document.getElementById("dashboard-list").click();
    document.getElementById("courseworksCalendarLink").click();
  };
};

// Click "Courses" link on on "dashboard/faculty-or-student" url
const coursesClick = function() {
  window.onload = function() {
    document.getElementById("course-list").click();
  };
};

// Click "Modules" link on on "dashboard/faculty-or-student" url
const modulesClick = function() {
  window.onload = function() {
    document.getElementById("module-list").click();
  };
};

const disableElement = function(className) {
  const element = document.querySelector(className);
  element.classList.add("icon--disabled");
};

// ======== UI CONTROLER ========
const UICtrl = (function() {
  /* ========================
   * PRIVATE VAR & METHODS
   * ======================== */
  // ======== GATHER UI SELECTORS ========
  const UISelectors = {
    // -------- COURSES FORM --------
    coursesForm: "#coursesForm",
    coursesTable: "#coursesTable",
    coursesTableBody: "#coursesTable tbody",
    coursesTableColumnTitle: "#coursesTable .sort-title",
    coursesTableColumnLevel: "#coursesTable .sort-level",
    coursesCheckBoxAll: "#coursesTable thead input[type='checkbox']",
    coursesCheckBoxes: "#coursesTable tbody .custom-control-input",
    triggerDeleteCoursesModalBtn: "#triggerDeleteCoursesModalBtn",
    deleteCourseBtn: "#deleteCourseBtn",
    // ---- Edit Course Form Modal----
    editCourseForm: "#editCourseModal form",
    editCourseName: "#editCourseName",
    editCourseLevel: "#editCourseLevel",
    editCourseColor: "#editCourseColor",
    // ---- Delete Courses Form Modal ----
    deleteCoursesModal: "#deleteCoursesModal",
    cancelDeleteCoursesModalBtn: "#cancelDeleteCoursesModalBtn",
    deleteCoursesModalBtn: "#deleteCoursesModalBtn",

    // ---- Create Course Form Modal----
    saveCourseBtn: "#saveCourseBtn",

    // -------- MODULES FORM --------
    modulesForm: "#modulesForm",
    modulesTable: "#modulesTable",
    modulesTableBody: "#modulesTable tbody",
    modulesTableColumnTitle: "#modulesTable .sort-title",
    modulesTableColumnCourse: "#modulesTable .sort-course",
    modulesTableColumnLevel: "#modulesTable .sort-level",
    modulesCheckBoxAll: "#modulesTable thead input[type='checkbox']",
    modulesCheckboxes: "#modulesTable tbody .custom-control-input",
    triggerDeleteModulesModalBtn: "#triggerDeleteModulesModalBtn",
    deleteModuleBtn: "#deleteModuleBtn",
    // ---- Edit Module Form Modal----
    editModuleForm: "#editModuleModal form",
    editModuleName: "#editModuleName",
    editModuleCourseName: "#editModuleCourseName",
    editModuleColor: "#editModuleColor",
    // ---- Delete Modules Form Modal ----
    deleteModulesModal: "#deleteModulesModal",
    cancelDeleteModulesModalBtn: "#cancelDeleteModulesModalBtn",
    deleteModulesModalBtn: "#deleteModulesModalBtn",

    // -------- DASHBOARD FORM --------
    dashboardMessages: "#dashboard .alertMessages",
    // ------------ Modules List Tab ------------
    // -------- Form --------
    // taughtModulesForm: "#taughtModulesForm",
    // ---- "Taught Modules" Table ----
    d_mlt_taughtModulesTable: "#taughtModulesTable",
    d_mlt_taughtModulesTableBody: "#taughtModulesTable tbody",
    d_mlt_taughtModulesTableColumnTitle: "#taughtModulesTable .sort-title",
    d_mlt_taughtModulesTableColumnCourse: "#taughtModulesTable .sort-course",
    d_mlt_taughtModulesTableColumnLevel: "#taughtModulesTable .sort-level",
    d_mlt_taughtModulesCheckboxAll:
      "#taughtModulesTable thead input[type='checkbox']",
    // ---- Buttons ----
    d_mlt_triggerModalDeleteTaughtModulesBtn:
      "#triggerModalDeleteTaughtModulesBtn",
    d_mlt_deleteTaughtModulesBtn: "#deleteTaughtModulesBtn",
    d_mlt_triggerModalAddTaughtModuleBtn: "#triggerModalAddTaughtModuleBtn",
    // -------- Add "Taught Modules" Modal --------
    // ---- "Modules" Table ----
    d_mlt_atm_m_modulesTable: "#modulesTableModal",
    d_mlt_atm_m_modulesTableBody: "#modulesTableModal tbody",
    d_mlt_atm_m_modulesTableColumnTitle: "#modulesTableModal .sort-title",
    d_mlt_atm_m_modulesTableColumnCourse: "#modulesTableModal .sort-course",
    d_mlt_atm_m_modulesTableColumnLevel: "#modulesTableModal .sort-level",
    d_mlt_atm_m_modulesCheckboxAll:
      "#modulesTableModal thead input[type='checkbox']",
    // -------- Delete "Taught Modules" Modal --------
    d_mlt_dtm_m_deleteTaughtModules: "#deleteTaughtModulesModal",
    // ---- Buttons ----
    d_mlt_dtm_m_cancelDeleteTaughtModulesBtn:
      "#cancelDeleteTaughtModulesModalBtn",
    d_mlt_dtm_m_deleteTaughtModulesBtn: "#deleteTaughtModulesModalBtn",
    // ------------ Courseworks Calendar Tab ------------
    // -------- Form --------
    courseworksForm: "#courseworksForm",
    // ---- "Courseworks" Table ----
    courseworksCalendarTabTable: "#d-cct-courseworksTable",
    d_cct_courseworksTableBody: "#d-cct-courseworksTable tbody",
    d_cct_courseworksTableColumnModule: "#d-cct-courseworksTable .sort-modules",
    d_cct_courseworksTableColumnDueDate:
      "#d-cct-courseworksTable .sort-dueDate",
    d_cct_courseworksCheckboxAll:
      "#d-cct-courseworksTable thead input[type='checkbox']",
    d_cct_courseworksSaveBtns: "#d-cct-courseworksTable tbody .btn-success",
    // ---- Buttons ----
    d_cct_deleteCourseworksBtn: "#d-cct-f-deleteCourseworksBtn",
    d_cct_triggerModalAddCourseworksBtn:
      "#d-cct-f-triggerModalAddCourseworksBtn",
    // -------- Add Courseworks Modal --------
    // d_cct_ac_m_taughtModulesTable: "#d_cct_ac_m_taughtModulesTable",
    // ---- "Taught Modules" Table ----
    addCourseworksModalTable: "#d_cct_ac_m_taughtModulesTable",
    d_cct_ac_m_taughtModulesTableBody: "#d_cct_ac_m_taughtModulesTable tbody",
    d_cct_ac_m_taughtModulesTableColumnTitle:
      "#d_cct_ac_m_taughtModulesTable .sort-title",
    d_cct_ac_m_taughtModulesCheckboxAll:
      "#d_cct_ac_m_taughtModulesTable thead input[type='checkbox']",
    d_cct_ac_m_addCourseworksBtn: "#addCourseworksBtn"
    // // -------- Delete "Courseworks" Modal --------
    // d_cct_dc_m_deleteCourseworks: "#deleteTaughtModulesModal",
    // // ---- Buttons ----
    // d_cct_dc_m_cancelDeleteCourseworksBtn:
    //   "#cancelDeleteTaughtModulesModalBtn",
    // d_cct_dc_m_deleteCourseworksBtn: "#deleteTaughtModulesModalBtn",
  };

  /* ========================
   * PUBLIC METHODS
   * ======================== */
  return {
    // ======== GET UI SELECTORS ========
    getUISelectors: function() {
      return UISelectors;
    },
    // ================ Forms ================
    fillInEditCourseModalForm: function(
      action,
      title,
      level,
      color,
      description
    ) {
      document
        .querySelector(UISelectors.editCourseForm)
        .setAttribute("action", action);

      // Course Name
      document.querySelector(UISelectors.editCourseName).value = title;

      // Academic Degree
      document.querySelector(UISelectors.editCourseLevel).value = level;

      // Color
      document.querySelector(UISelectors.editCourseColor).value = color;

      // -------- Description --------
      // Refresh CKEditor in order to update it's content without refresh the page
      CKEDITOR.instances.editCourseDescription.setData(description, {
        callback: function() {
          this.checkDirty(); // true
        }
      });
    },
    fillInEditModuleModalForm: function(
      action,
      title,
      course,
      level,
      color,
      description
    ) {
      document
        .querySelector(UISelectors.editModuleForm)
        .setAttribute("action", action);

      // Module Name
      document.querySelector(UISelectors.editModuleName).value = title;

      // -------- Course Name --------
      const selectList = document.querySelector(
        UISelectors.editModuleCourseName
      );
      for (const key of selectList) {
        if (key.innerText === `${course}-${level}`) {
          document.querySelector(
            UISelectors.editModuleCourseName
          ).value = `${key.value}`;
        }
      }

      // Color
      document.querySelector(UISelectors.editModuleColor).value = color;

      // -------- Description --------
      // Refresh CKEditor in order to update it's content without refresh the page
      CKEDITOR.instances.editModuleDescription.setData(description, {
        callback: function() {
          this.checkDirty(); // true
        }
      });
    },
    // Deletion Functionality
    populateDeletionData: function(listData, formID) {
      // ======== Create Html Inputs To Insert In The Courses Form ========
      // ---- Built Input Elements For Data Input Ids ----
      // Initialize elements vars
      let inputs = "";

      // Create inputs
      let itemArray = [],
        id = "";
      listData.forEach(function(item) {
        id = item.getAttribute("data-id");
        // Building html code
        inputs += `<input type="text" name="ids" id="${id}" class="d-none" value="${id}"></input>`;
      });

      // ---- Built Div Element To Wrap Inputs ----
      // Create div element
      const div = document.createElement("div");
      // Add class to div
      div.className = "dataIDForDelete";
      // Add inputs to div
      div.innerHTML = `${inputs}`;

      // ======== Insert Html Elements ========
      // -------- Gather The Form IDs --------
      const coursesFormID = document.querySelector(UISelectors.coursesForm).id;
      const modulesFormID = document.querySelector(UISelectors.modulesForm).id;

      // -------- Insert inputs --------
      if (formID === coursesFormID) {
        // Insert inputs in "Courses" form
        document
          .querySelector(UISelectors.coursesForm)
          .insertAdjacentElement("beforeend", div);
      } else if (formID === modulesFormID) {
        // Insert inputs in "Modules" form
        document
          .querySelector(UISelectors.modulesForm)
          .insertAdjacentElement("beforeend", div);
      }
    },
    // ---------------- Tables ----------------
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
    getModalTableID: function(tableID) {
      // Gather UI Selector IDs
      const taughtModulesModulesTabTable = document.querySelector(
        UISelectors.d_mlt_taughtModulesTable
      ).id;
      const addTaughtModulesModalTable = document.querySelector(
        UISelectors.d_mlt_atm_m_modulesTable
      ).id;
      const courseworksCalendarTable = document.querySelector(
        UISelectors.courseworksCalendarTabTable
      ).id;
      const addCourseworksModalTable = document.querySelector(
        UISelectors.addCourseworksModalTable
      ).id;

      // Get the table which will be compared
      if (tableID === taughtModulesModulesTabTable) {
        tableAllElementsID = addTaughtModulesModalTable;
      }
      // Get the table which will be compared
      if (tableID === courseworksCalendarTable) {
        tableAllElementsID = addCourseworksModalTable;
      }

      return tableAllElementsID;
    },
    getCheckBoxes: function(tableID) {
      // Gather all checkboxes according to the table
      const checkboxes = document.querySelectorAll(
        `${tableID} tbody .custom-control-input`
      );

      return checkboxes;
    },
    getDates: function(tableID) {
      // Gather all dates according to the table
      const dates = document.querySelectorAll(
        `${tableID} tbody input[type="date"]`
      );

      return dates;
    },
    getTableDeleteElements: function(modalID) {
      // -------- Gather The Modals IDs --------
      const coursesModalID = document.querySelector(
        UISelectors.deleteCoursesModal
      ).id;
      const modulesModalID = document.querySelector(
        UISelectors.deleteModulesModal
      ).id;
      const taughtModulesModalID = document.querySelector(
        UISelectors.d_mlt_dtm_m_deleteTaughtModules
      ).id;

      // ======== Gather All Necessary Elements ========
      let tableID;
      if (modalID === coursesModalID) {
        // -------- Get the "Courses" table elements --------
        // Get the checkbox "check all" element
        checkboxCheckAll = document.querySelector(
          UISelectors.coursesCheckBoxAll
        );
        // ---- Gather all checkboxes ----
        tableID = document.querySelector(UISelectors.coursesTable).id;
        checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);
        // Get the trigger "Delete" courses button
        triggerDeleteBtn = document.querySelector(
          UISelectors.triggerDeleteCoursesModalBtn
        );
        // Get the "Delete" courses button
        deleteBtn = document.querySelector(UISelectors.deleteCourseBtn);
      } else if (modalID === modulesModalID) {
        // -------- Get the "Modules" table elements --------
        // Get the checkbox "check all" element
        checkboxCheckAll = document.querySelector(
          UISelectors.modulesCheckBoxAll
        );
        // ---- Gather all checkboxes ----
        tableID = document.querySelector(UISelectors.modulesTable).id;
        checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);
        // Get the trigger "Delete" modules button
        triggerDeleteBtn = document.querySelector(
          UISelectors.triggerDeleteModulesModalBtn
        );
        // Get the "Delete" courses button
        deleteBtn = document.querySelector(UISelectors.deleteModuleBtn);
      } else if (modalID === taughtModulesModalID) {
        // -------- Get the "Taught Modules" table elements --------
        // Get the checkbox "check all" element
        checkboxCheckAll = document.querySelector(
          UISelectors.d_mlt_taughtModulesCheckboxAll
        );
        // ---- Gather all checkboxes ----
        tableID = document.querySelector(UISelectors.d_mlt_taughtModulesTable)
          .id;
        checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);
        // Get the trigger "Delete" modules button
        triggerDeleteBtn = document.querySelector(
          UISelectors.d_mlt_triggerModalDeleteTaughtModulesBtn
        );
        // Get the "Delete" courses button
        deleteBtn = document.querySelector(
          UISelectors.d_mlt_deleteTaughtModulesBtn
        );
      }

      return {
        checkboxCheckAll,
        checkboxes,
        triggerDeleteBtn,
        deleteBtn
      };
    },
    checkUncheckCheckboxes: function(
      checkAllCheckbox,
      checkboxes,
      triggerButton
    ) {
      if (checkAllCheckbox.checked) {
        checkboxes.forEach(function(checkbox) {
          // Check all if not disabled
          if (checkbox.disabled === false) {
            checkbox.checked = true;
            triggerButton.disabled = false;
          }
        });
      } else {
        // Uncheck all if disabled
        checkboxes.forEach(function(checkbox) {
          checkbox.checked = false;
          triggerButton.disabled = true;
        });
      }
    },
    resetDeletion: function(deleteElements) {
      // Uncheck check all checkbox element
      if (deleteElements.checkboxCheckAll.checked === true) {
        checkboxCheckAll.checked = false;
      }

      // Uncheck all ckeckbox elements
      deleteElements.checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
        deleteElements.triggerDeleteBtn.disabled = true;
      });
    },
    getTriggerBtn: function(buttons) {
      // Convert to array
      const values = Object.values(buttons);

      // Get the trigger button
      let button;
      let trigger;
      values.forEach(item => {
        trigger = item.getAttribute("data-trigger");
        if (trigger) {
          button = document.querySelector(`#${item.id}`);
        }
      });

      return button;
    },
    showAlertMessage: function(alert, position) {
      if (alert.type === "success") {
        // --- Built & Insert An Alert ----
        const div = document.createElement("div");
        div.className = "alert alert-success mt-3 mb-n3 mx-4";
        div.innerHTML = `${alert.message}`;
        position.insertAdjacentElement("beforeend", div);
      }

      /**
       * In this way the "alert" time out seems to start again with the 
       * click of the last coursework update
       */
      // Show only the alert of last update coursework 
      const alerts = position.children;
      if(alerts.length > 1) {
        let counter = 1;
        for(alertItem of alerts) {
          if (counter < alerts.length) {
            alertItem.classList.add("d-none");
          }
          counter++;
        }
      }

      // Alert timeout
      setTimeout(function() {
        position.firstElementChild.remove();
      }, 5000);
    },
    updateData: async function(data, path) {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
      const response = await fetch(path, options);
      return response.json();
    },
    OnOffButton: function(elements, button) {
      // Initialize vars
      let displayElement = false;
      let disableElement = true;
      let typeButton = false;
      let typeCheckbox = false;

      for (const element of elements) {
        if (element.type === "button") {
          typeButton = true;
          if (!element.classList.contains("d-none")) {
            displayElement = true;
            break;
          }
        }
        if (element.type === "checkbox") {
          typeCheckbox = true;
          if (element.checked === true) {
            disableElement = false;
            break;
          }
        }
      }

      if (typeCheckbox) {
        if (disableElement) {
          button.setAttribute("disabled", "");
        } else {
          button.removeAttribute("disabled");
        }
      } else if (typeButton) {
        if (displayElement) {
          button.setAttribute("disabled", "");
        } else {
          button.removeAttribute("disabled");
        }
      }
    },
    disableModalTableCheckboxRows: function(
      modalTableCheckboxes,
      targetTableCheckboxes
    ) {
      // In case of the table has checkboxes
      let targetTableCheckboxID;
      targetTableCheckboxes.forEach(checkbox => {
        targetTableCheckboxID = checkbox.value;
        modalTableCheckboxes.forEach(modalTableCheckbox => {
          if (targetTableCheckboxID === modalTableCheckbox.value) {
            // Disable checkbox
            modalTableCheckbox.setAttribute("disabled", "");

            // ---- Disable row ----
            let tr =
              modalTableCheckbox.parentElement.parentElement.parentElement;
            tr.classList.add("text-muted");
          }
        });
      });
    },
    disableModalTableInputDatesRow: function(
      targetTableCheckboxes,
      modalTableInputDateElements
    ) {
      let targetTableTaughtModuleID;
      let targetTableDateText;
      targetTableCheckboxes.forEach(checkbox => {
        targetTableTaughtModuleID = checkbox.value;
        targetTableDateText =
          checkbox.parentElement.parentElement.previousElementSibling
            .previousElementSibling.firstElementChild.innerText;

        /**
         * Match the rows of two tables and then hide the "input date",
         * display the "date text" & disable the row
         */
        modalTableInputDateElements.forEach(inputDate => {
          let modalTableDateText =
            inputDate.parentElement.previousElementSibling;
          let modalTableInputDate = inputDate;
          if (
            targetTableTaughtModuleID === inputDate.getAttribute("data-id") &&
            modalTableDateText.innerText !== ""
          ) {
            // Update & Display date text
            modalTableDateText.innerText = targetTableDateText;
            modalTableDateText.classList.remove("d-none");

            // Hide input date
            modalTableInputDate.parentElement.classList.add("d-none");

            // ---- Disable row ----
            // UICtrl.disableDateRows(inputDate);
            const tr = inputDate.parentElement.parentElement.parentElement;
            tr.classList.add("text-muted");
          }
        });
      });
    },
    enableModalSubmitButton: function(table, button) {
      // Enable modal submit button
      for (let i = 0; i < table.length; i++) {
        const tr = table[i].parentElement.parentElement.parentElement;
        if (tr.classList.contains("text-muted") === false) {
          // Enable button
          button.removeAttribute("disabled");
          break;
        }
      }
    }
    // addNewElement: function(newElement, parentElementID, position, html) {
    //   // Add HTML
    //   newElement.innerHTML = html;
    //   document
    //     .querySelector(parentElementID)
    //     .insertAdjacentElement(position, newElement);
    // },
    // removeElement: function(elementID) {
    //   // Removes an element from the document
    //   const element = document.getElementById(elementID);
    //   element.parentNode.removeChild(element);
    // }
  };
})();

// ======== APPLICATION CONTROLER ========
const App = (function(UICtrl) {
  /* ========================
   * PRIVATE VAR & METHODS
   * ======================== */

  // ======== LOAD EVENT LISTENERS ========
  const loadEventListeners = function() {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // ---------------- TABLE EVENT LISTENERS ----------------
    // -------- Check/Unckeck All Table Rows --------
    // "Courses" form -> ("Courses" table)
    document
      .querySelector(UISelectors.coursesCheckBoxAll)
      .addEventListener("click", checkUncheckAll);

    // "Modules" form -> ("Modules" table)
    document
      .querySelector(UISelectors.modulesCheckBoxAll)
      .addEventListener("click", checkUncheckAll);

    // "Dashboard" -> "Modules List" tab -> ("Taught Modules" table)
    document
      .querySelector(UISelectors.d_mlt_taughtModulesCheckboxAll)
      .addEventListener("click", checkUncheckAll);

    // "Dashboard" -> "Add Modules" modal -> ("Modules" table)
    document
      .querySelector(UISelectors.d_mlt_atm_m_modulesCheckboxAll)
      .addEventListener("click", checkUncheckAll);

    // "Dashboard" -> "Courseworks Calendar" -> ("Courseworks" table)
    document
      .querySelector(UISelectors.d_cct_courseworksCheckboxAll)
      .addEventListener("click", checkUncheckAll);

    // -------- Check/Unckeck A Selected Table Row --------
    // "Courses" form -> ("Courses" table)
    document
      .querySelector(UISelectors.coursesTableBody)
      .addEventListener("click", checkUncheckRow);

    // "Modules" form -> ("Modules" table)
    document
      .querySelector(UISelectors.modulesTableBody)
      .addEventListener("click", checkUncheckRow);

    // "Dashboard" -> "Modules List" tab -> ("Taught Modules" table)
    document
      .querySelector(UISelectors.d_mlt_taughtModulesTableBody)
      .addEventListener("click", checkUncheckRow);

    // "Dashboard" -> "Add Modules" modal form -> ("Modules" table)
    document
      .querySelector(UISelectors.d_mlt_atm_m_modulesTableBody)
      .addEventListener("click", checkUncheckRow);

    // "Dashboard" -> "Courseworks Calendar" tab -> ("Courseworks" table)
    document
      .querySelector(UISelectors.d_cct_courseworksTableBody)
      .addEventListener("click", checkUncheckRow);

    // -------------------- Sort Table --------------------
    // ---- Sort "Courses" form -> ("Courses" table) ----
    // Sort Title column
    document
      .querySelector(UISelectors.coursesTableColumnTitle)
      .addEventListener("click", sortTable);

    // Sort "Level" column
    document
      .querySelector(UISelectors.coursesTableColumnLevel)
      .addEventListener("click", sortTable);

    // ---- Sort "Modules" form -> ("Modules" table) ----
    // Sort Title column
    document
      .querySelector(UISelectors.modulesTableColumnTitle)
      .addEventListener("click", sortTable);

    // Sort "Course" column
    document
      .querySelector(UISelectors.modulesTableColumnCourse)
      .addEventListener("click", sortTable);

    // Sort "Level" column
    document
      .querySelector(UISelectors.modulesTableColumnLevel)
      .addEventListener("click", sortTable);

    // --- Sort "Dashboard" -> "Modules List" tab -> ("Taught Modules" table) ---
    // Sort Title column
    document
      .querySelector(UISelectors.d_mlt_taughtModulesTableColumnTitle)
      .addEventListener("click", sortTable);

    // Sort "Course" column
    document
      .querySelector(UISelectors.d_mlt_taughtModulesTableColumnCourse)
      .addEventListener("click", sortTable);

    // Sort "Level" column
    document
      .querySelector(UISelectors.d_mlt_taughtModulesTableColumnLevel)
      .addEventListener("click", sortTable);

    // --- Sort "Dashboard" -> "Add Taught Modules" modal -> ("Modules" table) ---
    // Sort Title column
    document
      .querySelector(UISelectors.d_mlt_atm_m_modulesTableColumnTitle)
      .addEventListener("click", sortTable);

    // Sort "Course" column
    document
      .querySelector(UISelectors.d_mlt_atm_m_modulesTableColumnCourse)
      .addEventListener("click", sortTable);

    // Sort "Level" column
    document
      .querySelector(UISelectors.d_mlt_atm_m_modulesTableColumnLevel)
      .addEventListener("click", sortTable);

    // --- Sort "Dashboard" -> "Courseworks Calendar" tab -> ("Courseworks" table) ---
    // Sort Modules column
    document
      .querySelector(UISelectors.d_cct_courseworksTableColumnModule)
      .addEventListener("click", sortTable);

    // Sort "Due Date" column
    document
      .querySelector(UISelectors.d_cct_courseworksTableColumnDueDate)
      .addEventListener("click", sortTable);

    // --- Sort "Dashboard" -> "Add Courseworks" modal -> ("Taught Modules" table) ---
    // Sort Title column
    document
      .querySelector(UISelectors.d_cct_ac_m_taughtModulesTableColumnTitle)
      .addEventListener("click", sortTable);

    // ---------------- Disable Table Row/Rows ----------------
    // "Dashboard" -> "Add Modules" modal -> ("Modules" table)
    document
      .querySelector(UISelectors.d_mlt_triggerModalAddTaughtModuleBtn)
      .addEventListener("click", disableRows);

    // "Dashboard" -> "Add Courseworks" modal -> ("Taught Modules" table)
    document
      .querySelector(UISelectors.d_cct_triggerModalAddCourseworksBtn)
      .addEventListener("click", disableRows);

    // -------------------- Edit Table Row --------------------
    // "Courses" form -> "Courses" table -> ("Edit" Button)
    document
      .querySelector(UISelectors.coursesTableBody)
      .addEventListener("click", editCourse);

    // "Modules" form -> "Modules" table -> ("Edit" Button)
    document
      .querySelector(UISelectors.modulesTableBody)
      .addEventListener("click", editModule);

    // --- Sort "Dashboard" -> "Courseworks Calendar" tab -> ("Courseworks" table) ---
    document
      .querySelector(UISelectors.d_cct_courseworksTableBody)
      .addEventListener("click", editCoursework);

    document
      .querySelector(UISelectors.d_cct_courseworksTableBody)
      .addEventListener("click", saveDateCoursework);

    // ---------------- Delete Table Row/Rows ----------------
    // -------- "Delete Courses" modal --------
    // "No" Button
    document
      .querySelector(UISelectors.cancelDeleteCoursesModalBtn)
      .addEventListener("click", cancelDeletion);

    // "Yes" Button
    document
      .querySelector(UISelectors.deleteCoursesModalBtn)
      .addEventListener("click", confirmDeletion);

    // -------- "Delete Modules" modal --------
    // "No" Button
    document
      .querySelector(UISelectors.cancelDeleteModulesModalBtn)
      .addEventListener("click", cancelDeletion);

    // "Yes" Button
    document
      .querySelector(UISelectors.deleteModulesModalBtn)
      .addEventListener("click", confirmDeletion);

    // -------- "Delete Taught Modules" modal --------
    // "No" Button
    document
      .querySelector(UISelectors.d_mlt_dtm_m_cancelDeleteTaughtModulesBtn)
      .addEventListener("click", cancelDeletion);

    // "Yes" Button
    document
      .querySelector(UISelectors.d_mlt_dtm_m_deleteTaughtModulesBtn)
      .addEventListener("click", confirmDeletion);

    // // ---- Enable/Disable "Plus" button when date element has value  ----
    // // "Dashboard" -> "Courseworks" tab -> ("Add Courseworks" modal)
    // document
    //   .querySelector(UISelectors.d_cct_ac_m_taughtModulesTable)
    //   .addEventListener("change", enableDisableBtn);
  };

  // ======================== EVENTS ========================
  // ---------------- TABLE EVENT LISTENERS ----------------
  // Check/Unckeck All Table Rows
  const checkUncheckAll = function(e) {
    // -------- Gather All Necessary Elements --------
    // Get the target element
    checkAllCheckbox = e.target;

    // Get the table id according to the target element
    const tableID =
      checkAllCheckbox.parentElement.parentElement.parentElement.parentElement
        .parentElement.id;

    // Gather all checkboxes from UI table
    const checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);

    // Gather all buttons which are on the form's bottom
    const buttons =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.nextElementSibling.children;

    // Get the trigger(enable/disable) button
    const triggerButton = UICtrl.getTriggerBtn(buttons);

    // -------- Check/Uncheck Checkboxes --------
    UICtrl.checkUncheckCheckboxes(checkAllCheckbox, checkboxes, triggerButton);
  };

  // Check/Unckeck A Selected Table Row
  const checkUncheckRow = function(e) {
    if (e.target.classList.contains("custom-control-input")) {
      // -------- Gather All Necessary Elements --------
      // Get the table id according to the target element
      const tableID =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.id;

      // Gather all checkboxes from UI table
      const checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);

      // Gather all buttons which are on the form's bottom
      const buttons =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.parentElement.nextElementSibling.children;

      // Get the trigger(enable/disable) button
      const triggerButton = UICtrl.getTriggerBtn(buttons);

      // -------- Disable/Enable trigger button --------
      UICtrl.OnOffButton(checkboxes, triggerButton);
    }
  };

  // Sort Table
  const sortTable = function(e) {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // ------------ FIND WHICH IS THE SELECTED COLUMN TO SORT ------------
    // -------- Gather the variables needed --------
    // Initialising variables
    let columnNameElements;
    let selectedColumnClassName;
    let sortIconClassName;
    let sortIconElement;
    let table; //The table which is gonna be sorted

    if (e.target.classList.contains("fas")) {
      // If the target is the column's title sort icon (arrow "down" or "up")
      columnNameElements = e.target.parentElement.parentElement.children;
      selectedColumnClassName = e.target.parentElement.className;
      sortIconClassName = e.target.className;
      sortIconElement = e.target;
      table = e.target.parentElement.parentElement.parentElement.parentElement;
    } else {
      // If the target is column title
      columnNameElements = e.target.parentElement.children;
      selectedColumnClassName = e.target.className;
      sortIconClassName = e.target.children[0].className;
      sortIconElement = e.target.children[0];
      table = e.target.parentElement.parentElement.parentElement;
    }

    // -------- Find The Column Title To Sort --------
    let index = 0;
    let columnIndex;
    for (const key of columnNameElements) {
      if (key.className === selectedColumnClassName) {
        // Get the selected column index
        columnIndex = index - 1;
      }
      index++;
    }

    // -------- CHANGE THE SORT ICON SYMBOL OF SELECTED COLUMN --------
    if (sortIconClassName === "fas fa-angle-down") {
      sortIconElement.className = "fas fa-angle-up";
    } else {
      sortIconElement.className = "fas fa-angle-down";
    }

    // -------- SORT THE TABLE'S COLUMN --------
    UICtrl.sortTableColumn(table, columnIndex);
  };

  // ---------------- Disable Table Row/Rows ----------------
  const disableRows = function(e) {
    // ---- Get The Tables Which Will Be Compared ----
    const targetElementsTableID =
      e.target.parentElement.previousElementSibling.children[0].id;

    const modalTableID = UICtrl.getModalTableID(targetElementsTableID);

    // ---- Get Checkboxes From Tables ----
    const modalTableCheckboxes = UICtrl.getCheckBoxes(`#${modalTableID}`);
    const targetTableCheckboxes = UICtrl.getCheckBoxes(
      `#${targetElementsTableID}`
    );

    // ---- Disable Rows From Modal Table ----
    if (modalTableCheckboxes.length > 0) {
      // In case of table has checkboxes
      UICtrl.disableModalTableCheckboxRows(
        modalTableCheckboxes,
        targetTableCheckboxes
      );
    } else {
      // In case of table has input dates elements without checkboxes
      const modalTableDateElements = UICtrl.getDates(`#${modalTableID}`);

      UICtrl.disableModalTableInputDatesRow(
        targetTableCheckboxes,
        modalTableDateElements
      );

      // ---- Enable modal submit button ----
      const UISelectors = UICtrl.getUISelectors();
      const button = document.querySelector(
        UISelectors.d_cct_ac_m_addCourseworksBtn
      );
      UICtrl.enableModalSubmitButton(modalTableDateElements, button);
    }
  };

  // ---------------- Edit Table Row ----------------
  // "Courses" form -> "Courses" table -> ("Edit" Button)
  const editCourse = function(e) {
    // Initilize variables needed
    let title, level, color, description, courseID;

    if (e.target.classList.contains("courseEdit")) {
      // -------- GATHER THE INFO FROM "COURSES" TABLE --------
      // Title
      title =
        e.target.parentElement.parentElement.parentElement.children[1]
          .innerText;

      // Level
      level =
        e.target.parentElement.parentElement.parentElement.children[2]
          .innerText;

      // -------- Color --------
      // Select the text of DOM element & get rid of spaces
      color = e.target.parentElement.parentElement.parentElement.children[3].innerText.match(
        /([\w]+|\"[\w\s]+\")/g
      );
      // Convert the array to string
      color = `#${color.toString()}`;

      // Description
      description =
        e.target.parentElement.parentElement.parentElement.children[4]
          .innerText;

      // Course ID
      courseID = e.target.parentElement.getAttribute("data-id");

      // Set Form Action
      const action = `/dashboards/facultyMember/courses/${courseID}?_method=PUT`;

      // -------- FILL IN THE "EDIT COURSE" MODAL FORM --------
      UICtrl.fillInEditCourseModalForm(
        action,
        title,
        level,
        color,
        description
      );
    }
  };

  // "Modules" form -> "Modules" table -> ("Edit" Button)
  const editModule = function(e) {
    // Initilize variables needed
    let title, course, level, color, description, moduleID;

    if (e.target.classList.contains("moduleEdit")) {
      // -------- GATHER THE INFO FROM "MODULES" TABLE --------
      // Title
      title =
        e.target.parentElement.parentElement.parentElement.children[1]
          .innerText;

      // Course
      course =
        e.target.parentElement.parentElement.parentElement.children[2]
          .innerText;

      // Level
      level =
        e.target.parentElement.parentElement.parentElement.children[3]
          .innerText;

      // -------- Color --------
      // Select the text of DOM element & get rid of spaces
      color = e.target.parentElement.parentElement.parentElement.children[4].innerText.match(
        /([\w]+|\"[\w\s]+\")/g
      );
      // Convert the array to string
      color = `#${color.toString()}`;

      // Description
      description =
        e.target.parentElement.parentElement.parentElement.children[5]
          .innerText;

      // Module ID
      moduleID = e.target.parentElement.getAttribute("data-id");

      // Set Form Action
      const action = `/dashboards/facultyMember/modules/${moduleID}?_method=PUT`;

      // -------- FILL IN THE "EDIT MODULE" MODAL FORM --------
      UICtrl.fillInEditModuleModalForm(
        action,
        title,
        course,
        level,
        color,
        description
      );
    }
  };

  const editCoursework = function(e) {
    if (e.target.classList.contains("courseworkEdit")) {
      // ---- Hide "edit icon" button ----
      const editBtn = e.target.parentElement;
      editBtn.classList.add("d-none");

      // Hide "coursework date" text
      const spanCourseworkDate =
        e.target.parentElement.parentElement.previousElementSibling
          .firstElementChild;
      spanCourseworkDate.classList.add("d-none");

      // Display input date
      const inputDate =
        e.target.parentElement.parentElement.previousElementSibling
          .lastElementChild;
      inputDate.classList.remove("d-none");

      // Display "save icon" button
      const saveBtn = e.target.parentElement.nextElementSibling;
      saveBtn.classList.remove("d-none");

      // ---- Disable "Add Coursework" button ----
      // Get UI Selectors
      const UISelectors = UICtrl.getUISelectors();

      const addCourseworksBtn = document.querySelector(
        UISelectors.d_cct_triggerModalAddCourseworksBtn
      );

      const saveButtons = document.querySelectorAll(
        UISelectors.d_cct_courseworksSaveBtns
      );

      const buttons = Object.values(saveButtons);

      UICtrl.OnOffButton(buttons, addCourseworksBtn);
    }
  };

  const saveDateCoursework = function(e) {
    if (e.target.classList.contains("courseworkDateSave")) {
      // ---- GATHER THE ELEMENTS NEEDED ----
      // Get UI Selectors
      const UISelectors = UICtrl.getUISelectors();
      
      // ---- Get "Faculty Member" id parameter ----
      const form = document.querySelector(UISelectors.courseworksForm);
      let formAction = form.action;
      formAction = formAction.split("/");
      formAction = formAction[6].split("?");
      facultyMemberID = formAction[0];

      let taughtModuleID = e.target.parentElement.getAttribute("data-id");

      const inputDate =
        e.target.parentElement.parentElement.previousElementSibling
          .lastElementChild.firstElementChild;

      const inputDateParentElement =
        e.target.parentElement.parentElement.previousElementSibling;

      const spanDateText = inputDateParentElement.firstElementChild;

      let newCourseworkDate = inputDate.value;

      if (newCourseworkDate) {
        // ---- UPDATE THE DATABASE ----
        // Set the data to be updated
        const data = {
          uiTaughtModuleID: taughtModuleID,
          uiCourseworkDate: newCourseworkDate
        };
        // Set the path
        const path = `/dashboards/facultyMember/courseworks/${facultyMemberID}`;

        // Update data & show update message
        UICtrl.updateData(data, path).then(alert => {
          const position = document.querySelector(
            UISelectors.dashboardMessages
          );
          UICtrl.showAlertMessage(alert, position);
        });

        // ---- SET THE NEW COURSEWORK DATE ----
        // ---- Convert Date Value To English Uk Short Format ----
        const parameters = {
          day: "numeric",
          month: "numeric",
          year: "numeric"
        };
        newCourseworkDate = new Date(newCourseworkDate).toLocaleString(
          "en-GB",
          parameters
        );
        // Set New Coursework Date
        spanDateText.textContent = newCourseworkDate;
      }

      // Hide save button
      const saveBtn = e.target.parentElement;
      saveBtn.classList.add("d-none");

      // Display span text with the new coursework date
      spanDateText.classList.remove("d-none");

      // Hide input date
      const spanInputDate = inputDateParentElement.lastElementChild;
      spanInputDate.classList.add("d-none");

      // Display edit button
      const editBtn = e.target.parentElement.previousElementSibling;
      editBtn.classList.remove("d-none");

      // ---- Enable "Add Courseworks" button ----
      const addCourseworksBtn = document.querySelector(
        UISelectors.d_cct_triggerModalAddCourseworksBtn
      );
      const saveIconButtons = document.querySelectorAll(
        UISelectors.d_cct_courseworksSaveBtns
      );
      const buttons = Object.values(saveIconButtons);
      UICtrl.OnOffButton(buttons, addCourseworksBtn);
    }
  };

  // ------------ Delete Table Row/Rows ------------
  // Cancel Deletion
  const cancelDeletion = function(e) {
    // -------- GATHER THE CHECKBOXES & "DELETE" BUTTON --------
    // Get current modal id
    const targetModalID =
      e.target.parentElement.parentElement.parentElement.parentElement.id;

    // Get checkboxes & "Delete" button
    const deleteElements = UICtrl.getTableDeleteElements(targetModalID);

    // ---- UNCHECK ALL CHECKBOXES & ENABLE "DELETE" BUTTON ----
    UICtrl.resetDeletion(deleteElements);
  };

  // Confirm Deletion
  const confirmDeletion = function(e) {
    // -------- GATHER THE CHECKBOXES & "DELETE" BUTTON --------
    // Get current modal id
    const targetModalID =
      e.target.parentElement.parentElement.parentElement.parentElement.id;

    // Get checkboxes & "Delete" button
    const deleteElements = UICtrl.getTableDeleteElements(targetModalID);

    // -------- CLICK DELETE BUTTON --------
    const deleteBtnID = deleteElements.deleteBtn.id;
    document.querySelector(`#${deleteBtnID}`).click();
  };

  // ------------ Enable/Disable "Plus" button ------------
  // const enableDisableBtn = function(e) {
  //   // -------- Gather All Necessary Elements --------
  //   // Gather all buttons which are on the form's bottom
  //   const buttons =
  //     e.target.parentElement.parentElement.parentElement.parentElement
  //       .parentElement.nextElementSibling.children;

  //   // -------- Enable/Disable Button --------
  //   if (e.target.type === "date") {
  //     // Get all "dates" elements
  //     const tbody =
  //       e.target.parentElement.parentElement.parentElement.localName;
  //     const dates = document.querySelectorAll(`${tbody} input[type='date']`);

  //     // Check if there is any date that has value
  //     let enable = false;
  //     dates.forEach(date => {
  //       if (date.value !== "") {
  //         enable = true;
  //       }
  //     });

  //     if (enable) {
  //       // If there is a date with value eneble button
  //       // Get the trigger(enable/disable) button
  //       const triggerButton = UICtrl.getTriggerBtn(buttons);
  //       triggerButton.disabled = false;
  //     } else {
  //       triggerButton.disabled = true;
  //     }
  //   }
  // };

  /* ========================
   * PUBLIC METHODS
   * ======================== */
  return {
    // Initialize Events
    init: function() {
      console.log("Run...");
      // Load event listeners
      loadEventListeners();
    }
  };
})(UICtrl);

// ======== INITIALIZE APP ========
App.init();
