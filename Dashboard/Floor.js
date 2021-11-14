class Floor{
    id;
    name;
    svgFile;
    boundingBox;
    spaces;

    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.svgFile = data.svgFile;
        this.boundingBox = data.boundingBox || [[0, 0], [800, 600]];
        this.spaces = data.spaces?.map(space => new FloorSpace(space)) || [];
    }
}


class FloorSpace {
    id;
    name;
    category;
    vertices;
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.category = data.category;
        this.vertices = data.vertices || [];
    }

    get geojsonFeature(){
        return {
            type: "Feature", 
            properties: {id: this.id}, 
            geometry: {
                type: "Polygon", 
                coordinates: [[this.vertices]]
            }
        }
    }
}