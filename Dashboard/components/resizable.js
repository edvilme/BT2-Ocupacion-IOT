const resizableTemplate = document.createElement('template');
resizableTemplate.innerHTML = `
    <style>
    </style>
    <slot></slot>
    <div id="horizontal"></div>
    <div id="vertical"></div>
`

class ResizableElement extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(resizableTemplate.content.cloneNode(true));
    }
}
customElements.define('ui-resizable', ResizableElement);