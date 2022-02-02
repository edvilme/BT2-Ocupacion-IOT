import CircularSegmentElement from './circular-segment.js';

const circularSegmentCollectionTemplate = document.createElement('template');
circularSegmentCollectionTemplate.innerHTML = `
    <style>
        :host{
            display: block;
            padding: 10px;
        }
        :host path{
            pointer-events: all;
        }
    </style>
    <svg viewbox="-1 -1 2 2">
        <text x="0" y="0" font-size="1.1" text-anchor="middle" dominant-baseline="middle"></text>
    </svg>
    <div style="display: none">
        <slot></slot>
    </div>
`;

class CircularSegmentCollectionElement extends HTMLElement{
    static get observedAttributes(){
        return ['data-text'];
    }
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
    attributeChangedCallback(attribute, oldValue, newValue){
        if(oldValue == newValue) return;
        if(attribute == 'data-text') this.shadowRoot.querySelector('text').innerHTML = this.dataset.text;
    }
    render(){
        this.shadowRoot.querySelector('text').innerHTML = this.dataset.text;
        this.shadowRoot.querySelector('svg').prepend(...this.segments);
    }
}

customElements.define('circular-segment-collection', CircularSegmentCollectionElement);
export default CircularSegmentCollectionElement;