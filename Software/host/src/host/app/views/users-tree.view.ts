import { AfterViewInit, Component } from '@angular/core';
import { IGridView } from './grid.view';
import { NamedComponent } from '../ui/decorators';

declare var $: any;

const dataUrl = 'http://webtest.aquilon.ru:808/api/adkuserdto';
//const dataUrl = 'http://localhost:13908/api/adkuserdto';

@Component({        
    templateUrl: 'users-tree.view.html'    
})
@NamedComponent('users-tree')
export class UsersTreeView implements AfterViewInit, IGridView {

    private id: string = 'tgrid';
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
            height: "100%",
            width: "100%",
            columns: [
                { key: "id", headerText: "id", hidden: true },
                { key: "name", headerText: "Наименование" },
                { key: "description", headerText: "Описание" },
                { key: "role", headerText: "Роль" }                                
            ],
	        rendered: (e, ui) => ui.owner.dataSource.settings.treeDS.customEncodeUrlFunc = (rec) => `${dataUrl}?groupid=${rec.id}`                            
        };            
    }

    ngAfterViewInit() {
        
    }  
}