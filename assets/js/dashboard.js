const uid = Cookies.get("uid")


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
    const form = document.querySelector("#buyForm")
    const type = form["typeOfMaterial"]
    const amount = form["amount"]
    const amountUnit = form["amountUnit"]
    const priceLimit = form["priceLimit"]


    const submitButton = document.querySelector("#submitBuy")
    const resetButton = document.querySelector("#resetbuy")



    const allowedKeysForNumbers = (e) => {
        return isNaN(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Tab"
    }

    const runSubmit = () => {
        const emptyValue = !type.value || !amount.value || !amountUnit.value || !priceLimit.value
        if (emptyValue) return
        db.ref(`goldPrices`).on("value", (snaphsot) => {
            const goldPrice = snaphsot.val()
            db.ref(`users/${uid}`).once("value", (snaphsot) => {
                const user = snaphsot.val()
                const balance = user.balance
                const gold = user.gold
                let price = 0

                if (amountUnit.value == "kg") {
                    const convertToGm = amount.value * 1000
                    price = convertToGm * goldPrice
                } else if (amountUnit.value == "gm") {
                    price = amount.value * goldPrice
                }
                if (price > balance) return
                const moneyBalance = balance - price
                let goldBalance = 0
                if (gold) {
                    goldBalance = gold + amount.value
                } else {
                    goldBalance = amount.value
                }

                db.ref(`users/${uid}`).update({
                    gold: goldBalance,
                    balance: moneyBalance,
                })

            })
        })

    }

    priceLimit.addEventListener("keydown", (e) => {
        if (allowedKeysForNumbers(e)) {
            e.preventDefault()
        }
    })

    priceLimit.addEventListener("change", (e) => {
        priceLimit.value = `EG${e.target.value}`
    })

    amount.addEventListener("keydown", (e) => {
        if (allowedKeysForNumbers(e)) {
            e.preventDefault()
        }
    })

    resetButton.addEventListener("click", (e) => {
        e.preventDefault()
        form.reset()
    })

    submitButton.addEventListener("click", (e) => {
        e.preventDefault()
        runSubmit()
    })


    form.addEventListener("submit", (e) => {
        e.preventDefault()
        runSubmit()
    })
}

runBuy()


db.ref(`users/${uid}`).on("value", (snapshot) => {
    console.log(snapshot.val())
})