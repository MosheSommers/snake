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
export class Board extends React.Component{

    @computed get boxes():JSX.Element[]{
        const boxes:JSX.Element[] = [];
        for (let index = 0; index < 64; index++) {
            boxes.push(
                // <Box key={index} out={this.out} type={
                //     this.snakeBoxes.includes(index) ? 
                //         boxTypes.Snake : this.foodBox === index ? boxTypes.Food : undefined
                // } />
            )   
        }
        return boxes;
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
        return(
            <div >
                {this.boxes}
            </div>
        )
    }
}

const S = {
    board:(out:boolean)=>css`
        width:80vh;
        height:80vh;
        display: flex;
        align-items: stretch;
        flex-wrap:wrap;
        border:${out? `5px solid hsl(0,100%,25%)` : `0.5px solid hsl(120, 100%, 75%)`};
        transition:border ease 500ms;
    `,
}