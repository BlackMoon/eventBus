import { Component, EventEmitter, Output } from '@angular/core';
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
export class UsersTreeView implements IGridView {

    private id: string = 'tgrid';
    private tgridOptions: any;
    private tgridRef: any;

    private customEncodeUrlFunc = (r): string => `${dataUrl}?groupid=${r.id}`;

    buttons: [ButtonItem] =
    [
        <ButtonItem>{
            id: "addItem",
            dropdown: true,
            icons: { primary: "ui-icon-circle-plus" },
            label: "Создать",
            click: () => {
                console.log(1);
            }
        },
        <ButtonItem>{
            id: "delItem",
            icons: { primary: "ui-icon-circle-close" },
            label: "Удалить"
        },
        <ButtonItem>{
            id: "refresh",
            icons: { primary: "ui-icon-circle-check" },
            label: "Обновить",
            click: () => {
                this.tgridRef.dataBind();
                this.tgridRef.dataSource.settings.treeDS.customEncodeUrlFunc = this.customEncodeUrlFunc;
            }
        }
    ];


    models: [any] = [''];

    constructor() {        

        this.tgridOptions = {
            autoGenerateColumns: false,
            childDataKey: "objects",
            create: e => this.tgridRef = $(e.target).data("igTreeGrid"),
            dataSource: [],
            dataSourceUrl: dataUrl,
            enableRemoteLoadOnDemand: true,
            features: [
                { name: "ColumnMoving" },
                { name: "Resizing" },
                {
                    name: "RowSelectors",
                    enableRowNumbering: false,
                    rowSelectorColumnWidth: 20
                },
                {
                    name: "Selection",
                    mode: 'row',
                    rowSelectionChanged: (e, ui) => {
                        let rec = this.tgridRef.findRecordByKey(ui.row.id);

                        this.buttons[0].disabled = (rec.objects === undefined);
                        this.rowSelectionChanged.emit({ event: e, ui: ui });
                    }
                }
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
            rendered: (e, ui) => {
                ui.owner.dataSource.settings.treeDS.customEncodeUrlFunc = this.customEncodeUrlFunc;
                ui.owner.element.igTreeGridSelection("selectRow", 0);
            }                            
        };            
    }

    changeItem(): void { }

    delItem(): void { }

    newItem(): void { }

    // event Handlers
    @Output() rowSelectionChanged: EventEmitter<any> = new EventEmitter<any>();
}