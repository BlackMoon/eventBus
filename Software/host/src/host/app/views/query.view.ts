import { Component, ComponentFactoryResolver, Input, OnInit, ReflectiveInjector, ViewChild, ViewContainerRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NamedComponent, namedComponents } from '../ui/named.decorator';

declare var $: any;

const viewKey = 'view';

enum PanelMode { Off, Bottom, Right };

/**
 * Компонент просмотра результатов выборки
 */
@Component({
    selector: 'query',    
    styleUrls: ['query.view.css'], 
    templateUrl: 'query.view.html'
})
@NamedComponent()
export class QueryView implements OnInit {
    private currentComponent = null;
    
    private layoutOptions: any;
    
    private panelMode: PanelMode = PanelMode.Off;

    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

    constructor(
        private route: ActivatedRoute,
        private resolver: ComponentFactoryResolver) {

        this.layoutOptions = {
            layoutMode: "border",
            height: '100%',
            borderLayout: {
                headerHeight: 36,
                showFooter: false,
                showLeft: false,
                showRight: false
            }
        };
    }
    
    ngOnInit() {
        
        this.route.params.subscribe(params => {
           
            let viewName = params[viewKey];
            if (viewName) {                

                let inputProvider = { provide: viewName, useValue: 100 };
                let resolvedInputs = ReflectiveInjector.resolve([inputProvider]);

                let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);
                let def = namedComponents.get(viewName.toLowerCase());            // component definition
               
                if (def) {
                    let factory = this.resolver.resolveComponentFactory(<any>def);
                    let component = factory.create(injector);

                    this.dynamicComponentContainer.insert(component.hostView);
                    (this.currentComponent) && this.currentComponent.destroy();
                    this.currentComponent = component;
                }
            }
        });

        $(".toolbar, .filterbar").buttonset();

        $("#addItem").button({ icons: { primary: 'ui-icon-circle-plus' } });
        $("#editItem").button({ icons: { primary: 'ui-icon-circle-zoomin' } });
        $("#delItem").button({ icons: { primary: 'ui-icon-circle-close' } });
        $("#refresh").button({ icons: { primary: 'ui-icon-circle-check' } });
        
    }

    toolbarClick() {
        $(".toolbar button").removeClass('ui-state-focus');
    }

    togglePanel(event) {
        debugger;
        this.panelMode++;

        event.target.textContent = this.panelMode;

        //this.layoutManagerRef.options.borderLayout.showRight = true;

        switch (this.panelMode) {

            case PanelMode.Bottom:
                
                break;

            case PanelMode.Right:
                break;

            default:
                //this.layoutManagerRef.options.borderLayout.showFooter = false;
                //this.layoutManagerRef.options.borderLayout.showRight = false;
                break;
        }

        
    }
}