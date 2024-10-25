import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Games } from '../model/games';

@Injectable({
  providedIn: 'root'
})
export class OnlineGamesDataService {
  private readonly gamesCollection: AngularFirestoreCollection<Games>;

  constructor(private afs: AngularFirestore) {
    this.gamesCollection = this.afs.collection('/games');
  }

  createNewGame(game: Games): Promise<void> {
    const newGameRef = this.gamesCollection.doc(this.afs.createId()).ref;
    game.id = newGameRef.id;
    game.isLightTurn = true;
    game.moves = {};
    return newGameRef.set(game);
  }

  deleteGame(id: string): Promise<void> {
    return this.gamesCollection.doc(id).delete();
  }

  getGameById(id: string): Observable<Games | undefined> {
    return this.gamesCollection.doc<Games>(id).valueChanges();
  }

  updateGame(game: Games): Promise<void> {
    return this.gamesCollection.doc(game.id).set(game);
  }

  getAllGames(): Observable<any[]> {
    return this.gamesCollection.snapshotChanges();
  }
}
