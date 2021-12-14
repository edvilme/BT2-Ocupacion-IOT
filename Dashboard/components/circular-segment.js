
const getCirclePercentageCoordinates = percentage => [
    Math.cos(Math.PI*2*percentage - Math.PI*2/4),
    Math.sin(Math.PI*2*percentage - Math.PI*2/4)
];

const circularSegmentTemplate = document.createElement('template');
circularSegmentTemplate.innerHTML = `
    <style>
        :host{
            display: block;
        }
    </style>
    <svg viewbox="-1 -1 2 2">
        <path fill></path>
    </svg>
`

class CircularSegmentElement extends HTMLElement{
    static get observedAttributes(){
        return ['start', 'end', 'fill', 'radius'];
    }
    get start(){
        return Number.parseFloat(this.getAttribute('start'))/100;
    }
    get end(){
        return Number.parseFloat(this.getAttribute('end'))/100;
    }
    get radius(){
        return Number.parseFloat(this.getAttribute('radius') || 100)/100;
    }
    get fill(){
        return this.getAttribute('fill');
    }
    get path(){
        return this.shadowRoot.querySelector('path');
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(circularSegmentTemplate.content.cloneNode(true));
        this.shadowRoot.querySelector('path').setAttribute('fill', this.fill);
        this.render();
    }
    attributeChangedCallback(attribute, oldValue, newValue){
        if(oldValue == newValue) return;
        if(attribute == "fill" && this.isConnected)
            this.shadowRoot.querySelector('path').setAttribute('fill', newValue);
        
    }
    render(){
        // Get bounding coordinates
        const [startX, startY] = getCirclePercentageCoordinates(this.start);
        const [endX, endY] = getCirclePercentageCoordinates(this.end);
        // Determine concave/convex
        const isLargeArc = (this.end - this.start) > 0.5 ? 1 : 0;
        // Get remaining radius
        const remainingRadius = 1 - this.radius;
        // Create path
        const path = [
            `M ${startX} ${startY}`, // Move pen to (startX, startY)
            `A 1 1 0 ${isLargeArc} 1 ${endX} ${endY}`, // Create outer arc
            `L ${remainingRadius*endX} ${remainingRadius*endY}`,
            `A ${remainingRadius} ${remainingRadius} 0 ${isLargeArc} 0 ${remainingRadius*startX} ${remainingRadius*startY}`, // Create outer arc
        ].join(' ');
        // Set to path
        this.shadowRoot.querySelector('path')
            .setAttribute('d', path);
    }
}

customElements.define('circular-segment', CircularSegmentElement);
export default CircularSegmentElement;