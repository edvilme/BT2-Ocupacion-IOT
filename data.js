async function getSpaceByDateAndMAC(date, MAC_Address){
    const res = await fetch('https://corsanywhere.herokuapp.com/https://27ajy1v04e.execute-api.us-west-2.amazonaws.com/Prod/data1', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            'Accept': '*/*'
        }, 
        body: JSON.stringify({date, MAC_Address})
    })
    const data = (await res.json())
        .map(r => ({...r, value: r.Label, date: new Date(new Date(r.Date.replace(' ', 'T')).getTime() - 3600 * 1000) }));
    return data;
}

async function getDataForAllSpaces(date){
    const res_data = await fetch('./test2.json');
    const data = await res_data.json();
    for(let space of data.spaces){
        if(!space.properties.sensor) continue;
        const space_data = await getSpaceByDateAndMAC(date, space.properties.sensor);
        space.data = space_data;
        console.dir(space.data);
    }
    return data;
}

function summarizeData(data){
    
}

async function getDataForAllSpacesCurrent(){
    return await getDataForAllSpaces(
        new Date(new Date().getTime() -6 * 3600 * 1000).toISOString().replace('T', ' ').replace(/\..+/g, '')
    )
}