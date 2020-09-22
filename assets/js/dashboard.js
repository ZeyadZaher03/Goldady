const uid = Cookies.get("uid")
const materialPricesInEgyptQuery = db.ref("materialPrices/egypt")
const userQuery = db.ref(`users/${uid}`)

const closeActivateAccountMessage = () => {
    const closeActivateMessage = document.querySelector(".activate-icon-close")
    const activeContainer = document.querySelector("#activate-div")
    const activeContainerClass = "activate-container"
    closeActivateMessage.addEventListener("click", () => {
        activeContainer.classList.remove(activeContainerClass)
        activeContainer.remove()
    })
}

closeActivateAccountMessage()

const runBuy = async () => {
    const buyForm = document.querySelector("#buyForm")
    const typeOfMaterial = buyForm["typeOfMaterial"]
    const quantityToBuy = buyForm["amount"]
    const quantityAmountUnit = buyForm["amountUnit"]
    const maxPriceLimit = buyForm["priceLimit"]
    const orderValueSummary = document.querySelector("#orderValueSummary")

    const submitButton = document.querySelector("#submitBuy")
    const resetButton = document.querySelector("#resetbuy")

    // console.log(moment)

    const allowedKeysForNumbers = (e) => {
        return isNaN(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Tab"
    }

    const getMaterialPrices = async () => {
        const egyptPrices = await materialPricesInEgyptQuery.once("value")
        return egyptPrices.val()
    }

    const getUserInfo = async () => {
        const userInfo = await userQuery.once("value")

        const goldAmount = userInfo.gold ? userInfo.gold : 0
        const silverAmount = userInfo.silver ? userInfo.silver : 0
        const balance = userInfo.balance ? userInfo.balance : 0
        return {
            userMoneyBalance: balance,
            userGoldBalance: goldAmount,
            userSilverBlance: silverAmount
        }
    }

    const amountConvetedToGrams = () => {
        quantityAmountUnit.value = "gm"
        quantityToBuy.value = "10"
        if (quantityAmountUnit.value == "gm") return quantityToBuy.value
        else if (quantityAmountUnit.value == "kg") return quantityToBuy.value * 1000
        // else // error massage
    }

    const {
        gold,
        silver
    } = await getMaterialPrices()
    const {
        userMoneyBalance,
        userGoldBalance,
        userSilverBlance
    } = await getUserInfo()
    amountConvetedToGrams()

    const calculateValue = () => {
        if (typeOfMaterial.value.toLowerCase() === "gold") return amountConvetedToGrams() * gold["22C"]
        else if (typeOfMaterial.value.toLowerCase() === "silver") return amountConvetedToGrams() * silver["22C"]
    }

    orderValueSummary.innerHTML = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'EGP'
    }).format(calculateValue())


    if (userMoneyBalance < calculateValue) {
        console.log("not enoght balance")
    } else {
        console.log("OKay")

    }

    console.log(await calculateValue())


    // const runSubmit = () => {
    //     const emptyValue = !type.value || !amount.value || !amountUnit.value || !priceLimit.value
    //     if (emptyValue) return
    //     db.ref(`goldPrices`).on("value", (snaphsot) => {
    //         const goldPrice = snaphsot.val()
    //         db.ref(`users/${uid}`).once("value", (snaphsot) => {
    //             const user = snaphsot.val()
    //             const balance = user.balance
    //             const gold = user.gold
    //             let price = 0

    //             if (amountUnit.value == "kg") {
    //                 const convertToGm = amount.value * 1000
    //                 price = convertToGm * goldPrice
    //             } else if (amountUnit.value == "gm") {
    //                 price = amount.value * goldPrice
    //             }
    //             if (price > balance) return
    //             const moneyBalance = balance - price
    //             let goldBalance = 0
    //             if (gold) {
    //                 goldBalance = gold + amount.value
    //             } else {
    //                 goldBalance = amount.value
    //             }

    //             db.ref(`users/${uid}`).update({
    //                 gold: goldBalance,
    //                 balance: moneyBalance,
    //             })

    //         })
    //     })

    // }

    // priceLimit.addEventListener("keydown", (e) => {
    //     if (allowedKeysForNumbers(e)) {
    //         e.preventDefault()
    //     }
    // })

    // priceLimit.addEventListener("change", (e) => {
    //     priceLimit.value = `EG${e.target.value}`
    // })

    // amount.addEventListener("keydown", (e) => {
    //     if (allowedKeysForNumbers(e)) {
    //         e.preventDefault()
    //     }
    // })

    // resetButton.addEventListener("click", (e) => {
    //     e.preventDefault()
    //     form.reset()
    // })

    // submitButton.addEventListener("click", (e) => {
    //     e.preventDefault()
    //     runSubmit()
    // })


    // form.addEventListener("submit", (e) => {
    //     e.preventDefault()
    //     runSubmit()
    // })
}

runBuy()

const accountBalanceData = () => {

    const balance = userQuery.child("balance")
    const gold = userQuery.child("gold")
    const silver = userQuery.child("silver")
    const accountInfoBalanceEle = document.querySelector("#account-cash-balance")
    const accountInfoGoldAmountEle = document.querySelector("#account-gold-amount")
    const accountInfoGoldPriceEle = document.querySelector("#account-gold-price")
    const accountInfoSilverAmountEle = document.querySelector("#account-silver-amount")
    const accountInfoSilverPriceEle = document.querySelector("#account-silver-price")
    const accountPortfolioValue = document.querySelector("#account-portfolio-net-value")

    const getMaterialPrices = async () => {
        const egyptPrices = await materialPricesInEgyptQuery.once("value")
        return {
            goldPrice: egyptPrices.val().gold,
            silverPrice: egyptPrices.val().silver,
        }
    }

    userQuery.on("value", async (snapshot) => {
        const user = snapshot.val()
        const {
            goldPrice,
            silverPrice
        } = await getMaterialPrices()
        const balance = user.balance ? user.balance : 0
        const gold = user.gold ? user.gold : 0
        const silver = user.silver ? user.silver : 0

        accountInfoBalanceEle.innerHTML = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'EGP'
        }).format(balance)

        // gold mass
        if (gold >= 1000) {
            accountInfoGoldAmountEle.innerHTML = `${gold/1000} KG`
        } else {
            accountInfoGoldAmountEle.innerHTML = `${gold} GM`
        }

        // gold price
        const getUserGoldPrice = gold * goldPrice["24C"]
        const getUserSilverPrice = silver * silverPrice["24C"]
        accountInfoGoldPriceEle.innerHTML = getUserGoldPrice

        accountInfoSilverPriceEle.innerHTML = getUserGoldPrice

        if (silver >= 1000) {
            accountInfoSilverAmountEle.innerHTML = `${gold/1000} KG`
        } else {
            accountInfoSilverAmountEle.innerHTML = `${gold} GM`
        }
        accountPortfolioValue.innerHTML = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'EGP'
        }).format(balance +
            getUserGoldPrice +
            getUserSilverPrice)

    })
}


accountBalanceData()

const buyAndSellTabs = () => {
    const buyButton = document.querySelector("#buyButtonTab")
    const sellButton = document.querySelector("#sellButtonTab")
    const buyContainer = document.querySelector("#buyForm")
    const sellContainer = document.querySelector("#sellForm")

    const openBuyTab = () => {
        buyButton.classList.add("dashboard-box-tabs-button--active")
        sellButton.classList.remove("dashboard-box-tabs-button--active")

        anime({
            targets: "#sellForm",
            opacity: [1, 0],
            duration: 100,
            easing: "easeInOutQuad",
            complete() {
                buyContainer.style.display = "grid"
                sellContainer.style.display = "none"
                anime({
                    targets: "#buyForm",
                    opacity: [0, 1],
                    duration: 400,
                    easing: "easeInOutQuad"
                })
            }
        })
    }

    const openSellTab = () => {
        sellButton.classList.add("dashboard-box-tabs-button--active")
        buyButton.classList.remove("dashboard-box-tabs-button--active")
        anime({
            targets: "#buyForm",
            opacity: [1, 0],
            duration: 100,
            easing: "easeInOutQuad",
            complete() {
                buyContainer.style.display = "none"
                sellContainer.style.display = "grid"
                anime({
                    targets: "#sellForm",
                    opacity: [0, 1],
                    duration: 400,
                    easing: "easeInOutQuad"
                })
            }
        })
    }

    buyButton.addEventListener("click", (e) => {
        e.preventDefault()
        openBuyTab()
    })
    sellButton.addEventListener("click", (e) => {
        e.preventDefault()
        openSellTab()
    })
}
buyAndSellTabs()

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