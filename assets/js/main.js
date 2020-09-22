var firebaseConfig = {
    apiKey: "AIzaSyAZkoH0U632d15FXYVtxjU7PAw0YVQd2mA",
    authDomain: "goldady-techzonelabs.firebaseapp.com",
    databaseURL: "https://goldady-techzonelabs.firebaseio.com",
    projectId: "goldady-techzonelabs",
    storageBucket: "goldady-techzonelabs.appspot.com",
    messagingSenderId: "147168306128",
    appId: "1:147168306128:web:9f303f3239449ae1f1cfd5",
    measurementId: "G-MBCEFCWX0G",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.database();
const showTopErrorMessage = (message) => {
    const cardContainer = document.querySelector(".top-card-message");
    cardContainer.classList.remove("top-card-message--succ");
    cardContainer.classList.add("top-card-message--error");
    cardContainer.innerHTML = message;
    cardContainer.style.display = "block";
    anime({
        targets: ".top-card-message",
        opacity: ["0", "1"],
        top: ["7rem", "8rem"],
        duration: 400,
        easing: "easeInOutQuad",
    });

    setTimeout(() => {
        anime({
            targets: ".top-card-message",
            opacity: ["1", "0"],
            top: ["8rem", "6rem"],
            duration: 350,
            easing: "easeInOutQuad",
        });
    }, 5000);
};

const showTopSuccessMessage = (message) => {
    const cardContainer = document.querySelector(".top-card-message");
    cardContainer.classList.remove("top-card-message--error");
    cardContainer.classList.add("top-card-message--succ");
    cardContainer.innerHTML = message;
    cardContainer.style.display = "block";
    anime({
        targets: ".top-card-message",
        opacity: ["0", "1"],
        top: ["7rem", "8rem"],
        duration: 400,
        easing: "easeInOutQuad",
    });

    setTimeout(() => {
        anime({
            targets: ".top-card-message",
            opacity: ["1", "0"],
            top: ["8rem", "6rem"],
            duration: 350,
            easing: "easeInOutQuad",
        });
    }, 5000);
};
const showBottomErrorMessage = (message) => {
    const cardContainer = document.querySelector(".side-card-message");
    cardContainer.classList.remove("side-card-message--succ");
    cardContainer.classList.add("side-card-message--error");
    cardContainer.innerHTML = message;
    cardContainer.style.display = "block";
    anime({
        targets: ".side-card-message",
        opacity: ["0", "1"],
        left: ["0", "2rem"],
        duration: 400,
        easing: "easeInOutQuad",
    });

    setTimeout(() => {
        anime({
            targets: ".side-card-message",
            opacity: ["1", "0"],
            left: ["2rem", "0"],
            duration: 350,
            easing: "easeInOutQuad",
        });
    }, 5000);
};
const showBottomSuccessMessage = (message) => {
    const cardContainer = document.querySelector(".side-card-message");
    cardContainer.classList.remove("side-card-message--error");
    cardContainer.classList.add("side-card-message--succ");
    cardContainer.innerHTML = message;
    cardContainer.style.display = "block";
    anime({
        targets: ".side-card-message",
        opacity: ["0", "1"],
        left: ["0", "2rem"],
        duration: 400,
        easing: "easeInOutQuad",
    });

    setTimeout(() => {
        anime({
            targets: ".side-card-message",
            opacity: ["1", "0"],
            left: ["2rem", "0"],
            duration: 350,
            easing: "easeInOutQuad",
        });
    }, 5000);
};