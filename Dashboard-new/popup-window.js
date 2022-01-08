
const template = document.createElement('template');
template.innerHTML = `
    <style>
        #container{
            width: 20px;
            height: 20px;
            background: red;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            transform: translate(-50%, -50%)
        }
        #content{
            position: absolute;
            z-index: 99
        }
        #backdrop{
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0
        }
    </style>
    <div id="backdrop"></div>
    <div id="container">
        <div id="content">
            <slot></slot>
        </div>
    </div>
`;

function getCoordinatePercentages(x, y, parent){
    return {
        x: (x - parent.getBoundingClientRect().x)/parent.getBoundingClientRect().width, 
        y: (y - parent.getBoundingClientRect().y)/parent.getBoundingClientRect().height
    }
}

class PopupWindowElement extends HTMLElement{
    static get observedAttributes(){
        return ["x", "y"];
    }
    constructor(){
        super();
        this.attachShadow({mode: "open"});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append( template.content.cloneNode(true) );
        this.updatePosition();
        this.shadowRoot.querySelector('#backdrop').addEventListener('click', this.hide.bind(this))
    }
    attributeChangedCallback(attr, oldValue, newValue){
        this.updatePosition();
    }
    updatePosition(){
        this.style.left = this.getAttribute("x");
        this.style.top = this.getAttribute("y");
        // this.shadowRoot.querySelector('#container').style.justifyContent = 'center'
        this.shadowRoot.querySelector('#container').style.alignItems = 'center'

        const percentageCoords = getCoordinatePercentages(this.getBoundingClientRect().x, this.getBoundingClientRect().y, this.parentElement)
        const contentBoundingRect = this.shadowRoot.querySelector('#content').getBoundingClientRect();
        const parentBoundingRect = this.parentElement.getBoundingClientRect();
        /** LEFT VS RIGHT */
        this.shadowRoot.querySelector('#container').style.justifyContent = 
            (percentageCoords.x < 0.5 || contentBoundingRect.left <= parentBoundingRect.left) ? 'flex-start' : 
            'flex-end'
        /** TOP, BOTTOM, MIDDLE */
        let top = contentBoundingRect.y <= parentBoundingRect.y;
        let bottom = contentBoundingRect.bottom >= parentBoundingRect.bottom
        this.shadowRoot.querySelector('#container').style.alignItems = 
            top && !bottom ? 'flex-start' : 
            bottom && !top ? 'flex-end' :
            'center'
    }
    hide(){
        this.shadowRoot.querySelector('#container').style.display = 'none';
        this.shadowRoot.querySelector('#backdrop').style.display = 'none';
    }
    show(){
        this.shadowRoot.querySelector('#container').style.display = 'block'
        this.shadowRoot.querySelector('#backdrop').style.display = 'block'
    }
}
customElements.define('popup-window', PopupWindowElement);