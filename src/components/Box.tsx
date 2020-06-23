import React from "react";
import { css } from "emotion";

interface BoxProps{
    type?:boxTypes;
    out?:boolean;
}

export enum boxTypes{
    Snake = 'snake',
    Food = 'food',
    Head = 'head'
}

export const Box = (props:BoxProps) => {
   return props.type === boxTypes.Head ? 
   <div className={S.box(props.type,props.out)}>
       <div></div>
       <div></div>
   </div>:
   <div className={S.box(props.type,props.out)}></div>

}
   

const S = {
    box:(type?:boxTypes, out:boolean = false)=>css`
        background:hsl(${type === boxTypes.Snake ? 200 : type === boxTypes.Food ? 0 :  120}, 100%, 25%); 
        border:0.5px solid hsl(120, 100%,${out ? 0 : 75}%);
        transition:border ease 500ms;
        flex-grow: 1 1;
        flex-shrink: 0;
        /** Full width divided by 8 minus 2px of border */
        flex-basis: calc((100% / 8) - 2px);  
        `
}