import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { css } from 'emotion';
import { Box, boxTypes } from './Box';

enum Directions{
    Right = 39,
    Left = 37,
    Up = 38,
    Down =40
}

const STARTING_SQARES:number[] = [27,28];
const STARTING_DIRECTION:Directions = Directions.Right;

@observer
export class MainContainer extends React.Component<{}>{

    @computed get boxes():JSX.Element[]{
        const boxes:JSX.Element[] = [];
        for (let index = 0; index < 64; index++) {
            boxes.push(
                <Box key={index} out={this.out} type={
                    this.snakeBoxes.includes(index) ? 
                        (index === 0 ? boxTypes.Head  :boxTypes.Snake) : 
                        this.foodBox === index ? boxTypes.Food : undefined
                } />
            )   
        }
        return boxes;
    }

    @computed get score():number{
        return this.snakeBoxes.length - 2;
    } 

    @computed get nextSquare():number{
        const lastSquare: number = this.snakeBoxes[this.snakeBoxes.length -1];
        switch(this.direction){
            case Directions.Right:
                return (lastSquare  + 1) % 8 === 0 ? -1 : lastSquare + 1;
            case Directions.Down:
                return  lastSquare >  55 ? -1 : lastSquare + 8;
            case Directions.Left:
                return (lastSquare) % 8 === 0 ? -1 : lastSquare - 1;
            case Directions.Up:
                return lastSquare < 8 ? -1 :  lastSquare - 8;
        }
    }

    private _foodBox = Math.floor(Math.random() * Math.floor(63));
    @computed get foodBox():number{
        while(this.snakeBoxes.includes(this._foodBox)){
            this._foodBox = Math.floor(Math.random() * Math.floor(63));
        }
        return this._foodBox;
    } 
    
    @observable snakeBoxes:number[] = STARTING_SQARES;
    @observable direction:Directions = STARTING_DIRECTION;
    @observable out:boolean = false;
    timer:NodeJS.Timer;

    startMoving = () => {
        this.timer = setInterval(() => {
            if(this.nextSquare === -1 || this.snakeBoxes.includes(this.nextSquare)){
                clearInterval(this.timer);
                this.out = true;
            }else{
                if(this.nextSquare !== this.foodBox) {
                    this.snakeBoxes.shift();
                }
                this.snakeBoxes.push(this.nextSquare);
            } 
        }, 400);
    }

    resetBoard = () =>  {
        this.snakeBoxes = STARTING_SQARES;
        this.direction = STARTING_DIRECTION;
        this.out = false;
    }

    keyDownListener = (e:KeyboardEvent) => {
        if(e.keyCode in Directions) {
            this.direction = e.keyCode;
        }
    }

    componentDidMount(){
        window.addEventListener('keydown', this.keyDownListener , true);
    }

    componentWillUnmount(){
        window.removeEventListener('keydown', this.keyDownListener , true);
    }
    render(){
        return (
            <div>
                <button onClick={this.startMoving}>Start</button>
                <button onClick={this.resetBoard}>Reset</button>
                <div>Score : {this.score}</div>
                <div className={S.mainContainer(this.out)}>
                    {this.boxes}
                </div>
            </div>
        
        );
    }
} 

const S = {
    mainContainer:(out:boolean)=>css`
        width:80vh;
        height:80vh;
        display: flex;
        align-items: stretch;
        flex-wrap:wrap;
        border:${out? `5px solid hsl(0,100%,25%)` : `0.5px solid hsl(120, 100%, 75%)`};
        transition:border ease 500ms;
    `,
}