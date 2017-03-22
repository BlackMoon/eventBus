import { Component } from '@angular/core';
import { RoutingComponent } from '../navigation/route.decorator';

const dataUrl = '/api/adkuser';

@Component({          
    templateUrl: 'users-tree.view.html'
})
@RoutingComponent()
export class UsersTreeView {
        
    private tgridOptions: any;

    constructor() {
        
        this.tgridOptions = {                        
            autoCommit: true,
            //autoGenerateColumns: false,            
            dataSource: [],
            dataSourceUrl: dataUrl,            
            enableRemoteLoadOnDemand: true,
            features: [
                { name: 'Resizing' },
                { name: 'RowSelectors' },
                { name: 'Selection' }
            ],
            width: "100%",
            height: "400px",
            
            primaryKey: "id",
            childDataKey: "objects",
            renderExpansionIndicatorColumn: true,
            columns: [
                { key: "id", headerText: "ID", width: "100px" },
                { key: "name", headerText: "name" },
                { key: "description", headerText: "description" }                
            ]
        };
    }
}