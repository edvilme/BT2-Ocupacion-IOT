const fs = require('fs');

fs.readFile('./test.json', (err, data) => {
    const d = JSON.parse(data.toString());

    d.spaces.forEach((space, i) => {
        d.spaces[i].vertices = space.vertices.map(([x, y]) => {
            return [x*0.6035502959, y*0.6035502959]
        })
    })

    console.log(JSON.stringify(d))

})