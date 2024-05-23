import Deck from "./deck";

export default class Controller {
    constructor(callback, playedCardsCallback){
        this._numPlayers = 4;
        this._betStartIndex = 0;
        this._betIndex = 0;
        this._betAmount = 0;
        this._playStartIndex = 0;
        this._playIndex = 0;
        this._status = 'WAITING_TO_START';
        this._callbacks = {};
        this.kitty = [];

    }

    addListener(event, callback) {
        this._callbacks[event] = callback;
    }

    _emit(event, data) {
        if (this._callbacks[event]) {
            this._callbacks[event](data);
        }
        
    }
    
    startGame() {
        //deal cards, assign order, etc
        this._players = [];
        this._betAmount = 0;
        this.playedCards = [];
        this._offsuit = '';
        this._deck = new Deck();
        for (let i=0; i < this._numPlayers; i++) {
            this._players.push(this._deck.dealCards((5)));
            this.playedCards.push(null);
        }
        this.kitty = this._deck.dealCards(3);
        this._emit('cardsUpdated', [...this.playedCards]);
        this._status = 'BETTING'
        this._emit('playersUpdated', this._players);
        this._emit('statusUpdated', this._status);

    }

    placeBet(amount) {
        if (amount > this._betAmount) {
            this._betAmount = amount;
            this._playStartIndex = this._betIndex;
        }
        this._incrementBetIndex();

        // computer plays until end of round
        while (this._betIndex != this._betStartIndex) {
            if(this._betAmount === 0) {
                this._playStartIndex = this._betIndex;
            }
            this._incrementBetIndex();
        }
        console.log(`play start from index ${this._playStartIndex}`)
        if(this._playStartIndex === 0) {
            this._players[0].push(...this.kitty);
            this._emit('cardsUpdated', [...this.playedCards]);
            this.kitty = [];
            this._status = 'SELECT_TRUMP';
        } else {
            //TODO: have computer choose trump
            this._trump = 'Hearts';
            this._status = 'DISCARD'
        }
        
        this._emit('statusUpdated', this._status);
        
    }

    chooseSuite(suite) {
        this._trump = suite;
        this._status = 'DISCARD'
        this._emit('statusUpdated', this._status);
    }

    discardCard(card) {
        if (this._players[0].length === 1) {
            return;
        }
        let index = this._players[0].indexOf(card)
        this._players[0].splice(index, 1);
        this._emit('cardsUpdated', [...this.playedCards]);
    }

    confirmDiscard() {
        this._status = 'PLAYING'
        this._playIndex = this._playStartIndex;
        this._emit('statusUpdated', this._status);
        this._players.forEach((player) => {
            if(player.length < 5) {
                player.push(...this._deck.dealCards(5-player.length))
            }
        })
        this._emit('cardsUpdated', [...this.playedCards]);
    }

    applyMove(card) {
        let index = this._players[0].indexOf(card)
        
        this.playedCards[0] = card;
        if(this._playStartIndex === 0 && card.suit !== this._trump) {
            this._offsuit = card.suit;
        }
        this._players[0].splice(index, 1);
        this._incrementPlayIndex();
        // computer plays until end of round
        while (this._playStartIndex !== null && this._playIndex != this._playStartIndex) {
            let playerHand = this.players[this._playIndex]
            let delIndex = this._generateMove(playerHand);
            this.playedCards[this._playIndex] = playerHand[delIndex]
            this._emit('cardsUpdated', [...this.playedCards]);
            this._players[this._playIndex].splice(delIndex, 1);
            this._incrementPlayIndex();
        }
        let [winner, highest] = this._runTrick(this.playedCards, this._trump, this._offsuit)
        this._offsuit = '';
        console.log(winner)
        if(this._players[0].length === 0) {
            this._status = 'OVER'
            this._emit('statusUpdated', this._status);
            return;
        }

        this.playedCards = [];
        for (let i=0; i < this._numPlayers; i++) {
            this.playedCards.push(null);
        }
        this._emit('cardsUpdated', [...this.playedCards]);
        this._emit('playersUpdated', this._players);
        this._playStartIndex = winner;
        this._playIndex = winner;

        //computer plays until player's turn
        while (this._playIndex != 0) {
            let playerHand = this.players[this._playIndex]
            let delIndex = this._generateMove(playerHand);
            this.playedCards[this._playIndex] = playerHand[delIndex]
            this._emit('cardsUpdated', [...this.playedCards]);
            if(this._playStartIndex === this._playIndex && playerHand[delIndex].suit !== this._trump) {
                this._offsuit = playerHand[delIndex].suit;
            }
            this._players[this._playIndex].splice(delIndex, 1);
            this._incrementPlayIndex();
        }

    }

    // returns index of card to play from a given hand
    _generateMove(cards) {
        return Math.floor(Math.random() * cards.length);
    }

    _incrementPlayIndex() {
        this._playIndex = (this._playIndex + 1) % this._numPlayers
    }

    _incrementBetIndex() {
        this._betIndex = (this._betIndex + 1) % this._numPlayers
    }

    get players() {
        return this._players;
    }

    /*
    cards: [{card, player}, ...]
    trumpsuit: string
    offsuit: string
    */
    _runTrick(cards, trumpsuit, offsuit) {
        let currentHigh = -1;
        let currentWinner = null;
        cards.forEach((card, i) => {
            let val = this._cardValue(card, trumpsuit, offsuit);
            if (val > currentHigh) {
                currentHigh = val;
                currentWinner = i;
            }
        });
        return [currentWinner, currentHigh];
    }

    _isRed(card) {
        return card.suit === 'Hearts' || card.suit === 'Diamonds';
    }

    
    _cardValue(card, trumpsuit, offsuit) {
        const BLACK_ORDER = ['10', '9', '8', '7', '6', '5', '4', '3', '2', 'A']
        const RED_ORDER = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        if (card.suit === trumpsuit) {
            switch (card.rank) {
                case '5':
                    return 29;
                case 'J':
                    return 28;
                case 'A':
                    return 26;
                case 'K':
                    return 25;
                case 'Q':
                    return 24;
            }
            if (this._isRed(card)) {
                return 14 + RED_ORDER.indexOf(card.rank)
            } else {
                return 14 + BLACK_ORDER.indexOf(card.rank)
            }
        } else if (card.suit === offsuit) {
            switch (card.rank) {
                case 'K':
                    return 13;
                case 'Q':
                    return 12;
                case 'J':
                    return 11;
            }
            if (this._isRed(card)) {
                return RED_ORDER.indexOf(card.rank)
            } else {
                return BLACK_ORDER.indexOf(card.rank)
            }
        } else {
            return -1;
        }
    }
}

/* game loop
1. deal each player 5 cards
2. deal 3 card kitty
3. Each player declares bet (min 15, max 30)
4. Highest bet declares suit, takes kitty
5. players discard 
6. players are dealt more cards so that everyone has 5
7. players take turns playing cards in tricks
8. players are awarded points based on how many tricks they win
9. if the bet maker didn't make his bet, he instead loses the wagered amount
10. winner is the first to 120 points
*/

/* rules
 - 5
 - J
 - A of hearts
 - A of trump suit
 - K
 - Q
 -if black
   - 2-10
 - if red
   - 10-2
 - offsuit K - J
 - offsuit A-10 (black) or 10-A (red)
 - anything else

*/