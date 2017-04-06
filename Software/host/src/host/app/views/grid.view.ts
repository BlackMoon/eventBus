import { EventEmitter } from '@angular/core';
import { ButtonItem } from "../models";

export interface IGridView {
    buttons: [ButtonItem];

    models: [any];
    // event Handlers
    rowSelectionChanged: EventEmitter<any>;
}