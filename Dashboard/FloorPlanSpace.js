class FloorPlanSpace {
    /**@type {String} */
    id;
    /**@type {String} */
    name;
    /**@type {String} */
    area;
    /**@type {String} */
    maximumOccupancy;
    /**@type {Boolean} */
    isOpenSpace;
    /**@type {Array.<{x: Number, y: Number}>} */
    geometryVertices;

    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.type = data.type || "DefaultSpace";
        this.area = data.area || 0;
        this.maximumOccupancy = data.maximumOccupancy || 0;
        this.isOpenSpace = data.isOpenSpace || false; 
        this.geometryVertices = data.geometryVertices || [];
    }

    get polygon(){
        return `<polygon points="${
            this.geometryVertices.map(v=>`${v.x}, ${v.y}`).join(' ')
        }" id="${this.id}" />`
    }
}