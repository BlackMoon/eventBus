import { AfterViewInit, Component } from '@angular/core';
import { RoutingComponent } from '../navigation/route.decorator';

declare var $: any;

const dataUrl = '/api/adkuserdto';

@Component({        
    templateUrl: 'users-tree.view.html'    
})
@RoutingComponent()
export class UsersTreeView implements AfterViewInit {

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
                { name: "ColumnMoving" },
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
            ],
	        rendered: (e, ui) => ui.owner.dataSource.settings.treeDS.customEncodeUrlFunc = (rec, expand) => `${dataUrl}?groupid=${rec.id}`                            
        };            
    }

    ngAfterViewInit() {
        
    }    
}