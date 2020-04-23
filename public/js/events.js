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
    // -------- Courses Form --------
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

    // -------- Modules Form --------
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

    // -------- Dashboard Form --------
    // -------- Modules List Tab -> Taught Modules Table --------
    taughtModulesForm: "#taughtModulesForm",
    taughtModulesTable: "#taughtModulesTable",
    taughtModulesTableBody: "#taughtModulesTable tbody",
    taughtModulesTableColumnTitle: "#taughtModulesTable .sort-title",
    taughtModulesTableColumnCourse: "#taughtModulesTable .sort-course",
    taughtModulesTableColumnLevel: "#taughtModulesTable .sort-level",
    taughtModulesCheckboxAll:
      "#taughtModulesTable thead input[type='checkbox']",
    triggerModalDeleteTaughtModulesBtn: "#triggerModalDeleteTaughtModulesBtn",
    deleteTaughtModulesBtn: "#deleteTaughtModulesBtn",
    triggerModalAddTaughtModuleBtn: "#triggerModalAddTaughtModuleBtn",
    // ---- Add Modules Modal ----
    modulesTableModal: "#modulesTableModal",
    modulesTableBodyModal: "#modulesTableModal tbody",
    modulesTableModalColumnTitle: "#modulesTableModal .sort-title",
    modulesTableModalColumnCourse: "#modulesTableModal .sort-course",
    modulesTableModalColumnLevel: "#modulesTableModal .sort-level",
    modulesModalCheckboxAll: "#modulesTableModal thead input[type='checkbox']",
    // ---- Delete Taught Modules Form Modal ----
    deleteTaughtModulesModal: "#deleteTaughtModulesModal",
    cancelDeleteTaughtModulesModalBtn: "#cancelDeleteTaughtModulesModalBtn",
    deleteTaughtModulesModalBtn: "#deleteTaughtModulesModalBtn"
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
    getAllTablesElementID: function(tableID) {
      // Gather UI Selector IDs
      const taughtModulesTableID = document.querySelector(
        UISelectors.taughtModulesTable
      ).id;
      const modulesTableModalID = document.querySelector(
        UISelectors.modulesTableModal
      ).id;

      // Get the table which will be compared
      if (tableID === taughtModulesTableID) {
        tableAllElementsID = modulesTableModalID;
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
    getTableDeleteElements: function(modalID) {
      // -------- Gather The Modals IDs --------
      const coursesModalID = document.querySelector(
        UISelectors.deleteCoursesModal
      ).id;
      const modulesModalID = document.querySelector(
        UISelectors.deleteModulesModal
      ).id;
      const taughtModulesModalID = document.querySelector(
        UISelectors.deleteTaughtModulesModal
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
          UISelectors.taughtModulesCheckboxAll
        );
        // ---- Gather all checkboxes ----
        tableID = document.querySelector(UISelectors.taughtModulesTable).id;
        checkboxes = UICtrl.getCheckBoxes(`#${tableID}`);
        // Get the trigger "Delete" modules button
        triggerDeleteBtn = document.querySelector(
          UISelectors.triggerModalDeleteTaughtModulesBtn
        );
        // Get the "Delete" courses button
        deleteBtn = document.querySelector(UISelectors.deleteTaughtModulesBtn);
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
    OnOffButton: function(checkboxes, triggerButton) {
      // ======== Get all checkboxes that are checked ========
      let listChecked = [];
      checkboxes.forEach(checkbox => {
        if (checkbox.checked === true) {
          listChecked.push(checkbox);
        }
      });

      // ======== Enable/Disable Button ========
      // If a checkbox is checked, enable button else disable button
      if (listChecked.length > 0) {
        triggerButton.disabled = false;
      } else {
        triggerButton.disabled = true;
      }
    }
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
      .querySelector(UISelectors.taughtModulesCheckboxAll)
      .addEventListener("click", checkUncheckAll);

    // "Dashboard" -> "Add Modules" modal form -> ("Modules" table)
    document
      .querySelector(UISelectors.modulesModalCheckboxAll)
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
      .querySelector(UISelectors.taughtModulesTableBody)
      .addEventListener("click", checkUncheckRow);

    // "Dashboard" -> "Add Modules" modal form -> ("Modules" table)
    document
      .querySelector(UISelectors.modulesTableBodyModal)
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

    // --- Sort "Dashboard" -> "Add Modules" modal form -> ("Modules" table) ---
    // Sort Title column
    document
      .querySelector(UISelectors.modulesTableModalColumnTitle)
      .addEventListener("click", sortTable);

    // Sort "Course" column
    document
      .querySelector(UISelectors.modulesTableModalColumnCourse)
      .addEventListener("click", sortTable);

    // Sort "Level" column
    document
      .querySelector(UISelectors.modulesTableModalColumnLevel)
      .addEventListener("click", sortTable);

    // --- Sort "Dashboard" -> "Modules List" tab -> ("Taught Modules" table) ---
    // Sort Title column
    document
      .querySelector(UISelectors.taughtModulesTableColumnTitle)
      .addEventListener("click", sortTable);

    // Sort "Course" column
    document
      .querySelector(UISelectors.taughtModulesTableColumnCourse)
      .addEventListener("click", sortTable);

    // Sort "Level" column
    document
      .querySelector(UISelectors.taughtModulesTableColumnLevel)
      .addEventListener("click", sortTable);

    // ---------------- Disable Table Row/Rows ----------------
    // "Dashboard" -> "Add Modules" modal form -> ("Modules" table)
    document
      .querySelector(UISelectors.triggerModalAddTaughtModuleBtn)
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
      .querySelector(UISelectors.cancelDeleteTaughtModulesModalBtn)
      .addEventListener("click", cancelDeletion);

    // "Yes" Button
    document
      .querySelector(UISelectors.deleteTaughtModulesModalBtn)
      .addEventListener("click", confirmDeletion);
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
    // ---- Get The Table Which Will Be Compared ----
    const tableLessElementsID =
      e.target.parentElement.previousElementSibling.children[0].id;

    const tableAllElementsID = UICtrl.getAllTablesElementID(
      tableLessElementsID
    );

    // ---- Get Checkboxes From Tables ----
    const lessElementsCheckboxes = UICtrl.getCheckBoxes(
      `#${tableLessElementsID}`
    );
    const allElementsCheckboxes = UICtrl.getCheckBoxes(
      `#${tableAllElementsID}`
    );

    // ---- Disable Checkboxes From Table With Has All Elements ----
    let id;
    lessElementsCheckboxes.forEach(checkbox => {
      id = checkbox.value;
      allElementsCheckboxes.forEach(checkBox => {
        if (id === checkBox.value) {
          // ---- Disable row ----
          checkBox.setAttribute("disabled", "");
          let tr = checkBox.parentElement.parentElement.parentElement;
          tr.classList.add("text-muted");
        }
      });
    });
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
