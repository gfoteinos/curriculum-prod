
// Click "profile" link on dashboard faculty/student menu 
const profileClick = function () {
  window.onload = function () {
    document.getElementById("profile-list").click();
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