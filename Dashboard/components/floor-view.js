const floorViewAreaTemplate = document.createElement('template');
floorViewAreaTemplate.innerHTML = `
    <svg>
        <polygon style="fill: red"></polygon>
    </svg>
`

class FloorViewAreaElement extends HTMLElement{
    static get observedAttributes(){
        return ['data-vertices'];
    }
    get polygon(){
        return this.shadowRoot.querySelector('polygon');
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(floorViewAreaTemplate.content.cloneNode(true));
        this.render();
    }
    render(){
        this.shadowRoot.querySelector('polygon').setAttributeNS(null, 'points', this.dataset.vertices)
    }
}
customElements.define('floor-view-area', FloorViewAreaElement);

const floorViewTemplate = document.createElement('template');
floorViewTemplate.innerHTML = `
    <style>
        :host{
            display: block
        }
    </style>
    <object></object>
    <div style="display: none">
        <slot></slot>
    </div>
`

class FloorViewElement extends HTMLElement{
    static get observedAttributes(){
        return ['data'];
    }
    get areas(){
        return this.shadowRoot.querySelector('slot')?.assignedElements()
            .filter(element => element instanceof FloorViewAreaElement)
            .map(element => element.polygon.cloneNode(true));
    }
    get data(){
        return this.getAttribute('data')
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.append(floorViewTemplate.content.cloneNode(true));

        this.shadowRoot.querySelector('object').setAttribute('data', this.data);
        this.shadowRoot.querySelector('object').addEventListener('load', this.renderAreas.bind(this))
    }
    attributeChangedCallback(attribute, oldValue, newValue){

    }
    renderAreas(){
        let contentDocument = this.shadowRoot.querySelector('object').contentDocument;
        contentDocument.querySelector('svg').append(...this.areas)
    }
}
customElements.define('floor-view', FloorViewElement);