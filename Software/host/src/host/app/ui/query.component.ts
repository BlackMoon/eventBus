import { Component, ComponentFactoryResolver, Input, OnInit, ReflectiveInjector, ViewChild, ViewContainerRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingComponent } from '../navigation/route.decorator';

/**
 * Компонент просмотра результатов выборки
 */
@Component({
    selector: 'query',    
    template: `<div #dynamicComponentContainer></div>`
})
@RoutingComponent()
export class QueryComponent implements OnInit {
    private currentComponent = null;

    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

    constructor(private route: ActivatedRoute,
        private resolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            debugger;

            /*let inputProviders = Object.keys(data.inputs).map((inputName) => { return { provide: inputName, useValue: data.inputs[inputName] }; });
            let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

            let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

            let factory = this.resolver.resolveComponentFactory(data.component);

            let component = factory.create(injector);

            if (this.currentComponent) {
                this.currentComponent.destroy();
            }

            this.currentComponent = component;*/
        });
    }
}