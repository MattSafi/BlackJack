<template>
    <div class="about">
      <h1>About This Blackjack Game</h1>
      <p>
        This is a simple Blackjack game created using Vue.js. The game simulates a
        basic version of Blackjack where you can play against a dealer.
      </p>
      <p>
        The objective of the game is to have a hand value as close to 21 as
        possible without going over.
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutView'
  };
  </script>
  
  <style scoped>
  .about {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>
  