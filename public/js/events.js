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
const UICtrl = (function () {
  // ======== Private var & methods ========
  const UISelectors = {
    coursesTable: '#coursesTable tbody',
    saveCourseBtn: '#saveCourseBtn'
  }

  // ======== Public Methods ========
  return {
    getUISelectors: function() {
      return UISelectors;
    }
  }
})();

// ======== Application Controler ========
const App = (function(UICtrl) {
  // ======== Private var & methods ========
  // ---- Load event listeners ----
  const loadEventListeners = function() {
    // Get UISelectors 
    const UISelectors = UICtrl.getUISelectors();
    // console.log(UISelectors.coursesTable);
    // Edit coursework event
    // document.querySelector(UISelectors.coursesTable).addEventListener("click", editCoursework);

    document.querySelector(UISelectors.coursesTable).addEventListener("click", editCourse);

    document.querySelector(UISelectors.saveCourseBtn).addEventListener("click", saveCourse);
  }

  // Edit coursework 
  const editCoursework = function(e) {
    if(e.target.classList.contains('courseEdit')) {
      console.log('Click');
      // ======== Make changes in UI at "Courses" list ========
      // -------- Gather the UI elements --------
      const title = e.target.parentNode.parentNode.previousSibling.previousSibling.previousSibling.previousSibling; 
      const titleText = title.firstChild;
      const titleInput = title.lastElementChild;
      const level = e.target.parentNode.parentNode.previousSibling.previousSibling; 
      const levelText = e.target.parentNode.parentNode.previousSibling.previousSibling.firstChild;
      const levelInput = e.target.parentNode.parentNode.previousSibling.previousSibling.lastElementChild;
      const saveBtn = e.target.parentNode.parentNode.previousSibling.previousSibling.nextElementSibling.lastElementChild;

      console.log(title, titleText, titleInput, level, levelText, levelInput);
      
      // Remove Title Text 
      title.removeChild(titleText);

      // Remove Degree Text 
      level.removeChild(levelText);

      // Remove edit button 
      e.target.parentNode.setAttribute('style', 'display: none');
      
      // Display Title Input Tag 
      titleInput.setAttribute('style', 'display: block');

      // Display Level Input Tag 
      levelInput.setAttribute('style', 'display: block');

      // Display save button 
      saveBtn.setAttribute('style', 'display: block');
    }
    
    // e.preventDefault();
  }

  const editCourse = function(e) {
    if(e.target.classList.contains('courseEdit')){
      // ======== Gather the info from course table ========
      // Title
      const title = e.target.parentElement.parentElement.parentElement.children[1].innerText;

      // Level
      const level = e.target.parentElement.parentElement.parentElement.children[2].innerText;

      // -------- Color --------
      // Select the text of DOM element & get rid of spaces 
      let color = e.target.parentElement.parentElement.parentElement.children[3].innerText.match(/([\w]+|\"[\w\s]+\")/g);
      // Convert the array to string 
      color = `#${color.toString()}`;

      // Description
      const description = e.target.parentElement.parentElement.parentElement.children[4].innerText;
      
      // Course ID 
      const courseID = e.target.parentElement.getAttribute("data-id");

      // Set Form Action 
      const action = `/dashboards/facultyMember/courses/${courseID}?_method=PUT`

      // ======== Fill in the "Edit Course" modal form ========
      //Form Action
      document.querySelector('#editCourseModal form').setAttribute("action", action); 

      // Course Name
      document.querySelector('#editCourseName').value = title; 

      // Academic Degree 
      document.querySelector('#editCourseLevel').value = level;

      // Color 
      document.querySelector('#editCourseColor').value = color;

      // ---- Description ----
      // Refresh CKEditor in order to update it's content without refresh the page 
      CKEDITOR.instances.editCourseDescription.setData( description, {
        callback: function() {
            this.checkDirty(); // true
        }
      });
    }
  }

  const saveCourse = function(e) {

    // const courseName = document.querySelector('#createCourseName').value; 
    // const academicDegree = document.querySelector('#createCourseLevel').value; 
    // const color = document.querySelector('#createCourseColor').value; 
    // const description = document.querySelector('#createCourseDescription').innerText; 
    // console.log(`courseName: ${courseName}, academicDegree: ${academicDegree}, color: ${color}, description: ${description} `);

    // e.preventDefault();
  }

  // ======== Public Methods ========
  return {
    init: function() {
      console.log('Run...');
      // Load event listeners 
      loadEventListeners();
    }
  }
})(UICtrl);

// ======== Initialize app ========
App.init();

// // ======== Export module ========
// module.exports = methods;
