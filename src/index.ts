import * as fs from 'fs'

const data = Uint8Array.from(fs.readFileSync('SAVE1/PLAYER.DAT'))
const xorvalue = data[0]
var incrnum:number = 3;
const newData: number[] = []

for (var i = 1; i <= 220; i++) {
    if (i == 80 || i == 160) incrnum = 3;
    newData[i] = (data[i] ^ (xorvalue + incrnum)) % 256;
    incrnum += 3;

    console.log((i-1).toString(16).padStart(4, '0'), newData[i]);
}
