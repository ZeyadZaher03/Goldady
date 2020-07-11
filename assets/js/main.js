const toggleHideAndShow = (btn, container, className, callback) => {
  const buttonItem = document.querySelector(btn);
  const containerItem = document.querySelector(container);

  buttonItem.addEventListener("click", () => {
    if (typeof callback === "function") {
      callback();
    }
    containerItem.classList.toggle(className);
  });
};

toggleHideAndShow(
  "#registration_btn",
  ".registeration_box",
  "registeration_box--vis"
);
