"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var route_decorator_1 = require("../navigation/route.decorator");
var dataUrl = '/api/adkuserdto';
var UsersTreeView = (function () {
    function UsersTreeView() {
        this.id = "tgrid";
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
            rendered: function (e, ui) { return ui.owner.dataSource.settings.treeDS.customEncodeUrlFunc = function (rec) { return dataUrl + "?groupid=" + rec.id; }; }
        };
    }
    UsersTreeView.prototype.ngAfterViewInit = function () {
    };
    return UsersTreeView;
}());
UsersTreeView = __decorate([
    core_1.Component({
        templateUrl: 'users-tree.view.html'
    }),
    route_decorator_1.RoutingComponent(),
    __metadata("design:paramtypes", [])
], UsersTreeView);
exports.UsersTreeView = UsersTreeView;
//# sourceMappingURL=users-tree.view.js.map