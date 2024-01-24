import { Cell } from "./Cell";
import { Direction } from "./Direction";
import { Game } from "./Game";
import { SCALE } from "./constants";

export class Worm {

    readonly INITIAL_SIZE = 3;
    readonly INITIAL_DIRECTION = 'Right';
    readonly INITIAL_POSITION = { x: 1, y: 1 };

    private head: Cell;
    private tail: Cell[];
    private directions: Direction[];
    private size: number;
    private game: Game;

    constructor(game: Game) {
        this.game = game;

        this.size = this.INITIAL_SIZE;
        this.directions = [this.INITIAL_DIRECTION];

        // initial head
        this.head = new Cell(this.INITIAL_POSITION.x, this.INITIAL_POSITION.y);

        // initial tail
        this.tail = [];
    }

    setDirection(direction: Direction) {
        const lastDirection = this.directions[this.directions.length - 1];
        if (lastDirection == 'Up' && (direction == 'Down' || direction == 'Up')) {
            return;
        }
        if (lastDirection == 'Down' && (direction == 'Up' || direction == 'Down')) {
            return;
        }
        if (lastDirection == 'Left' && (direction == 'Right' || direction == 'Left')) {
            return;
        }
        if (lastDirection == 'Right' && (direction == 'Left' || direction == 'Right')) {
            return;
        }
        this.directions.push(direction);
    }

    move() {

        // add current head to tail
        this.tail.push(this.head);

        // get next position
        this.head = this.getNext();

        // fix the worm size
        if (this.tail.length > this.size) {
            this.tail.splice(0, 1);
        }
    }

    getNext(): Cell {
        const direction = this.directions.length > 1 ? this.directions.splice(0, 1)[0] : this.directions[0];
        switch (direction) {
            case 'Up':
                return new Cell(this.head.x, this.head.y - 1);
            case 'Right':
                return new Cell(this.head.x + 1, this.head.y);
            case 'Down':
                return new Cell(this.head.x, this.head.y + 1);
            case 'Left':
                return new Cell(this.head.x - 1, this.head.y);
        }
    }

    draw(context: CanvasRenderingContext2D) {
        const { cellWidth, cellHeight, cellSizeX } = this.game.getConfiguration();
        // head
        const size = cellSizeX * SCALE / 10;
        const offset = cellSizeX * SCALE / 3;
        const x = cellWidth * this.head.x;
        const y = cellHeight * this.head.y;
        context.fillStyle = "#111111";
        context.fillRect(x, y, cellWidth, cellHeight);
        // eyes
        switch (this.directions[0]) {
            case 'Up':
                context.beginPath();
                context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Down':
                context.beginPath();
                context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Right':
                context.beginPath();
                context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Left':
                context.beginPath();
                context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
                context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
        }
        // tail
        context.fillStyle = "#333333";
        this.tail.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
    }

    grow(qty: number = 3) {
        this.size += qty;
    }

    shrink(qty: number = 3) {
        this.size -= qty;
    }

    getHead() {
        return this.head;
    }

    isWorm(cell: Cell) {
        return this.tail.find(el => cell.x == el.x && cell.y == el.y);
    }
}
