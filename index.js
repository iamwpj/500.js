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

function whoIsMyPartner(player) {
    let val = player.slice(-1)
    if (val == 1) {
        return 'player3'
    } else if (val == 2) {
        return 'player4'
    } else if (val == 3) {
        return 'player1'
    } else if (val == 4) {
        return 'player 2'
    }
}

function basicDeal() {
    let deck1 = getDeck()
    let basic = dealCards(shuffle(deck1));
    return basic
}

// PLAY TIME
function suitRating(player) {
    // Statistics

    /*
    Currently not accounting for left baurer.
    The goal is to make a very accurate first bid and be a bit looser with the upgrade.
    This will ensure the computer can lose.

    Weight of hand:
    */
    let conversions = {
        "4": 0,
        "5": 1,
        "6": 1,
        "7": 1,
        "8": 1,
        "9": 2,
        "10": 2,
        "J": 5,
        "Q": 4,
        "K": 4,
        "A": 5,
        "Joker": 10,
    }

    let suitRating = new Object()
    suits.forEach(function(suit) {
        let bidVal = 0
        player.forEach(function(card) {
            if (card.Suit == suit) {
                bidVal += conversions[card.Value]
            }
        });
        suitRating[suit] = bidVal
    });

    return suitRating
}

function autoBid(player, deal) {

    /*
        See suitRating for additional details.
        Initial partner bid logic:
            -36 would be a guaranteed 10 tricks -
            31 - 35 means you 're missing some lows but no highs: 9 tricks -
            25 - 30 means you 're likely missing on bower or Ace and Joker: 8 tricks -
            18 - 24 hodge podge: 7 tricks -
            8 - 17 Indication: 6 tricks

        If our partner doesn 't bid (pass) or bid alternative suit we will
        analyze our odds plus theirs.
        Ex:
            Partner bid: Diamonds = 21
        My rating: Diamonds = 7
        Our final bid: 8 Diamonds(28 points)

        This bid is pretty risky!
        */


    function converter(val) {
        if (val == 36) {
            return 10
        } else if (val >= 31 && val <= 35) {
            return 9
        } else if (val >= 25 && val <= 30) {
            return 8
        } else if (val >= 18 && val <= 24) {
            return 7
        } else if (val >= 8 && val <= 17) {
            return 6
        } else {
            return 0
        }
    }

    var partner = whoIsMyPartner(player);
    // console.log(`Player: ${player}, Partner: ${partner}`);

    if (deal['bid'][partner] !== undefined) {
        var partnerBid = deal['bid'][partner]
    } else {
        var partnerBid
    }

    console.log(partnerBid);

    var myBid = new Object()
    var suit
    var hiVal
    if (partnerBid == undefined) {
        // I'm first bidder on team
        let bidOpts = new Array()
        for (var sr in deal['suit_ratings'][player]) {
            let myBidval = Math.max(deal['suit_ratings'][player][sr])
            deal[player].forEach(function(card) {
                if (card.Value == "Joker") {
                    myBidval += 10
                }
            })
            bidOpts[sr] = myBidval
        }
        hiVal = Math.max(...Object.values(bidOpts))
        for (var bid in bidOpts) {
            if (bidOpts[bid] == hiVal) {
                suit = bid
            }
        }
    }

    deal['bid'][player] = {
        [suit]: converter(hiVal)
    }
}


function testit() {
    // Dealing
    const deal = new Object(basicDeal());

    // Rate your hand
    let suitRatings = new Object();

    for (var i in deal) {
        if (i != 'blind') {
            let sr = suitRating(deal[i])
            suitRatings[i] = sr
        }
    }
    deal['suit_ratings'] = suitRatings;

    // Bidding

    deal['bid'] = new Array();
    let playerOrder = new Array('player2', 'player3', 'player4', 'player1');
    playerOrder.forEach(function(turn) {
        let bid = autoBid(turn, deal)
    });

    //
    console.log(deal)
}

testit()