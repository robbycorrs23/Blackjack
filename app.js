let player = {
    name: "Rob",
    chips: 200
}

let dealer = {
    name: "Dealer",
    chips: 200
}

let pot = 0
let playerCards = []
let dealerCards = []
let playerSum = 0
let dealerSum = 0
let playerHasBlackJack = false
let dealerHasBlackJack = false
let playerIsAlive = false
let dealerIsAlive = false
let playerTurn
let message = ""
const messageEl = document.getElementById("message-el")
const playerWallet = document.getElementById("player-wallet")
const dealerWallet = document.getElementById("dealer-wallet")
const playerSumDisplay = document.getElementById("player-sum-display")
const dealerSumDisplay = document.getElementById("dealer-sum-display")
const playerImageContainer = document.querySelector(".player-image-container")
const dealerImageContainer = document.querySelector(".dealer-image-container")
const potDisplay = document.querySelector("#active-bet")
const dealNew = document.querySelector("#deal-new")
const gameOver = document.querySelector(".over")

playerWallet.textContent = player.name + ": $" + player.chips
dealerWallet.textContent = dealer.name + ": $" + dealer.chips

function getRandomCard() {
    const randomNumber = Math.floor(Math.random() * deck.length) - 1
    deck.splice(randomNumber, 1)
    return deck[randomNumber]
}


dealNew.addEventListener("click", startGame)

function startGame() {
    if (pot === 0) {
        window.alert("Please place a bet!")
    } else {
        playerIsAlive = true
        dealerIsAlive = true
        playerTurn = true
        let playerFirstCard = getRandomCard()
        let playerSecondCard = getRandomCard()
        playerCards = [playerFirstCard, playerSecondCard]
        playerTurn = false
        let dealerFirstCard = getRandomCard()
        dealerCards = [dealerFirstCard]
        getSum()
        renderGame()
        dealNew.disabled = true
        gameOver.disabled = false
    }
    
}

function resetGame () {
    playerImageContainer.innerHTML = ""
    dealerImageContainer.innerHTML = ""
    playerCards = []
    dealerCards = []
    playerSum = 0
    dealerSum = 0
    playerSumDisplay.textContent = "Player Sum: " + playerSum
    dealerSumDisplay.textContent = "Dealer Sum: " + dealerSum
    pot = 0
    walletDisplay()
    playerTurn = true
    dealNew.disabled = false
}

function renderGame() {
    console.log(dealerCards)
    console.log(playerCards)
    dealerImageContainer.textContent = ""
    for (let i = 0; i < dealerCards.length; i++) {
        let path = `images/${dealerCards[i].value + dealerCards[i].suit}.png`
        dealerImageContainer.innerHTML += `
            <img src="${path}" id="card-image">
        `
    }
    
    playerImageContainer.textContent = ""
    for (let i = 0; i < playerCards.length; i++) {
        let path = `images/${playerCards[i].value + playerCards[i].suit}.png`
        playerImageContainer.innerHTML += `
            <img src="${path}" id="card-image">
        `
    }
    
    playerSumDisplay.textContent = "Player Sum: " + playerSum
    dealerSumDisplay.textContent = "Dealer Sum: " + dealerSum
    if (playerSum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (playerSum === 21) {
        playerHasBlackJack = true
        playerTurn = false
        playerWins()
        walletDisplay()
    } else {
        playerIsAlive = false
        playerTurn = false
        dealerWins()
        walletDisplay()
    }
    messageEl.textContent = message
}


function newCard() {
    playerTurn = true
    if (playerIsAlive === true && playerHasBlackJack === false) {
        let card = getRandomCard()
        playerCards.push(card)
        getSum()
        renderGame()
        console.log(deck.length)       
    }
}

function newDealerCard() {
    let card = getRandomCard()
    dealerCards.push(card)
    getSum()
    renderGame()
    if (dealerSum < 17) {
        newDealerCard()  
    } else {
        declareWinner()
    }
}

function stand() {
    playerTurn = false
    playerSumDisplay.textContent = "Player Sum: " + playerSum
    dealerSumDisplay.textContent = "Dealer Sum: " + dealerSum
    newDealerCard()
}

function declareWinner () {
    if (dealerSum > playerSum || dealerSum === 21) {
        dealerWins ()
        walletDisplay()
    } else if (dealerSum === playerSum) {
        message = "It's a draw!"
        player.chips += (pot / 2)
        dealer.chips += (pot / 2)
        walletDisplay()
    } else {
        playerWins()
        walletDisplay()
    }
    messageEl.textContent = message
}

function getSum() {
    playerSum = playerCards.reduce((a, b) => a + b, 0)
    dealerSum = dealerCards.reduce((a, b) => a + b, 0)
}

function bet10 () {
    if (pot < player.chips && player.chips > 10 && dealer.chips > 10) {
        pot += 20
        player.chips -= 10
        dealer.chips -= 10
        walletDisplay()
    }
    potDisplay.textContent = pot
}

function walletDisplay () {
    potDisplay.textContent = 0
    playerWallet.textContent = player.name + ": $" + player.chips
    dealerWallet.textContent = dealer.name + ": $" + dealer.chips
}

function playerWins () {
    message = "Player is the winner!"
    gameOver.disabled = true
    player.chips += pot
    messageEl.textContent = message
}

function dealerWins () {
    message = "Dealer is the winner!"
    gameOver.disabled = true
    dealer.chips += pot
    messageEl.textContent = message
}
