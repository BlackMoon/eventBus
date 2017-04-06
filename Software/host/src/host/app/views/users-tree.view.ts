import { AfterViewInit, Component } from '@angular/core';
import { IGridView } from './grid.view';
import { ButtonItem } from '../models';
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
    private tgridRef: any;   

    private customEncodeUrlFunc = (r):string => `${dataUrl}?groupid=${r.id}`; 

    constructor() {

        let self = this;

        this.tgridOptions = {                                    
            autoGenerateColumns: false,                
            childDataKey: "objects",            
            create: e => self.tgridRef = $(e.target).data("igTreeGrid"),
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
            rendered: (e, ui) => ui.owner.dataSource.settings.treeDS.customEncodeUrlFunc = this.customEncodeUrlFunc                            
        };            
    }

    get buttons(): [ButtonItem] {
        
        return [
            {
                id: "addItem",
                iconCls: "ui-icon-circle-plus",
                click: () => {
                    console.log(1);    
                },
                title: "Создать"
            },
            {
                id: "editItem",
                iconCls: "ui-icon-circle-zoomin",
                title: "Изменить"
            },
            {
                id: "delItem",
                iconCls: "ui-icon-circle-close",
                title: "Удалить"
            },
            {
                id: "refresh",
                iconCls: "ui-icon-circle-check",
                click: () => {
                    this.tgridRef.dataBind();
                    this.tgridRef.dataSource.settings.treeDS.customEncodeUrlFunc = this.customEncodeUrlFunc;
                },
                title: "Обновить"
            }
        ];
    }

    get models(): [any] { return ['']; }

    ngAfterViewInit() {
        
    }  
}