import { AfterViewInit, Component, ComponentFactoryResolver, Input, OnInit, ReflectiveInjector, ViewChild, ViewContainerRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGridView } from './grid.view';
import { ButtonItem } from '../models';
import { Display, NamedComponent, namedComponents } from '../ui/decorators';

declare var $: any;

const viewKey = 'view';

enum PanelMode { Off, Bottom, Right };

namespace PanelMode {
    export function toName(mode: PanelMode) {

        let name: string = "";
        switch (mode) {

            case PanelMode.Off:
                name = "Выкл.";
                break;

            case PanelMode.Bottom:
                name = "Внизу";
                break;

            case PanelMode.Right:
                name = "Справа";
                break;
        }

        return name;
    }
}

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

    private $btnMode: any;
    private $footer: any;
    private $layout: any;

    private layoutOptions: any;

// ReSharper disable once InconsistentNaming
    private PanelMode = PanelMode;
    private panelMode = PanelMode.Off;

    /**
     * dynamic component instance
     */
    private view:IGridView;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

    private buttons: [ButtonItem]; 

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

        $(".toolbar, .filterbar").buttonset();
        
        for (let bi of this.buttons) {
            
            if (bi.iconCls)
                $(`#${bi.id}`).button("option", "icons", { primary: bi.iconCls });
        }

        $("#btnMode .ui-button-text").text(PanelMode.toName(this.panelMode));
        
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
                    
                    this.view = <IGridView>component.instance;
                    this.buttons = this.view.buttons;

                    this.dynamicComponentContainer.insert(component.hostView);
                    (this.currentComponent) && this.currentComponent.destroy();
                    this.currentComponent = component;
                }
            }
        });
    }

    toolbarClick(event, bi:ButtonItem) {
        $(".toolbar button").removeClass('ui-state-focus');

        bi.click && bi.click.call(bi, event);
    }

    togglePanel(event) {
        
        this.panelMode++;
        (this.panelMode > PanelMode.Right) && (this.panelMode = PanelMode.Off);

        let h = this.panelMode === PanelMode.Bottom ? '300px' : 0;

        this.$layout.css("padding-bottom", h);
        this.$footer.css("height", h);
        
        event.target.textContent = PanelMode.toName(this.panelMode);
    }
}