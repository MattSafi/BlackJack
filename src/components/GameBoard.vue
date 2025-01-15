<template>
  <div class="game-board">
    <!-- Tokens and Bet Amount -->
    <div class="mobile-betting-toggle">
      <Button @click="toggleMobileBetting" class="mobile-betting-toggle-btn">
        <span>&#9824;</span>
      </Button>
    </div>

    <div :class="['betting', { active: isBettingActive }]">
      <div class="tokens-text">
        <span>Tokens</span>
        <span>{{ tokens }}</span>
      </div>
      <div class="bet-text">
        <span>Current Bet</span>
        <span>{{ currentBet }}</span>
      </div>
    </div>

    <!-- Pre-game -->

    <div class="token-buttons-container" v-if="!betPlaced">
      <span v-if="!betPlaced && !gameOver" class="place-a-bet-text">
        Place A Bet To Start Playing!
      </span>
      <div class="token-buttons">
        <Button
          v-for="amount in [
            50, 100, 150, 200, 250, 300, 400, 450, 500, 1000, 1500, 2000,
          ]"
          :key="amount"
          @click="placeBet(amount)"
          :disabled="amount > tokens || betPlaced || gameOver"
          :class="{
            token: true,
            'disabled-token': amount > tokens || betPlaced || gameOver,
          }"
          :style="{ backgroundColor: getBackgroundColor(amount) }"
        >
          <span>{{ amount }}</span>
        </Button>
      </div>
    </div>

    <!-- In-game -->

    <div v-if="betPlaced" class="main-game-container">
      <!-- Dealer's hand -->
      <div class="hands">
        <div class="cards-container">
          <div v-for="(card, index) in dealerHand" :key="index" class="card">
            <span>{{ card.rank }} {{ card.suit }}</span>
          </div>
        </div>
        <div class="hand-value">
          <span>Dealer</span>
          <span>{{ dealerHandValue }}</span>
        </div>
      </div>

      <!-- Hit and Stand Buttons -->
      <div class="actions">
        <Button @click="handleHit" :disabled="gameOver" class="hit-button">
          Hit
        </Button>
        <Button @click="handleStand" :disabled="gameOver" class="stand-button">
          Stand
        </Button>
        <Button
          v-if="canSplit"
          @click="handleSplit"
          :disabled="gameOver || !canSplit"
          class="split-button"
        >
          Split
        </Button>
      </div>

      <!-- Player's hand -->
      <div class="hands">
        <div class="hand-value">
          <span>Player</span>
          <span>{{ playerHandValue }}</span>
        </div>
        <div class="cards-container">
          <div v-for="(card, index) in playerHand" :key="index" class="card">
            <span>{{ card.rank }} {{ card.suit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Results popup -->
  <div class="result-container" v-if="gameOver">
    <div class="modal">
      <span
        v-if="gameOver && resultMessage.includes('Dealer wins!')"
        class="result dealer-result"
      >
        {{ resultMessage }}
      </span>
      <span
        v-if="gameOver && resultMessage.includes('You Win!')"
        class="result player-result"
      >
        {{ resultMessage }}
      </span>
      <span
        v-if="gameOver && resultMessage.includes('It\'s a tie!')"
        class="result tied-result"
        >{{ resultMessage }}</span
      >
      <span v-if="tokens <= 0" class="refresh-tokens"
        >You&apos;ve run out of tokens<button
          class="refresh-tokens-button"
          @click="refreshTokens()"
        >
          Refresh Tokens
        </button></span
      >

      <div class="score">
        <span>Dealer</span>
        <span>{{ dealerHandValue }}</span>
      </div>
      <div class="score">
        <span>Player</span>
        <span>{{ playerHandValue }}</span>
      </div>

      <div class="newGame" v-if="gameOver">
        <Button
          @click="startNewGame"
          :class="newGameButtonClass"
          class="new-game-button"
        >
          Play Again
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "./Button.vue";

const suits = ["♥", "♦", "♣", "♠"];
const ranks = [
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 10 },
  { rank: "Q", value: 10 },
  { rank: "K", value: 10 },
  { rank: "A", value: 11 },
];

export default {
  name: "GameBoard",
  components: {
    Button,
  },
  data() {
    return {
      deck: [],
      playerHand: [],
      dealerHand: [],
      gameOver: false,
      resultMessage: "",
      canHit: true, // Cool-down flag for hit
      canStartNewGame: true, // Cool-down flag for new game
      tokens: 2000,
      currentBet: 0,
      betPlaced: false,
      isBettingActive: true,
      canToggle: true, // Flag to control mobile toggle token frequency
      canEndPlayerTurn: true, // Cool-down flag for end player turn
      canStartDealerTurn: true, // Cool-down flag for dealer turn
      currentHandIndex: 0,
    };
  },
  computed: {
    playerHandValue() {
      return this.calculateHandValue(this.playerHand);
    },
    dealerHandValue() {
      return this.calculateHandValue(this.dealerHand);
    },

    newGameButtonClass() {
      if (this.resultMessage.includes("You Win!")) {
        return "player-wins";
      } else if (this.resultMessage.includes("Dealer wins!")) {
        return "dealer-wins";
      } else if (this.resultMessage.includes("It's a tie!")) {
        return "tie-game";
      }
      return "";
    },
  },

  methods: {
    createDeck() {
      console.log("Creating deck");
      const deck = [];
      suits.forEach((suit) => {
        ranks.forEach((rankObj) => {
          deck.push({
            suit: suit,
            rank: rankObj.rank,
            value: rankObj.value,
          });
        });
      });

      // Shuffle the deck
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      return deck;
    },
    toggleMobileBetting() {
      if (this.canToggle) {
        this.isBettingActive = !this.isBettingActive;
        this.canToggle = false;
        setTimeout(() => {
          this.canToggle = true;
        }, 200); // Set timeout to enable toggling after 200ms
      }
    },
    startNewGame() {
      if (!this.canStartNewGame) return;
      this.canStartNewGame = false;
      setTimeout(() => (this.canStartNewGame = true), 200); // Cool-down period in milliseconds

      console.log("Starting new game");
      this.deck = this.createDeck();
      this.playerHand = [];
      this.dealerHand = [];
      this.gameOver = false;
      this.resultMessage = "";
      this.currentBet = 0;
      this.betPlaced = false;
    },
    dealInitialCards() {
      console.log("Dealing initial cards");
      this.dealCard(this.playerHand);
      this.dealCard(this.playerHand);
      this.dealCard(this.dealerHand);
    },
    dealCard(hand) {
      const card = this.deck.pop();
      hand.push(card);
      console.log(
        `Dealt card: ${card.rank} of ${card.suit} to ${
          hand === this.playerHand ? "Player" : "Dealer"
        }`
      );
    },
    async dealerTurn() {
      if (!this.canStartDealerTurn) return;
      this.canStartDealerTurn = false;
      setTimeout(() => (this.canStartDealerTurn = true), 200); // Cool-down period in milliseconds

      console.log("Dealer turn started.");
      while (this.shouldDealerHit()) {
        this.dealCard(this.dealerHand);
        console.log("Dealer dealt a card. Waiting for 1 second...");
        await this.sleep(800);
      }
      console.log("Dealer's turn finished.");
      this.finishDealerTurn();
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    shouldDealerHit() {
      const dealerValue = this.calculateHandValue(this.dealerHand);
      return dealerValue < 17;
    },
    async playerTurnEnds() {
      if (!this.canEndPlayerTurn) return;
      this.canEndPlayerTurn = false;
      setTimeout(() => (this.canEndPlayerTurn = true), 200); // Cool-down period in milliseconds

      console.log("Player's turn ended");
      await this.dealerTurn(); // Ensure this function is called properly
    },
    finishDealerTurn() {
      console.log("Finishing dealer's turn");
      this.determineWinner();
    },
    handleHit() {
      if (!this.canHit || !this.betPlaced) return;
      this.canHit = false;
      setTimeout(() => (this.canHit = true), 200); // Cool-down period in milliseconds
      console.log("Hit button clicked");
      if (this.gameOver) {
        return;
      }

      // Deal only one card to the player's hand
      this.dealCard(this.playerHand);
      console.log("Player hand:", this.playerHand);

      const playerValue = this.calculateHandValue(this.playerHand);

      if (playerValue > 21) {
        this.endGame("Dealer wins!");
      } else if (playerValue === 21) {
        // Automatically stand if player hits 21
        this.handleStand();
      }
    },
    handleStand() {
      if (this.gameOver || !this.betPlaced) {
        return;
      }

      console.log("Stand button clicked");
      this.playerTurnEnds();
    },
    placeBet(amount) {
      if (amount <= this.tokens && !this.betPlaced && !this.gameOver) {
        this.tokens -= amount;
        this.currentBet = amount;
        this.betPlaced = true;
        console.log(`Bet placed: ${amount} tokens`);
        this.dealInitialCards(); // Deal cards after bet is placed
      }
    },
    getBackgroundColor(amount) {
      const colors = {
        50: "#b2232f",
        100: "#b2232f",
        150: "#5a5e9e",
        200: "#5a5e9e",
        250: "#000000",
        300: "#000000",
        400: "#0066ff",
        450: "#0066ff",
        500: "#e4a700",
        1000: "#e4a700",
        1500: "#a200ff",
        2000: "#a200ff",
      };
      return colors[amount] || "#ffffff"; // Default color if not found
    },
    handleSplit() {
      if (this.canSplit) {
        this.tokens -= this.currentBet;
        const firstCard = this.playerHands[0].pop();
        this.playerHands.push([firstCard]);
        this.dealCard(this.playerHands[0]);
        this.dealCard(this.playerHands[1]);
        console.log("Player hand split into two hands:", this.playerHands);
      }
    },
    calculateHandValue(hand) {
      let value = hand.reduce((acc, card) => acc + card.value, 0);
      let aces = hand.filter((card) => card.rank === "A").length;

      // Adjust for aces
      while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
      }

      return value;
    },
    determineWinner() {
      const playerValue = this.calculateHandValue(this.playerHand);
      const dealerValue = this.calculateHandValue(this.dealerHand);

      if (dealerValue > 21 || playerValue > dealerValue) {
        this.endGame("You Win!");
      } else if (dealerValue > playerValue) {
        this.endGame("Dealer wins!");
      } else {
        this.endGame("It's a tie!");
      }
    },
    endGame(message) {
      this.gameOver = true;
      this.resultMessage = message;
      this.resolveBet();
    },
    resolveBet() {
      if (this.resultMessage.includes("You Win!")) {
        this.tokens += this.currentBet * 2; // Double the bet if player wins
      } else if (this.resultMessage.includes("It's a tie!")) {
        this.tokens += this.currentBet; // Return the bet if it's a tie
      }
      this.currentBet = 0; // Reset current bet
    },

    refreshTokens() {
      location.reload();
    },
  },

  mounted() {
    this.deck = this.createDeck();
    this.startNewGame();
  },
};
</script>

<style scoped>
.game-board {
  display: flex;
  align-items: center;
  justify-content: center;
  color: aliceblue;
  background-image: radial-gradient(#1d7e53, #0e3b26);
  font-size: 1.5rem;
  width: 100vw;
  height: 100vh;
}

.game-board .main-game-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  max-height: 1080px;
}

.betting {
  position: absolute;
  top: 8px;
  left: 8px;
  min-width: 216px;
  background-color: #000000;
  border: 4px double #a46928;
  border-radius: 14px;
  padding: 6px;
  color: #e4a700;
  box-shadow: 0px 0px 10px 0px #e4a700;
}

.betting .tokens-text,
.betting .bet-text {
  display: flex;
  justify-content: space-between;
  filter: drop-shadow(0px 0px 6px #e4a700);
}

.mobile-betting-toggle {
  display: none;
}

.hands {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 15px;
  flex-grow: 5;
  width: 100%;
}

.hands .hand-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.3rem;
  min-width: 144px;
  border-radius: 14px;
  background: #000000;
  border: 2px double #a46928;
  padding: 10px;
  box-shadow: 0px 0px 10px 0px #e4a700;
  color: #e4a700;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  height: 100%;
  width: 100%;
}

.cards-container .card {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 3px double #0011ff;
  border-radius: 8px;
  background-color: aliceblue;
  color: black;
  height: 100%;
  max-width: 180px;
  aspect-ratio: 3/5;
  font-size: 2rem;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-grow: 2;
}

.actions .hit-button,
.actions .stand-button {
  font-size: 1.5rem;
  min-width: 100px;
  border-radius: 10px;
  border: 4px double #e48700;
  color: #e48700;
  box-shadow: 0px 0px 8px 0px #e48700;
  padding: 15px 20px;
  cursor: pointer;
  transition: transform 100ms ease;
}

.actions .hit-button {
  background: #072457;
}
.actions .stand-button {
  background: #7b1414;
}
.actions .split-button {
  display: flex;
  margin: 5px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid black;
  border-radius: 5px;
  background-color: lightblue;
}

.stand-button:hover,
.hit-button:hover {
  transform: scale(1.1);
}

.result-container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  background-color: #000000a2;
  align-items: center;
  font-size: 4rem;
  font-weight: 600;
}

.result-container .modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 510px;
  height: 370px;
  background-color: #13563b;
  border: 4px double #e48700;
  border-radius: 16px;
  color: aliceblue;
}

.result-container .modal .score {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 190px;
  font-size: 2rem;
  background-color: #000000;
  border: 4px double #a46928;
  border-radius: 14px;
  padding: 6px;
  color: #e4a700;
  box-shadow: 0px 0px 10px 0px #e4a700;
}

.new-game-button {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin: 5px;
  margin-top: 15px;
  color: #000000;
  box-shadow: 0px 0px 6px 0px #e48700;
  font-size: 1.4rem;
  border: 5px double aliceblue;
  border-radius: 10px;
  transition: 0.3s ease;
  padding: 10px 20px;
  cursor: pointer;
}

.new-game-button.player-wins {
  background-color: limegreen;
}
.new-game-button.player-wins:hover {
  background-color: rgb(29, 118, 29);
}
.new-game-button.dealer-wins {
  background-color: red;
}
.new-game-button.dealer-wins:hover {
  background-color: rgb(173, 16, 16);
}

.new-game-button.tie-game {
  background-color: yellow;
  border: 5px double #000000;
}
.new-game-button.tie-game:hover {
  background-color: rgb(165, 165, 0);
}
.refresh-tokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.4rem;
}
.refresh-tokens-button {
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 5px;
  justify-content: center;
  background-color: #000000;
  color: aliceblue;
  box-shadow: 0 0 2px 1px #e48700;
  font-size: 1rem;
  border: 2px solid aliceblue;
  border-radius: 10px;
  transition: 0.1s ease;
  padding: 8px;
  cursor: pointer;
}
.refresh-tokens-button:hover {
  transform: scale(1.01);
}

.token-buttons-container {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  color: #000000;
  padding: 5px;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.token-buttons {
  display: flex;
  flex-direction: row;

  justify-self: center;
  gap: 10px;
  padding: 15px;
  color: #000000;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1rem;

  border-radius: 12px;
}

.place-a-bet-text {
  display: flex;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: #e4a700;
}

.token {
  display: flex;
  font-weight: 600;
  font-size: 1rem;
  font-family: "Courier New", Courier, monospace;
  border-radius: 100vw;
  padding: 8px;
  height: 70px;
  width: 70px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border: 3.5px dashed aliceblue;
  position: relative;
  transition: 0.1s ease;
  background-color: currentColor;
  color: rgb(0, 0, 0);
  background-color: #e4a700;
}

.token::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: rgb(240, 248, 255);
  color: rgb(0, 0, 0);
  z-index: 0;
}

.token span {
  position: relative;
  z-index: 2; /* Ensure text is above the white center */
}

.token.btn1,
.token.btn2 {
  background-color: #b2232f;
}

.token.btn3,
.token.btn4 {
  background-color: #5a5e9e;
}

.token.btn5,
.token.btn6 {
  background-color: #e4a700;
}

.token:hover,
.token-no-bet:hover {
  box-shadow: 0px 0px 10px 0px aliceblue;
  cursor: pointer;
  transform: scale(1.1);
}

.token-no-bet {
  display: flex;
  font-weight: 600;
  font-size: 1rem;
  font-family: "Courier New", Courier, monospace;
  border-radius: 100vw;
  padding: 8px;
  height: 70px;
  width: 70px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border: 3.5px dashed aliceblue;
  position: relative;
  transition: 0.1s ease;
  background-color: #2a2a2a;
  color: rgb(0, 0, 0);
}
.token-no-bet::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: aliceblue;
  color: rgb(0, 0, 0);
  z-index: 0;
}
.token-no-bet span {
  position: relative;
  z-index: 2;
}
.disabled-token {
  display: none;
}

@media screen and (max-width: 960px) {
  .game-board {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  .mobile-betting-toggle {
    display: flex;
    position: absolute;
    top: 12vh;
    left: 5px;
    align-items: center;
  }

  .mobile-betting-toggle-btn {
    display: flex;
    justify-content: center;
    margin: 0;
    height: 35px;
    width: 35px;
    background-color: #e4a700af;
    border: 5px double #000000;
    border-radius: 8px;
    color: #e4a700;
    filter: drop-shadow(0px 0px 6px #e4a700);
    transition: 0.1s ease;
    cursor: pointer;
  }
  .mobile-betting-toggle-btn span {
    filter: drop-shadow(0px 0px 6px #e4a700);
    color: #000000;
    font-size: 1.8rem;
    justify-content: center;
    align-self: center;
  }
  .mobile-betting-toggle-btn:hover {
    transform: scale(1.01);
  }

  .betting {
    position: fixed;
    top: 0;
    left: 0;
    width: 216px;
    min-width: 216px;
    background-color: #000000;
    transform: translateX(-100%);
    transition: all 0.3s ease;
    z-index: 1000;
  }
  .betting.active {
    transform: translateX(1%);
  }
  .token-buttons-container {
    display: flex;
  }
  .token-buttons {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
  }
  .token {
    height: 50px;
    width: 50px;
    cursor: pointer;
  }
  .token::before {
    width: 35px;
    height: 35px;
  }
  .token-no-bet::before {
    width: 35px;
    height: 35px;
  }
  .cards-container {
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
  .cards-container .card {
    height: 160px;
    width: 95px;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
  }
}
</style>
