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
export default (await import('vue')).defineComponent({
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
            if (!this.canStartNewGame)
                return;
            this.canStartNewGame = false;
            setTimeout(() => this.canStartNewGame = true, 200); // Cool-down period in milliseconds
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
            this.dealCard(this.dealerHand);
            this.dealCard(this.dealerHand);
        },
        dealCard(hand) {
            const card = this.deck.pop();
            hand.push(card);
            console.log(`Dealt card: ${card.rank} of ${card.suit} to ${hand === this.playerHand ? 'Player' : 'Dealer'}`);
        },
        handleHit() {
            if (!this.canHit || !this.betPlaced)
                return;
            this.canHit = false;
            setTimeout(() => this.canHit = true, 200); // Cool-down period in milliseconds
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
            }
            else if (playerValue === 21) {
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
            }
            else if (dealerValue > playerValue) {
                this.endGame('Dealer wins!');
            }
            else {
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
            }
            else if (this.resultMessage.includes('Dealer wins!')) {
                // No change needed here as tokens are already subtracted when the bet is placed
            }
            this.betPlaced = false;
            this.currentBet = 0; // Reset current bet
        },
        checkGameOver() {
            if (this.calculateHandValue(this.playerHand) > 21) {
                this.endGame('Player busts! Dealer wins.');
            }
            else if (this.calculateHandValue(this.dealerHand) > 21) {
                this.endGame('Dealer busts! You win.');
            }
        }
    },
    mounted() {
        this.deck = this.createDeck();
        this.startNewGame();
    },
});
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("game-board") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hands") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hand") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("cards-container") }, });
    for (const [card, index] of __VLS_getVForSourceType((__VLS_ctx.dealerHand))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((index)), ...{ class: ("card") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("cards") }, });
        (card.rank);
        (card.suit);
        // @ts-ignore
        [dealerHand,];
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hand-value") }, });
    (__VLS_ctx.dealerHandValue);
    // @ts-ignore
    [dealerHandValue,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hand") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("cards-container") }, });
    for (const [card, index] of __VLS_getVForSourceType((__VLS_ctx.playerHand))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((index)), ...{ class: ("card") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("cards") }, });
        (card.rank);
        (card.suit);
        // @ts-ignore
        [playerHand,];
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hand-value") }, });
    (__VLS_ctx.playerHandValue);
    // @ts-ignore
    [playerHandValue,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("actions-result") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("actions") }, });
    // @ts-ignore
    const __VLS_0 = {}
        .Button;
    ({}.Button);
    ({}.Button);
    __VLS_components.Button;
    __VLS_components.Button;
    // @ts-ignore
    [Button, Button,];
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.gameOver || !__VLS_ctx.betPlaced)), ...{ class: ("hitStandBtn") }, }));
    const __VLS_2 = __VLS_1({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.gameOver || !__VLS_ctx.betPlaced)), ...{ class: ("hitStandBtn") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.gameOver || !__VLS_ctx.betPlaced)), ...{ class: ("hitStandBtn") }, }));
    let __VLS_6;
    const __VLS_7 = {
        onClick: (__VLS_ctx.handleHit)
    };
    // @ts-ignore
    [gameOver, betPlaced, handleHit,];
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    let __VLS_3;
    let __VLS_4;
    // @ts-ignore
    const __VLS_8 = {}
        .Button;
    ({}.Button);
    ({}.Button);
    __VLS_components.Button;
    __VLS_components.Button;
    // @ts-ignore
    [Button, Button,];
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.gameOver || !__VLS_ctx.betPlaced)), ...{ class: ("hitStandBtn") }, }));
    const __VLS_10 = __VLS_9({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.gameOver || !__VLS_ctx.betPlaced)), ...{ class: ("hitStandBtn") }, }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    ({}({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.gameOver || !__VLS_ctx.betPlaced)), ...{ class: ("hitStandBtn") }, }));
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.handleStand)
    };
    // @ts-ignore
    [gameOver, betPlaced, handleStand,];
    (__VLS_13.slots).default;
    const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_8, __VLS_10);
    let __VLS_11;
    let __VLS_12;
    __VLS_elementAsFunction(__VLS_intrinsicElements.br, __VLS_intrinsicElements.br)({});
    // @ts-ignore
    const __VLS_16 = {}
        .Button;
    ({}.Button);
    ({}.Button);
    __VLS_components.Button;
    __VLS_components.Button;
    // @ts-ignore
    [Button, Button,];
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({ ...{ 'onClick': {} }, ...{ class: ("newGameBtn") }, }));
    const __VLS_18 = __VLS_17({ ...{ 'onClick': {} }, ...{ class: ("newGameBtn") }, }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    ({}({ ...{ 'onClick': {} }, ...{ class: ("newGameBtn") }, }));
    let __VLS_22;
    const __VLS_23 = {
        onClick: (__VLS_ctx.startNewGame)
    };
    // @ts-ignore
    [startNewGame,];
    (__VLS_21.slots).default;
    const __VLS_21 = __VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18);
    let __VLS_19;
    let __VLS_20;
    if (__VLS_ctx.gameOver) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("result") }, });
        (__VLS_ctx.resultMessage);
        // @ts-ignore
        [gameOver, resultMessage,];
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("betting") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.tokens);
    // @ts-ignore
    [tokens,];
    // @ts-ignore
    const __VLS_24 = {}
        .Button;
    ({}.Button);
    ({}.Button);
    __VLS_components.Button;
    __VLS_components.Button;
    // @ts-ignore
    [Button, Button,];
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ ...{ 'onClick': {} }, disabled: ((10 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }));
    const __VLS_26 = __VLS_25({ ...{ 'onClick': {} }, disabled: ((10 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    ({}({ ...{ 'onClick': {} }, disabled: ((10 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }));
    let __VLS_30;
    const __VLS_31 = {
        onClick: (...[$event]) => {
            __VLS_ctx.placeBet(10);
            // @ts-ignore
            [betPlaced, tokens, placeBet,];
        }
    };
    (__VLS_29.slots).default;
    const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26);
    let __VLS_27;
    let __VLS_28;
    // @ts-ignore
    const __VLS_32 = {}
        .Button;
    ({}.Button);
    ({}.Button);
    __VLS_components.Button;
    __VLS_components.Button;
    // @ts-ignore
    [Button, Button,];
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ ...{ 'onClick': {} }, disabled: ((25 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }));
    const __VLS_34 = __VLS_33({ ...{ 'onClick': {} }, disabled: ((25 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    ({}({ ...{ 'onClick': {} }, disabled: ((25 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }));
    let __VLS_38;
    const __VLS_39 = {
        onClick: (...[$event]) => {
            __VLS_ctx.placeBet(25);
            // @ts-ignore
            [betPlaced, tokens, placeBet,];
        }
    };
    (__VLS_37.slots).default;
    const __VLS_37 = __VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34);
    let __VLS_35;
    let __VLS_36;
    // @ts-ignore
    const __VLS_40 = {}
        .Button;
    ({}.Button);
    ({}.Button);
    __VLS_components.Button;
    __VLS_components.Button;
    // @ts-ignore
    [Button, Button,];
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({ ...{ 'onClick': {} }, disabled: ((50 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }));
    const __VLS_42 = __VLS_41({ ...{ 'onClick': {} }, disabled: ((50 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    ({}({ ...{ 'onClick': {} }, disabled: ((50 > __VLS_ctx.tokens || __VLS_ctx.betPlaced)), ...{ class: ("token") }, }));
    let __VLS_46;
    const __VLS_47 = {
        onClick: (...[$event]) => {
            __VLS_ctx.placeBet(50);
            // @ts-ignore
            [betPlaced, tokens, placeBet,];
        }
    };
    (__VLS_45.slots).default;
    const __VLS_45 = __VLS_pickFunctionalComponentCtx(__VLS_40, __VLS_42);
    let __VLS_43;
    let __VLS_44;
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['game-board'];
        __VLS_styleScopedClasses['hands'];
        __VLS_styleScopedClasses['hand'];
        __VLS_styleScopedClasses['cards-container'];
        __VLS_styleScopedClasses['card'];
        __VLS_styleScopedClasses['cards'];
        __VLS_styleScopedClasses['hand-value'];
        __VLS_styleScopedClasses['hand'];
        __VLS_styleScopedClasses['cards-container'];
        __VLS_styleScopedClasses['card'];
        __VLS_styleScopedClasses['cards'];
        __VLS_styleScopedClasses['hand-value'];
        __VLS_styleScopedClasses['actions-result'];
        __VLS_styleScopedClasses['actions'];
        __VLS_styleScopedClasses['hitStandBtn'];
        __VLS_styleScopedClasses['hitStandBtn'];
        __VLS_styleScopedClasses['newGameBtn'];
        __VLS_styleScopedClasses['result'];
        __VLS_styleScopedClasses['betting'];
        __VLS_styleScopedClasses['token'];
        __VLS_styleScopedClasses['token'];
        __VLS_styleScopedClasses['token'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {
        Button
    };
    const __VLS_name = 'GameBoard';
    let __VLS_internalComponent;
}
//# sourceMappingURL=GameBoard.vue.js.map