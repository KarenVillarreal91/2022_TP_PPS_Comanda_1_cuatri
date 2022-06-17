import { Injectable, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class DeckcardsService {
	
  constructor(private http:HttpClient) { }
newGame(deckId){
return this.http.get("https://deckofcardsapi.com/api/deck/"+ deckId + "/shuffle/")
}
drawCard(deckId){
	
	return this.http.get("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2")
}


startGame(){
return this.http.get("https://deckofcardsapi.com/api/deck/new/shuffle/")
}

}
