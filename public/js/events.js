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

// Click "Exams Calendar" link on on "dashboard/faculty" url
const examsCalendarClick = function() {
  window.onload = function() {
    document.getElementById("dashboard-list").click();
    document.getElementById("examsCalendarLink").click();
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
    form_cardCourses: "#formCourses",
    form_cardModules: "#modulesForm",
    form_modalEditCourse: "#editCourseModal form",
    form_modalEditModule: "#editModuleModal form",
    form_modalEditExam: "#editExamModal form",
    form_tabCourseworks: "#courseworksForm",

    tableCheckbox_cardCourses: "#coursesTable",
    tableCheckbox_cardModules: "#modulesTable",
    tableCheckbox_tabModules: "#taughtModulesTable",
    tableCheckbox_tabCourseworks: "#d-cct-courseworksTable",
    tableCheckbox_tabExams: "#d-ect-examsTable",
    tableCheckbox_modalAddTaughtModules: "#modulesTableModal",
    tableDate_modalAddCourseworks: "#d_cct_ac_m_taughtModulesTable",
    tableDate_modalAddExams: "#d_ect_ae_m_taughtModulesTable",

    tableCheckboxBody_cardCourses: "#coursesTable tbody",
    tableCheckboxBody_cardModules: "#modulesTable tbody",
    tableCheckboxBody_tabModules: "#taughtModulesTable tbody",
    tableCheckboxBody_tabCourseworks: "#d-cct-courseworksTable tbody",
    tableCheckboxBody_tabExams: "#d-ect-examsTable tbody",
    tableCheckboxBody_modalAddTaughtModules: "#modulesTableModal tbody",
    // tableDateBody_modalAddCourseworks: "#d_cct_ac_m_taughtModulesTable tbody",

    tableCheckboxColumnTitle_cardCourses: "#coursesTable .sort-title",
    tableCheckboxColumnLevel_cardCourses: "#coursesTable .sort-level",
    tableCheckboxColumnCheckbox_cardCourses:
      "#coursesTable thead input[type='checkbox']",
    tableCheckboxColumnTitle_cardModules: "#modulesTable .sort-title",
    tableCheckboxColumnCourse_cardModules: "#modulesTable .sort-course",
    tableCheckboxColumnLevel_cardModules: "#modulesTable .sort-level",
    tableCheckboxColumnCheckbox_cardModules:
      "#modulesTable thead input[type='checkbox']",
    tableCheckboxColumnTitle_cardModulesSelection:
      "#modulesSelectionTable .sort-title",
    tableCheckboxColumnTitle_tabModules: "#taughtModulesTable .sort-title",
    tableCheckboxColumnCourse_tabModules: "#taughtModulesTable .sort-course",
    tableCheckboxColumnLevel_tabModules: "#taughtModulesTable .sort-level",
    tableCheckboxColumnCheckbox_tabModules:
      "#taughtModulesTable thead input[type='checkbox']",
    tableCheckboxColumnTitle_modalAddTaughtModules:
      "#modulesTableModal .sort-title",
    tableCheckboxColumnCourse_modalAddTaughtModules:
      "#modulesTableModal .sort-course",
    tableCheckboxColumnLevel_modalAddTaughtModules:
      "#modulesTableModal .sort-level",
    tableCheckboxColumnCheckbox_modalAddTaughtModules:
      "#modulesTableModal thead input[type='checkbox']",
    tableCheckboxColumnModule_tabCourseworks:
      "#d-cct-courseworksTable .sort-modules",
    tableCheckboxColumnDueDate_tabCourseworks:
      "#d-cct-courseworksTable .sort-dueDate",
    tableCheckboxColumnCheckbox_tabCourseworks:
      "#d-cct-courseworksTable thead input[type='checkbox']",
    tableDateColumnTitle_modalAddCourseworks:
      "#d_cct_ac_m_taughtModulesTable .sort-title",
    tableCheckboxColumnModules_tabExams: "#d-ect-examsTable .sort-modules",
    tableCheckboxColumnDate_tabExams: "#d-ect-examsTable .sort-date",
    tableCheckboxColumnTime_tabExams: "#d-ect-examsTable .sort-time",
    tableCheckboxColumnClassroom_tabExams: "#d-ect-examsTable .sort-classroom",
    tableCheckboxColumnCheckbox_tabExams:
      "#d-ect-examsTable thead input[type='checkbox']",

    inputTextName_modalEditCourse: "#editCourseName",
    inputSelectDegree_modalEditCourse: "#editCourseLevel",
    inputColor_modalEditCourse: "#editCourseColor",
    inputTextName_modalEditModule: "#editModuleName",
    inputSelectCourse_modalEditModule: "#editModuleCourseName",
    inputColor_modalEditModule: "#editModuleColor",
    inputTextName_modalEditExam: "#editExamTaughtModuleName",
    inputDate_modalEditExam: "#editExamDate",
    inputTime_modalEditExam: "#editExamTime",
    inputTextClassroom_modalEditExam: "#editExamClassroom",
    inputTextTaughtModuleId_modalEditExam: "#editExamTaughtModuleId",

    btnAddTaughtModules_tabModules: "#triggerModalAddTaughtModuleBtn",
    btnAddCourseworks_tabCourseworks: "#d-cct-f-triggerModalAddCourseworksBtn",
    btnAddExams_tabExams: "#d-ect-f-triggerModalAddExamsBtn",

    btnDelete_cardCourses: "#triggerDeleteCoursesModalBtn",
    btnDelete_cardModules: "#triggerDeleteModulesModalBtn",
    btnDelete_tabModules: "#triggerModalDeleteTaughtModulesBtn",
    // btnDelete_cardCourseworksTab: "#d-cct-f-deleteCourseworksBtn",

    btnDeleteHidden_cardCourses: "#deleteCourseBtn",
    btnDeleteHidden_cardModules: "#deleteModuleBtn",
    btnDeleteHidden_tabModules: "#deleteTaughtModulesBtn",

    btnNo_modalDeleteCourses: "#cancelDeleteCoursesModalBtn",
    btnNo_modalDeleteModules: "#cancelDeleteModulesModalBtn",
    btnNo_modalDeleteTaughtModules: "#cancelDeleteTaughtModulesModalBtn",

    btnYes_modalDeleteCourses: "#deleteCoursesModalBtn",
    btnYes_modalDeleteModules: "#deleteModulesModalBtn",
    btnYes_modalDeleteTaughtModules: "#deleteTaughtModulesModalBtn",

    // btnSave_cardCourseInfo: "#saveCourseBtn",
    btnIconSave_tabCourseworks: "#d-cct-courseworksTable tbody .btn-success",
    btnIconAdd_modalAddCourseworks: "#addCourseworksBtn",
    btnIconAdd_modalAddExams: "#addExamsBtn",

    modalDeleteCourses: "#deleteCoursesModal",
    modalDeleteModules: "#deleteModulesModal",
    modalDeleteTaughtModules: "#deleteTaughtModulesModal",

    dashboardMessages: "#dashboard .alertMessages"
    // ---- Edit Course Form Modal----

    // ---- Delete Courses Form Modal ----

    // ---- Create Course Form Modal----

    // -------- MODULES FORM --------

    // ---- Edit Module Form Modal----

    // ---- Delete Modules Form Modal ----

    // -------- DASHBOARD FORM --------

    // ------------ Modules List Tab ------------
    // -------- Form --------
    // taughtModulesForm: "#taughtModulesForm",
    // ---- "Taught Modules" Table ----

    // ---- Buttons ----

    // -------- Add "Taught Modules" Modal --------
    // ---- "Modules" Table ----

    // -------- Delete "Taught Modules" Modal --------

    // ---- Buttons ----

    // ------------ Courseworks Calendar Tab ------------
    // -------- Form --------

    // ---- "Courseworks" Table ----

    // ---- Buttons ----

    // -------- Add Courseworks Modal --------
    // d_cct_ac_m_taughtModulesTable: "#d_cct_ac_m_taughtModulesTable",
    // ---- "Taught Modules" Table ----

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
        .querySelector(UISelectors.form_modalEditCourse)
        .setAttribute("action", action);

      // Course Name
      document.querySelector(
        UISelectors.inputTextName_modalEditCourse
      ).value = title;

      // Academic Degree
      document.querySelector(
        UISelectors.inputSelectDegree_modalEditCourse
      ).value = level;

      // Color
      document.querySelector(
        UISelectors.inputColor_modalEditCourse
      ).value = color;

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
        .querySelector(UISelectors.form_modalEditModule)
        .setAttribute("action", action);

      // Module Name
      document.querySelector(
        UISelectors.inputTextName_modalEditModule
      ).value = title;

      // -------- Course Name --------
      const selectList = document.querySelector(
        UISelectors.inputSelectCourse_modalEditModule
      );
      for (const key of selectList) {
        if (key.innerText === `${course}-${level}`) {
          document.querySelector(
            UISelectors.inputSelectCourse_modalEditModule
          ).value = `${key.value}`;
        }
      }

      // Color
      document.querySelector(
        UISelectors.inputColor_modalEditModule
      ).value = color;

      // -------- Description --------
      // Refresh CKEditor in order to update it's content without refresh the page
      CKEDITOR.instances.editModuleDescription.setData(description, {
        callback: function() {
          this.checkDirty(); // true
        }
      });
    },
    fillInEditExamModalForm: function(
      action,
      taughtModuleName,
      taughtModuleID
    ) {
      document
        .querySelector(UISelectors.form_modalEditExam)
        .setAttribute("action", action);

      document
        .querySelector(UISelectors.inputTextTaughtModuleId_modalEditExam)
        .setAttribute("value", taughtModuleID);

      document.querySelector(
        UISelectors.inputTextName_modalEditExam
      ).textContent = taughtModuleName;
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
        UISelectors.tableCheckbox_tabModules
      ).id;
      const addTaughtModulesModalTable = document.querySelector(
        UISelectors.tableCheckbox_modalAddTaughtModules
      ).id;
      const courseworksCalendarTable = document.querySelector(
        UISelectors.tableCheckbox_tabCourseworks
      ).id;
      const addCourseworksModalTable = document.querySelector(
        UISelectors.tableDate_modalAddCourseworks
      ).id;
      const examsModalTable = document.querySelector(
        UISelectors.tableCheckbox_tabExams
      ).id;
      const addExamsModalTable = document.querySelector(
        UISelectors.tableDate_modalAddExams
      ).id;

      // Get the table which will be compared
      if (tableID === taughtModulesModulesTabTable) {
        tableAllElementsID = addTaughtModulesModalTable;
      }
      // Get the table which will be compared
      if (tableID === courseworksCalendarTable) {
        tableAllElementsID = addCourseworksModalTable;
      }
      // Get the table which will be compared
      if (tableID === examsModalTable) {
        tableAllElementsID = addExamsModalTable;
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
    getNumberOfColumns: function(tableID) {
      const numberOfColumns = document.querySelectorAll(`${tableID} thead th`)
        .length;

      return numberOfColumns;
    },
    getTableDeleteElements: function(modalID) {
      // -------- Gather The Modals IDs --------
      const coursesModalID = document.querySelector(
        UISelectors.modalDeleteCourses
      ).id;
      const modulesModalID = document.querySelector(
        UISelectors.modalDeleteModules
      ).id;
      const taughtModulesModalID = document.querySelector(
        UISelectors.modalDeleteTaughtModules
      ).id;

      // ======== Gather All Necessary Elements ========
      let tableID;
      if (modalID === coursesModalID) {
        // -------- Get the "Courses" table elements --------
        // Get the checkbox "check all" element
        checkboxCheckAll = document.querySelector(
          UISelectors.tableCheckboxColumnCheckbox_cardCourses
        );
        // ---- Gather all checkboxes ----
        tableID = document.querySelector(UISelectors.tableCheckbox_cardCourses)
          .id;
        checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);
        // Get the trigger "Delete" courses button
        triggerDeleteBtn = document.querySelector(
          UISelectors.btnDelete_cardCourses
        );
        // Get the "Delete" courses button
        deleteBtn = document.querySelector(
          UISelectors.btnDeleteHidden_cardCourses
        );
      } else if (modalID === modulesModalID) {
        // -------- Get the "Modules" table elements --------
        // Get the checkbox "check all" element
        checkboxCheckAll = document.querySelector(
          UISelectors.tableCheckboxColumnCheckbox_cardModules
        );
        // ---- Gather all checkboxes ----
        tableID = document.querySelector(UISelectors.tableCheckbox_cardModules)
          .id;
        checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);
        // Get the trigger "Delete" modules button
        triggerDeleteBtn = document.querySelector(
          UISelectors.btnDelete_cardModules
        );
        // Get the "Delete" courses button
        deleteBtn = document.querySelector(
          UISelectors.btnDeleteHidden_cardModules
        );
      } else if (modalID === taughtModulesModalID) {
        // -------- Get the "Taught Modules" table elements --------
        // Get the checkbox "check all" element
        checkboxCheckAll = document.querySelector(
          UISelectors.tableCheckboxColumnCheckbox_tabModules
        );
        // ---- Gather all checkboxes ----
        tableID = document.querySelector(UISelectors.tableCheckbox_tabModules)
          .id;
        checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);
        // Get the trigger "Delete" modules button
        triggerDeleteBtn = document.querySelector(
          UISelectors.btnDelete_tabModules
        );
        // Get the "Delete" courses button
        deleteBtn = document.querySelector(
          UISelectors.btnDeleteHidden_tabModules
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
      if (alerts.length > 1) {
        let counter = 1;
        for (alertItem of alerts) {
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

      // ---- Enable modal submit button ----
      const button = document.querySelector(
        UISelectors.btnIconAdd_modalAddCourseworks
      );
      UICtrl.enableModalSubmitButton(modalTableInputDateElements, button);
    },
    disableModalAddExamsTableRows: function(
      targetTableCheckboxes,
      modalTableInputDateElements
    ) {
      let targetTableTaughtModuleID;
      let targetTableDateText;
      targetTableCheckboxes.forEach(checkbox => {
        targetTableTaughtModuleID = checkbox.value;
        targetTableDateText =
          checkbox.parentElement.parentElement.previousElementSibling
            .previousElementSibling.previousElementSibling
            .previousElementSibling.firstElementChild.innerText;
        targetTableTimeText =
          checkbox.parentElement.parentElement.previousElementSibling
            .previousElementSibling.previousElementSibling.firstElementChild
            .innerText;
        targetTableClassroomText =
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

          let modalTableTimeText =
            inputDate.parentElement.parentElement.nextElementSibling
              .firstElementChild;
          let modalTableInputTime =
            inputDate.parentElement.parentElement.nextElementSibling
              .lastElementChild.children[1];

          let modalTableClassroomText =
            inputDate.parentElement.parentElement.nextElementSibling
              .nextElementSibling.firstElementChild;
          let modalTableInputClassroom =
            inputDate.parentElement.parentElement.nextElementSibling
              .nextElementSibling.lastElementChild.children[1];

          if (
            targetTableTaughtModuleID === inputDate.getAttribute("data-id") &&
            modalTableDateText.innerText !== ""
          ) {
            // Update & Display date text
            modalTableDateText.innerText = targetTableDateText;
            modalTableDateText.classList.remove("d-none");

            modalTableTimeText.innerText = targetTableTimeText;
            modalTableTimeText.classList.remove("d-none");

            modalTableClassroomText.innerText = targetTableClassroomText;
            modalTableClassroomText.classList.remove("d-none");

            // Hide input date
            modalTableInputDate.parentElement.classList.add("d-none");
            modalTableInputTime.parentElement.classList.add("d-none");
            modalTableInputClassroom.parentElement.classList.add("d-none");

            // ---- Disable row ----
            // UICtrl.disableDateRows(inputDate);
            const tr = inputDate.parentElement.parentElement.parentElement;
            tr.classList.add("text-muted");
          }
        });
      });

      // ---- Enable modal submit button ----
      const button = document.querySelector(
        UISelectors.btnIconAdd_modalAddExams
      );
      UICtrl.enableModalSubmitButton(modalTableInputDateElements, button);
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

    // // window.onload = () => {};
    // ---------------- TABLE EVENT LISTENERS ----------------
    // -------- Check/Unckeck All Table Rows --------
    console.log(
      document.querySelector(
        UISelectors.tableCheckboxColumnCheckbox_cardCourses
      )
    );
    console.log(
      document.querySelector(
        UISelectors.tableCheckboxColumnTitle_cardModulesSelection
      )
    );
    if (
      document.querySelector(
        UISelectors.tableCheckboxColumnCheckbox_cardCourses
      )
    ) {
      document
        .querySelector(UISelectors.tableCheckboxColumnCheckbox_cardCourses)
        .addEventListener("click", checkUncheckAll);
    }
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnCheckbox_cardCourses)
    //   .addEventListener("click", checkUncheckAll);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnCheckbox_cardModules)
    //   .addEventListener("click", checkUncheckAll);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnCheckbox_tabModules)
    //   .addEventListener("click", checkUncheckAll);
    // document
    //   .querySelector(
    //     UISelectors.tableCheckboxColumnCheckbox_modalAddTaughtModules
    //   )
    //   .addEventListener("click", checkUncheckAll);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnCheckbox_tabCourseworks)
    //   .addEventListener("click", checkUncheckAll);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnCheckbox_tabExams)
    //   .addEventListener("click", checkUncheckAll);

    // // -------- Check/Unckeck A Selected Table Row --------
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_cardCourses)
    //   .addEventListener("click", checkUncheckRow);
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_cardModules)
    //   .addEventListener("click", checkUncheckRow);
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_tabModules)
    //   .addEventListener("click", checkUncheckRow);
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_modalAddTaughtModules)
    //   .addEventListener("click", checkUncheckRow);
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_tabCourseworks)
    //   .addEventListener("click", checkUncheckRow);
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_tabExams)
    //   .addEventListener("click", checkUncheckRow);

    // // -------------------- Sort Table --------------------
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnTitle_cardCourses)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnLevel_cardCourses)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnTitle_cardModules)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnCourse_cardModules)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnLevel_cardModules)
    //   .addEventListener("click", sortTable);
    document
      .querySelector(UISelectors.tableCheckboxColumnTitle_cardModulesSelection)
      .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnTitle_tabModules)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnCourse_tabModules)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnLevel_tabModules)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnTitle_modalAddTaughtModules)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(
    //     UISelectors.tableCheckboxColumnCourse_modalAddTaughtModules
    //   )
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnLevel_modalAddTaughtModules)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnModule_tabCourseworks)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnDueDate_tabCourseworks)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableDateColumnTitle_modalAddCourseworks)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnModules_tabExams)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnDate_tabExams)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnTime_tabExams)
    //   .addEventListener("click", sortTable);
    // document
    //   .querySelector(UISelectors.tableCheckboxColumnClassroom_tabExams)
    //   .addEventListener("click", sortTable);

    // // ---------------- Disable Table Row/Rows ----------------
    // // "Dashboard" -> "Add Modules" modal -> ("Modules" table)
    // document
    //   .querySelector(UISelectors.btnAddTaughtModules_tabModules)
    //   .addEventListener("click", disableRows);

    // // "Dashboard" -> "Add Courseworks" modal -> ("Taught Modules" table)
    // document
    //   .querySelector(UISelectors.btnAddCourseworks_tabCourseworks)
    //   .addEventListener("click", disableRows);

    // // "Dashboard" -> "Add Courseworks" modal -> ("Taught Modules" table)
    // document
    //   .querySelector(UISelectors.btnAddExams_tabExams)
    //   .addEventListener("click", disableRows);

    // // -------------------- Edit Table Row --------------------
    // // "Courses" form -> "Courses" table -> ("Edit" Button)
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_cardCourses)
    //   .addEventListener("click", editCourse);

    // // "Modules" form -> "Modules" table -> ("Edit" Button)
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_cardModules)
    //   .addEventListener("click", editModule);

    // // "Exams" tab -> "Exams" table -> ("Edit" Button)
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_tabExams)
    //   .addEventListener("click", editExam);

    // // --- Sort "Dashboard" -> "Courseworks Calendar" tab -> ("Courseworks" table) ---
    // document
    //   .querySelector(UISelectors.tableCheckboxBody_tabCourseworks)
    //   .addEventListener("click", editCoursework);

    // document
    //   .querySelector(UISelectors.tableCheckboxBody_tabCourseworks)
    //   .addEventListener("click", saveDateCoursework);

    // // ---------------- Delete Table Row/Rows ----------------
    // // -------- "Delete Courses" modal --------
    // // "No" Button
    // document
    //   .querySelector(UISelectors.btnNo_modalDeleteCourses)
    //   .addEventListener("click", cancelDeletion);

    // // "Yes" Button
    // document
    //   .querySelector(UISelectors.btnYes_modalDeleteCourses)
    //   .addEventListener("click", confirmDeletion);

    // // -------- "Delete Modules" modal --------
    // // "No" Button
    // document
    //   .querySelector(UISelectors.btnNo_modalDeleteModules)
    //   .addEventListener("click", cancelDeletion);

    // // "Yes" Button
    // document
    //   .querySelector(UISelectors.btnYes_modalDeleteModules)
    //   .addEventListener("click", confirmDeletion);

    // // -------- "Delete Taught Modules" modal --------
    // // "No" Button
    // document
    //   .querySelector(UISelectors.btnNo_modalDeleteTaughtModules)
    //   .addEventListener("click", cancelDeletion);

    // // "Yes" Button
    // document
    //   .querySelector(UISelectors.btnYes_modalDeleteTaughtModules)
    //   .addEventListener("click", confirmDeletion);

    // // // ---- Enable/Disable "Plus" button when date element has value  ----
    // // // "Dashboard" -> "Courseworks" tab -> ("Add Courseworks" modal)
    // // document
    // //   .querySelector(UISelectors.d_cct_ac_m_taughtModulesTable)
    // //   .addEventListener("change", enableDisableBtn);
  };

  document.addEventListener("DOMContentLoaded", loadEventListeners);

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
    const buttons = document.querySelector(`#${tableID}`).parentElement
      .nextElementSibling.children;

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
      const buttons = document.querySelector(`#${tableID}`).parentElement
        .nextElementSibling.children;

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

      // const modalTableNumberOfColumns = UICtrl.getNumberOfColumns(
      //   `#${modalTableID}`
      // );
      const UISelectors = UICtrl.getUISelectors();

      if (UISelectors.tableDate_modalAddCourseworks === `#${modalTableID}`) {
        // If it's the "Add Courseworks" modal table
        UICtrl.disableModalTableInputDatesRow(
          targetTableCheckboxes,
          modalTableDateElements
        );
      } else {
        // It's the "Add Exams" modal table
        UICtrl.disableModalAddExamsTableRows(
          targetTableCheckboxes,
          modalTableDateElements
        );
      }
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
    if (e.target.classList.contains("courseworkDateEdit")) {
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
        UISelectors.btnAddCourseworks_tabCourseworks
      );

      const saveButtons = document.querySelectorAll(
        UISelectors.btnIconSave_tabCourseworks
      );

      const buttons = Object.values(saveButtons);

      UICtrl.OnOffButton(buttons, addCourseworksBtn);
    }
  };

  const editExam = function(e) {
    // Initilize variables needed
    let taughtModuleName, taughtModuleID, facultyID;

    if (e.target.classList.contains("examEdit")) {
      // -------- GATHER THE INFO FROM "EXAMS" TABLE --------
      // Modules
      taughtModuleName =
        e.target.parentElement.parentElement.parentElement.children[1]
          .innerText;

      // ModuleID
      taughtModuleID = e.target.parentElement.getAttribute("data-id");

      // ---- Set Form Action ----
      facultyID = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute(
        "data-id"
      );
      const action = `/dashboards/facultyMember/exams/${facultyID}?_method=PUT`;

      // -------- FILL IN THE "EDIT MODULE" MODAL FORM --------
      UICtrl.fillInEditExamModalForm(action, taughtModuleName, taughtModuleID);
    }
  };

  const saveDateCoursework = function(e) {
    if (e.target.classList.contains("courseworkDateSave")) {
      // ---- GATHER THE ELEMENTS NEEDED ----
      // Get UI Selectors
      const UISelectors = UICtrl.getUISelectors();

      // ---- Get "Faculty Member" id parameter ----
      const form = document.querySelector(UISelectors.form_tabCourseworks);
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
        // ---- Convert Date Value To English UK Short Format ----
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
        UISelectors.btnAddCourseworks_tabCourseworks
      );
      const saveIconButtons = document.querySelectorAll(
        UISelectors.btnIconSave_tabCourseworks
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
      // loadEventListeners();
    }
  };
})(UICtrl);

// ======== INITIALIZE APP ========
App.init();
