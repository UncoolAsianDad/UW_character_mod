import * as fs from 'fs'

const STR = 0x1E
const DEX = 0x1F
const INTE = 0x20
const ATK = 0x21
const DEF = 0x22
const UNARM = 0x23
const SWD = 0x24
const LORE = 0x29
const HP = 0x35
const HP_2 = 0xDC
const HPMAX = 0x36
const MP = 0x37
const MPMAX = 0x38
const LVL = 0x3D
const RUNE1 = 0x47
const RUNE2 = 0x48
const RUNE3 = 0x49
const WEIGHTA = 0x4A
const WEIGHTB = 0x4B
const WEIGHT_MAXA = 0x4C
const WEIGHT_MAXB = 0x4D

const printPlayer = (data: Uint8Array) => {
    const player = {
        name: new TextDecoder("utf-8").decode(data.slice(0, 14)),
        str: data.slice(0x1E, 0x1F)[0],
        dex: data.slice(0x1F, 0x20)[0],
        intiligence: data.slice(0x20, 0x21)[0],
        LV: data.slice(LVL, LVL + 1)[0],
        HP: data.slice(HP, HP + 1)[0],
        HP_MAX: data.slice(HPMAX, HPMAX + 1)[0],
        MP: data.slice(MP, MP + 1)[0],
        MP_MAX: data.slice(MPMAX, MPMAX + 1)[0],
        weight: new Int16Array(data.slice(WEIGHTA, WEIGHTB)),
        weight_MAX: data.slice(WEIGHT_MAXB, WEIGHT_MAXB + 1)[0] * 256 + data.slice(WEIGHT_MAXA, WEIGHT_MAXB)[0],
        // weight: new Int16Array(data.slice(0x4A, 0x4B)),
        // max_weight: new Int16Array(data.slice(0x4C, 0x4D)),
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
decoded[SWD] = 30
decoded[LORE] = 30
decoded[HP] = 200
decoded[HP_2] = 200
decoded[HPMAX] = 200
decoded[MP] = 200
decoded[MPMAX] = 200
decoded[RUNE1] = 255
decoded[RUNE2] = 255
decoded[RUNE3] = 255
decoded[WEIGHT_MAXB] = 0x02
decoded[WEIGHT_MAXA] = 0xB2
printPlayer(decoded);

// process.exit(0)
const encoded = xor(decoded, key);
console.log(encoded, data, item)

const rawToSave = new Uint8Array(raw.length);
rawToSave.set(new Uint8Array([key]))
rawToSave.set(encoded, 1)
rawToSave.set(item, 1 + encoded.length)

fs.writeFileSync('SAVE1/PLAYER.DAT', rawToSave)