import { Component, OnDestroy } from '@angular/core';
import { Game } from '../classes/game/Game';
import { Subscription, of } from 'rxjs';
import { GamePlayProviderService } from '../services/game-play-provider.service';
import { Router } from '@angular/router';
import { SinglePlayerGame } from '../classes/game/SinglePlayerGame';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnDestroy {
  game: Game | undefined;
  gameplayState: Subscription;
  constructor(private gameplayProvider: GamePlayProviderService, private router: Router) {

    this.gameplayState = this.gameplayProvider.getObserver().subscribe(isGameRunning => {
      console.log(`isGameRunning: ${isGameRunning}`)
      if (!isGameRunning) {
        this.resetGame();
      }
    })

    if (!this.gameplayProvider.gameIsValid()) {
      this.resetGame();
      return;
    }

    this.game = new SinglePlayerGame(gameplayProvider);
    this.startGame();
  }

  startGame() {
    this.game?.start();
  }

  resetGame() {
    var element = document.getElementsByTagName("canvas"), index;

    for (index = element.length - 1; index >= 0; index--) {
      element[index].parentNode?.removeChild(element[index]);
    }

    this.router.navigate([""]);
  }

  ngOnDestroy(): void {
    this.gameplayState?.unsubscribe();
  }
}
