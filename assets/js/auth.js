auth.onAuthStateChanged((user) => {
  if (user && Cookies.get("logedin") == true) {
    return window.location.replace("dashboard.html");
  }
});


const login = () => {
  const loginForm = document.querySelector("#login_form");
  const loginFormButton = document.querySelector("#loginButton");

  const emailEle = loginForm["email"];
  const passwordEle = loginForm["password"];

  loginForm.addEventListener("submit", (e) => e.preventDefault());
  loginFormButton.addEventListener("click", (e) => {
    auth
      .signInWithEmailAndPassword(emailEle.value.trim(), passwordEle.value.trim())
      .then((cred) => {
        const uid = cred.user.uid;
        Cookies.set("logedin", true)
        location.href = "dashboard.html"
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
login()



const register = () => {
  const registerForm = document.querySelector("#register_form");
  const registerFormButton = document.querySelector("#registerButton");

  const fristNameEle = registerForm["firstName"];
  const lastNameEle = registerForm["lastName"];
  const emailEle = registerForm["email"];
  const confirmEmailEle = registerForm["confirm_email"];
  const passwordEle = registerForm["password"];
  const phoneNumberEle = registerForm["phone_number"];

  registerForm.addEventListener("submit", (e) => e.preventDefault());
  const errorMessage = (ele, errorMessage) => {
    const parent = ele.parentElement;
    const errEle = parent.querySelector(".input-reg-error");
    const tipEle = parent.querySelector(".input-reg-tip");

    errEle.innerHTML = errorMessage;
    errEle.classList.add("input-reg-error--active");
    tipEle.style.display = "none";
    ele.addEventListener("input", () => {
      errEle.innerHTML = "";
      tipEle.style.display = "block";
      errEle.classList.remove("input-reg-error--active");
    });
  };

  const runRegister = () => {
    const registerValidation = {
      firstName: false,
      lastName: false,
      email: false,
      confirmEmail: false,
      password: false,
      phoneNumber: false,
    };

    const verifyNames = () => {
      if (!fristNameEle.value) {
        errorMessage(fristNameEle, "First Name is Required");
        registerValidation.firstName = false;
      }
      if (!lastNameEle.value) {
        errorMessage(lastNameEle, "Last Name is Required");
        registerValidation.lastName = false;
      }
    };

    const verifyPassword = () => {
      // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9,a-z,A-Z,_]{8,}$/;
      if (!passwordEle.value) errorMessage(passwordEle, "Password is Required");
      else if (passwordEle.value.length >= 8) {
        errorMessage(passwordEle, "Password Must be 8 or more Characters containing (numbers,lowerCase,upperCase)");
        registerValidation.password = false;
      }
    };

    const verifyEmail = () => {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (!emailEle.value) {
        errorMessage(emailEle, "Please Write your Email Address");
        registerValidation.email = false;
      } else if (!emailEle.value.match(emailRegex)) {
        errorMessage(emailEle, "Invalid Email");
        registerValidation.email = false;
      }

      if (!confirmEmailEle.value) {
        errorMessage(confirmEmailEle, "Please confirm your Email Address");
        registerValidation.email = false;
      } else if (emailEle.value !== confirmEmailEle.value) {
        errorMessage(confirmEmailEle, "Email doesn't match");
        registerValidation.email = false;
      }
    };

    const verifyPhoneNumber = () => {
      const phoneNumber = phoneNumberEle.value;
      const phoneRegex = /(01)[0-9]{9}/;
      const validator = phoneNumber.match(phoneRegex);
      if (!validator) {
        errorMessage(phoneNumberEle, "Invalid Phone Number");
        registerValidation.phoneNumber = false;
      }
    };

    verifyPhoneNumber();
    verifyEmail();
    verifyNames();
    verifyPassword();

    const userInfo = {
      firstName: fristNameEle.value,
      lastName: lastNameEle.value,
      email: emailEle.value,
      activated: false,
      gold: 0,
      balance: 20,
    };

    return {
      registerValidation,
      userInfo,
      password: passwordEle.value,
    };
  };

  registerFormButton.addEventListener("click", (e) => {
    e.preventDefault();
    const {
      registerValidation,
      userInfo,
      password,
    } = runRegister();

    let isDataValid = false;

    for (const item in registerValidation) {
      if (registerValidation[item]) isDataValid = false;
      else isDataValid = true;
    }

    if (!isDataValid) return;

    auth
      .createUserWithEmailAndPassword(userInfo.email.trim(), password.trim())
      .then((cred) => {
        const uid = cred.user.uid;
        Cookies.set("uid", uid, {
          expires: 30,
        });
        Cookies.set("logedin", true)
        db.ref(`users/${uid}`).set(userInfo);
        location.href = "dashboard.html"
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// export const login = () => {};

register()