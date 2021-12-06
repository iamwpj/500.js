/* 
Just a test of basics.
References:
    - https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
 */

var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var joker = {
    "Value": "Joker",
    "Suit": "Joker"
}

function getDeck() {
    let deck = new Array();

    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < values.length; x++) {
            let card = { Value: values[x], Suit: suits[i] };
            deck.push(card);
        }
    }
    // Insert Joker
    deck.push(joker)

    return deck;
}

function shuffle(deck) {
    // for 1000 turns
    // switch the values of two random cards
    for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }

    return deck
}

function dealCards(deck) {

    // Inefficient, but clearly typed.
    var blind = []
    var player1 = []
    var player2 = []
    var player3 = []
    var player4 = []

    // Deal 1
    for (let i = 0; i < 3; i++) {
        player1.push(deck.pop())
        player2.push(deck.pop())
        player3.push(deck.pop())
        player4.push(deck.pop())
        blind.push(deck.pop())
    }

    // Deal 2

    for (let i = 0; i < 4; i++) {
        player1.push(deck.pop())
        player2.push(deck.pop())
        player3.push(deck.pop())
        player4.push(deck.pop())
    }
    blind.push(deck.pop())

    // Deal 3
    for (let i = 0; i < 3; i++) {
        player1.push(deck.pop())
        player2.push(deck.pop())
        player3.push(deck.pop())
        player4.push(deck.pop())
    }
    blind.push(deck.pop())

    return {
        blind,
        player1,
        player2,
        player3,
        player4
    }
}


function basicDeal() {
    deck1 = getDeck()
    let basic = dealCards(shuffle(deck1));
    return basic
}




// function testit() {
//     console.log(shuffle(getDeck()))
// }

console.log(basicDeal())