import './circular-segment-collection.js';

const dataDayTemplate = document.createElement('template');
dataDayTemplate.innerHTML = `
    <style>
        :host{
            display: block
        }

        :host .row {
            display: flex; 
            align-items: center
        }
        :host .row > * {
            border: 1px dotted rgb(200,200,200);
            flex: 1
        }
    </style>
    <div>

    </div>
`;

const circularSegmentCollectionTemplate = document.createElement('circular-segment-collection')
const circularSegmentTemplate = document.createElement('circular-segment')

const rowTemplate = document.createElement('template');
rowTemplate.innerHTML = `
    <div class="row">
        <div class="day"></div>
    </div>
`;

const rowSegmentTemplate = document.createElement('template');
rowSegmentTemplate.innerHTML = `
    <svg viewbox="-1 -1 2 2">
        <circle fill="red" cx="0" cy="0" r="1"></circle>
    </svg>
`;

class DataDayElement extends HTMLElement{
    static get observedAttributes(){
        return ['type', 'data-stats', 'data-date'];
    }
    get type(){
        return this.getAttribute('type')
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(dataDayTemplate.content.cloneNode(true));
        this.render();
    }
    render(){
        let rows = JSON.parse(this.dataset.stats);
        this.shadowRoot.querySelector('div').innerHTML = "";

        if(this.type == 'row'){
            // Row
            let row = rowTemplate.content.cloneNode(true);
            row.querySelector('.day').innerHTML = new Date(this.dataset.date).toLocaleDateString();
            for(let i = 0; i < rows.length; i++){
                let rowSegment = rowSegmentTemplate.content.cloneNode(true);
                rowSegment.querySelector('circle').style.transform = `scale(${rows[i].count/100})`
                row.querySelector('div').append(rowSegment);
            }
            this.shadowRoot.querySelector('div').append(row);
        }
        else{
            // Circular
            let circularSegmentCollection = circularSegmentCollectionTemplate.cloneNode(true);
            circularSegmentCollection.dataset.text = new Date(this.dataset.date).getUTCDate();
            for(let i = 0; i < rows.length; i++){
                let circularSegment = circularSegmentTemplate.cloneNode(true);
                circularSegment.setAttribute('start', 100*i/rows.length);
                circularSegment.setAttribute('end', 100*(i+1)/rows.length);
                circularSegment.setAttribute('radius', rows[i].count);
                circularSegmentCollection.append(circularSegment);
            }
            this.shadowRoot.querySelector('div').append(circularSegmentCollection);
            circularSegmentCollection.render()
        }

    }
    
    
    
    
    
}

customElements.define('data-day', DataDayElement)