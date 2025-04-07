// custom NukemNet support for proDuke written by LARD (phcs93)

module.exports = function({deepClone, utils}, gamedefs) {

    // custom injected css style
    const style = `

        <style>

            select#game-param-multiplayerMode,
            select#game-param-monstersSkill,
            select#game-param-mapType,
            select#game-param-episodeAndLevel,
            select#game-param-presets
            {
                float: right;
                width: 480px;
            }

            input#game-param-map,
            input#game-param-playDmo
            {
                width: calc(480px - 72px);
            }

            div[style*="display: flex"][style*="flex-direction: row"][style*="align-items: center"] div[style*="width: 100%"]:nth-child(2) > span[style*="display: flex"][style*="flex-direction: row"] { 
                float: right;
            }

            div[style*="display: flex"][style*="flex-direction: row"][style*="align-items: center"] span[style*="width: 100%"] > span[style*="display: flex"][style*="flex-direction: row"] { 
                float: right;
            }

            input#game-param-scoreLimit,
            input#game-param-timeLimit,
            input#game-param-extraLives,
            input#game-param-botsNum
            {
                width: calc(480px - 72px - 4px) !important;
            }

            div[style*="display: flex"][style*="flex-direction: row"][style*="align-items: center"] div[style*="width: 100%"]:nth-child(2) > div[style*="display: flex"][style*="flex-direction: row"][style*="align-items: center"] input[type="number"] { 
                width: 72px;
            }

            div[style*="display: flex"][style*="flex-direction: row"][style*="align-items: center"] div[style*="width: 100%"]:nth-child(2) > div[style*="display: flex"][style*="flex-direction: row"][style*="align-items: center"] { 
                float: right;
            }

            input#game-param-allowMods {
                margin-bottom: 16px;
            }

            div#netflags {
                margin: 16px 0px;
            }    

            div.flags {
                border: 1px solid #495057;
                border-radius: 5px;
                padding: 16px;
            }

            div.flags > span {
                display: inline-block;
                margin-bottom: 16px;
                font-weight: bolder;
            }

        </style>

    `;

    // used to change order of inputs on view
    const reorderFields = (object, order) => {
        return Object.fromEntries([
            // order fields defined in order array
            ...order.filter(key => key in object).map(key => [key, object[key]]),
            // put remaining fields in the end
            ...Object.keys(object).filter(key => !order.includes(key)).map(key => [key, object[key]])
        ]);
    };

    // parse netflag name
    const parseNetFlagName = s => {
        return s
            .replace("[", "")
            .replace("]", "")
            .replace(/\//g, "")
            .replace(/\'/g, "")
            .split(" ")
            .join("")
        ;
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
    gamedefs.games.duke3d.executables.produke.parameters.multiplayerMode.label = "Game Mode";
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
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.label = "Skill";
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.type = "choice";    
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.dependsOn = null;
    gamedefs.games.duke3d.executables.produke.parameters.monstersSkill.value = c => c.value > 0 ? "/s" + c.value : null;
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
        label: "Map Type",
        optional: false,
        syncOnly: true,
        choices: [
            {label: "Original Map", value: "original"},
            {label: "User Map", value: "user"}
        ]
    };

    // original map
    gamedefs.games.duke3d.executables.produke.parameters.episodeAndLevel.label = "Map";
    gamedefs.games.duke3d.executables.produke.parameters.episodeAndLevel.optional = false;
    gamedefs.games.duke3d.executables.produke.parameters.episodeAndLevel.dependsOn = {
        params: "mapType", 
        show: c => c?.ParamEl?.mapType === "original"
    };

    // user map
    gamedefs.games.duke3d.executables.produke.parameters.map.label = "Map";
    gamedefs.games.duke3d.executables.produke.parameters.map.optional = false;
    gamedefs.games.duke3d.executables.produke.parameters.map.dependsOn = {
        params: "mapType", 
        show: c => c?.ParamEl?.mapType === "user"
    };

    // score limit
    gamedefs.games.duke3d.executables.produke.parameters.scoreLimit = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "numrange",
        label: "Score Limit",
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
        label: "Time Limit",
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
        label: "Extra Lives",
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
    gamedefs.games.duke3d.executables.produke.parameters.botsNum.label = "BOTs";
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
    gamedefs.games.duke3d.executables.produke.parameters.playDmo.label = "Play DEMO";

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

    // netflags presets
    const netflagsPresets = {
        "---": {
            netflagsA: 0,
            netflagsB: 0,
            netflagsC: 0,
            weapflags: 1,
            invflags: 1
        },
        classic: {
            netflagsA: 398332,
            netflagsB: 1,
            netflagsC: 0,
            weapflags: 1,
            invflags: 1
        },
        teamplay: {
            netflagsA: 54004732,
            netflagsB: 0,
            netflagsC: 0,
            weapflags: 1,
            invflags: 1
        },
        rebalanced: {
            netflagsA: 50933756,
            netflagsB: 6,
            netflagsC: 1,
            weapflags: 1,
            invflags: 1
        },
        hardcore: {
            netflagsA: 63370220,
            netflagsB: 31,
            netflagsC: 106,
            weapflags: 1,
            invflags: 1
        },
        overpowered: {
            netflagsA: 3747708,
            netflagsB: 32,
            netflagsC: 20,
            weapflags: 2047,
            invflags: 2047
        }
    };

    // netflags presets input
    gamedefs.games.duke3d.executables.produke.parameters.presets = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "choice",
        label: "NetFlags Presets",
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
                if (c?.ParamEl?.presets) {
                    const element = document.getElementById("game-param-presets");
                    if (!element.dataset.listening) {
                        element.dataset.listening = true;
                        element.addEventListener("input", e => {
                            const preset = netflagsPresets[e.target.value.replace(/\"/g, "")];
                            for (const nf of Object.keys(netFlagsADefs)) {
                                if ((preset.netflagsA & netFlagsADefs[nf]) !== 0) {                            
                                    document.getElementById(`game-param-netFlagA${parseNetFlagName(nf)}`).checked = true;
                                } else {
                                    document.getElementById(`game-param-netFlagA${parseNetFlagName(nf)}`).checked = false;
                                }
                            }
                            for (const nf of Object.keys(netFlagsBDefs)) {
                                if ((preset.netflagsB & netFlagsBDefs[nf]) !== 0) {
                                    document.getElementById(`game-param-netFlagB${parseNetFlagName(nf)}`).checked = true;
                                } else {
                                    document.getElementById(`game-param-netFlagB${parseNetFlagName(nf)}`).checked = false;
                                }
                            }
                            for (const nf of Object.keys(netFlagsCDefs)) {
                                if ((preset.netflagsC & netFlagsCDefs[nf]) !== 0) {
                                    document.getElementById(`game-param-netFlagC${parseNetFlagName(nf)}`).checked = true;
                                } else {
                                    document.getElementById(`game-param-netFlagC${parseNetFlagName(nf)}`).checked = false;
                                }
                            }
                            for (const nf of Object.keys(weapFlagsDefs)) {
                                if ((preset.weapflags & weapFlagsDefs[nf]) !== 0) {
                                    document.getElementById(`game-param-weapFlag${parseNetFlagName(nf)}`).checked = true;
                                } else {
                                    document.getElementById(`game-param-weapFlag${parseNetFlagName(nf)}`).checked = false;
                                }
                            }
                            for (const nf of Object.keys(invFlagsDefs)) {
                                if ((preset.invflags & invFlagsDefs[nf]) !== 0) {
                                    document.getElementById(`game-param-invFlag${parseNetFlagName(nf)}`).checked = true;
                                } else {
                                    document.getElementById(`game-param-invFlag${parseNetFlagName(nf)}`).checked = false;
                                }
                            }
                        });
                    }                    
                }
                return true;
            }
        }
    };

    // netflags A inputs
    for (const nfa of Object.keys(netFlagsADefs)) {
        const prop = parseNetFlagName(nfa);
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
        const prop = parseNetFlagName(nfb);
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
        const prop = parseNetFlagName(nfc);
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
        const prop = parseNetFlagName(wf);
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
        const prop = parseNetFlagName(invf);
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
            if (c.GameRoom.Params.monstersSkill.length === 0) netFlagsA |= 32;
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
                if (p.startsWith("weapFlag")) {
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
                if (p.startsWith("invFlag")) {
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
            "lockOptions",
            "lockPlayers",
            "disableAutoaim",
            "exploitMode",
            "allowMods",
            "recordDmo",
            "playDmo",
            "presets"
        ]
    );

    // small hack to manipulate the html
    gamedefs.games.duke3d.executables.produke.parameters.html = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "choice",
        label: "",
        optional: false,
        syncOnly: true,
        choices: [ {label: "", value: ""} ],
        dependsOn: {
            params: "html",
            show: () => {

                // get reference element
                const reference = document.getElementById("game-param-presets");

                // if reference element doesn't exists => ignore
                if (!reference) return;

                // get custom netflags element
                const netflags = document.getElementById("netflags");

                // if custom netflags element already exists => just check if it is in the correct spot
                if (netflags) {

                    const innerDiv = reference.closest("div");
                    const outerDiv = innerDiv?.parentElement;

                    if (!outerDiv) return;
                    if (outerDiv.nextElementSibling !== netflags) {
                        outerDiv.parentElement.insertBefore(netflags, outerDiv.nextElementSibling);                    
                    }

                    // move checkboxes to corresponding boxes
                    document.querySelectorAll(`[id^="game-param-netFlagA"]`).forEach(e => {
                        document.getElementById("netflagsA").appendChild(e.parentNode.parentNode.parentNode);
                    });
                    document.querySelectorAll(`[id^="game-param-netFlagB"]`).forEach(e => {
                        document.getElementById("netflagsB").appendChild(e.parentNode.parentNode.parentNode);
                    });
                    document.querySelectorAll(`[id^="game-param-netFlagC"]`).forEach(e => {
                        document.getElementById("netflagsC").appendChild(e.parentNode.parentNode.parentNode);
                    });
                    document.querySelectorAll(`[id^="game-param-weapFlag"]`).forEach(e => {
                        document.getElementById("weapFlags").appendChild(e.parentNode.parentNode.parentNode);
                    });
                    document.querySelectorAll(`[id^="game-param-invFlag"]`).forEach(e => {
                        document.getElementById("invFlags").appendChild(e.parentNode.parentNode.parentNode);
                    });

                    return;
                }

                // add main flex boxes
                reference.parentNode.parentNode.insertAdjacentHTML("afterend", `
                    ${style}
                    <div id="netflags" style="display: flex; flex-direction: column; gap: 16px;">
                        <div style="display: flex; flex-direction: row; gap: 16px;">
                            <div style="flex: 1; min-width: 0;">
                                <div id="netflagsA" class="flags">
                                    <span>NetFlags A</span>
                                </div>
                            </div>
                            <div style="display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 16px;">
                                <div id="netflagsB" class="flags">
                                    <span>NetFlags B</span>
                                </div>
                                <div id="netflagsC" class="flags"">
                                    <span>NetFlags C</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: row; gap: 16px;">
                            <div id="weapFlags" style="flex: 1; min-width: 0;" class="flags">
                                <span>Starting Weapon</span>
                            </div>
                            <div id="invFlags" style="flex: 1; min-width: 0;" class="flags">
                                <span>Starting Inventory</span>
                            </div>
                        </div>
                    </div>
                `);

                // move checkboxes to corresponding boxes
                document.querySelectorAll(`[id^="game-param-netFlagA"]`).forEach(e => {
                    document.getElementById("netflagsA").appendChild(e.parentNode.parentNode.parentNode);
                });
                document.querySelectorAll(`[id^="game-param-netFlagB"]`).forEach(e => {
                    document.getElementById("netflagsB").appendChild(e.parentNode.parentNode.parentNode);
                });
                document.querySelectorAll(`[id^="game-param-netFlagC"]`).forEach(e => {
                    document.getElementById("netflagsC").appendChild(e.parentNode.parentNode.parentNode);
                });
                document.querySelectorAll(`[id^="game-param-weapFlag"]`).forEach(e => {
                    document.getElementById("weapFlags").appendChild(e.parentNode.parentNode.parentNode);
                });
                document.querySelectorAll(`[id^="game-param-invFlag"]`).forEach(e => {
                    document.getElementById("invFlags").appendChild(e.parentNode.parentNode.parentNode);
                });

                return false;
            }
        }
    };

}