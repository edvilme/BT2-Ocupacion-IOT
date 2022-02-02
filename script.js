const fs = require('fs');

fs.readFile('./test-old.json', (err, data) => {
    const d = JSON.parse(data.toString());

    d.spaces.forEach((space, i) => {
        // Random max occupancy
        d.spaces[i].maxOccupancy = Math.floor(Math.random()*20);
        //
        d.spaces[i].data = [];
        // Generate 285 hours of data since december 25 2021
        const initialDate = new Date(2021, 11, 25);
        for(let j = 0; j < 285; j++){
            // Get date
            const date = new Date(initialDate.setHours(initialDate.getHours() + 1));
            // Get value
            const value = Math.floor(Math.random() * d.spaces[i].maxOccupancy);
            d.spaces[i].data.push({date, value})
        }

    })
    console.log(JSON.stringify(d))
})