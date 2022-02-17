const red = 'rgb(255, 59, 48)';
const yellow = 'rgb(255, 204, 0)';
const green = 'rgb(52, 199, 89)';
const black = 'rgb(0, 0, 0)';
const white = 'rgb(255, 255, 255)';

export const getColorFromPercentage = label => {
    if(label == 'F') return red;
    if(label == 'M') return yellow;
    if(label == 'E') return green;
    if(label == '?') return black;
    return white;
}