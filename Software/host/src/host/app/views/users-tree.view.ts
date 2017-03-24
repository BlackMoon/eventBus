import { Component } from '@angular/core';
import { RoutingComponent } from '../navigation/route.decorator';

declare var $: any;

const dataUrl = '/api/adkusers';

@Component({ 
    templateUrl: 'users-tree.view.html'
})
@RoutingComponent()
export class UsersTreeView {

    private id: string = "tgrid";
    private tgridOptions: any;

    constructor() {
        
        this.tgridOptions = {                                    
            autoGenerateColumns: false,
            childDataKey: "objects",            
            dataSource: [],
            dataSourceUrl: dataUrl,        
            enableRemoteLoadOnDemand: true,
            features: [
                { name: "Resizing" },
                { name: "RowSelectors" },
                { name: "Selection" }
            ],
            initialExpandDepth: 1,            
            primaryKey: "id",            
            responseDataKey: "data",
            responseTotalRecCountKey: "total",            
            height: "400px",
            width: "100%",
            columns: [
                { key: "id", headerText: "id", hidden: true },
                { key: "name", headerText: "Наименование" },
                { key: "description", headerText: "Описание" },
                { key: "role", headerText: "Роль" }                                
            ]
        };
    }
}