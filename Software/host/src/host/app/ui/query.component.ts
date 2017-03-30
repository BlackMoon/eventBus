import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import { RoutingComponent } from '../navigation/route.decorator';

/**
 * Компонент просмотра результатов выборки
 */
@Component({
    selector: 'query',    
    template: `<div #dynamicComponentContainer></div>`
})
@RoutingComponent()
export default class QueryComponent {
    private currentComponent = null;

    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

    constructor(private resolver: ComponentFactoryResolver) { }
}