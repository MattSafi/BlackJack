<template>
  <header><h1>Blackjack</h1></header>
  <div class="game-board">
    <div class="hands">
      <div class="hand">
        <!-- <h3>Dealer</h3> -->
        <div class="cards-container">
          <div v-for="(card, index) in dealerHand" :key="index" class="card">
            <span class="cards">{{ card.rank }} {{ card.suit }}</span>
          </div>
        </div>
        <div class="hand-value">Dealer: {{ dealerHandValue }}</div>
      </div>
      <div class="hand">
        <!-- <h3>Player</h3> -->
        <div class="cards-container">
          <div v-for="(card, index) in playerHand" :key="index" class="card">
            <span class="cards">{{ card.rank }} {{ card.suit }}</span>
          </div>
        </div>
        <div class="hand-value">Player: {{ playerHandValue }}</div>
      </div>
    </div>

    

    <div class="actions-result">
      <div class="actions" v-if="betPlaced">
        <Button
          @click="handleHit"
          :disabled="gameOver || !betPlaced"
          :class="{ 'hitStandBtn': true, 'disabledBtn': !betPlaced }"
          class="hitStandBtn" >
          Hit</Button>
          <Button
          @click="handleStand"
          :disabled="gameOver || !betPlaced"
          :class="{ 'hitStandBtn': true, 'disabledBtn': !betPlaced }"
          class="hitStandBtn" >
          Stand</Button>
      </div>
      <div class="newGame" v-if="gameOver">
        <Button @click="startNewGame" class="newGameBtn">New Game</Button>
      </div>
      <div v-if="gameOver" class="result">{{ resultMessage }}</div>
    </div>
    <div class="instructions">
      <p>Place your bet <br>to play</p>
    </div>
    <div class="betting">
      <div>Tokens: {{ tokens }}</div> 
      <Button @click="placeBet(0)" :disabled="0 > tokens || betPlaced" class="tokenNoBet">No Bet</Button>
      <Button @click="placeBet(10)" :disabled="10 > tokens || betPlaced" class="token">10</Button>
      <Button @click="placeBet(25)" :disabled="25 > tokens || betPlaced" class="token">25</Button>
      <Button @click="placeBet(50)" :disabled="50 > tokens || betPlaced" class="token">50</Button>
      <Button @click="placeBet(100)" :disabled="100 > tokens || betPlaced" class="token">100</Button>
      
    </div>
  </div>
</template>

<script>

import Button from './Button.vue';

const suits = ['♥', '♦', '♣', '♠'];
const ranks = [
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'Jack', value: 10 },
  { rank: 'Queen', value: 10 },
  { rank: 'King', value: 10 },
  { rank: 'Ace', value: 11 }
];

export default {
  name: 'GameBoard',
  components: {
    Button
  },
  data() {
    return {
      deck: [],
      playerHand: [],
      dealerHand: [],
      gameOver: false,
      resultMessage: '',
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
    }
  },
  methods: {
    createDeck() {
      console.log('Creating deck');
      const deck = [];
      suits.forEach(suit => {
        ranks.forEach(rankObj => {
          deck.push({
            suit: suit,
            rank: rankObj.rank,
            value: rankObj.value
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
      setTimeout(() => this.canStartNewGame = true, 200);  // Cool-down period in milliseconds

      console.log('Starting new game');
      this.deck = this.createDeck();
      this.playerHand = [];
      this.dealerHand = [];
      this.gameOver = false;
      this.resultMessage = '';
      this.currentBet = 0;
      this.betPlaced = false;

      console.log('Dealing initial cards');
      this.dealCard(this.playerHand);
      this.dealCard(this.playerHand);
      // this.dealCard(this.dealerHand);
      this.dealCard(this.dealerHand);
    },
    dealCard(hand) {
      const card = this.deck.pop();
      hand.push(card);
      console.log(`Dealt card: ${card.rank} of ${card.suit} to ${hand === this.playerHand ? 'Player' : 'Dealer'}`);
    },
    handleHit() {
      if (!this.canHit || !this.betPlaced) return;
      this.canHit = false;
      setTimeout(() => this.canHit = true, 200);  // Cool-down period in milliseconds
      console.log('Hit button clicked');
      if (this.gameOver) {
        return;
      }

      // Deal only one card to the player's hand
      this.dealCard(this.playerHand);
      console.log('Player hand:', this.playerHand);

      const playerValue = this.calculateHandValue(this.playerHand);

      if (playerValue > 21) {
        this.endGame('Player busts! Dealer wins.');
      } else if (playerValue === 21) {
        // Automatically stand if player hits 21
        this.handleStand();
      }
    },
    handleStand() {
      if (this.gameOver || !this.betPlaced) {
        return;
      }

      console.log('Stand button clicked');
      while (this.calculateHandValue(this.dealerHand) < 17) {
        this.dealCard(this.dealerHand);
      }
      this.determineWinner();
    },
    placeBet(amount) {
      if (amount <= this.tokens && !this.betPlaced) {
        this.tokens -= amount;
        this.currentBet = amount;
        this.betPlaced = true;
        console.log(`Bet placed: ${amount} tokens`);
      }
    },
    calculateHandValue(hand) {
      let value = hand.reduce((acc, card) => acc + card.value, 0);
      let aces = hand.filter(card => card.rank === 'Ace').length;

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
        this.endGame('You Win!');
      } else if (dealerValue > playerValue) {
        this.endGame('Dealer wins!');
      } else {
        this.endGame('It\'s a tie!');
      }
    },
    endGame(message) {
      this.gameOver = true;
      this.resultMessage = message;
      this.resolveBet();
    },
    resolveBet() {
      if (this.resultMessage.includes('You Win!')) {
        this.tokens += this.currentBet * 2; // Double the bet if player wins
      } else if (this.resultMessage.includes('Dealer wins!')) {
        // No change needed here as tokens are already subtracted when the bet is placed
      }
      this.betPlaced = false;
      this.currentBet = 0; // Reset current bet
    },
    checkGameOver() {
      if (this.calculateHandValue(this.playerHand) > 21) {
        this.endGame('Player busts! Dealer wins.');
      } else if (this.calculateHandValue(this.dealerHand) > 21) {
        this.endGame('Dealer busts! You win.');
      }
    }
  },
  mounted() {
    this.deck = this.createDeck();
    this.startNewGame();
  },
}
</script>


<style scoped>
</style>
