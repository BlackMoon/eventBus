import { Component } from '@angular/core';
import { RoutingComponent } from '../navigation/route.decorator';

declare var $: any;

const dataUrl = '/nodes.json';//'/api/adkuser';

@Component({          
    templateUrl: 'users-tree.view.html'
})
@RoutingComponent()
export class UsersTreeView {

    private id: string = 'tgrid';
    private tgridOptions: any;

    constructor() {

        let ds = new $.ig.TreeHierarchicalDataSource({
            dataSource: dataUrl
        });
        

        this.tgridOptions = {                        
            autoCommit: true,            
            autoGenerateColumns: false,
            dataSource: ds,            
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

        ds.dataBind();
    }
}