import { Component, OnInit } from '@angular/core';
import { DeckcardsService } from './deckcards.service';
import { MyCustomDeckofApiType } from './deckinterface';
import { cardsInterface } from './cardsInterface';

@Component({
  selector: 'app-mayoromenor',
  templateUrl: './mayoromenor.component.html',
  styleUrls: ['./mayoromenor.component.scss'],
  providers: [DeckcardsService]
})
export class MayoromenorComponent implements OnInit {

  public wins = 0;
  public losses = 0;
  public loader = true;
  public sortedCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "JACK", "QUEEN", "KING", "ACE"]
  public lowCards = ["ACE", 2, 3, 4, 5, 6, 7];
  public highCards = [8, 9, 10, "JACK", "QUEEN", "KING"];
  public BlankCard = "/assets/hideCard.png";
  public deck_id: string;
  public totalcurd: number;
  Dcards = [];
  public alreadyPlayed: boolean = false;

  constructor(private deckcardsService: DeckcardsService) { }

  ngOnInit() {
    let startSubs = this.deckcardsService.startGame().subscribe((decks: MyCustomDeckofApiType) => {

      this.drawCards(decks.deck_id);
      startSubs.unsubscribe();
    });
  }
  drawCards(deck_id) {
    this.deck_id = deck_id;

    let drawSubs = this.deckcardsService.drawCard(deck_id).subscribe((cds: cardsInterface) => {
      this.totalcurd = cds.remaining;
      this.message = "";
      cds.cards[0].viewCard = true;
      cds.cards[1].viewCard = true;
      cds.cards[0].BlankCard = cds.cards[0].images.png;
      cds.cards[1].BlankCard = this.BlankCard;
      this.Dcards = cds.cards;
      this.loader = false;
      drawSubs.unsubscribe();
    }
    );
  }
  checkHighLow(target) {
    var low = true;
    for (var i = 0; i < this.highCards.length; i++) {
      if (this.highCards[i] == target) {
        low = false;
      }
    }
    return low;
  }

  checkHigher(cartaPropia, cartaMazo) {
    if (this.getPositionInArray(this.sortedCards, cartaPropia.value)
      <= this.getPositionInArray(this.sortedCards, cartaMazo.value)) {
      return false;
    }
    return true;
  }

  getPositionInArray(sortedArray, item) {
    for (var i = 0; i < sortedArray.length; i++) {
      if (item == sortedArray[i]) {
        break;
      }
    }
    return i
  }


  checkLower(cartaPropia, cartaMazo) {
    if (this.getPositionInArray(this.sortedCards, cartaPropia.value)
      >= this.getPositionInArray(this.sortedCards, cartaMazo.value)) {
      return false;
    }
    return true;
  }


  message = "";
  fcard = false;
  scard = false;
  changeCard(dcards, type) {

    this.Dcards = dcards;
    if (type == "H") {
      if (this.checkHigher(dcards[1], dcards[0]) == false) {
        this.message = "Ja! Mandaste fruta eh";
        this.losses++;
      }
      else {
        this.message = "Pura suerte";
        this.wins++;
      }
      this.fcard = true;

    }
    else {
      if (this.checkLower(dcards[1], dcards[0]) == false) {
        this.message = "Ja! Mandaste fruta eh";
        this.losses++;
      }
      else {
        this.message = "Pura suerte";
        this.wins++;
      }

    }
    dcards[1].viewCard = true;
    dcards[1].BlankCard = dcards[1].images.png;
    return;
  }

  onSelectHigh() {
    this.changeCard(this.Dcards, "H");
    this.alreadyPlayed=true;

  }
  onSelectLow() {
    this.changeCard(this.Dcards, "L");
    this.alreadyPlayed=true;
  }
  onSelectTryAgain() {
    this.alreadyPlayed = false;
    this.message = "";
    this.loader = true;
    let newGameSubs = this.deckcardsService.newGame(this.deck_id).subscribe((decks: MyCustomDeckofApiType) => {
      this.drawCards(decks.deck_id);
      newGameSubs.unsubscribe();
    }
    );
  }
}
