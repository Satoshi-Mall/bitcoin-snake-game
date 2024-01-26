import { GamePlayProviderService } from "../../services/game-play-provider.service";
import { Game } from "./Game";
import { Worm } from "./Worm";
import { PlayerState } from "./PlayerState";
import { SCALE } from "./constants";


export class SinglePlayerGame extends Game {
    private score: number = 0;
    private worm: Worm;

    constructor(gamePlayProviderService: GamePlayProviderService) {
        super(gamePlayProviderService);
        this.worm = new Worm(this);
    }


    override drawPlayer(): void {
        if (this.context == null) return;
        this.worm.draw(this.context);
    }

    processState() {
        let state = PlayerState.ALIVE;
        const cell = this.worm.getHead();

        // left the play area or ate itself?? 
        if (this.isOutside(cell) || this.worm.isWorm(cell)) {
            // dead
            state = PlayerState.DEAD;   
        }

        // ate apple?
        if (this.grid.isApple(cell)) {
            // eaten
            state = PlayerState.EATEN;
        }
        switch (state) {
            case PlayerState.DEAD:
                this.die();
                break;
            case PlayerState.EATEN:
                this.worm.grow();
                this.score += 10;
                this.grid.eat(this.worm.getHead());
                this.gamePlayProviderService.appleIsEaten();
                if (this.grid.isDone()) {
                    this.levelUp();
                }
                break;
            default:
                // update display
                this.paint();
        }
    }

    override drawStats(): void {
        if (this.context == null) return;

        const { width, height, color, level } = this.configuration;
        // level
        this.context.font = height + 'px Arial';
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';
        this.context.fillStyle = 'rgba(0,0,0,0.1)';
        this.context.fillText(`${level + 1}`, width / 2, height / 2);



        // score
        this.context.font = 35 * SCALE + 'px Arial';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'rgba(0,0,0,0.25)';
        this.context.fillText(this.score.toString(), 10 * SCALE, 10 * SCALE);
    }

    override move(): void {
        this.worm.move();
    }

    override handleUserInput(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.worm.setDirection('Up');
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.worm.setDirection('Down');
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.worm.setDirection('Left');
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.worm.setDirection('Right');
                break;
        }
    }
    
}
