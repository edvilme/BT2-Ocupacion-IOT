import { getColorFromPercentage } from "./colors.js";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{
            display: block;
            font-family: Arial, Helvetica, sans-serif;
        }
        polygon{
            mix-blend-mode: multiply
        }
    </style>
    <object></object>
`

const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
polygon.style.mixBlendMode = 'darken'

const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text.setAttributeNS(null, 'text-anchor', 'middle');
text.setAttributeNS(null, 'fill', 'white')
text.setAttributeNS(null, 'font-family', 'Arial, Helvetica, sans-serif')

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

        this.shadowRoot.querySelector('object').addEventListener('load', ()=>{
            const contentDocument = this.shadowRoot.querySelector('object').contentDocument;

            this.__data?.spaces?.forEach?.(space => {
                // Make polygon
                const __polygon = polygon.cloneNode(true)
                __polygon.setAttributeNS(null, 'points', space?.vertices?.map?.(([x, y]) => `${x},${y}`).join(' '));
                __polygon.setAttributeNS(null, 'id', space.id)
                // Make text
                const centerX = space?.vertices?.reduce?.((acc, [x, y]) => acc+=x, 0)/space?.vertices?.length
                const centerY = space?.vertices?.reduce?.((acc, [x, y]) => acc+=y, 0)/space?.vertices?.length
                const __text = text.cloneNode(true)
                __text.setAttributeNS(null, 'x', centerX);
                __text.setAttributeNS(null, 'y', centerY);
                __text.innerHTML = space?.properties?.name || space?.id
                // Append
                contentDocument.querySelector('svg').append(__polygon);
                contentDocument.querySelector('svg').append(__text);
                // Click event listener
                __polygon.addEventListener('click', (e)=>{
                    this.dispatchEvent(new CustomEvent('select', {detail: space}))
                })
            });

            this.update();
        })
    }


    update(){
        this.__data?.spaces?.forEach?.(space => {
            console.log(space)
            const __polygon = this.shadowRoot.querySelector('object').contentDocument.getElementById(space.id)
            __polygon.setAttributeNS(null, 'fill', getColorFromPercentage(Math.random()));
        })
        
    }

    attributeChangedCallback(attr, oldValue, newValue){
        if(attr == "src"){
                fetch(newValue)
                    .then(res => res.json())
                    .then(json => {
                        this.__data = json;
                        this.shadowRoot.querySelector('object').setAttribute('data', json.map.src)
                    })
                    .catch(console.log)
        } 
        if(attr == "date"){
            this.update();
        }
    }

}

customElements.define('floor-map', FloorMapElement)