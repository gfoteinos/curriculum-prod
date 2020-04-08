// Click "Profile" link on dashboard faculty/student menu
const profileClick = function() {
  window.onload = function() {
    document.getElementById("profile-list").click();
  };
};

// Click "Courses" link on dashboard faculty menu
const coursesClick = function() {
  window.onload = function() {
    document.getElementById("course-list").click();
  };
};

// Click "Modules" link on dashboard faculty menu
const modulesClick = function() {
  window.onload = function() {
    document.getElementById("module-list").click();
  };
};

const disableElement = function(className) {
  const element = document.querySelector(className);
  element.classList.add("icon--disabled");
};

// ======== UI Controler ========
const UICtrl = (function() {
  // ======== Private var & methods ========
  const UISelectors = {
    // -------- Courses Form --------
    coursesForm: "#coursesForm",
    coursesTable: "#coursesTable",
    coursesTableBody: "#coursesTable tbody",
    coursesTableColumnTitle: "#coursesTable .sort-title",
    coursesTableColumnLevel: "#coursesTable .sort-level",
    coursesCheckBoxAll: "#coursesCheckAll",
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
    modulesCheckBoxAll: "#mtCheckAll",
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
    // ---- Add Modules Modal ----
    addModulesTableBody: "#modulesTableModal tbody",
    addModulesTableColumnTitle: "#modulesTableModal .sort-title",
    addModulesTableColumnCourse: "#modulesTableModal .sort-course",
    addModulesTableColumnLevel: "#modulesTableModal .sort-level",
    addModulesCheckBoxAll: "#mtmCheckAll"
  };

  // ======== Public Methods ========
  return {
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
    fillInEditModuleModalForm: function() {
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
        // Get the "id" from "checkbox id" element
        itemArray = item.id.split("-");
        id = itemArray[1];

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
    // -------- Tables --------
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
    getCheckBoxes: function(table) {
      // Gather all checkboxes according to the table
      const checkboxes = document.querySelectorAll(
        `#${table} tbody .custom-control-input`
      );

      return checkboxes;
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

// ======== Application Controler ========
const App = (function(UICtrl) {
  // ======== Private var & methods ========
  // ---- Load event listeners ----
  const loadEventListeners = function() {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // ================ TABLE EVENTS ================
    // -------- Check/Unckeck All Table Rows --------
    // Check/uncheck all from "courses" table at "Courses" form
    document
      .querySelector(UISelectors.coursesCheckBoxAll)
      .addEventListener("click", checkUncheckAll);

    // Check/uncheck all from "modules" table at "Modules" form
    document
      .querySelector(UISelectors.modulesCheckBoxAll)
      .addEventListener("click", checkUncheckAll);

    // Check/uncheck all from "Add Modules" table at "Add Modules" modal
    document
      .querySelector(UISelectors.addModulesCheckBoxAll)
      .addEventListener("click", checkUncheckAll);

    // -------- Check/Unckeck A Selected Table Row --------
    // Check/uncheck a course from "courses" table at "Courses" form
    document
      .querySelector(UISelectors.coursesTableBody)
      .addEventListener("click", checkUncheckRow);

    // Check/uncheck a module from "modules" table at "Modules" form
    document
      .querySelector(UISelectors.modulesTableBody)
      .addEventListener("click", checkUncheckRow);

    // Check/uncheck a module from "modules" table at "Add Modules" modal
    document
      .querySelector(UISelectors.addModulesTableBody)
      .addEventListener("click", checkUncheckRow);

    // ======== COURSES TABLE ========
    // -------- Sorting "Courses" Table --------
    // Sort "Title" column
    document
      .querySelector(UISelectors.coursesTableColumnTitle)
      .addEventListener("click", sortTable);

    // Sort "Level" column
    document
      .querySelector(UISelectors.coursesTableColumnLevel)
      .addEventListener("click", sortTable);

    // Edit Course Button
    document
      .querySelector(UISelectors.coursesTableBody)
      .addEventListener("click", editCourse);

    // Save Course Button
    document
      .querySelector(UISelectors.saveCourseBtn)
      .addEventListener("click", saveCourse);

    // "No" Button On Delete Course Modal
    document
      .querySelector(UISelectors.cancelDeleteCoursesModalBtn)
      .addEventListener("click", cancelDeletion);

    // "Yes" Button On Delete Course Modal
    document
      .querySelector(UISelectors.deleteCoursesModalBtn)
      .addEventListener("click", confirmDeletion);

    // ======== MODULES TABLE ========
    // -------- Sorting "Modules" Table --------
    // ---- Sort "Title" column ----
    // Modules Form
    document
      .querySelector(UISelectors.modulesTableColumnTitle)
      .addEventListener("click", sortTable);

    //Dashboard form - "Add Modules" modal
    document
      .querySelector(UISelectors.addModulesTableColumnTitle)
      .addEventListener("click", sortTable);

    // ---- Sort "Course" column ----
    // Modules Form
    document
      .querySelector(UISelectors.modulesTableColumnCourse)
      .addEventListener("click", sortTable);

    //Dashboard form - "Add Modules" modal
    document
      .querySelector(UISelectors.addModulesTableColumnCourse)
      .addEventListener("click", sortTable);

    // ---- Sort "Level" column ----
    // Modules Form
    document
      .querySelector(UISelectors.modulesTableColumnLevel)
      .addEventListener("click", sortTable);

    //Dashboard form - "Add Modules" modal
    document
      .querySelector(UISelectors.addModulesTableColumnLevel)
      .addEventListener("click", sortTable);

    // Edit Module Button
    document
      .querySelector(UISelectors.modulesTableBody)
      .addEventListener("click", editModule);

    // "No" Button On Delete Module Modal
    document
      .querySelector(UISelectors.cancelDeleteModulesModalBtn)
      .addEventListener("click", cancelDeletion);

    // "Yes" Button On Delete Course Modal
    document
      .querySelector(UISelectors.deleteModulesModalBtn)
      .addEventListener("click", confirmDeletion);
  };

  // ======== COURSES TABLE EVENTS ========
  // Edit Course
  const editCourse = function(e) {
    // Initilize variables needed
    let title, level, color, description, courseID;

    if (e.target.classList.contains("courseEdit")) {
      // -------- Gather The Info From "Courses" Table --------
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

      // -------- Fill In The "Edit Course" Modal Form --------
      UICtrl.fillInEditCourseModalForm(
        action,
        title,
        level,
        color,
        description
      );
    }
  };

  // Save Course
  const saveCourse = function(e) {
    // const courseName = document.querySelector('#createCourseName').value;
    // const academicDegree = document.querySelector('#createCourseLevel').value;
    // const color = document.querySelector('#createCourseColor').value;
    // const description = document.querySelector('#createCourseDescription').innerText;
    // console.log(`courseName: ${courseName}, academicDegree: ${academicDegree}, color: ${color}, description: ${description} `);
    // e.preventDefault();
  };

  // ======== MODULES TABLE EVENTS ========
  // Edit Module
  const editModule = function(e) {
    // Initilize variables needed
    let title, course, level, color, description, moduleID;

    if (e.target.classList.contains("moduleEdit")) {
      // -------- Gather The Info From "Modules" Table --------
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

      // -------- Fill In The "Edit Module" Modal Form --------
      UICtrl.fillInEditModuleModalForm(
        action,
        title,
        course,
        level,
        color,
        description,
        moduleID
      );
    }
  };

  // // Check/Uncheck Checkbox For All Checkboxes On Modules Table
  // const checkUncheckAllModules = function(e) {
  //   // ======== Gather All Necessary Elements ========
  //   // Get UISelectors
  //   const UISelectors = UICtrl.getUISelectors();

  //   // Get the table id according to the target element
  //   const table =
  //     e.target.parentElement.parentElement.parentElement.parentElement
  //       .parentElement.id;

  //   // Gather all checkboxes from UI table
  //   const checkboxes = UICtrl.getCheckBoxes(table);

  //   // Get the delete modules button
  //   const deleteBtn = document.querySelector(
  //     UISelectors.triggerDeleteModulesModalBtn
  //   );

  //   // ======== Check/Uncheck Checkboxes ========
  //   if (e.target.checked) {
  //     checkboxes.forEach(function(checkbox) {
  //       // Check all if not disabled
  //       if (checkbox.disabled === false) {
  //         checkbox.checked = true;
  //         deleteBtn.disabled = false;
  //       }
  //     });
  //   } else {
  //     // Uncheck all if disabled
  //     checkboxes.forEach(function(checkbox) {
  //       checkbox.checked = false;
  //       deleteBtn.disabled = true;
  //     });
  //   }
  // };

  // ======== COURSES & MODULES TABLES EVENTS ========
  //Sort Table
  const sortTable = function(e) {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // ======== Find Which Is The Selected Column To Sort ========

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

    // ---- Change the sort icon symbol of selected column ----
    if (sortIconClassName === "fas fa-angle-down") {
      sortIconElement.className = "fas fa-angle-up";
    } else {
      sortIconElement.className = "fas fa-angle-down";
    }

    // Sort the table's column
    UICtrl.sortTableColumn(table, columnIndex);
  };

  // Check/Uncheck Checkbox For All Checkboxes On Courses Table
  const checkUncheckAll = function(e) {
    // -------- Gather All Necessary Elements --------
    // Get the target element
    checkAllCheckbox = e.target;

    // Get the table id according to the target element
    const table =
      checkAllCheckbox.parentElement.parentElement.parentElement.parentElement
        .parentElement.id;

    // Gather all checkboxes from UI table
    const checkboxes = UICtrl.getCheckBoxes(table);

    // Gather all buttons which are on the form's bottom
    const buttons =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.nextElementSibling.children;

    // -------- Get the trigger(enable/disable) button --------
    const triggerButton = UICtrl.getTriggerBtn(buttons);

    // -------- Check/Uncheck Checkboxes --------
    UICtrl.checkUncheckCheckboxes(checkAllCheckbox, checkboxes, triggerButton);
  };

  // Check/Uncheck A Checkbox Row In A Table
  const checkUncheckRow = function(e) {
    if (e.target.classList.contains("custom-control-input")) {
      // -------- Gather All Necessary Elements --------
      // Get the table id according to the target element
      const table =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.id;

      // Gather all checkboxes from UI table
      const checkboxes = UICtrl.getCheckBoxes(table);

      // Gather all buttons which are on the form's bottom
      const buttons =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.parentElement.nextElementSibling.children;

      // -------- Get the trigger(enable/disable) button --------
      const triggerButton = UICtrl.getTriggerBtn(buttons);

      UICtrl.OnOffButton(checkboxes, triggerButton);
    }
  };

  // -------- Deletion Functionality --------
  // Cancel Deletion
  const cancelDeletion = function(e) {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // ======== Gather The Modals IDs ========
    const coursesModalID = document.querySelector(
      UISelectors.deleteCoursesModal
    ).id;
    const modulesModalID = document.querySelector(
      UISelectors.deleteModulesModal
    ).id;
    const currentModalID =
      e.target.parentElement.parentElement.parentElement.parentElement.id;

    // ======== Gather All Necessary Elements ========
    if (currentModalID === coursesModalID) {
      // -------- Get the "Courses" table elements --------
      // Get the checkbox all element
      checkBoxAll = document.querySelector(UISelectors.coursesCheckBoxAll);
      // Gather all checkboxes from UI
      checkboxes = UICtrl.getCheckBoxes("courses");
      // Get the delete courses button
      deleteBtn = document.querySelector(
        UISelectors.triggerDeleteCoursesModalBtn
      );
    } else if (currentModalID === modulesModalID) {
      // -------- Get the "Modules" table elements --------
      // Get the checkbox all element
      checkBoxAll = document.querySelector(UISelectors.modulesCheckBoxAll);
      // Gather all checkboxes from UI
      checkboxes = UICtrl.getCheckBoxes("modules");
      // Get the delete modules button
      deleteBtn = document.querySelector(
        UISelectors.triggerDeleteModulesModalBtn
      );
    }

    // ======== Uncheck All CheckBoxes ========
    // Uncheck checkbox all element
    if (checkBoxAll.checked === true) {
      checkBoxAll.checked = false;
    }

    // Uncheck all ckeckboxes
    checkboxes.forEach(function(checkbox) {
      checkbox.checked = false;
      deleteBtn.disabled = true;
    });
  };

  // Confirm Deletion
  const confirmDeletion = function(e) {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // ======== Gather The Modals IDs ========
    const coursesModalID = document.querySelector(
      UISelectors.deleteCoursesModal
    ).id;
    const modulesModalID = document.querySelector(
      UISelectors.deleteModulesModal
    ).id;
    const currentModalID =
      e.target.parentElement.parentElement.parentElement.parentElement.id;

    // ======== Gather The Form IDs ========
    const coursesFormID = document.querySelector(UISelectors.coursesForm).id;
    const modulesFormID = document.querySelector(UISelectors.modulesForm).id;

    // ======== Gather All Necessary Elements ========
    if (currentModalID === coursesModalID) {
      // -------- Get the "Courses" table elements --------
      // Gather all checkboxes from UI
      checkboxes = UICtrl.getCheckBoxes("courses");
      // ======== Get all checkboxes that are checked ========
      let listChecked = [];
      checkboxes.forEach(checkbox => {
        if (checkbox.checked === true) {
          listChecked.push(checkbox);
        }
      });
      // Populate the checked courses in "Courses" table
      UICtrl.populateDeletionData(listChecked, coursesFormID);
      // Click delete course button
      // document.querySelector(UISelectors.deleteCourseBtn).click();
    } else if (currentModalID === modulesModalID) {
      // -------- Get the "Modules" table elements --------
      // Gather all checkboxes from UI
      checkboxes = UICtrl.getCheckBoxes("modules");
      // ======== Get all checkboxes that are checked ========
      let listChecked = [];
      checkboxes.forEach(checkbox => {
        if (checkbox.checked === true) {
          listChecked.push(checkbox);
        }
      });
      // Populate the checked modules in "Modules" table
      UICtrl.populateDeletionData(listChecked, modulesFormID);
      // Click delete course button
      // document.querySelector(UISelectors.deleteModuleBtn).click();
    }
  };

  // ======== Public Methods ========
  return {
    init: function() {
      console.log("Run...");
      // Load event listeners
      loadEventListeners();
    }
  };
})(UICtrl);

// ======== Initialize app ========
App.init();

// // ======== Export module ========
// module.exports = methods;
