import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

declare var $: any;


class JqueryUiContolBase<T> {
    @Input() options: T;

    constructor(protected el: ElementRef) {}
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
export class JqueryUiButtonComponent extends JqueryUiContolBase<IJqueryUiButton> implements OnInit, OnDestroy {
    
    constructor(el: ElementRef) { super(el); }

    ngOnInit() {
        if (this.options.dropdown) {
            this.options.icons = this.options.icons || {};
            this.options.icons.secondary = "ui-icon-triangle-1-s";
        }
        $(this.el.nativeElement).button(this.options);
    }

    ngOnDestroy(): void {
        $(this.el.nativeElement).button("destroy");   
    }
}
