<template>
  <div class="game-board">
    <!-- Tokens and Bet Amount -->
    <div class="betting">
      <div class="tokens-text">
        <span>Tokens</span>
        <span>{{ tokens }}</span>
      </div>
      <div class="bet-text">
        <span>Current Bet</span>
        <span>{{ currentBet }}</span>
      </div>
    </div>
    <div class="mobile-betting-toggle">Toggle button</div>

    <!-- Pre-game -->
    <!-- TODO: check vue docs for transition -->
    <!-- <transition> -->
    <div class="token-buttons-container" v-if="!betPlaced">
      <!-- Tokens for betting -->
      <div class="token-buttons">
        <span v-if="!betPlaced && !gameOver" class="place-a-bet-text"
          >Place A Bet To Start Playing!</span
        >
        <Button
          @click="placeBet(0)"
          :disabled="0 > tokens || betPlaced || gameOver"
          class="token-no-bet"
          >No Bet</Button
        >
        <Button
          @click="placeBet(50)"
          :disabled="50 > tokens || betPlaced || gameOver"
          class="token btn1"
          >50</Button
        >
        <Button
          @click="placeBet(100)"
          :disabled="100 > tokens || betPlaced || gameOver"
          class="token btn2"
          >100</Button
        >
        <Button
          @click="placeBet(150)"
          :disabled="150 > tokens || betPlaced || gameOver"
          class="token btn3"
          >150</Button
        >
        <Button
          @click="placeBet(200)"
          :disabled="200 > tokens || betPlaced || gameOver"
          class="token btn4"
          >200</Button
        >
        <Button
          @click="placeBet(250)"
          :disabled="250 > tokens || betPlaced || gameOver"
          class="token btn5"
          >250</Button
        >
        <Button
          @click="placeBet(300)"
          :disabled="300 > tokens || betPlaced || gameOver"
          class="token btn6"
          >300</Button
        >
      </div>
    </div>
    <!-- In-game -->
    <div v-else class="main-game-container">
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
        >{{ resultMessage }}
      </span>

      <div class="score">
        <span>Dealer</span>
        <span>{{ dealerHandValue }}</span>
      </div>
      <div class="score">
        <span>Player</span>
        <span>{{ playerHandValue }}</span>
      </div>

      <div class="newGame" v-if="gameOver">
        <Button @click="startNewGame" class="new-game-button"
          >Play Again</Button
        >
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
      // TODO: toggle this when click button
      isBettingInfoVisible: false,
      deck: [],
      playerHand: [],
      dealerHand: [],
      gameOver: false,
      resultMessage: "",
      canHit: true, // Cool-down flag for hit
      canStartNewGame: true, // Cool-down flag for new game
      tokens: 1000,
      currentBet: 0,
      betPlaced: false,
    };
  },
  computed: {
    playerHandValue() {
      return this.calculateHandValue(this.playerHand);
    },
    dealerHandValue() {
      return this.calculateHandValue(this.dealerHand);
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
      while (this.calculateHandValue(this.dealerHand) < 17) {
        this.dealCard(this.dealerHand);
      }
      this.determineWinner();
    },
    placeBet(amount) {
      if (amount <= this.tokens && !this.betPlaced && !this.gameOver) {
        this.tokens -= amount;
        this.currentBet = amount;
        this.betPlaced = true;
        console.log(`Bet placed: ${amount} tokens`);
        this.dealInitialCards(); // Deal cards after bet is placed
        this.checkTokens();
      }
    },
    calculateHandValue(hand) {
      let value = hand.reduce((acc, card) => acc + card.value, 0);
      let aces = hand.filter((card) => card.rank === "Ace").length;

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
      } else if (this.resultMessage.includes("Dealer wins!")) {
      }
      this.currentBet = 0; // Reset current bet
      this.checkTokens();
    },
    checkTokens() {
      if (this.tokens <= 0 && !this.gameOver) {
        alert("You have run out of tokens! Refresh the page to play again.");
      }
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
  background-image: radial-gradient(#1d7e53, #0c4429);
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
  transition: transform 200ms ease;
}

.actions .hit-button {
  background: #072457;
}
.actions .stand-button {
  background: #7b1414;
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
}

.result-container .modal .score {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 190px;
  font-size: 2rem;
}

@media screen and (max-width: 960px) {
  .mobile-betting-toggle {
    display: flex;
    /* TODO: position it correctly */
  }
  /* TODO: put it off screen with a toggle button */
  /* once you click toggle, slide out the betting container */
  .betting {
    /* transform: translateX(-110%); */
    /* opacity: 0.5; */
  }
}

/* TODO: token stuff */
.token-buttons {
  display: flex;
  flex-direction: column;
  /* position: fixed;
  top: 12vh;
  right: 15vw; */
  justify-self: center;
  gap: 10px;
  padding: 15px;
  color: aliceblue;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1rem;
  border: 2px double aliceblue;
  border-radius: 12px;
}

.place-a-bet-text {
  display: flex;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: aliceblue;
}

.new-game-button {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin: 5px;
  margin-top: 15px;
  color: aliceblue;
  box-shadow: 0px 0px 6px 0px #e48700;
  font-size: 1.4rem;
  border: 5px double aliceblue;
  border-radius: 10px;
  background-color: #930606;
  transition: 0.3s ease;
  padding: 10px 20px;
  cursor: pointer;
}

.new-game-button:hover {
  background-color: #010c1e;
  box-shadow: 0px 0px 10px 0px #e48700;
  color: #e48700;
}

.token {
  display: flex;
  font-weight: 600;
  font-size: auto;
  border-radius: 50%;
  padding: 8px;
  height: 50px;
  width: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border: 3px dotted aliceblue;
  transition: 0.1s ease;
}

.token.btn1,
.token.btn2 {
  background-color: #b2232f;
  color: aliceblue;
}

.token.btn3,
.token.btn4 {
  background-color: #5a5e9e;
  color: aliceblue;
}

.token.btn5,
.token.btn6 {
  background-color: #2a2a2a;
  color: aliceblue;
}

.token:hover,
.token-no-bet:hover {
  box-shadow: 0px 0px 10px 0px aliceblue;
  cursor: pointer;
  transform: scale(1.05);
}

.token-no-bet {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-size: auto;
  padding: 2px;
  height: 40px;
  width: 70px;
  background-color: #51ffeb;
  border-radius: 8px;
  transition: 0.1s ease;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 3px double black;
  transition: 0.1s ease;
}
</style>
