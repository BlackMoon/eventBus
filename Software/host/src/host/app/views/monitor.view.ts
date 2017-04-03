import { Component } from '@angular/core';
import { NamedComponent } from '../ui/named.decorator';

@Component({
    styles: [``],
    template: `<ig-splitter [(options)]="splitterOptions">
                   <div>1</div> 
                   <div>2</div> 
               </ig-splitter>`
})
@NamedComponent('monitor')
export class MonitorView {
    private splitterOptions: any;

    constructor() {
        this.splitterOptions = {
            orientation: "horizontal",
            height: '100%',
            panels: [
                { size: "50%", min: "40%", max: "55%", collapsed: true, collapsible: true },
                { collapsible: true }
            ]
        }
    }

}