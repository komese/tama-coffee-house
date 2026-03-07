export type RGBColor = [number, number, number, number];

export type TamaData = {
    baseColor: string;
    eyePosition: [number, number];
    adjustments: number;
};

export const COLOR_PALETTES: Record<string, Record<string, RGBColor>> = {
    "blue": {
        "0": [
            172,
            234,
            255,
            255
        ],
        "1": [
            115,
            206,
            255,
            255
        ],
        "2": [
            74,
            165,
            255,
            255
        ],
        "3": [
            115,
            198,
            255,
            255
        ],
        "4": [
            74,
            165,
            255,
            255
        ],
        "5": [
            32,
            137,
            230,
            255
        ]
    },
    "gray": {
        "0": [
            230,
            230,
            246,
            255
        ],
        "1": [
            205,
            206,
            230,
            255
        ],
        "2": [
            164,
            165,
            189,
            255
        ],
        "3": [
            205,
            206,
            230,
            255
        ],
        "4": [
            164,
            165,
            189,
            255
        ],
        "5": [
            131,
            133,
            164,
            255
        ]
    },
    "green": {
        "0": [
            230,
            255,
            164,
            255
        ],
        "1": [
            172,
            234,
            123,
            255
        ],
        "2": [
            123,
            218,
            57,
            255
        ],
        "3": [
            172,
            234,
            123,
            255
        ],
        "4": [
            123,
            218,
            57,
            255
        ],
        "5": [
            90,
            182,
            32,
            255
        ]
    },
    "indigo": {
        "0": [
            213,
            210,
            255,
            255
        ],
        "1": [
            180,
            182,
            255,
            255
        ],
        "2": [
            148,
            153,
            255,
            255
        ],
        "3": [
            180,
            182,
            255,
            255
        ],
        "4": [
            115,
            117,
            238,
            255
        ],
        "5": [
            90,
            97,
            213,
            255
        ]
    },
    "lavender": {
        "0": [
            230,
            226,
            255,
            255
        ],
        "1": [
            213,
            210,
            255,
            255
        ],
        "2": [
            180,
            182,
            255,
            255
        ],
        "3": [
            213,
            210,
            255,
            255
        ],
        "4": [
            180,
            182,
            255,
            255
        ],
        "5": [
            148,
            153,
            255,
            255
        ]
    },
    "light_green": {
        "0": [
            230,
            255,
            197,
            255
        ],
        "1": [
            213,
            255,
            164,
            255
        ],
        "2": [
            172,
            234,
            123,
            255
        ],
        "3": [
            213,
            255,
            164,
            255
        ],
        "4": [
            172,
            234,
            123,
            255
        ],
        "5": [
            123,
            218,
            57,
            255
        ]
    },
    "light_pink": {
        "0": [
            255,
            227,
            247,
            255
        ],
        "1": [
            255,
            210,
            239,
            255
        ],
        "2": [
            255,
            178,
            230,
            255
        ],
        "3": [
            255,
            186,
            230,
            255
        ],
        "4": [
            255,
            130,
            181,
            255
        ],
        "5": [
            255,
            89,
            148,
            255
        ]
    },
    "light_yellow": {
        "0": [
            255,
            255,
            238,
            255
        ],
        "1": [
            255,
            250,
            222,
            255
        ],
        "2": [
            255,
            242,
            148,
            255
        ],
        "3": [
            255,
            250,
            222,
            255
        ],
        "4": [
            255,
            242,
            148,
            255
        ],
        "5": [
            255,
            234,
            82,
            255
        ]
    },
    "orange": {
        "0": [
            255,
            230,
            197,
            255
        ],
        "1": [
            255,
            210,
            139,
            255
        ],
        "2": [
            255,
            165,
            98,
            255
        ],
        "3": [
            255,
            210,
            139,
            255
        ],
        "4": [
            255,
            165,
            98,
            255
        ],
        "5": [
            246,
            133,
            49,
            255
        ]
    },
    "pink": {
        "0": [
            255,
            186,
            230,
            255
        ],
        "1": [
            255,
            129,
            180,
            255
        ],
        "2": [
            255,
            89,
            148,
            255
        ],
        "3": [
            255,
            129,
            180,
            255
        ],
        "4": [
            255,
            89,
            148,
            255
        ],
        "5": [
            213,
            80,
            131,
            255
        ]
    },
    "purple": {
        "0": [
            238,
            190,
            255,
            255
        ],
        "1": [
            222,
            137,
            255,
            255
        ],
        "2": [
            172,
            97,
            246,
            255
        ],
        "3": [
            222,
            137,
            255,
            255
        ],
        "4": [
            172,
            97,
            246,
            255
        ],
        "5": [
            131,
            48,
            222,
            255
        ]
    },
    "red": {
        "0": [
            255,
            194,
            197,
            255
        ],
        "1": [
            255,
            141,
            139,
            255
        ],
        "2": [
            255,
            101,
            98,
            255
        ],
        "3": [
            255,
            141,
            139,
            255
        ],
        "4": [
            255,
            101,
            98,
            255
        ],
        "5": [
            222,
            52,
            49,
            255
        ]
    },
    "sky_blue": {
        "0": [
            213,
            242,
            255,
            255
        ],
        "1": [
            172,
            234,
            255,
            255
        ],
        "2": [
            115,
            206,
            255,
            255
        ],
        "3": [
            172,
            234,
            255,
            255
        ],
        "4": [
            115,
            206,
            255,
            255
        ],
        "5": [
            74,
            165,
            255,
            255
        ]
    },
    "teal": {
        "0": [
            205,
            246,
            246,
            255
        ],
        "1": [
            172,
            238,
            238,
            255
        ],
        "2": [
            139,
            214,
            213,
            255
        ],
        "3": [
            172,
            238,
            238,
            255
        ],
        "4": [
            139,
            214,
            213,
            255
        ],
        "5": [
            90,
            186,
            180,
            255
        ]
    },
    "white": {
        "0": [
            255,
            255,
            255,
            255
        ],
        "1": [
            255,
            255,
            254,
            255
        ],
        "2": [
            230,
            230,
            230,
            255
        ],
        "3": [
            255,
            255,
            254,
            255
        ],
        "4": [
            255,
            246,
            246,
            255
        ],
        "5": [
            230,
            222,
            222,
            255
        ]
    },
    "yellow": {
        "0": [
            255,
            250,
            222,
            255
        ],
        "1": [
            255,
            242,
            148,
            255
        ],
        "2": [
            255,
            234,
            82,
            255
        ],
        "3": [
            255,
            242,
            172,
            255
        ],
        "4": [
            255,
            234,
            82,
            255
        ],
        "5": [
            246,
            202,
            49,
            255
        ]
    }
};

export const TAMA_DATA: Record<string, TamaData> = {
    "amefuratchi": {
        "baseColor": "blue",
        "eyePosition": [
            8,
            17
        ],
        "adjustments": 0
    },
    "ankotchi": {
        "baseColor": "indigo",
        "eyePosition": [
            9,
            21
        ],
        "adjustments": 0
    },
    "axolopatchi": {
        "baseColor": "light_pink",
        "eyePosition": [
            10,
            17
        ],
        "adjustments": 2
    },
    "babymarutchi": {
        "baseColor": "yellow",
        "eyePosition": [
            -1,
            5
        ],
        "adjustments": 0
    },
    "batatchi": {
        "baseColor": "yellow",
        "eyePosition": [
            6,
            21
        ],
        "adjustments": 2
    },
    "batchi": {
        "baseColor": "indigo",
        "eyePosition": [
            12,
            13
        ],
        "adjustments": 0
    },
    "bbmarutchi": {
        "baseColor": "yellow",
        "eyePosition": [
            6,
            9
        ],
        "adjustments": 1
    },
    "beavertchi": {
        "baseColor": "orange",
        "eyePosition": [
            3,
            15
        ],
        "adjustments": -2
    },
    "bumbleyoung": {
        "baseColor": "yellow",
        "eyePosition": [
            4,
            10
        ],
        "adjustments": 0
    },
    "chirpyoung": {
        "baseColor": "light_green",
        "eyePosition": [
            1,
            16
        ],
        "adjustments": 0
    },
    "chodracotchi": {
        "baseColor": "light_pink",
        "eyePosition": [
            8,
            21
        ],
        "adjustments": 0
    },
    "eagletchi": {
        "baseColor": "gray",
        "eyePosition": [
            6,
            3
        ],
        "adjustments": 0
    },
    "elizardotchi": {
        "baseColor": "teal",
        "eyePosition": [
            10,
            18
        ],
        "adjustments": 0
    },
    "flapyoung": {
        "baseColor": "lavender",
        "eyePosition": [
            2,
            11
        ],
        "adjustments": 0
    },
    "floatyoung": {
        "baseColor": "red",
        "eyePosition": [
            3,
            10
        ],
        "adjustments": 0
    },
    "forestchirpyoung": {
        "baseColor": "white",
        "eyePosition": [
            1,
            14
        ],
        "adjustments": 0
    },
    "foresthorhotchi": {
        "baseColor": "light_pink",
        "eyePosition": [
            5,
            12
        ],
        "adjustments": 0
    },
    "forestkid": {
        "baseColor": "teal",
        "eyePosition": [
            1,
            14
        ],
        "adjustments": 0
    },
    "forestroaryoung": {
        "baseColor": "pink",
        "eyePosition": [
            2,
            12
        ],
        "adjustments": 0
    },
    "forestsproutyoung": {
        "baseColor": "light_pink",
        "eyePosition": [
            1,
            13
        ],
        "adjustments": 0
    },
    "foresttoddleyoung": {
        "baseColor": "teal",
        "eyePosition": [
            2,
            14
        ],
        "adjustments": 0
    },
    "furawatchi": {
        "baseColor": "light_pink",
        "eyePosition": [
            6,
            14
        ],
        "adjustments": 0
    },
    "gemtchi": {
        "baseColor": "white",
        "eyePosition": [
            3,
            28
        ],
        "adjustments": 1
    },
    "glideyoung": {
        "baseColor": "blue",
        "eyePosition": [
            7,
            18
        ],
        "adjustments": 0
    },
    "gumax": {
        "baseColor": "gray",
        "eyePosition": [
            10,
            13
        ],
        "adjustments": 0
    },
    "gusokutchi": {
        "baseColor": "white",
        "eyePosition": [
            8,
            18
        ],
        "adjustments": 0
    },
    "hatchitchi": {
        "baseColor": "yellow",
        "eyePosition": [
            5,
            8
        ],
        "adjustments": 0
    },
    "heavytchi": {
        "baseColor": "green",
        "eyePosition": [
            8,
            8
        ],
        "adjustments": 0
    },
    "horhotchi": {
        "baseColor": "lavender",
        "eyePosition": [
            5,
            12
        ],
        "adjustments": 0
    },
    "imoritchi": {
        "baseColor": "gray",
        "eyePosition": [
            4,
            3
        ],
        "adjustments": 0
    },
    "irukatchi": {
        "baseColor": "blue",
        "eyePosition": [
            8,
            13
        ],
        "adjustments": 1
    },
    "ishikorotchi": {
        "baseColor": "gray",
        "eyePosition": [
            11,
            12
        ],
        "adjustments": 0
    },
    "kabutotchi": {
        "baseColor": "orange",
        "eyePosition": [
            7,
            21
        ],
        "adjustments": 1
    },
    "kachitchi": {
        "baseColor": "blue",
        "eyePosition": [
            6,
            7
        ],
        "adjustments": 0
    },
    "kametchi": {
        "baseColor": "yellow",
        "eyePosition": [
            12,
            12
        ],
        "adjustments": 1
    },
    "kanokotchi": {
        "baseColor": "red",
        "eyePosition": [
            8,
            24
        ],
        "adjustments": 0
    },
    "kawazutchi": {
        "baseColor": "teal",
        "eyePosition": [
            8,
            11
        ],
        "adjustments": 0
    },
    "kiwitchi": {
        "baseColor": "green",
        "eyePosition": [
            2,
            7
        ],
        "adjustments": 1
    },
    "konkotchi": {
        "baseColor": "yellow",
        "eyePosition": [
            7,
            11
        ],
        "adjustments": 0
    },
    "kuchipatchi": {
        "baseColor": "green",
        "eyePosition": [
            5,
            5
        ],
        "adjustments": 0
    },
    "kujiratchi": {
        "baseColor": "blue",
        "eyePosition": [
            7,
            14
        ],
        "adjustments": 0
    },
    "kuraratchi": {
        "baseColor": "orange",
        "eyePosition": [
            7,
            9
        ],
        "adjustments": 1
    },
    "landkid": {
        "baseColor": "light_pink",
        "eyePosition": [
            1,
            5
        ],
        "adjustments": 0
    },
    "leapyoung": {
        "baseColor": "light_pink",
        "eyePosition": [
            3,
            9
        ],
        "adjustments": 0
    },
    "leopatchi": {
        "baseColor": "orange",
        "eyePosition": [
            6,
            9
        ],
        "adjustments": 0
    },
    "lessapantchi": {
        "baseColor": "light_pink",
        "eyePosition": [
            4,
            17
        ],
        "adjustments": -2
    },
    "lickyoung": {
        "baseColor": "orange",
        "eyePosition": [
            3,
            6
        ],
        "adjustments": 0
    },
    "magmatchi": {
        "baseColor": "red",
        "eyePosition": [
            11,
            9
        ],
        "adjustments": 0
    },
    "mametchi": {
        "baseColor": "yellow",
        "eyePosition": [
            3,
            18
        ],
        "adjustments": 0
    },
    "mendakotchi": {
        "baseColor": "red",
        "eyePosition": [
            8,
            14
        ],
        "adjustments": 2
    },
    "meowtchi": {
        "baseColor": "pink",
        "eyePosition": [
            2,
            24
        ],
        "adjustments": 0
    },
    "mermarintchi": {
        "baseColor": "blue",
        "eyePosition": [
            11,
            9
        ],
        "adjustments": 2
    },
    "mimitchi": {
        "baseColor": "white",
        "eyePosition": [
            4,
            26
        ],
        "adjustments": 2
    },
    "molmotchi": {
        "baseColor": "white",
        "eyePosition": [
            6,
            11
        ],
        "adjustments": 0
    },
    "mongatchi": {
        "baseColor": "white",
        "eyePosition": [
            3,
            10
        ],
        "adjustments": 3
    },
    "nappatchi": {
        "baseColor": "green",
        "eyePosition": [
            10,
            32
        ],
        "adjustments": 0
    },
    "oretatchi": {
        "baseColor": "purple",
        "eyePosition": [
            3,
            12
        ],
        "adjustments": 0
    },
    "otototchi": {
        "baseColor": "green",
        "eyePosition": [
            4,
            8
        ],
        "adjustments": 0
    },
    "paddleyoung": {
        "baseColor": "indigo",
        "eyePosition": [
            6,
            11
        ],
        "adjustments": 0
    },
    "panbootchi": {
        "baseColor": "white",
        "eyePosition": [
            11,
            10
        ],
        "adjustments": 0
    },
    "papillotchi": {
        "baseColor": "light_pink",
        "eyePosition": [
            11,
            25
        ],
        "adjustments": 0
    },
    "peacotchi": {
        "baseColor": "blue",
        "eyePosition": [
            12,
            22
        ],
        "adjustments": 0
    },
    "peatchi": {
        "baseColor": "light_pink",
        "eyePosition": [
            9,
            15
        ],
        "adjustments": 0
    },
    "pochitchi": {
        "baseColor": "yellow",
        "eyePosition": [
            10,
            6
        ],
        "adjustments": 2
    },
    "potsunentchi": {
        "baseColor": "teal",
        "eyePosition": [
            5,
            26
        ],
        "adjustments": 2
    },
    "ratchi": {
        "baseColor": "light_pink",
        "eyePosition": [
            8,
            14
        ],
        "adjustments": 0
    },
    "roaryoung": {
        "baseColor": "light_pink",
        "eyePosition": [
            2,
            6
        ],
        "adjustments": 0
    },
    "rockyyoung": {
        "baseColor": "gray",
        "eyePosition": [
            6,
            10
        ],
        "adjustments": 0
    },
    "rushraditchi": {
        "baseColor": "white",
        "eyePosition": [
            -1,
            24
        ],
        "adjustments": 0
    },
    "sebiretchi": {
        "baseColor": "yellow",
        "eyePosition": [
            6,
            13
        ],
        "adjustments": 2
    },
    "sharktchi": {
        "baseColor": "gray",
        "eyePosition": [
            7,
            20
        ],
        "adjustments": 0
    },
    "sheeptchi": {
        "baseColor": "yellow",
        "eyePosition": [
            12,
            10
        ],
        "adjustments": 0
    },
    "shigemi-san": {
        "baseColor": "green",
        "eyePosition": [
            11,
            25
        ],
        "adjustments": 0
    },
    "shiitaketchi": {
        "baseColor": "orange",
        "eyePosition": [
            8,
            19
        ],
        "adjustments": 0
    },
    "skykid": {
        "baseColor": "lavender",
        "eyePosition": [
            0,
            15
        ],
        "adjustments": 0
    },
    "sparrotchi": {
        "baseColor": "orange",
        "eyePosition": [
            5,
            4
        ],
        "adjustments": 0
    },
    "sproutyoung": {
        "baseColor": "teal",
        "eyePosition": [
            1,
            18
        ],
        "adjustments": 0
    },
    "suigyutchi": {
        "baseColor": "blue",
        "eyePosition": [
            12,
            11
        ],
        "adjustments": 0
    },
    "tachutchi": {
        "baseColor": "indigo",
        "eyePosition": [
            1,
            14
        ],
        "adjustments": 3
    },
    "tanoontchi": {
        "baseColor": "purple",
        "eyePosition": [
            8,
            8
        ],
        "adjustments": 0
    },
    "tatsutchi": {
        "baseColor": "green",
        "eyePosition": [
            6,
            14
        ],
        "adjustments": 0
    },
    "tentotchi": {
        "baseColor": "yellow",
        "eyePosition": [
            1,
            20
        ],
        "adjustments": 0
    },
    "tigaotchi": {
        "baseColor": "orange",
        "eyePosition": [
            6,
            30
        ],
        "adjustments": 0
    },
    "toddleyoung": {
        "baseColor": "yellow",
        "eyePosition": [
            2,
            8
        ],
        "adjustments": 0
    },
    "tokipatchi": {
        "baseColor": "white",
        "eyePosition": [
            4,
            12
        ],
        "adjustments": 0
    },
    "tustustchi": {
        "baseColor": "green",
        "eyePosition": [
            7,
            19
        ],
        "adjustments": 0
    },
    "uruotchi": {
        "baseColor": "indigo",
        "eyePosition": [
            5,
            6
        ],
        "adjustments": 0
    },
    "waterkid": {
        "baseColor": "blue",
        "eyePosition": [
            0,
            7
        ],
        "adjustments": 0
    },
    "yayacorntchi": {
        "baseColor": "purple",
        "eyePosition": [
            5,
            22
        ],
        "adjustments": 6
    }
};

export const JADE_EXCLUSIVE: string[] = [
    "forestkid",
    "forestroaryoung",
    "forestchirpyoung",
    "foresttoddleyoung",
    "forestsproutyoung",
    "foresthorhotchi",
    "konkotchi",
    "tigaotchi",
    "tanoontchi",
    "kachitchi",
    "tokipatchi",
    "sparrotchi",
    "lessapantchi",
    "kanokotchi",
    "suigyutchi",
    "panbootchi",
    "shiitaketchi",
    "peatchi",
    "nappatchi",
    "rushraditchi",
    "tatsutchi"
];

export const NON_BREEDABLE_EYES: string[] = [
    "babymarutchi",
    "landkid",
    "waterkid",
    "skykid",
    "forestkid",
    "roaryoung",
    "toddleyoung",
    "lickyoung",
    "sproutyoung",
    "glideyoung",
    "leapyoung",
    "paddleyoung",
    "floatyoung",
    "flapyoung",
    "chirpyoung",
    "bumbleyoung",
    "rockyyoung",
    "bbmarutchi",
    "forestchirpyoung",
    "forestroaryoung",
    "forestsproutyoung",
    "foresttoddleyoung"
];
