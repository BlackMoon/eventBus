import { EventEmitter } from '@angular/core';
import { ButtonItem } from "../models";

export interface IGridView {
    buttons: [ButtonItem];

    models: [any];
    
    changeItem(): void;

    delItem(): void;

    newItem(): void;

    // event Handlers
    rowSelectionChanged: EventEmitter<any>;
}