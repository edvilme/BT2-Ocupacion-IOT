const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{
            display: block
        }
    </style>
    <object></object>
`

class FloorMapElement extends HTMLElement{
    static get observedAttributes(){
        return ["src"]
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
                const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                polygon.setAttributeNS(null, 'id', space.id)
                // Make points
                const points = space?.vertices?.map?.(([x, y]) => `${x},${y}`).join(' ');
                polygon.setAttributeNS(null, 'points', points);
                // Get centroid
                const centerX = space?.vertices?.reduce?.((acc, [x, y]) => acc+=x, 0)/space?.vertices?.length
                const centerY = space?.vertices?.reduce?.((acc, [x, y]) => acc+=y, 0)/space?.vertices?.length
                // Make text
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttributeNS(null, 'x', centerX);
                text.setAttributeNS(null, 'y', centerY);
                text.setAttributeNS(null, 'text-anchor', 'middle');
                text.setAttributeNS(null, 'fill', 'white')
                text.innerHTML = space?.properties?.name || space?.id

                contentDocument.querySelector('svg').append(polygon);
                contentDocument.querySelector('svg').append(text);
            })
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
    }

}

customElements.define('floor-map', FloorMapElement)