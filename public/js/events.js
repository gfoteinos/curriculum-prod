
// Click "Profile" link on dashboard faculty/student menu 
const profileClick = function () {
  window.onload = function () {
    document.getElementById("profile-list").click();
  };
}

// Click "Courses" link on dashboard faculty menu 
const coursesClick = function () {
  window.onload = function () {
    document.getElementById("course-list").click();
  };
}

// Click "Modules" link on dashboard faculty menu 
const modulesClick = function () {
  window.onload = function () {
    document.getElementById("module-list").click();
  };
}

const disableElement = function(className) {
  const element = document.querySelector(className);
  element.classList.add('icon--disabled');
}


// const methods = {
//   printMsg: () => {
//     console.log('The file is connected and useable');
//     document.getElementById('profile-list').click();
//   }
// }

// function update() {
//   console.log("this is running!")
// }

// console.log("this is running!")
// console.log('The file is connected and useable');
// document.getElementById('profile-list').click();

// // ======== Export module ========
// module.exports = methods;