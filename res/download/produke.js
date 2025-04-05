module.exports = function({deepClone, utils}, gamedefs) {

    // used to change order of inputs on view
    const reorderFields = (object, order) => {
        return Object.fromEntries([
            // order fields defined in order array
            ...order.filter(key => key in object).map(key => [key, object[key]]),
            // put remaining fields in the end
            ...Object.keys(object).filter(key => !order.includes(key)).map(key => [key, object[key]])
        ]);
    };

    // used to calculate the estimated size of a given string as a monospace font
    const charWidths = {
        "0": 8.625, "1": 8.625, "2": 8.625, "3": 8.625, "4": 8.625,
        "5": 8.625, "6": 8.625, "7": 8.625, "8": 8.625, "9": 8.625,
        " ": 4.3828125, "!": 4.546875, "\"": 6.2734375, "#": 9.453125,
        "$": 8.625, "%": 13.09375, "&": 12.8046875, "'": 3.6796875,
        "(": 4.828125, ")": 4.828125, "*": 6.671875, "+": 10.9453125,
        ",": 3.46875, "-": 6.3984375, ".": 3.46875, "/": 6.234375,
        ":": 3.46875, ";": 3.46875, "<": 10.9453125, "=": 10.9453125,
        ">": 10.9453125, "?": 7.171875, "@": 15.28125, "A": 10.3203125,
        "B": 9.171875, "C": 9.90625, "D": 11.21875, "E": 8.09375,
        "F": 7.8125, "G": 10.9765625, "H": 11.359375, "I": 4.2578125,
        "J": 5.7109375, "K": 9.28125, "L": 7.53125, "M": 14.3671875,
        "N": 11.96875, "O": 12.0625, "P": 8.9609375, "Q": 12.0625,
        "R": 9.5703125, "S": 8.5, "T": 8.3828125, "U": 10.9921875,
        "V": 9.9375, "W": 14.9453125, "X": 9.4375, "Y": 8.84375,
        "Z": 9.125, "[": 4.828125, "\\": 6.0625, "]": 4.828125,
        "^": 10.9453125, "_": 6.640625, "`": 4.2890625, "a": 8.140625,
        "b": 9.40625, "c": 7.390625, "d": 9.421875, "e": 8.3671875,
        "f": 5.0078125, "g": 9.421875, "h": 9.0546875, "i": 3.875,
        "j": 3.875, "k": 7.953125, "l": 3.875, "m": 13.78125,
        "n": 9.0546875, "o": 9.375, "p": 9.40625, "q": 9.421875,
        "r": 5.5625, "s": 6.7890625, "t": 5.421875, "u": 9.0546875,
        "v": 7.6640625, "w": 11.5625, "x": 7.34375, "y": 7.7421875,
        "z": 7.234375, "{": 4.828125, "|": 3.828125, "}": 4.828125,
        "~": 10.9453125, " ": 4.3828125
    };

    // used to calculate the estimated size of a given string as a monospace font
    const estimateVisualWidth = str => {
        return Array.from(str).reduce((total, ch) => {
            return total + (charWidths[ch] || charWidths[" "]);
        }, 0);
    };

    // used to add spaces after each field's name to align them
    const pad = str => {
        const targetWidthPx = 96;
        let result = str;
        let currentWidth = estimateVisualWidth(result);
        while (currentWidth < targetWidthPx) {
            result += " ";
            currentWidth = estimateVisualWidth(result);
        }
        return result;
    };

    // clone xduke definitions as base
    gamedefs.games.duke3d.executables.produke = deepClone(gamedefs.games.duke3d.executables.xduke);

    // change to produke name and executable
    gamedefs.games.duke3d.executables.produke.name = "proDuke";
    gamedefs.games.duke3d.executables.produke.files.main.path = "produke.exe";

    // remove arguments that have been moved to netflags
    delete gamedefs.games.duke3d.executables.produke.parameters.noMonsters;
    delete gamedefs.games.duke3d.executables.produke.parameters.respawn;

    // remove irrelevant fields
    delete gamedefs.games.duke3d.executables.produke.parameters.con;
    delete gamedefs.games.duke3d.executables.produke.parameters.grp;

    // game mode
    gamedefs.games.duke3d.executables.produke.parameters.multiplayerMode.label = pad("Game Mode");
    gamedefs.games.duke3d.executables.produke.parameters.multiplayerMode.optional = false;
    gamedefs.games.duke3d.executables.produke.parameters.multiplayerMode.choices = [
        {label: "Dukematch (DM)", value: 1},
        {label: "COOP", value: 2},
        {label: "Team Dukematch (TDM)", value: 3},
        {label: "Catch The Flag (CTF)", value: 4},
        {label: "1-Flag CTF (1FCTF)", value: 5},
        {label: "ATK/DEF CTF (ADCTF)", value: 6},
        {label: "Survival", value: 7},
        {label: "Last Man Standing (LMS)", value: 8},
        {label: "Team Last Man Standing (TLMS)", value: 9},
        {label: "Terminator", value: 10}
    ];

    // send /teampicker automatically if any team based mode is selected
    gamedefs.games.duke3d.executables.produke.parameters["teampicker"] = {
        modeSupport: ["singleplayer", "multiplayer"],
        type: "static",
        addIf: c => {
            return [3,4,5,6,8].includes(parseInt(c.GameRoom.Params.multiplayerMode[0].replace("/c", "")));
        },
        value: "/teampicker"
    };

    // skill
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.label = pad("Skill");
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.type = "choice";    
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.dependsOn = null;
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.value = c => c.value > 0 ? "/s" + c.value : "/m";
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.optional = false;
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.choices = [
        {label: "No Monsters", value: 0},
        {label: "Piece Of Cake", value: 1},
        {label: "Let's Rock", value: 2},
        {label: "Come Get Some", value: 3},
        {label: "Damn I'm Good", value: 4}
    ];

    // map type (original or user)
    gamedefs.games.duke3d.executables.produke.parameters.mapType = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "choice",
        label: pad("Map Type"),
        optional: false,
        syncOnly: true,
        choices: [
            {label: "Original Map", value: "original"},
            {label: "User Map", value: "user"}
        ]
    };

    // original map
    gamedefs.games.duke3d.executables.produke.parameters.episodeAndLevel.label = pad("Map");
    gamedefs.games.duke3d.executables.produke.parameters.episodeAndLevel.optional = false;
    gamedefs.games.duke3d.executables.produke.parameters.episodeAndLevel.dependsOn = {
        params: "mapType", 
        show: c => c?.ParamEl?.mapType === "original"
    };

    // user map
    gamedefs.games.duke3d.executables.produke.parameters.map.label = pad("Map");
    gamedefs.games.duke3d.executables.produke.parameters.map.optional = false;
    gamedefs.games.duke3d.executables.produke.parameters.map.dependsOn = {
        params: "mapType", 
        show: c => c?.ParamEl?.mapType === "user"
    };

    // score limit
    gamedefs.games.duke3d.executables.produke.parameters.scoreLimit = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "numrange",
        label: pad("Score Limit"),
        min: 0,
        max: 99,
        delta: 1,
        optional: false,
        value: c => parseInt(c.value) > 0 ? `/y${c.value}` : null
    };

    // time limit
    gamedefs.games.duke3d.executables.produke.parameters.timeLimit = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "numrange",
        label: pad("Time Limit"),
        min: 0,
        max: 240,
        delta: 1,
        optional: false,
        value: c => parseInt(c.value) > 0 ? `/k${c.value}` : null
    };

    // extra lives
    gamedefs.games.duke3d.executables.produke.parameters.extraLives = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "numrange",
        label: pad("Extra Lives"),
        min: 0,
        max: 9,
        delta: 1,
        optional: false,
        value: c => parseInt(c.value) > 0 ? `/e${c.value}` : null,
        dependsOn: {
            params: "multiplayerMode", 
            show: c => c?.ParamEl?.multiplayerMode && [7,8,9].includes(c.ParamEl.multiplayerMode)
        }
    };

    // bots
    gamedefs.games.duke3d.executables.produke.parameters.botsNum.label = pad("BOTs");
    gamedefs.games.duke3d.executables.produke.parameters.botsNum.optional = false;
    gamedefs.games.duke3d.executables.produke.parameters.botsNum.min = 0;
    gamedefs.games.duke3d.executables.produke.parameters.botsNum.max = 16;

    // bot ai
    gamedefs.games.duke3d.executables.produke.parameters.botsAi.label = "BOTs AI";
    gamedefs.games.duke3d.executables.produke.parameters.botsAi.optional = false;
    gamedefs.games.duke3d.executables.produke.parameters.botsAi.dependsOn = null;

    // record demo
    gamedefs.games.duke3d.executables.produke.parameters.recordDmo.label = "Record DEMO";

    // play demo
    gamedefs.games.duke3d.executables.produke.parameters.playDmo.label = pad("Play DEMO");

    // lock options
    gamedefs.games.duke3d.executables.produke.parameters.lockOptions = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Lock Options",
        optional: false,
        value: "/lockoptions",
        for: "host-only-private"
    };

    // lock players
    gamedefs.games.duke3d.executables.produke.parameters.lockPlayers = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Lock Players",
        optional: false,
        value: "/lockplayers",
        for: "host-only-private"
    };

    // disable autoaim
    gamedefs.games.duke3d.executables.produke.parameters.disableAutoaim = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Disable Autoaim",
        optional: false,
        value: "/disableautoaim"
    };

    // exploit mode
    gamedefs.games.duke3d.executables.produke.parameters.exploitMode = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Exploit Mode (tiles + visiblity)",
        optional: false,
        value: "/exploitmode"
    };

    // allow mods
    gamedefs.games.duke3d.executables.produke.parameters.allowMods = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Allow Mods (con / art / dat / etc)",
        optional: false,
        value: "/allowmods"
    };

    // netflags presets
    gamedefs.games.duke3d.executables.produke.parameters.presets = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "choice",
        label: pad("NetFlags Presets"),
        optional: false,
        syncOnly: true,
        choices: [
            {label: "Classic", value: "classic"},
            {label: "Teamplay", value: "teamplay"},
            {label: "Rebalanced", value: "rebalanced"},
            {label: "Hardcore", value: "hardcore"},
            {label: "Overpowered", value: "overpowered"},
            {label: "---", value: "---"}
        ],
        dependsOn: {
            params: "presets", 
            show: async c => {
                switch (c?.ParamEl?.presets) {
                    case "classic": {
                        break;
                    }
                    case "teamplay": {
                        break;
                    }
                    case "rebalanced": {
                        break;
                    }
                    case "hardcore": {
                        break;
                    }
                    case "overpowered": {
                        break;
                    }
                    case "---": {
                        break;
                    }
                    default: {
                        // ingore
                        break;
                    }
                }
                return true;
            }
        }
    };

    // netflags A definition
    const netFlagsADefs = {
        "Weapons Pickable Once": 1,
        "Respawn Monsters": 2,
        "Respawn Items": 4,
        "Respawn Inventory": 8,
        "Markers": 16,
        "Don't Spawn Monsters": 32,
        "Don't Spawn Keycards": 64,
        "[COOP/TEAM] Friendly Fire": 128,
        "Spawn MP Only Switches": 256,
        "Spawn MP Only Items": 512,
        "Weapon Always Drops On Kill": 1024,
        "Revealed Automap": 2048,
        "No Target Names": 4096,
        "No Map Exit": 8192,
        "[SURV/TLMS] Lives Are Shared": 16384,
        "Force Respawn": 32768,
        "[PVP] Respawn Farthest": 65536,
        "[TEAM] Teamless Spawn Points": 131072,
        "[COOP/TEAM] Autoaim On Allies": 262144,
        "[COOP/TEAM/TRM] Overhead Info": 524288,
        "[COOP/TEAM/TRM] Outlines": 1048576,
        "[CTF] Outline On Flags": 2097152,
        "[CTF] Flag Return Instantly": 4194304,
        "[CTF] Flag Auto Detonate": 8388608,
        "[T/LMS] Restricted Spycam": 16777216,
        "[T/LMS] Restricted Chat": 33554432
    };

    // netflags B definition
    const netFlagsBDefs = {
        "[TEAM] No Colored Tripbombs": 1,
        "[CTF] No Steroids If With Flag": 2,
        "[CTF] No Jetpack If With Flag": 4,
        "[TRM] No Infinite Jetpack": 8,
        "[TRM] No Shrinker Immunity": 16,
        "[TRM] No Freezer Weakness": 32
    };

    // netflags C definition
    const netFlagsCDefs = {
        "Arsenal Rebalance": 1,
        "Laser Invisible W/O Nightvision": 2,
        "Freezer Can't Hurt Owner": 4,
        "Destructable Cameras": 8,
        "[1.3D] Double Kick": 16,
        "[1.3D] No Expander": 32,
        "Fix Tripbombs On Slopes": 64
    };

    // weapflags definition
    const weapFlagsDefs = {
        "Pistol": 1,
        "Shotgun": 2,
        "Chaingun": 4,
        "RPG": 8,
        "Pipebomb": 16,
        "Shrinker": 32,
        "Devastator": 64,
        "Tripbomb": 128,
        "Freezer": 256,
        "Full Ammo": 512,
        "Expander": 1024
    };

    // invflags definition
    const invFlagsDefs = {
        "Key Cards": 1,
        "Medkit": 2,
        "Steroids": 4,
        "Holoduke": 8,
        "Jetpack": 16,
        "Nightvision": 32,
        "Scuba Gear": 64,
        "Boots": 128,
        "Armor": 256,
        "Atomic Health 1": 512,
        "Atomic Health 2": 1024
    };

    // netflags A inputs
    for (const nfa of Object.keys(netFlagsADefs)) {
        const prop = nfa.replace("[", "").replace("]", "").replace(/\//g, "").replace(/\'/g, "").split(" ").join("");
        gamedefs.games.duke3d.executables.produke.parameters[`netFlagA${prop}`] = {
            "modeSupport": ["multiplayer", "singleplayer"],
            "type": "boolean",
            "syncOnly": true,
            "label": nfa,
            "value": netFlagsADefs[nfa]            
        };
    }

    // netflags B inputs
    for (const nfb of Object.keys(netFlagsBDefs)) {
        const prop = nfb.replace("[", "").replace("]", "").replace(/\//g, "").replace(/\'/g, "").split(" ").join("");
        gamedefs.games.duke3d.executables.produke.parameters[`netFlagB${prop}`] = {
            "modeSupport": ["multiplayer", "singleplayer"],
            "type": "boolean",
            "syncOnly": true,
            "label": nfb,
            "value": netFlagsBDefs[nfb]
        };
    }

    // netflags C inputs
    for (const nfc of Object.keys(netFlagsCDefs)) {
        const prop = nfc.replace("[", "").replace("]", "").replace(/\//g, "").replace(/\'/g, "").split(" ").join("");
        gamedefs.games.duke3d.executables.produke.parameters[`netFlagC${prop}`] = {
            "modeSupport": ["multiplayer", "singleplayer"],
            "type": "boolean",
            "syncOnly": true,
            "label": nfc,
            "value": netFlagsCDefs[nfc]
        };
    }

    // weapflags inputs
    for (const wf of Object.keys(weapFlagsDefs)) {
        const prop = wf.replace("[", "").replace("]", "").replace(/\//g, "").replace(/\'/g, "").split(" ").join("");
        gamedefs.games.duke3d.executables.produke.parameters[`weapFlag${prop}`] = {
            "modeSupport": ["multiplayer", "singleplayer"],
            "type": "boolean",
            "syncOnly": true,
            "label": wf,
            "value": weapFlagsDefs[wf]            
        };
    }

    // invflags inputs
    for (const invf of Object.keys(invFlagsDefs)) {
        const prop = invf.replace("[", "").replace("]", "").replace(/\//g, "").replace(/\'/g, "").split(" ").join("");
        gamedefs.games.duke3d.executables.produke.parameters[`invFlag${prop}`] = {
            "modeSupport": ["multiplayer", "singleplayer"],
            "type": "boolean",
            "syncOnly": true,
            "label": invf,
            "value": invFlagsDefs[invf]            
        };
    }

    // netflags A argument
    gamedefs.games.duke3d.executables.produke.parameters.netflagsA = {
        modeSupport: ["singleplayer", "multiplayer"],
        type: "static",
        label: "NetFlagsA",
        value: c => {
            let netFlagsA = 0;
            for (let p in c.GameRoom.Params) {
                if (p.startsWith("netFlagA")) {
                    netFlagsA |= parseInt(c.GameRoom.ParamDefs[p]?.value || 0);
                }
            }
            // failsafe => force "DontSpawnMonsters" if skill is set to "No Monsters"
            if (c.GameRoom.Params.monstersSkill[0] === "/m") netFlagsA |= 32;
            return netFlagsA > 0 ? [`/netflagsA${netFlagsA}`] : null;
        }
    };

    // netflags B argument
    gamedefs.games.duke3d.executables.produke.parameters.netflagsB = {
        modeSupport: ["singleplayer", "multiplayer"],
        type: "static",
        label: "NetFlagsB",
        value: c => {
            let netFlagsB = 0;
            for (let p in c.GameRoom.Params) {
                if (p.startsWith("netFlagB")) {
                    netFlagsB |= parseInt(c.GameRoom.ParamDefs[p]?.value || 0);
                }
            }
            return netFlagsB > 0 ? [`/netflagsB${netFlagsB}`] : null;
        }
    };

    // netflags C argument
    gamedefs.games.duke3d.executables.produke.parameters.netflagsC = {
        modeSupport: ["singleplayer", "multiplayer"],
        type: "static",
        label: "NetFlagsC",
        value: c => {
            let netFlagsC = 0;
            for (let p in c.GameRoom.Params) {
                if (p.startsWith("netFlagC")) {
                    netFlagsC |= parseInt(c.GameRoom.ParamDefs[p]?.value || 0);
                }
            }
            return netFlagsC > 0 ? [`/netflagsC${netFlagsC}`] : null;
        }
    };

    // weapflags argument
    gamedefs.games.duke3d.executables.produke.parameters.weapFlags = {
        modeSupport: ["singleplayer", "multiplayer"],
        type: "static",
        label: "WeapFlags",
        value: c => {
            let weapFlags = 0;
            for (let p in c.GameRoom.Params) {
                if (p.startsWith("weapFlags")) {
                    weapFlags |= parseInt(c.GameRoom.ParamDefs[p]?.value || 0);
                }
            }
            return weapFlags > 0 ? [`/weapflags${weapFlags}`] : null;
        }
    };

    // invflags argument
    gamedefs.games.duke3d.executables.produke.parameters.invFlags = {
        modeSupport: ["singleplayer", "multiplayer"],
        type: "static",
        label: "InvFlags",
        value: c => {
            let invFlags = 0;
            for (let p in c.GameRoom.Params) {
                if (p.startsWith("invFlags")) {
                    invFlags |= parseInt(c.GameRoom.ParamDefs[p]?.value || 0);
                }
            }
            return invFlags > 0 ? [`/invflags${invFlags}`] : null;
        }
    };

    // reorder fields
    gamedefs.games.duke3d.executables.produke.parameters = reorderFields(
        gamedefs.games.duke3d.executables.produke.parameters, 
        [
            "multiplayerMode",
            "monstersSkill",
            "mapType",
            "episodeAndLevel",
            "map",
            "scoreLimit",
            "timeLimit",
            "extraLives",
            "botsNum",
            "botsAi",
            "recordDmo",
            "playDmo",
            "lockOptions",
            "lockPlayers",
            "disableAutoaim",
            "exploitMode",
            "allowMods",
            "presets"
        ]
    );

}