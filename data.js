async function getDataByNameAndMAC(date, MAC_Address){
    const res = await fetch('https://27ajy1v04e.execute-api.us-west-2.amazonaws.com/Prod/data1/', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            'Accept': '*/*'
        }, 
        body: JSON.stringify({date, MAC_Address})
    })
    return await res.json();
}

async function getDataForAllSpaces(date){
    const res_data = await fetch('./test2.json');
    const data = await res_data.json();
    for(let space of data.spaces){
        const space_data = await getDataByNameAndMAC(date, space.properties.sensor);
        space.data = space_data;
    }
    return data;
}