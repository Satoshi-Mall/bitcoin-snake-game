import { GamePlayProviderService } from "../../services/game-play-provider.service";
import { Cell } from "./Cell";
import { Configuration } from "./Configuration";
import { Grid } from "./Grid";
import { Worm } from "./Worm";
import { CELLSIZE, COLORS, HEIGHT, MAX_LEVEL, SCALE, SPEED, WIDTH } from "./constants";


export class Game {

    private canvas: HTMLCanvasElement;

    private score: number = 0;
    private running: boolean = false;
    private grid: Grid;
    private worm: Worm;
    private configuration: Configuration;
    private nextMove: number = 0;
    gamePlayProviderService: GamePlayProviderService;

    constructor(gamePlayProviderService: GamePlayProviderService) {
        this.gamePlayProviderService = gamePlayProviderService;
        this.canvas = document.createElement('Canvas') as HTMLCanvasElement;
        document.body.appendChild(this.canvas);

        // canvas element size in the page
        this.canvas.style.width = WIDTH * CELLSIZE + 'px';
        this.canvas.style.height = HEIGHT * CELLSIZE + 'px';

        // image buffer size 
        this.canvas.width = WIDTH * CELLSIZE * SCALE;
        this.canvas.height = HEIGHT * CELLSIZE * SCALE;

        // configuration
        this.configuration = {
            level: 0,
            speed: SPEED,
            width: this.canvas.width,
            height: this.canvas.height,
            nbCellsX: WIDTH,
            nbCellsY: HEIGHT,
            cellWidth: this.canvas.width / WIDTH,
            cellHeight: this.canvas.height / HEIGHT,
            color: COLORS[0]
        };

        this.worm = new Worm(this);
        this.grid = new Grid(this);

        // event listeners
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    start() {
        this.nextMove = 0;
        this.running = true;
        requestAnimationFrame(this.loop.bind(this));
        this.gamePlayProviderService.onStartGame();
    }

    stop() {
        this.running = false;
        this.gamePlayProviderService.onEndGame();
    }

    get isRunning(): boolean{
        return this.running;
    }

    getConfiguration() {
        return this.configuration;
    }

    loop(time: number) {

        if (this.running) {

            requestAnimationFrame(this.loop.bind(this));

            if (time >= this.nextMove) {

                this.nextMove = time + this.configuration.speed;

                // move once
                this.worm.move();

                // check what happened  
                switch (this.checkState()) {
                    case -1:
                        this.die();
                        break;
                    case 1:
                        this.worm.grow();
                        this.score += 100;
                        this.grid.eat(this.worm.getHead());
                        this.gamePlayProviderService.appleIsEaten();
                        if (this.grid.isDone()) {
                            this.levelUp();
                        }
                        break;
                    default:
                        // update display
                        this.paint(time);
                }
            }
        }
    }

    paint(time: number) {

        const { width, height, color, level } = this.configuration;
        const context = this.canvas.getContext("2d");

        if (context == null) return;
        // background
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);

        // level
        context.font = height + 'px Arial';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.fillStyle = 'rgba(0,0,0,0.1)';
        context.fillText(`${level + 1}`, width / 2, height / 2);

        // score
        context.font = 35 * SCALE + 'px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillStyle = 'rgba(0,0,0,0.25)';
        context.fillText(this.score.toString(), 10 * SCALE, 10 * SCALE);

        // grid
        this.grid.draw(context);
        // worm
        this.worm.draw(context);
    }

    checkState() {

        const cell = this.worm.getHead();

        // left the play area or ate itself?? 
        if (this.isOutside(cell) || this.worm.isWorm(cell)) {
            // dead
            return -1;
        }

        // ate apple?
        if (this.grid.isApple(cell)) {
            return 1;
        }

        // nothing special
        return 0;
    }

    levelUp() {
        this.score += 1000;
        this.configuration.level++;
        if (this.configuration.level < MAX_LEVEL) {
            this.configuration.speed -= 7;
            this.configuration.color = COLORS[this.configuration.level];
            this.grid.seed();
        } else {
            this.win();
        }
    }

    win() {
        alert("Congrats you beat the game!\r\n\r\nFinal Score: " + this.score);
        this.stop();
    }

    die() {
        alert("You died.\r\n\r\nFinal Score: " + this.score);
        this.stop();
    }

    isOutside(cell: Cell) {
        const { nbCellsX, nbCellsY } = this.configuration;
        return cell.x < 0 || cell.x >= nbCellsX || cell.y < 0 || cell.y >= nbCellsY;
    }

    onKeyDown(event: KeyboardEvent) {
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
    //@ts-ignore
    onTouchStart(e) {
        //@ts-ignore
        this.touch = e.changedTouches[0];
        e.preventDefault();
    }
    //@ts-ignore
    onTouchMove(e) {
        e.preventDefault();
    }
    //@ts-ignore
    onTouchEnd(e) {

        const touch = e.changedTouches[0];
        //@ts-ignore
        const distX = touch.pageX - this.touch.pageX;
        //@ts-ignore
        const distY = touch.pageY - this.touch.pageY;

        let direction = null;

        if (Math.abs(distX) >= 100) {
            direction = (distX < 0) ? 'Left' : 'Right';
        }
        else if (Math.abs(distY) >= 100) {
            direction = (distY < 0) ? 'Up' : 'Down';
        }

        if (direction) {
            //@ts-ignore
            this.worm.setDirection(direction);
        }

        e.preventDefault();
    }
}
