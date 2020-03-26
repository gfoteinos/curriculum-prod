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
    coursesForm: "#coursesForm",
    coursesTable: "#coursesTable",
    coursesTableBody: "#coursesTable tbody",
    coursesCheckBoxAll: "#coursesCheckAll",
    coursesCheckBoxes: "#coursesTable tbody .custom-control-input",
    saveCourseBtn: "#saveCourseBtn",
    triggerDeleteCoursesModalBtn: "#triggerDeleteCoursesModalBtn",
    deleteCoursesModalBtn: "#deleteCoursesModalBtn",
    deleteCourseBtn: "#deleteCourseBtn"
  };

  // ======== Public Methods ========
  return {
    getCheckBoxes: function(flag) {
      // Gather checkboxes
      // const addModulesCheckboxes = document.querySelectorAll(UISelectors.addModulesCheckboxes);
      const coursesCheckBoxes = document.querySelectorAll(
        UISelectors.coursesCheckBoxes
      );
      // const courseworksCheckboxes = document.querySelectorAll(UISelectors.courseworksCheckboxes);
      // const AddCourseworksCheckboxes = document.querySelectorAll(UISelectors.addCourseworksCheckboxes);

      if (flag === "addModules") {
        return addModulesCheckboxes;
      } else if (flag === "courses") {
        return coursesCheckBoxes;
      } else if (flag === "courseworks") {
        return courseworksCheckboxes;
      } else if (flag === "addCourseworks") {
        return AddCourseworksCheckboxes;
      }
    },
    populateCourses: function(courses) {
      // ======== Create Html Code To Insert In The Courses Form ========
      // ---- Built Input Elements For Courses Ids ----
      // Initialize elements vars
      let inputs = "";

      // Create inputs
      courses.forEach(function(course) {
        // Building html code
        inputs += `<input type="text" name="ids" id="${course.id}" class="d-none" value="${course.id}"></input>`;
      });

      // ---- Built Div Element To Wrap Inputs ----
      // Create div element
      const div = document.createElement("div");
      // Add class to div
      div.className = "coursesIDForDelete";
      // Add inputs to div
      div.innerHTML = `${inputs}`;

      // ==== Insert Html Code ====
      document
        .querySelector(UISelectors.coursesForm)
        .insertAdjacentElement("beforeend", div);
    },
    getUISelectors: function() {
      return UISelectors;
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

    // ======== Courses Table ========
    // ---- Sorting courses Table ----
    // Sort title column
    document
      .querySelector("#coursesTable .sort-title")
      .addEventListener("click", sortTable);

    // Sort level column
    document
      .querySelector("#coursesTable .sort-level")
      .addEventListener("click", sortTable);

    // Check/Uncheck All From "Courses" Table
    document
      .querySelector(UISelectors.coursesCheckBoxAll)
      .addEventListener("click", checkUncheckAllCourses);

    // Check/Uncheck a course from "Courses" Table
    document
      .querySelector(UISelectors.coursesTableBody)
      .addEventListener("click", enableDeleteBtn);

    // Edit Course Button
    document
      .querySelector(UISelectors.coursesTableBody)
      .addEventListener("click", editCourse);

    // Save Course Button
    document
      .querySelector(UISelectors.saveCourseBtn)
      .addEventListener("click", saveCourse);

    // "Yes" Button On Delete Course Modal
    document
      .querySelector(UISelectors.deleteCoursesModalBtn)
      .addEventListener("click", deleteCourses);
  };

  // Edit Course
  const editCourse = function(e) {
    if (e.target.classList.contains("courseEdit")) {
      // ======== Gather the info from course table ========
      // Title
      const title =
        e.target.parentElement.parentElement.parentElement.children[1]
          .innerText;

      // Level
      const level =
        e.target.parentElement.parentElement.parentElement.children[2]
          .innerText;

      // -------- Color --------
      // Select the text of DOM element & get rid of spaces
      let color = e.target.parentElement.parentElement.parentElement.children[3].innerText.match(
        /([\w]+|\"[\w\s]+\")/g
      );
      // Convert the array to string
      color = `#${color.toString()}`;

      // Description
      const description =
        e.target.parentElement.parentElement.parentElement.children[4]
          .innerText;

      // Course ID
      const courseID = e.target.parentElement.getAttribute("data-id");

      // Set Form Action
      const action = `/dashboards/facultyMember/courses/${courseID}?_method=PUT`;

      // ======== Fill in the "Edit Course" modal form ========
      //Form Action
      document
        .querySelector("#editCourseModal form")
        .setAttribute("action", action);

      // Course Name
      document.querySelector("#editCourseName").value = title;

      // Academic Degree
      document.querySelector("#editCourseLevel").value = level;

      // Color
      document.querySelector("#editCourseColor").value = color;

      // ---- Description ----
      // Refresh CKEditor in order to update it's content without refresh the page
      CKEDITOR.instances.editCourseDescription.setData(description, {
        callback: function() {
          this.checkDirty(); // true
        }
      });
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

  // Enable Delete Button For (Courses & Modules Deletion)
  const enableDeleteBtn = function(e) {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    if (e.target.classList.contains("custom-control-input")) {
      // Gather all checkboxes from UI
      const checkboxes = UICtrl.getCheckBoxes("courses");

      // Get all courses that are checked
      let checkedCourses = [];
      checkboxes.forEach(checkbox => {
        if (checkbox.checked === true) {
          checkedCourses.push(checkbox);
        }
      });

      // -------- Enable/Disable Button --------
      const deleteBtn = document.querySelector(
        UISelectors.triggerDeleteCoursesModalBtn
      );
      // If a course is checked enable button else disable button
      if (checkedCourses.length > 0) {
        deleteBtn.disabled = false;
      } else {
        deleteBtn.disabled = true;
      }
    }
  };

  // Delete Courses
  const deleteCourses = function(e) {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // Gather all checkboxes from UI
    const checkboxes = UICtrl.getCheckBoxes("courses");
    console.log(checkboxes);

    // Get all courses that are checked
    let checkedCourses = [];
    checkboxes.forEach(checkbox => {
      if (checkbox.checked === true) {
        checkedCourses.push(checkbox);
      }
    });

    // Populate the checked courses in UI
    UICtrl.populateCourses(checkedCourses);

    // Click delete course button
    document.querySelector(UISelectors.deleteCourseBtn).click();
  };

  // Check/Uncheck Checkbox For All Checkboxes On Courses Table
  const checkUncheckAllCourses = function(e) {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // Gather all checkboxes from UI
    const checkboxes = UICtrl.getCheckBoxes("courses");

    const deleteBtn = document.querySelector(
      UISelectors.triggerDeleteCoursesModalBtn
    );

    // ======== Check/Uncheck Checkboxes ========
    if (e.target.checked) {
      checkboxes.forEach(function(checkbox) {
        // Check all if not disabled
        if (checkbox.disabled === false) {
          checkbox.checked = true;
          deleteBtn.disabled = false;
        }
      });
    } else {
      // Uncheck all if disabled
      checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
        deleteBtn.disabled = true;
      });
    }
  };

  //Sort Table
  const sortTable = function(e) {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // ======== Find Which Is The Column Index To Sort ========

    let columnNames;
    let columnClassName;
    let sortSymbolClassName;
    let clickedColumnSortSymbol;

    // Get the column names $ the class name of clicked column
    if (e.target.classList.contains("fas")) {
      columnNames = e.target.parentElement.parentElement.children;
      columnClassName = e.target.parentElement.className;
      sortSymbolClassName = e.target.className;
      clickedColumnSortSymbol = e.target;
    } else {
      columnNames = e.target.parentElement.children;
      columnClassName = e.target.className;
      sortSymbolClassName = e.target.children[0].className;
      clickedColumnSortSymbol = e.target.children[0];
    }

    // console.log(target);
    // console.log(`sortSymbol: ${sortSymbol}`);
    // console.log(`class name: ${e.target.className}`);

    // console.log("column names");
    // console.log(columnNames);

    // Get the column index
    let index = 0;
    let columnIndex;
    for (const key of columnNames) {
      console.log(
        `key.className: ${key.className} e.target.className: ${e.target.className}`
      );
      if (key.className === columnClassName) {
        console.log(key, index);
        columnIndex = index - 1;
      }
      index++;
    }

    // let sortSymbol = document.querySelector(".fa-angle-down");
    // console.log(sortSymbol);
    if (sortSymbolClassName === "fas fa-angle-down") {
      clickedColumnSortSymbol.className = "fas fa-angle-up";
    } else {
      clickedColumnSortSymbol.className = "fas fa-angle-down";
    }

    // ======== Sort The Table ========
    // Initialize vars
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;

    // Get the table to be sorted
    table = document.querySelector(UISelectors.coursesTable);

    // Set sort to start
    switching = true;

    // Set the sorting direction to ascending
    dir = "asc";

    // Get the column sort symbol
    // console.log(e.target);
    // // Get the table to be sorted

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
          // sortSymbol = document.querySelector(".fa-angle-down");
          // sortSymbol.className = "fas fa-angle-up";
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          // sortSymbol = document.querySelector(".fa-angle-up");
          // sortSymbol.className = "fas fa-angle-down";
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
