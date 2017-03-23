import { Component } from '@angular/core';
import { RoutingComponent } from '../navigation/route.decorator';

declare var $: any;

const dataUrl = '/api/adkuser';

@Component({          
    templateUrl: 'users-tree.view.html'
})
@RoutingComponent()
export class UsersTreeView {

    private id: string = 'tgrid';
    private tgridOptions: any;

    constructor() {
        
        this.tgridOptions = {                        
            autoCommit: true,            
            autoGenerateColumns: false,
            dataSource: [],
            dataSourceUrl: dataUrl,                        
            enableRemoteLoadOnDemand: true,
            features: [
                { name: 'Resizing' },
                //{ name: 'RowSelectors', rowSelectorNumberingMode: 'sequential' },
                //{ name: 'Selection' }
            ],
            initialExpandDepth: 0,
            primaryKey: "id",
            childDataKey: "objects",
            renderExpansionIndicatorColumn: true,
            height: "400px",
            width: "100%",
            columns: [
                { key: "id", headerText: "id" },
                { key: "name", headerText: "name" },
                { key: "description", headerText: "description" }                
            ]
        };
    }
}