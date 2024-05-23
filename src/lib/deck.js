const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export default class Deck {
    constructor(shuffle = true) {
        this.cards = [];
        this.createDeck(shuffle);
    }

    createDeck(shuffle = true) {
        this.cards = [];
        suits.forEach((suit) => {
            ranks.forEach((rank) => {
                this.cards.push({ suit, rank });
            });
        });
        if (shuffle) {
            for (let i = this.cards.length - 1; i > 0; i--) {
                let randomIdx = Math.floor(Math.random() * (i + 1));
                [this.cards[i], this.cards[randomIdx]] = [this.cards[randomIdx], this.cards[i]];
            }
        }
    }

    dealCards(nCards) {
        if (nCards > this.cards.length) {
            console.log(`Error: Attempted to draw ${nCards} cards, but only ${this.cards.length} are in the deck`)
        }
        return this.cards.splice(0, Math.min(nCards, this.cards.length));
    }

}