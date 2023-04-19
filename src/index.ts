import * as fs from 'fs'

const STR = 0x1E
const DEX = 0x1F
const INTE = 0x20
const ATK = 0x21
const DEF = 0x22
const UNARM = 0x23
const LORE = 0x29

const printPlayer = (data: Uint8Array) => {
    const player = {
        name: new TextDecoder("utf-8").decode(data.slice(0, 14)),

        str: data.slice(0x1E, 0x1F)[0],
        dex: data.slice(0x1F, 0x20)[0],
        intiligence: data.slice(0x20, 0x21)[0]
    }

    console.log(JSON.stringify(player, null, 2))
}


const xor = (data: Uint8Array, key: number) => {
    let incrnum: number = 3;
    let newData: Uint8Array = new Uint8Array(data.length)

    for (let i = 0; i <= 220; i++) { // 0xDC = 220 
        if (i == 80 || i == 160) incrnum = 3; // 0x50 = 80, 0xA0 = 160, reset the increment
        newData[i] = (data[i] ^ (key + incrnum)) % 256; // xor 
        incrnum += 3;
    }

    return newData;
}

try {
    fs.copyFileSync('SAVE1/PLAYER.DAT', 'SAVE1/PLAYER.DAT.bak')
} catch (error: any) {
    console.log(error)
    process.exit(0)
}

const raw = Uint8Array.from(fs.readFileSync('SAVE1/PLAYER.DAT.bak'));
console.log(raw.length)
const key = raw[0]
const data = raw.slice(1, 221)
const item = raw.slice(221)

const decoded = xor(data, key)
decoded[STR] = 30
decoded[DEX] = 30
decoded[INTE] = 30
decoded[ATK] = 30
decoded[DEF] = 30
decoded[UNARM] = 30
decoded[LORE] = 30
printPlayer(decoded);

const encoded = xor(decoded, key);
console.log(encoded, data, item)

const rawToSave = new Uint8Array(raw.length);
rawToSave.set(new Uint8Array([key]))
rawToSave.set(encoded, 1)
rawToSave.set(item, 1 + encoded.length)


fs.writeFileSync('SAVE1/PLAYER.DAT', rawToSave)