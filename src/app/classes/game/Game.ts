import { GamePlayProviderService } from "../../services/game-play-provider.service";
import { Cell } from "./Cell";
import { Configuration } from "./Configuration";
import { Grid } from "./Grid";
import { COLORS, NCELLSX, MAX_LEVEL, SCALE, SPEED, NCELLSY } from "./constants";


export abstract class Game {

    protected canvas: HTMLCanvasElement;
    private running: boolean = false;
    protected grid: Grid;
    protected configuration: Configuration;
    private nextMove: number = 0;
    gamePlayProviderService: GamePlayProviderService;
    protected context: CanvasRenderingContext2D | null;

    constructor(gamePlayProviderService: GamePlayProviderService) {
        this.gamePlayProviderService = gamePlayProviderService;
        this.canvas = document.createElement('Canvas') as HTMLCanvasElement;
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");
        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;

        const cellSizeX = Math.floor(clientWidth / NCELLSX);
        const cellSizeY = Math.floor(clientHeight / NCELLSY);

        const width = NCELLSX * cellSizeX
        const height = NCELLSY * cellSizeY
        // canvas element size in the page
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        // image buffer size 
        this.canvas.width = width * SCALE;
        this.canvas.height = height * SCALE;

        // configuration
        this.configuration = {
            level: 0,
            speed: SPEED,
            width: this.canvas.width,
            height: this.canvas.height,
            nbCellsX: NCELLSX,
            nbCellsY: NCELLSY,
            cellWidth: this.canvas.width / NCELLSX,
            cellHeight: this.canvas.height / NCELLSY,
            color: COLORS[0],
            cellSizeX: cellSizeX,
            cellSizeY: cellSizeY
        };

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

    get isRunning(): boolean {
        return this.running;
    }

    getConfiguration() {
        return this.configuration;
    }

    loop(timestamp: number) {
        if (timestamp > this.nextMove) {
            this.nextMove = timestamp + this.configuration.speed;
            this.move();
            this.processState();
        }
        if (this.running) {
            requestAnimationFrame(this.loop.bind(this));
        }
    }

    abstract processState(): void;

    abstract move(): void;

    paint() {

        const { width, height, color, level } = this.configuration;

        if (this.context == null) return;
        // background
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, width, height);

        // level
        this.context.font = height + 'px Arial';
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';
        this.context.fillStyle = 'rgba(0,0,0,0.1)';
        this.context.fillText(`${level + 1}`, width / 2, height / 2);

        this.drawStats();
        this.grid.draw(this.context);
        this.drawPlayer();
    }
    abstract drawPlayer(): void;
    abstract drawStats(): void;

    levelUp() {//todo refactor
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
        alert("Congrats you beat the game!");
        this.stop();
    }

    die() {
        alert("You died.");
        this.stop();
    }

    isOutside(cell: Cell) {
        const { nbCellsX, nbCellsY } = this.configuration;
        return cell.x < 0 || cell.x >= nbCellsX || cell.y < 0 || cell.y >= nbCellsY;
    }

    abstract handleUserInput(event: KeyboardEvent):void;

    onKeyDown(event: KeyboardEvent) {//todo refactor
        this.handleUserInput(event);
    }
    //@ts-ignore
    onTouchStart(e) {//todo refactor
        //@ts-ignore
        this.touch = e.changedTouches[0];
        e.preventDefault();
    }
    //@ts-ignore
    onTouchMove(e) {//todo refactor
        e.preventDefault();
    }
    //@ts-ignore
    onTouchEnd(e) {//todo refactor

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
