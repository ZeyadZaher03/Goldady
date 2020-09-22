auth.onAuthStateChanged((user) => {
    if (!user) return location.href = "auth.html"
    const userUid = user.uid
    Cookies.set("uid", userUid);
})
const signotubtn = document.querySelector("#signout")
signotubtn.addEventListener("click", e => {
    e.preventDefault()
    auth.signOut()
})
const uid = Cookies.get("uid");
const userQuery = db.ref(`users/${uid}`);
const materialPricesInEgyptQuery = db.ref("materialPrices/egypt");

const formatPriceToEGP = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "EGP",
    }).format(price);



const closeActivateAccountMessage = async () => {
    const activeContainer = document.querySelector("#activate-div");
    const closeActivateMessage = document.querySelector(".activate-icon-close");
    activeContainer.style.display = "none"
    const isActivated = (await (userQuery.child("activated").once("value"))).val()

    if (!isActivated) {
        // document.addEventListener("keypress", (e) => e.preventDefault())
        activeContainer.style.display = "flex"
    }

    const activeContainerClass = "activate-container";
    closeActivateMessage.addEventListener("click", () => {
        activeContainer.classList.remove(activeContainerClass);
        activeContainer.remove();
    });
};

closeActivateAccountMessage();

const runBuy = async () => {
    const buyForm = document.querySelector("#buyForm");
    const typeOfMaterial = buyForm["typeOfMaterial"];
    const quantityToBuy = buyForm["amount"];
    const quantityAmountUnit = buyForm["amountUnit"];
    const maxPriceLimit = buyForm["priceLimit"];
    const orderValueSummary = document.querySelector("#orderValueSummary");

    const submitButton = document.querySelector("#submitBuy");
    const resetButton = document.querySelector("#resetbuy");

    const allowedKeysForNumbers = (e) => {
        return (
            isNaN(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight" &&
            e.key !== "ArrowUp" &&
            e.key !== "ArrowDown" &&
            e.key !== "." &&
            e.key !== "Tab"
        );
    };

    //  validation

    maxPriceLimit.addEventListener("keydown", (e) => {
        if (allowedKeysForNumbers(e)) return e.preventDefault();
    });

    quantityToBuy.addEventListener("keydown", (e) => {
        if (allowedKeysForNumbers(e)) e.preventDefault();
    });

    const buyingProccess = async () => {
        if (!typeOfMaterial.value || !quantityAmountUnit.value || !quantityToBuy.value) {
            return showTopErrorMessage("plase add quantity To Buy with and the material ");
        }

        const getMaterialPrices = async () => {
            const egyptPrices = await materialPricesInEgyptQuery.once("value");
            return {
                goldPrices: egyptPrices.val().gold,
                silverPrices: egyptPrices.val().silver,
            };
        };

        const getUserInfo = async () => {
            const userInfo = await userQuery.once("value");
            const userData = await userInfo.val();
            const goldAmount = userData.gold ? userData.gold : 0;
            const silverAmount = userData.silver ? userData.silver : 0;
            const balance = userData.balance ? userData.balance : 0;

            return {
                userMoneyBalance: balance,
                userGoldBalance: goldAmount,
                userSilverBlance: silverAmount,
            };
        };

        const amountConvetedToGrams = () => {
            if (quantityAmountUnit.value == "gm") return quantityToBuy.value;
            else if (quantityAmountUnit.value == "kg") return quantityToBuy.value * 1000;
            else showTopErrorMessage("Something Went Wronge, please try again");
        };

        const {
            goldPrices,
            silverPrices
        } = await getMaterialPrices();
        const {
            userMoneyBalance,
            userGoldBalance,
            userSilverBlance
        } = await getUserInfo();
        amountConvetedToGrams();

        const calculateValue = () => {
            if (typeOfMaterial.value.toLowerCase() === "gold") return amountConvetedToGrams() * goldPrices["22C"];
            else if (typeOfMaterial.value.toLowerCase() === "silver") return amountConvetedToGrams() * silverPrices["22C"];
        };

        orderValueSummary.innerHTML = formatPriceToEGP(calculateValue());
        // EXCEEDED THE USER PRICE LIMIT
        if (!(!maxPriceLimit.value || maxPriceLimit.value !== 0 || maxPriceLimit.value !== "")) {
            if (maxPriceLimit.value < calculateValue())
                return showTopErrorMessage(`Maximum price limit Exceeded by :${formatPriceToEGP(calculateValue() - maxPriceLimit.value)}`);
        }

        // NO ENOUGH BALANCE
        if (userMoneyBalance < calculateValue()) return showTopErrorMessage("You do not have enough Blance");

        const balanceAfterBuying = userMoneyBalance - calculateValue();
        const silverBalanceAfterBuying = userSilverBlance + amountConvetedToGrams();
        const goldBalanceAfterBuying = userGoldBalance + amountConvetedToGrams();

        if (typeOfMaterial.value === "gold") {
            userQuery
                .update({
                    balance: balanceAfterBuying,
                    gold: goldBalanceAfterBuying,
                })
                .then(() => {
                    showTopSuccessMessage("transaction have been done successfully");
                    sellForm.reset();
                });
        } else if (typeOfMaterial.value === "silver") {
            userQuery
                .update({
                    balance: balanceAfterBuying,
                    silver: silverBalanceAfterBuying,
                })
                .then(() => {
                    showTopSuccessMessage("transaction have been done successfully");
                    sellForm.reset();
                });
        }
    };

    const getTotal = async () => {
        const getMaterialPrices = async () => {
            const egyptPrices = await materialPricesInEgyptQuery.once("value");
            return egyptPrices.val();
        };

        const amountConvetedToGrams = () => {
            if (quantityAmountUnit.value == "gm") return quantityToBuy.value;
            else if (quantityAmountUnit.value == "kg") return quantityToBuy.value * 1000;
            else showTopErrorMessage("Something Went Wronge, please try again");
        };

        const {
            gold,
            silver
        } = await getMaterialPrices();
        amountConvetedToGrams();

        const calculateValue = () => {
            if (typeOfMaterial.value.toLowerCase() === "gold") return amountConvetedToGrams() * gold["22C"];
            else if (typeOfMaterial.value.toLowerCase() === "silver") return amountConvetedToGrams() * silver["22C"];
        };

        return (orderValueSummary.innerHTML = formatPriceToEGP(calculateValue()));
    };
    //   RUN THE CODE
    resetButton.addEventListener("click", (e) => {
        e.preventDefault();
        buyForm.reset();
        orderValueSummary.innerHTML = 0;
    });

    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        buyingProccess();
    });

    buyForm.addEventListener("keydown", () => {
        if (quantityAmountUnit.value && quantityToBuy.value) return getTotal();
    });
};

const runSell = async () => {
    const sellForm = document.querySelector("#sellForm");
    const typeOfMaterial = sellForm["typeOfMaterial"];
    const quantityToBuy = sellForm["amount"];
    const quantityAmountUnit = sellForm["amountUnit"];
    const maxPriceLimit = sellForm["priceLimit"];
    const orderValueSummary = document.querySelector("#orderValueSummarySell");

    const submitButton = document.querySelector("#submisell");
    const resetButton = document.querySelector("#resetsell");

    const allowedKeysForNumbers = (e) => {
        return (
            isNaN(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight" &&
            e.key !== "ArrowUp" &&
            e.key !== "ArrowDown" &&
            e.key !== "." &&
            e.key !== "Tab"
        );
    };

    //  validation

    maxPriceLimit.addEventListener("keydown", (e) => {
        if (allowedKeysForNumbers(e)) return e.preventDefault();
    });

    quantityToBuy.addEventListener("keydown", (e) => {
        if (allowedKeysForNumbers(e)) e.preventDefault();
    });

    const buyingProccess = async () => {
        if (!typeOfMaterial.value || !quantityAmountUnit.value || !quantityToBuy.value) {
            return showTopErrorMessage("plase add quantity To Buy with and the material ");
        }

        const getMaterialPrices = async () => {
            const egyptPrices = await materialPricesInEgyptQuery.once("value");
            return {
                goldPrices: egyptPrices.val().gold,
                silverPrices: egyptPrices.val().silver,
            };
        };

        const getUserInfo = async () => {
            const userInfo = await userQuery.once("value");
            const userData = await userInfo.val();
            const goldAmount = userData.gold ? userData.gold : 0;
            const silverAmount = userData.silver ? userData.silver : 0;
            const balance = userData.balance ? userData.balance : 0;

            return {
                userMoneyBalance: balance,
                userGoldBalance: goldAmount,
                userSilverBlance: silverAmount,
            };
        };

        const amountConvetedToGrams = () => {
            if (quantityAmountUnit.value == "gm") return quantityToBuy.value;
            else if (quantityAmountUnit.value == "kg") return quantityToBuy.value * 1000;
            else showTopErrorMessage("Something Went Wronge, please try again");
        };

        const {
            goldPrices,
            silverPrices
        } = await getMaterialPrices();
        const {
            userMoneyBalance,
            userGoldBalance,
            userSilverBlance
        } = await getUserInfo();
        amountConvetedToGrams();

        const calculateValue = () => {
            if (typeOfMaterial.value.toLowerCase() === "gold") return amountConvetedToGrams() * goldPrices["22C"];
            else if (typeOfMaterial.value.toLowerCase() === "silver") return amountConvetedToGrams() * silverPrices["22C"];
        };
        orderValueSummary.innerHTML = formatPriceToEGP(calculateValue());

        // NO ENOUGH BALANCE
        if (typeOfMaterial.value === "gold") {
            if (userGoldBalance < amountConvetedToGrams()) return showTopErrorMessage("You do not have enough gold to sell");
        } else if (typeOfMaterial.value === "silver") {
            if (userSilverBlance < amountConvetedToGrams()) return showTopErrorMessage("You do not have enough gold to silver");
        }
        console.log("s");
        const balanceAfterBuying = userMoneyBalance + calculateValue();
        const silverBalanceAfterBuying = userSilverBlance - amountConvetedToGrams();
        const goldBalanceAfterBuying = userGoldBalance - amountConvetedToGrams();

        if (typeOfMaterial.value === "gold") {
            userQuery
                .update({
                    balance: balanceAfterBuying,
                    gold: goldBalanceAfterBuying,
                })
                .then(() => {
                    showTopSuccessMessage("transaction have been done successfully");
                    sellForm.reset();
                });
        } else if (typeOfMaterial.value === "silver") {
            userQuery
                .update({
                    balance: balanceAfterBuying,
                    silver: silverBalanceAfterBuying,
                })
                .then(() => {
                    showTopSuccessMessage("transaction have been done successfully");
                    sellForm.reset();
                });
        }
    };

    const getTotal = async () => {
        const getMaterialPrices = async () => {
            const egyptPrices = await materialPricesInEgyptQuery.once("value");
            return egyptPrices.val();
        };

        const amountConvetedToGrams = () => {
            if (quantityAmountUnit.value == "gm") return quantityToBuy.value;
            else if (quantityAmountUnit.value == "kg") return quantityToBuy.value * 1000;
            else showTopErrorMessage("Something Went Wronge, please try again");
        };

        const {
            gold,
            silver
        } = await getMaterialPrices();
        amountConvetedToGrams();
        const calculateValue = () => {
            if (typeOfMaterial.value.toLowerCase() === "gold") return amountConvetedToGrams() * gold["22C"];
            else if (typeOfMaterial.value.toLowerCase() === "silver") return amountConvetedToGrams() * silver["22C"];
        };
        return (orderValueSummary.innerHTML = formatPriceToEGP(calculateValue()));
    };
    //   RUN THE CODE
    resetButton.addEventListener("click", (e) => {
        e.preventDefault();
        sellForm.reset();
        orderValueSummary.innerHTML = 0;
    });

    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        buyingProccess();
    });

    sellForm.addEventListener("keydown", () => {
        if (quantityAmountUnit.value && quantityToBuy.value) return getTotal();
    });
};

runSell();
runBuy();
const accountBalanceData = () => {
    const accountInfoBalanceEle = document.querySelector("#account-cash-balance");
    const accountInfoGoldAmountEle = document.querySelector("#account-gold-amount");
    const accountInfoGoldPriceEle = document.querySelector("#account-gold-price");
    const accountInfoSilverAmountEle = document.querySelector("#account-silver-amount");
    const accountInfoSilverPriceEle = document.querySelector("#account-silver-price");
    const accountPortfolioValueEle = document.querySelector("#account-portfolio-net-value");

    const getMaterialPrices = async () => {
        const egyptPrices = await materialPricesInEgyptQuery.once("value");
        return {
            goldPrice: egyptPrices.val().gold,
            silverPrice: egyptPrices.val().silver,
        };
    };

    userQuery.on("value", async (snapshot) => {
        const user = snapshot.val();
        const {
            goldPrice,
            silverPrice
        } = await getMaterialPrices();
        const balance = user.balance ? user.balance : 0;
        const gold = user.gold ? user.gold : 0;
        const silver = user.silver ? user.silver : 0;

        accountInfoBalanceEle.innerHTML = formatPriceToEGP(balance);

        // gold mass
        if (gold >= 1000) {
            accountInfoGoldAmountEle.innerHTML = `${gold / 1000} KG`;
        } else {
            accountInfoGoldAmountEle.innerHTML = `${gold} GM`;
        }

        // gold price
        const getUserGoldPrice = gold * goldPrice["24C"];
        const getUserSilverPrice = silver * silverPrice["24C"];
        accountInfoGoldPriceEle.innerHTML = getUserGoldPrice;
        accountInfoSilverPriceEle.innerHTML = getUserSilverPrice;

        if (silver >= 1000) {
            accountInfoSilverAmountEle.innerHTML = `${silver / 1000} KG`;
        } else {
            accountInfoSilverAmountEle.innerHTML = `${silver} GM`;
        }
        const accountPortfolioValue = balance + getUserGoldPrice + getUserSilverPrice;
        accountPortfolioValueEle.innerHTML = formatPriceToEGP(accountPortfolioValue);
    });
};

accountBalanceData();

const buyAndSellTabs = () => {
    const buyButton = document.querySelector("#buyButtonTab");
    const sellButton = document.querySelector("#sellButtonTab");
    const buyContainer = document.querySelector("#buyForm");
    const sellContainer = document.querySelector("#sellForm");

    const openBuyTab = () => {
        buyButton.classList.add("dashboard-box-tabs-button--active");
        sellButton.classList.remove("dashboard-box-tabs-button--active");

        anime({
            targets: "#sellForm",
            opacity: [1, 0],
            duration: 100,
            easing: "easeInOutQuad",
            complete() {
                buyContainer.style.display = "grid";
                sellContainer.style.display = "none";
                anime({
                    targets: "#buyForm",
                    opacity: [0, 1],
                    duration: 400,
                    easing: "easeInOutQuad",
                });
            },
        });
    };

    const openSellTab = () => {
        sellButton.classList.add("dashboard-box-tabs-button--active");
        buyButton.classList.remove("dashboard-box-tabs-button--active");
        anime({
            targets: "#buyForm",
            opacity: [1, 0],
            duration: 100,
            easing: "easeInOutQuad",
            complete() {
                buyContainer.style.display = "none";
                sellContainer.style.display = "grid";
                anime({
                    targets: "#sellForm",
                    opacity: [0, 1],
                    duration: 400,
                    easing: "easeInOutQuad",
                });
            },
        });
    };

    buyButton.addEventListener("click", (e) => {
        e.preventDefault();
        openBuyTab();
    });
    sellButton.addEventListener("click", (e) => {
        e.preventDefault();
        openSellTab();
    });
};
buyAndSellTabs();

// db.ref(`materialPrices`).set({
//     "egypt": {
//         "gold": {
//             "22C": 905.26,
//             "24C": 987.55
//         },
//         "silver": {
//             "22C": 205.26,
//             "24C": 287.55
//         }
//     }
// })