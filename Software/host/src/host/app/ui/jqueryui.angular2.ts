import { Component, DoCheck, ElementRef, EventEmitter, HostListener, Input, IterableDiffers, Renderer, OnDestroy, OnInit } from '@angular/core';

declare var $: any;

/**
 * jQuery UI control base
 */
// ReSharper disable once InconsistentNaming
class JqControlBase<Model> implements DoCheck {
// ReSharper disable InconsistentNaming
    private _differs: any;
    protected _opts: any = {};
    protected _el: any;
    protected _widgetName: string;
    protected _differ: any;
    protected _config: any;
    protected _events: Map<string, string>;
    protected _allowChangeDetection = true;
    private _evtEmmiters: any = {};
// ReSharper restore InconsistentNaming

    @Input()
    set options(v: Model) {
        if (this._config !== undefined && this._config !== null) {
            //if the options are alrealy set recreate the component
            $(this._el)[this._widgetName]("destroy");
            this._config = $.extend(false, this._config, v);
            $(this._el)[this._widgetName](this._config);
        } else {
            this._config = $.extend(true, v, this._opts);
            if (this._opts.dataSource) {
                // _config.dataSource should reference the data if the data is set as a top-level opts
                // to allow two-way data binding
                this._config.dataSource = this._opts.dataSource;
            }
            this._differ = this._differs.find([]).create(null);
        }
        this._opts = $.extend(true, {}, this._config);
        if (this._opts.dataSource) {
            delete this._opts.dataSource;
        }
    };

    public widgetId: string;
    public changeDetectionInterval: number;

    constructor(el: ElementRef, renderer: Renderer, differs: IterableDiffers, widgetName: string) {
        this._differs = differs;
        
        this._widgetName = widgetName;
        this._el = el.nativeElement;

        for (var opt in $.ui[this._widgetName].prototype.options) {
            Object.defineProperty(this, opt, {
                set: this.createSetter(opt),
                enumerable: true,
                configurable: true
            });
        }

        for (var propt in $.ui[this._widgetName].prototype.events) {
            this[propt] = new EventEmitter();
            //caching the event emmitters for cases when the event name is the same as a method name.
            this._evtEmmiters[propt] = this[propt];
        }
    }

    createSetter(name) {
        return function (value) {
            this._opts[name] = value;
            if (this._config) {
                this._config[name] = value;
            }
            if ($.ui[this._widgetName] &&
                $.ui[this._widgetName].prototype.options &&
                $.ui[this._widgetName].prototype.options.hasOwnProperty(name) &&
                $(this._el).data(this._widgetName)) {
                $(this._el)[this._widgetName]("option", name, value);
            }
        }
    }

    ngOnInit() {
        var evtName;
        this._events = new Map<string, string>();

        //events binding
        let that = this;

        for (var propt in $.ui[this._widgetName].prototype.events) {
            evtName = this._widgetName.toLowerCase() + propt.toLowerCase();
            this._events[evtName] = propt;

            $(this._el).on(evtName, (evt, ui) => {
                var emmiter = this._evtEmmiters[this._events[evt.type]];
                emmiter.emit({ event: evt, ui: ui });
            });
        }
        var propNames = Object.getOwnPropertyNames($.ui[this._widgetName].prototype);
        for (var i = 0; i < propNames.length; i++) {
            var name = propNames[i];
            if (name.indexOf("_") !== 0 && typeof $.ui[this._widgetName].prototype[name] === "function") {
                Object.defineProperty(that, name, {
                    get: that.createMethodGetter(name)
                });
            }
        }

        if (this.changeDetectionInterval === undefined || this.changeDetectionInterval === null) {
            this.changeDetectionInterval = 500;
        }

        setInterval(() => this._allowChangeDetection = true, this.changeDetectionInterval);

        $(this._el).attr("id", this.widgetId);
        if (this._config === null || this._config === undefined) {
            //if there is no config specified in the component template use the defined top-level options for a configuration
            //by invoking the setter of options property
            this.options = this._opts;
        }
        $(this._el)[this._widgetName](this._config);
    }
    createMethodGetter(name) {
        return function () {
            var widget = $(this._el).data(this._widgetName);
            return $.proxy(widget[name], widget);
        }
    }

    ngDoCheck() {
        if (this._allowChangeDetection) {
            this._allowChangeDetection = false;
            this.optionChange();
        }
    }

    optionChange() {
        if (this._differ != null) {
            var diff = [];
            var element = $(this._el);
            var i, j, valKey = this._config.valueKey, option;
            var opts = $.extend(true, {}, this._config);
            if (opts.dataSource) {
                delete opts.dataSource;
            }

            if (!this.equalsDiff(opts, this._opts, diff)) {
                this._opts = $.extend(true, {}, opts);
                for (i = 0; i < diff.length; i++) {
                    option = diff[i].key;
                    if ($.ui[this._widgetName] &&
                        $.ui[this._widgetName].prototype.options &&
                        $.ui[this._widgetName].prototype.options.hasOwnProperty(option) &&
                        $(this._el).data(this._widgetName)) {
                        $(this._el)[this._widgetName]("option", option, diff[i].newVal);
                    }
                }
            }
        }
    }

    // Interrogation functions
    isDate(value) {
        return Object.prototype.toString.call(value) === "[object Date]";
    }

    isRegExp(value) {
        return Object.prototype.toString.call(value) === "[object RegExp]";
    }

    isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }

    isWindow(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }

    isFunction(value) { return typeof value === "function"; }

    isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    }

    equalsDiff(o1, o2, diff?) {
        if (o1 === o2) { return true; }
        if (o1 === null || o2 === null) { return false; }
        if (o1 !== o1 && o2 !== o2) { return true; }// NaN === NaN
        var t1 = typeof o1, t2 = typeof o2, length, key, keySet, dirty, skipDiff = false, changedVals = [];
        if (t1 === t2) {
            if (t1 === "object") {
                if (this.isArray(o1)) {
                    if (!this.isArray(o2)) { return false; }
                    if ((length = o1.length) === o2.length) {
                        if (!this.isArray(diff)) {
                            skipDiff = true;
                        }
                        for (key = 0; key < length; key++) {
                            // we are comparing objects here
                            if (!this.equalsDiff(o1[key], o2[key], changedVals)) {
                                dirty = true;
                                if (!skipDiff) {
                                    diff.push({ index: key, txlog: changedVals });
                                }
                            }
                        }
                        if (dirty) {
                            return false;
                        }
                        return true;
                    }
                } else if (this.isDate(o1)) {
                    return this.isDate(o2) && o1.getTime() === o2.getTime();
                } else if (this.isRegExp(o1) && this.isRegExp(o2)) {
                    return o1.toString() === o2.toString();
                } else {
                    if (this.isScope(o1) || this.isScope(o2) || this.isWindow(o1) || this.isWindow(o2) || this.isArray(o2)) { return false; }
                    keySet = {};
                    if (!this.isArray(diff)) {
                        skipDiff = true;
                    }
                    for (key in o1) {
                        if (key.charAt(0) === "$" || this.isFunction(o1[key])) { continue; }
                        if (!this.equalsDiff(o1[key], o2[key])) {
                            dirty = true;
                            if (!skipDiff) {
                                diff.push({ key: key, oldVal: o2[key], newVal: o1[key] });
                            }
                        }
                        keySet[key] = true;
                    }
                    for (key in o2) {
                        if (!keySet.hasOwnProperty(key) &&
                            key.charAt(0) !== "$" &&
                            o2[key] !== undefined &&
                            !this.isFunction(o2[key])) { return false; }
                    }
                    if (dirty) {
                        return false;
                    }
                    return true;
                }
            }
        }
        return false;
    }
    }


/**
 * jQuery UI Button
 */
interface IJqButton {
    classes?: {};
    disabled: boolean;
    dropdown: boolean;
    icons?: { primary?: string, secondary?: string };
    items?: [IJqMenuItem];
    label: string;    
    showLabel: false;
    click: () => void;
}

/**
 * jQuery UI Menu
 */
interface IJqMenuItem {
    classes?: {};
    disabled: boolean;
    dropdown: boolean;
    dropdownwidth: number;
    label: string;    
    icon?: string;
    items?: [IJqMenuItem];
    position: {};
    click: () => void;
}

@Component({
    selector: '.ui-button',
    template: ``
})
export class JqButtonComponent extends JqControlBase<IJqButton>  {
// ReSharper disable InconsistentNaming
    private _dropmenu:any;
// ReSharper restore InconsistentNaming
    constructor(el: ElementRef, renderer: Renderer, differs: IterableDiffers) { super(el, renderer, differs, "button"); }
    
    ngOnInit() {
        if (this._config.dropdown) {
            this._config.icons = $.extend(this._config.icons, { secondary: "ui-icon-triangle-1-s" });

            this._dropmenu = $(`<ul></ul>`)
                .css("text-align", "left")
                .menu();

            let items: [IJqMenuItem] = this._config.items || [];

            for (let item of items) {

                let $li = $(`<li><div><span class="${item.icon}"></span>${item.label}</div></li>`).click(item.click);
                this._dropmenu.append($li);
            }
            this._dropmenu.menu("refresh").hide();
            this._el.parentNode.insertBefore(this._dropmenu[0], null);

            document.onclick = e => {
                
                let buttonEl = <HTMLElement>e.target;
                (buttonEl.className !== "ui-button") && (buttonEl = buttonEl.parentElement);
                (buttonEl !== this._el) && this._dropmenu.hide();
            };
        }
        super.ngOnInit();
    }
    
    @HostListener('click', ['$event'])
    onClick(e) {
        
        e.stopPropagation();

        if (this._config.dropdown) {

            if (this._config.dropdownwidth === undefined || this._config.dropdownwidth === null) 
                this._config.dropdownwidth = this._el.offsetWidth;

            this._dropmenu
                .toggle()
                .width(this._config.dropdownwidth);
        }
    }
}