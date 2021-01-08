/* ================================================
 * UI CONTROLER
 * ================================================ */
const UICtrl = (function() {
  /* PRIVATE VAR & METHODS
   * ================================ */

  // -------- GATHER UI SELECTORS --------
  const UISelectors = {
    buttons_allFormsSubmit: "button[type='submit']",
    div_alertCardProfile: "#cardProfileMessage",
    link_tabProfile: "#profile-list",
    
  };

  /* PUBLIC METHODS
   * ================================ */
  return {
    getUISelectors: function() {
      return UISelectors;
    },
    formShowValidationMessages: function(position, message) {
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
    }
  };
})();

/* ================================================
 * APPLICATION CONTROLER
 * ================================================ */
const App = (function(UICtrl) {
  /* PRIVATE VAR & METHODS
   * ================================ */

  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getUISelectors();

    // ---------------- ALERT MESSAGES ----------------
    if (document.querySelector(UISelectors.div_alertCardProfile)) {
      document.querySelector(UISelectors.link_tabProfile).click();
    }

    // ---------------- FORM VALIDATION ----------------
    const formSubmitButtons = document.querySelectorAll(UISelectors.buttons_allFormsSubmit);
    console.log(formSubmitButtons);
    formSubmitButtons.forEach(button => {
      button.addEventListener("click", formValidation);
    });
  };

  // Load event listeners when the DOM content is loaded
  document.addEventListener("DOMContentLoaded", loadEventListeners);

  /* ------------------------------------------------
   * EVENTS
   * ------------------------------------------------ */
  const formValidation = function(e) {
    // Get The Form Element
    const form = e.target.closest("form");

    // Get The Defaults Browser Invalid Fields && Fields Feedback Messages
    const invalidFieldsExceptCKEditor = form.querySelectorAll(":invalid");
    const invalidFeedback = form.querySelectorAll(".error-feedback");

    console.log(invalidFieldsExceptCKEditor);
    console.log(invalidFeedback);

    // Reset Feedback Messages
    for (let i = 0; i < invalidFeedback.length; i++) {
      // Remove any feedback messages if exist
      invalidFeedback[i].parentNode.removeChild(invalidFeedback[i]);
    }

    // ======== GET ALL INVALID FIELDS ========
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

    // Cancel Submition In Case Of Invalid Fields
    if (allInvalidFields.length > 0) {
      console.log(allInvalidFields);
      e.preventDefault();
    }

    // ======== SHOW VALIDATION MESSAGE ========
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
      UICtrl.formShowValidationMessages(position, message);
    }
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
