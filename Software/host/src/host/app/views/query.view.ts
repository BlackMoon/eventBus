import { AfterViewInit, Component, ComponentFactoryResolver, Input, OnInit, ReflectiveInjector, ViewChild, ViewContainerRef} from '@angular/core';
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
export class QueryView implements AfterViewInit, OnInit {
    private currentComponent = null;
    
    private $footer: any;
    private $layout: any;

    private layoutOptions: any;

// ReSharper disable once InconsistentNaming
    private PanelMode = PanelMode;
    private panelMode = PanelMode.Off;

    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

    constructor(
        private route: ActivatedRoute,
        private resolver: ComponentFactoryResolver) {
        
        this.layoutOptions = {
            layoutMode: "border",
            height: '100%',
            borderLayout: {
                rightWidth: '20%',
                showLeft: false
            }
        };
    }

    ngAfterViewInit() {
        this.$layout = $("#layout");
        this.$footer = this.$layout.find(".footer").css("font-size", "initial");
    }  
    
    ngOnInit() {
        
        this.route.params.subscribe(params => {
           
            let viewName = params[viewKey];
            if (viewName) {                

                let inputProvider = { provide: viewName, useValue: null };
                let resolvedInputs = ReflectiveInjector.resolve([inputProvider]);
                let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

                // component definition
                let def = namedComponents.get(viewName.toLowerCase());            
               
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
        
        this.panelMode++;
        (this.panelMode > PanelMode.Right) && (this.panelMode = PanelMode.Off);

        let h = this.panelMode === PanelMode.Bottom ? '300px' : 0;

        this.$layout.css("padding-bottom", h);
        this.$footer.css("height", h);

        event.target.textContent = this.panelMode;
    }
}