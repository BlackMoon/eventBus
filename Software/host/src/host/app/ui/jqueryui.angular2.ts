import { Component, DoCheck, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

declare var $: any;

class JqueryUiContolBase<T> implements DoCheck, OnDestroy, OnInit {

    protected allowChangeDetection = true;
    protected config: any;
    protected differ: any;
    protected el: any;
    protected opts: any = {};
    protected widgetName: string;

    public changeDetectionInterval: number;
    public widgetId: string;

    constructor(element: ElementRef, widgetName: string) {
        this.el = element.nativeElement;
        this.widgetName = widgetName;
        
        for (var opt in $.ui[this.widgetName].prototype.options) {
            Object.defineProperty(this, opt, {
                set: this.createSetter(opt),
                enumerable: true,
                configurable: true
            });
        }
    }

    @Input()
    set options(v: T) {
        
        if (this.config !== undefined && this.config !== null) {
            //if the options are alrealy set recreate the component
            $(this.el)[this.widgetName]("destroy");
            this.config = $.extend(false, this.config, v);
            $(this.el)[this.widgetName](this.config);
        }
        else
            this.config = $.extend(true, v, this.opts);
        
    };

    createSetter(name) {
        return function (value) {
            debugger;
            this.opts[name] = value;
            (this.config) && (this.config[name] = value);
            
            if ($.ui[this.widgetName] &&
                $.ui[this.widgetName].prototype.options &&
                $.ui[this.widgetName].prototype.options.hasOwnProperty(name) &&
                $(this.el).data(this.widgetName)) {
                $(this.el)[this.widgetName]("option", name, value);
            }
        }
    }

    ngDoCheck() {
        if (this.allowChangeDetection) {
            this.allowChangeDetection = false;

            let option;
            for (let p in this.config) {
                if (this.config.hasOwnProperty(p)) {
                    option = this.config[p];
                    debugger;
                    if (this.opts.hasOwnProperty(p) && this.opts[p] !== option) {
                        $(this.el)[this.widgetName]("option", p, option);
                        this.opts[p] = option;
                    }
                }
            }
        }
    }
    
    ngOnInit() {
        if (this.changeDetectionInterval === undefined || this.changeDetectionInterval === null) 
            this.changeDetectionInterval = 500;
       
        setInterval(() => this.allowChangeDetection = true, this.changeDetectionInterval);

        $(this.el).attr("id", this.widgetId);

        // store initial options for using in ngDoCheck
        this.opts = $.extend({}, this.config);
        $(this.el)[this.widgetName](this.config);
    }

    ngOnDestroy(): void {
        $(this.el)[this.widgetName]("destroy");
    }
}


/**
 * jQuery Button
 */
interface IJqueryUiButton {
    classes?: {};
    disabled: boolean;
    dropdown: boolean;
    icons?: { primary?: string, secondary?: string };
    label: string;    
    showLabel: false;
}

@Component({
    selector: '.ui-button',
    template: ``
})
export class JqueryUiButtonComponent extends JqueryUiContolBase<IJqueryUiButton>  {
    
    constructor(el: ElementRef) { super(el, "button"); }

    ngOnInit() {
        (this.config.dropdown) && (this.config.icons = $.extend(this.config.icons, { secondary: "ui-icon-triangle-1-s" }));
        super.ngOnInit();
    }

    @HostListener('click', ['$event.target'])
    onClick(event) {
        if (this.config.dropdown) {
            
        }
    }
}