const circularSegmentCollectionTemplate = document.createElement('template');
circularSegmentCollectionTemplate.innerHTML = `
    <style>
        :host{
            display: block;
        }
    </style>
    <svg viewbox="-1 -1 2 2"></svg>
    <div style="display: none">
        <slot></slot>
    </div>
`;

class CircularSegmentCollectionElement extends HTMLElement{
    get segments(){
        let slotElements = this.shadowRoot.querySelector('slot').assignedElements()
            .filter(element => element instanceof CircularSegmentElement)
            .map(element => element.path.cloneNode(true));
        return slotElements
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(circularSegmentCollectionTemplate.content.cloneNode(true));
        this.render();
    }
    render(){
        this.shadowRoot.querySelector('svg').append(...this.segments);
    }
}

customElements.define('circular-segment-collection', CircularSegmentCollectionElement);