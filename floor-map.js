import { getColorFromPercentage } from "./colors.js";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{
            display: block;
            font-family: Arial, Helvetica, sans-serif;
        }
        div{
            height: 100%;
            text-align: center;
        }
        svg{
            height: 100% !important;
            display: inline-block
        }
    </style>
    <div>

    </div>
`

const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
polygon.style.mixBlendMode = 'darken'

const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text.setAttributeNS(null, 'text-anchor', 'middle');
text.setAttributeNS(null, 'fill', 'white')
text.setAttributeNS(null, 'font-family', 'Arial, Helvetica, sans-serif')

const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
foreignObject.style.overflow = 'auto';
foreignObject.innerHTML = `
    <div xmlns="http://www.w3.org/1999/xhtml"><slot></slot></div>
`

class FloorMapElement extends HTMLElement{
    static get observedAttributes(){
        return ["src", "date"]
    }
    constructor(){
        super();
        this.attachShadow({mode: "open"})
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(template.content.cloneNode(true));
    }
    async loadSVG(src){
        const res = await fetch(src);
        const data = await res.text();
        this.shadowRoot.querySelector('div').innerHTML = data;
        // Draw spaces
        this.drawSpaces();
        // Add foreign object
        // this.shadowRoot.querySelector('svg').append(foreignObject.cloneNode(true))
        // Update
        this.update();
    }
    drawSpaces(){
        this.__data?.spaces?.forEach?.(space => {
            // Make polygon
            const __polygon = polygon.cloneNode(true)
            __polygon.setAttributeNS(null, 'points', space?.vertices?.map?.(([x, y]) => `${x},${y}`).join(' '));
            __polygon.setAttributeNS(null, 'id', space.id)
            // Get center
            const centerX = space?.vertices?.reduce?.((acc, [x, y]) => acc+=x, 0)/space?.vertices?.length
            const centerY = space?.vertices?.reduce?.((acc, [x, y]) => acc+=y, 0)/space?.vertices?.length
            // Make text
            const __text = text.cloneNode(true)
            __text.setAttributeNS(null, 'x', centerX);
            __text.setAttributeNS(null, 'y', centerY);
            __text.innerHTML = space?.properties?.name || space?.id
            // Append
            this.shadowRoot.querySelector('svg').append(__polygon);
            this.shadowRoot.querySelector('svg').append(__text);
            // Click event listener
            __polygon.addEventListener('click', (e)=>{
                const x = __polygon.getBoundingClientRect().x + __polygon.getBoundingClientRect().width/2
                const y = __polygon.getBoundingClientRect().y + __polygon.getBoundingClientRect().height/2
                this.dispatchEvent(
                    new CustomEvent('select', { 
                        detail: {
                            space, 
                            center: {x, y}
                        } 
                    })
                )
            })
        });
    }
    update(){
        // Get date
        const date = this.getAttribute('date')
        this.__data?.spaces?.forEach?.(space => {
            const __polygon = this.shadowRoot.querySelector('svg').getElementById(space.id)
            const occupation = space.data.find(item => item.date == date)?.value || 0;
            const occupationPercentage = occupation/space.maxOccupancy;
            __polygon.setAttributeNS(null, 'fill', getColorFromPercentage(occupationPercentage));
        })
        
    }

    attributeChangedCallback(attr, oldValue, newValue){
        if(attr == "src"){
                fetch(newValue)
                    .then(res => res.json())
                    .then(json => {
                        this.__data = json;
                        this.loadSVG(json.map.src)
                    })
                    .catch(console.log)
        } 
        if(attr == "date"){
            this.update();
        }
    }

}

customElements.define('floor-map', FloorMapElement)