const red = 'rgb(255, 59, 48)';
const yellow = 'rgb(255, 204, 0)';
const green = 'rgb(52, 199, 89)';

export const getColorFromPercentage = percentage => {
    if(percentage > 2/3) return red;
    if(percentage > 1/3) return yellow;
    return green;
}