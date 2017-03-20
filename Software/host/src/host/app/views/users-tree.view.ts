import { Component } from '@angular/core';
import { RoutingComponent } from '../navigation/route.decorator';

@Component({          
    templateUrl: 'users-tree.view.html'
})
@RoutingComponent()
export class UsersTreeView {

    private id: string;
    private tgridOptions: any;

    constructor() {
        
        this.tgridOptions = {
            autoCommit: true,
            dataSource: [{ "id": 0 }, { "id": 1 }, { "id": 2 }],
            width: "100%",
            height: "400px",
            autoGenerateColumns: false,
            autoGenerateColumnLayouts: false,
            primaryKey: "id",
            childDataKey: "products",
            renderExpansionIndicatorColumn: true,
            columns: [
                { key: "id", headerText: "ID", width: "100px", dataType: "number" }                
            ]
        };
    }
}