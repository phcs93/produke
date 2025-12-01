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

    // netflags A definition
    const netFlagsADefs = {
        "Weapons Are Pickable Only Once": 1,
        "Respawn Monsters": 2,
        "Respawn Items": 4,
        "Respawn Inventory": 8,
        "Markers": 16,
        "Don't Spawn Monsters": 32,
        "Don't Spawn Keycards": 64,
        "Spawn MP Only Switches": 128,
        "Spawn MP Only Items": 256,
        "[COOP/TEAM] Friendly Fire": 512,
        "[COOP/TEAM] Autoaim On Allies": 1024,
        "[COOP/TEAM] Global Ally Sounds": 2048,
        "[COOP/TEAM] Disable Spycam/Mapview": 4096,
        "Revealed Automap": 8192,
        "No Map Exit": 16384,
        "No Target Names": 32768,
        "Weapon Always Drops On Kill": 65536,
        "Force Respawn": 131072,
        "[PVP] Respawn Farthest": 262144,
        "[TEAM] Teamless Spawn Points": 524288,
        "Damage Numbers": 1048576,
        "[COOP/TEAM/TRM] Overhead Info": 2097152,
        "[COOP/TEAM/TRM] Outlines": 4194304,
        "[CTF] Outline On Flags": 8388608,
        "[CTF] Flag Return Instantly": 16777216,
        "[CTF] Flag Auto Detonate": 33554432,
        "[T/LMS] Restricted Spycam": 67108864,
        "[T/LMS] Restricted Chat": 134217728,
        "[COOP] KeyCards Are Shared": 268435456,
        "[SURV/TLMS] Lives Are Shared": 536870912
    };

    // netflags B definition
    const netFlagsBDefs = {
        "[TEAM] Colored Tripbombs": 1,
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
        "Fix Tripbombs On Slopes": 64,
        "[DOS] Map Start Bugs": 128,
        "[DOS] No Suicide If FFire Is Off": 256,
        "[DOS] Can Respawn Drowning": 512,
        "[DOS] Can Respawn Shrunked": 1024,
        "[DOS] Bad Expander Radius Owner": 2048,
        "[DOS] Alt-Weapon Switching Bugs": 4096,
        "[DOS] Dead player swaping Bugs": 8192,
        "[DOS] Useless Nightvision": 16384
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

    // netflagsA definition
    const NetFlagsA = {
        GETWEAPONCE:                  1 << 0,   // 1
        RESPAWN_MONSTERS:             1 << 1,   // 2
        RESPAWN_ITEMS:                1 << 2,   // 4
        RESPAWN_INVENTORY:            1 << 3,   // 8
        MARKERS:                      1 << 4,   // 16
        NO_MONSTERS:                  1 << 5,   // 32
        NO_ACCESS:                    1 << 6,   // 64
        DMSWITCHES:                   1 << 7,   // 128
        MPITEMS:                      1 << 8,   // 256
        COOPTEAM__FRIENDLY_FIRE:      1 << 9,   // 512
        COOPTEAM__AUTOAIM_ON_ALLIES:  1 << 10,  // 1024
        COOPTEAM__GLOBAL_ALLY_SOUNDS: 1 << 11,  // 2048
        COOPTEAM__NO_SPYCAM_MAPVIEW:  1 << 12,  // 4096
        REVEALED_AUTOMAP:             1 << 13,  // 8192
        DISABLE_MAP_EXIT:             1 << 14,  // 16384
        DISABLE_TARGET_NAMES:         1 << 15,  // 32768
        WEAPON_ALWAYS_DROP:           1 << 16,  // 65536
        FORCE_RESPAWN:                1 << 17,  // 131072
        RESPAWN_FARTHEST:             1 << 18,  // 262144
        TEAM__USE_NORMAL_SPAWNS:      1 << 19,  // 524288        
        DAMAGENUMS:                   1 << 20,  // 1048576
        TRMCOOPTEAM__OVERHEAD:        1 << 21,  // 2097152
        TRMCOOPTEAM__OUTLINES:        1 << 22,  // 4194304
        CTF__FLAG_OUTLINE:            1 << 23,  // 8388608
        CTF__FLAG_INSTANT_RETURN:     1 << 24,  // 16777216
        CTF__FLAG_AUTODETONATE:       1 << 25,  // 33554432
        T_LMS__RESTRICTED_SPYCAM:     1 << 26,  // 67108864
        T_LMS__RESTRICTED_CHAT:       1 << 27,  // 134217728
        COOP__SHARED_ACCESS:          1 << 28,  // 268435456
        SURVTLMS__SHARED_LIVES:       1 << 29,  // 536870912
    };

    // netflagsB definition
    const NetFlagsB = {
        TEAM__LASER_COLORS:           1 << 0,   // 1
        CTF__NO_ROIDS:                1 << 1,   // 2
        CTF__NO_JETPACK:              1 << 2,   // 4
        TRM__NO_INFINITE_JPACK:       1 << 3,   // 8
        TRM__NO_SHRINKER_IMMUNITY:    1 << 4,   // 16
        TRM__NO_FREEZER_WEAKNESS:     1 << 5,   // 32
    };

    // netflagsC definition
    const NetFlagsC = {
        ARSENAL_REBALANCE:                   1 << 0,  // 1
        LASERMODE_HEAT:                      1 << 1,  // 2
        FREEZER_CANT_HURT_OWNER:             1 << 2,  // 4
        DESTRUCTABLE_CAMERAS:                1 << 3,  // 8
        _13D_ENABLE_DOUBLE_KICK:             1 << 4,  // 16
        _13D_DISABLE_EXPANDER:               1 << 5,  // 32
        FIX_TRIPBOMB_ON_SLOPES:              1 << 6,  // 64
        ORIGBHV_MAP_START_BUGS:              1 << 7,  // 128
        ORIGBHV_FFIRE_NO_SUICIDE:            1 << 8,  // 256        
        ORIGBHV_DROWNING_RESPAWN:            1 << 9,  // 512
        ORIGBHV_SHRUNK_RESPAWN:              1 << 10, // 1024
        ORIGBHV_EXPANDER_RADIUS:             1 << 11, // 2048
        ORIGBHV_ALTWEAPON_SWITCHING_BUGS:    1 << 12, // 4096
        ORIGBHV_DEAD_PLAYER_SWAPING_BUGS:    1 << 13, // 8192
        ORIGBHV_BAD_NIGHTVISION_GLOW:        1 << 14, // 16384
    };

    // weapflags definitions
    const StartingWeapon = {
        PISTOL:       1 << 0,   // 1   
        SHOTGUN:      1 << 1,   // 2   
        CHAINGUN:     1 << 2,   // 4   
        RPG:          1 << 3,   // 8   
        HANDBOMB:     1 << 4,   // 16  
        SHRINKER:     1 << 5,   // 32  
        DEVISTATOR:   1 << 6,   // 64  
        TRIPBOMB:     1 << 7,   // 128 
        FREEZE:       1 << 8,   // 256 
        FULL_AMMO:    1 << 9,   // 512 
        GROW:         1 << 10,  // 1024
    };

    // invflags definitions
    const StartingInventory = {
        ACCESS:    1 << 0,  // 1     
        FIRSTAID:  1 << 1,  // 2     
        STEROIDS:  1 << 2,  // 4
        HOLODUKE:  1 << 3,  // 8
        JETPACK:   1 << 4,  // 16
        HEAT:      1 << 5,  // 32    
        AIRTANK:   1 << 6,  // 64    
        BOOTS:     1 << 7,  // 128
        ARMOR:     1 << 8,  // 256
        ATOMIC1:   1 << 9,  // 512   
        ATOMIC2:   1 << 10, // 1024  
    };

    // default netflags presets per game mode category
    const DEFAULT_NETFLAGS_SP         = 0;
    const DEFAULT_NETFLAGS_PVP_SPWN   = 0 | NetFlagsA.MARKERS | NetFlagsA.NO_MONSTERS | NetFlagsA.NO_ACCESS | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | NetFlagsA.DMSWITCHES | NetFlagsA.MPITEMS;
    const DEFAULT_NETFLAGS_PVP_NOSPWN = NetFlagsA.GETWEAPONCE | 0 | NetFlagsA.NO_MONSTERS | NetFlagsA.NO_ACCESS | 0 | 0 | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | NetFlagsA.DMSWITCHES | NetFlagsA.MPITEMS;
    const DEFAULT_NETFLAGS_COOP       = NetFlagsA.GETWEAPONCE | 0 | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | 0 | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | 0 | NetFlagsA.MPITEMS;

    // base netflags presets
    const BASE_TDM_TLMS           = NetFlagsA.TEAM__USE_NORMAL_SPAWNS | NetFlagsA.T_LMS__RESTRICTED_SPYCAM | NetFlagsA.T_LMS__RESTRICTED_CHAT;
    const BASE_LMS                = NetFlagsA.FORCE_RESPAWN | NetFlagsA.RESPAWN_FARTHEST;
    const BASE_MODERN             = NetFlagsA.WEAPON_ALWAYS_DROP | NetFlagsA.REVEALED_AUTOMAP | NetFlagsA.DISABLE_MAP_EXIT | NetFlagsA.DAMAGENUMS;
    const BASE_HARDCORE           = NetFlagsA.DISABLE_TARGET_NAMES;
    const BASE_CLASSIC_TEAMPLAY   = NetFlagsA.DISABLE_TARGET_NAMES | 0 | 0 | 0 | 0;
    const BASE_ALT_TEAMPLAY       = 0 | NetFlagsA.TRMCOOPTEAM__OVERHEAD | 0 | 0 | 0;
    const BASE_MODERN_TEAMPLAY    = 0 | NetFlagsA.TRMCOOPTEAM__OVERHEAD | NetFlagsA.TRMCOOPTEAM__OUTLINES | 0 | 0;
    const BASE_HARDCORE_TEAMPLAY  = NetFlagsA.DISABLE_TARGET_NAMES | 0 | 0 | NetFlagsA.COOPTEAM__NO_SPYCAM_MAPVIEW | NetFlagsA.COOPTEAM__AUTOAIM_ON_ALLIES;

    // netflagsA preset combinations
    const PRESET_NETFLAGS_CLASSIC_COOP  = DEFAULT_NETFLAGS_COOP | NetFlagsA.COOPTEAM__GLOBAL_ALLY_SOUNDS | BASE_CLASSIC_TEAMPLAY;
    const PRESET_NETFLAGS_ALT_COOP      = 0 | NetFlagsA.MARKERS | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | 0 | NetFlagsA.MPITEMS | NetFlagsA.SURVTLMS__SHARED_LIVES | BASE_ALT_TEAMPLAY;
    const PRESET_NETFLAGS_MODERN_COOP   = NetFlagsA.GETWEAPONCE | NetFlagsA.MARKERS | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | 0 | 0 | NetFlagsA.MPITEMS | 0 | BASE_MODERN_TEAMPLAY;
    const PRESET_NETFLAGS_HARDCORE_COOP = 0 | 0 | 0 | 0 | 0 | 0 | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | 0 | 0 | NetFlagsA.SURVTLMS__SHARED_LIVES | BASE_HARDCORE_TEAMPLAY;

    const PRESET_NETFLAGS_CLASSIC_SURV  = PRESET_NETFLAGS_CLASSIC_COOP | NetFlagsA.COOP__SHARED_ACCESS;
    const PRESET_NETFLAGS_ALT_SURV      = PRESET_NETFLAGS_ALT_COOP | NetFlagsA.COOP__SHARED_ACCESS;
    const PRESET_NETFLAGS_MODERN_SURV   = PRESET_NETFLAGS_MODERN_COOP | NetFlagsA.COOP__SHARED_ACCESS;
    const PRESET_NETFLAGS_HARDCORE_SURV = PRESET_NETFLAGS_HARDCORE_COOP | NetFlagsA.COOP__SHARED_ACCESS;

    const PRESET_NETFLAGS_CLASSIC_FFA   = DEFAULT_NETFLAGS_PVP_SPWN | 0 | 0;
    const PRESET_NETFLAGS_ALT_FFA       = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0;
    const PRESET_NETFLAGS_MODERN_FFA    = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_MODERN;
    const PRESET_NETFLAGS_HARDCORE_FFA  = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_HARDCORE;

    const PRESET_NETFLAGS_CLASSIC_TEAM  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | 0 | BASE_CLASSIC_TEAMPLAY | 0;
    const PRESET_NETFLAGS_ALT_TEAM      = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0 | BASE_ALT_TEAMPLAY | 0;
    const PRESET_NETFLAGS_MODERN_TEAM   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_MODERN | BASE_MODERN_TEAMPLAY | 0;
    const PRESET_NETFLAGS_HARDCORE_TEAM = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA.SURVTLMS__SHARED_LIVES;

    const PRESET_NETFLAGS_CLASSIC_CTF   = DEFAULT_NETFLAGS_PVP_SPWN | 0 | 0 | BASE_CLASSIC_TEAMPLAY | 0;
    const PRESET_NETFLAGS_ALT_CTF       = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0 | BASE_ALT_TEAMPLAY | NetFlagsA.CTF__FLAG_INSTANT_RETURN;
    const PRESET_NETFLAGS_MODERN_CTF    = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_MODERN | BASE_MODERN_TEAMPLAY | NetFlagsA.CTF__FLAG_OUTLINE;
    const PRESET_NETFLAGS_HARDCORE_CTF  = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA.CTF__FLAG_INSTANT_RETURN | NetFlagsA.CTF__FLAG_AUTODETONATE;

    const PRESET_NETFLAGS_CLASSIC_LMS   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS | 0;
    const PRESET_NETFLAGS_ALT_LMS       = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0;
    const PRESET_NETFLAGS_MODERN_LMS    = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS | BASE_MODERN;
    const PRESET_NETFLAGS_HARDCORE_LMS  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS | BASE_HARDCORE;

    const PRESET_NETFLAGS_CLASSIC_TERM  = DEFAULT_NETFLAGS_PVP_SPWN | 0 | 0 | BASE_CLASSIC_TEAMPLAY;
    const PRESET_NETFLAGS_ALT_TERM      = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0 | BASE_ALT_TEAMPLAY;
    const PRESET_NETFLAGS_MODERN_TERM   = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_MODERN | BASE_MODERN_TEAMPLAY;
    const PRESET_NETFLAGS_HARDCORE_TERM = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY;

    // netflagsB preset combinations
    const PRESET_NETFLAGSB_CLASSIC        = 0;
    const PRESET_NETFLAGSB_ALT            = NetFlagsB.TEAM__LASER_COLORS;
    const PRESET_NETFLAGSB_MODERN         = NetFlagsB.TEAM__LASER_COLORS;
    const PRESET_NETFLAGSB_HARDCORE       = 0;

    const PRESET_NETFLAGSB_CLASSIC_TERM   = PRESET_NETFLAGSB_CLASSIC | 0 | 0;
    const PRESET_NETFLAGSB_ALT_TERM       = PRESET_NETFLAGSB_ALT | 0 | NetFlagsB.TRM__NO_SHRINKER_IMMUNITY;
    const PRESET_NETFLAGSB_MODERN_TERM    = PRESET_NETFLAGSB_MODERN | NetFlagsB.TRM__NO_INFINITE_JPACK | 0;
    const PRESET_NETFLAGSB_HARDCORE_TERM  = PRESET_NETFLAGSB_HARDCORE | NetFlagsB.TRM__NO_INFINITE_JPACK | NetFlagsB.TRM__NO_SHRINKER_IMMUNITY;

    // weapflags presets
    const DEFAULT_WEAPFLAGS              = StartingWeapon.PISTOL;
    const PRESET_WEAPFLAGS_HARDCORE_TERM = StartingWeapon.PISTOL | StartingWeapon.FREEZE;

    // invflags presets
    const DEFAULT_INVFLAGS   = 0;
    const DEFAULT_INVFLAGS_PVP = StartingInventory.ACCESS;

    // gametype enum for easier handling
    const GameType = {
        DM:     1,  // Dukematch (DM)
        COOP:   2,  // Cooperative
        TDM:    3,  // Team Dukematch
        CTF:    4,  // Capture The Flag
        F1CTF:  5,  // 1-Flag CTF
        ADCTF:  6,  // Attack/Defend CTF
        SURV:   7,  // Survival
        LMS:    8,  // Last Man Standing
        TLMS:   9,  // Team Last Man Standing
        TERM:   10, // Terminator
    };

    // get flags corresponding to selected gamemode and preset
    const getFlags = (gametype, preset) => {

        let netflagsA = 0;
        let netflagsB = 0;
        let netflagsC = 0;
        let weapflags = 0;
        let invflags  = 0;

        switch (preset) {
            case "classic": {
                switch (gametype) {
                    case GameType.COOP: {
                        netflagsA = PRESET_NETFLAGS_CLASSIC_COOP;
                        netflagsB = PRESET_NETFLAGSB_CLASSIC;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS;
                        break;
                    }
                    case GameType.SURV: {
                        netflagsA = PRESET_NETFLAGS_CLASSIC_SURV;
                        netflagsB = PRESET_NETFLAGSB_CLASSIC;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS;
                        break;
                    }
                    case GameType.DM: {
                        netflagsA = PRESET_NETFLAGS_CLASSIC_FFA;
                        netflagsB = PRESET_NETFLAGSB_CLASSIC;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.TDM: case GameType.TLMS: {
                        netflagsA = PRESET_NETFLAGS_CLASSIC_TEAM;
                        netflagsB = PRESET_NETFLAGSB_CLASSIC;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.CTF: case GameType.F1CTF: case GameType.ADCTF: {
                        netflagsA = PRESET_NETFLAGS_CLASSIC_CTF;
                        netflagsB = PRESET_NETFLAGSB_CLASSIC;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.LMS: {
                        netflagsA = PRESET_NETFLAGS_CLASSIC_LMS;
                        netflagsB = PRESET_NETFLAGSB_CLASSIC;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.TERM: {
                        netflagsA = PRESET_NETFLAGS_CLASSIC_TERM;
                        netflagsB = PRESET_NETFLAGSB_CLASSIC_TERM;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                }
                break;
            }
            case "alternative": {
                switch (gametype) {
                    case GameType.COOP: {
                        netflagsA = PRESET_NETFLAGS_ALT_COOP;
                        netflagsB = PRESET_NETFLAGSB_ALT;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS;
                        break;
                    }
                    case GameType.SURV: {
                        netflagsA = PRESET_NETFLAGS_ALT_SURV;
                        netflagsB = PRESET_NETFLAGSB_ALT;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS;
                        break;
                    }
                    case GameType.DM: {
                        netflagsA = PRESET_NETFLAGS_ALT_FFA;
                        netflagsB = PRESET_NETFLAGSB_ALT;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.TDM: case GameType.TLMS: {
                        netflagsA = PRESET_NETFLAGS_ALT_TEAM;
                        netflagsB = PRESET_NETFLAGSB_ALT;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.CTF: case GameType.F1CTF: case GameType.ADCTF: {
                        netflagsA = PRESET_NETFLAGS_ALT_CTF;
                        netflagsB = PRESET_NETFLAGSB_ALT;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.LMS: {
                        netflagsA = PRESET_NETFLAGS_ALT_LMS;
                        netflagsB = PRESET_NETFLAGSB_ALT;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.TERM: {
                        netflagsA = PRESET_NETFLAGS_ALT_TERM;
                        netflagsB = PRESET_NETFLAGSB_ALT_TERM;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                }
                break;
            }
            case "modern": {
                switch (gametype) {
                    case GameType.COOP: {
                        netflagsA = PRESET_NETFLAGS_MODERN_COOP;
                        netflagsB = PRESET_NETFLAGSB_MODERN;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS;
                        break;
                    }
                    case GameType.SURV: {
                        netflagsA = PRESET_NETFLAGS_MODERN_SURV;
                        netflagsB = PRESET_NETFLAGSB_MODERN;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS;
                        break;
                    }
                    case GameType.DM: {
                        netflagsA = PRESET_NETFLAGS_MODERN_FFA;
                        netflagsB = PRESET_NETFLAGSB_MODERN;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.TDM: case GameType.TLMS: {
                        netflagsA = PRESET_NETFLAGS_MODERN_TEAM;
                        netflagsB = PRESET_NETFLAGSB_MODERN;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.CTF: case GameType.F1CTF: case GameType.ADCTF: {
                        netflagsA = PRESET_NETFLAGS_MODERN_CTF;
                        netflagsB = PRESET_NETFLAGSB_MODERN;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.LMS: {
                        netflagsA = PRESET_NETFLAGS_MODERN_LMS;
                        netflagsB = PRESET_NETFLAGSB_MODERN;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.TERM: {
                        netflagsA = PRESET_NETFLAGS_MODERN_TERM;
                        netflagsB = PRESET_NETFLAGSB_MODERN_TERM;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                }
                break;
            }
            case "hardcore": {
                switch (gametype) {
                    case GameType.COOP: {
                        netflagsA = PRESET_NETFLAGS_HARDCORE_COOP;
                        netflagsB = PRESET_NETFLAGSB_HARDCORE;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS;
                        break;
                    }
                    case GameType.SURV: {
                        netflagsA = PRESET_NETFLAGS_HARDCORE_SURV;
                        netflagsB = PRESET_NETFLAGSB_HARDCORE;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS;
                        break;
                    }
                    case GameType.DM: {
                        netflagsA = PRESET_NETFLAGS_HARDCORE_FFA;
                        netflagsB = PRESET_NETFLAGSB_HARDCORE;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.TDM: case GameType.TLMS: {
                        netflagsA = PRESET_NETFLAGS_HARDCORE_TEAM;
                        netflagsB = PRESET_NETFLAGSB_HARDCORE;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.CTF: case GameType.F1CTF: case GameType.ADCTF: {
                        netflagsA = PRESET_NETFLAGS_HARDCORE_CTF;
                        netflagsB = PRESET_NETFLAGSB_HARDCORE;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.LMS: {
                        netflagsA = PRESET_NETFLAGS_HARDCORE_LMS;
                        netflagsB = PRESET_NETFLAGSB_HARDCORE;
                        weapflags = DEFAULT_WEAPFLAGS;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                    case GameType.TERM: {
                        netflagsA = PRESET_NETFLAGS_HARDCORE_TERM;
                        netflagsB = PRESET_NETFLAGSB_HARDCORE_TERM;
                        weapflags = PRESET_WEAPFLAGS_HARDCORE_TERM;
                        invflags  = DEFAULT_INVFLAGS_PVP;
                        break;
                    }
                }
                break;
            }
        }

        return {
            netflagsA,
            netflagsB,
            netflagsC,
            weapflags,
            invflags
        }

    };

    const setFlags = preset => {
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
    };

    // clone xduke definitions as base
    gamedefs.games.duke3d.executables.produke = deepClone(gamedefs.games.duke3d.executables.xduke);

    // change to produke name and executable
    gamedefs.games.duke3d.executables.produke.name = "proDuke";
    gamedefs.games.duke3d.executables.produke.files.main.path = "produke.exe";
    gamedefs.games.duke3d.executables.produke.networking = {
        modes: ['p2p'], 
        ipv6:true
    };

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
    gamedefs.games.duke3d.executables.produke.parameters.multiplayerMode.dependsOn = {
        params: "multiplayerMode", 
        show: async c => {            
            if (c?.ParamEl?.multiplayerMode) {
                const element = document.getElementById("game-param-multiplayerMode");
                if (!element.dataset.listening) {
                    element.dataset.listening = true;
                    element.addEventListener("input", e => {
                        const selectedGamemode = parseInt(e.target.value);
                        const selectedPreset = document.getElementById("game-param-presets").value.replace(/\"/g, "");
                        const preset = getFlags(selectedGamemode, selectedPreset);
                        setFlags(preset);
                    });
                }                    
            }
            return true;
        }
    }

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
        modeSupport: ["multiplayer"],
        type: "boolean",
        label: "Lock Options",
        optional: false,
        value: "/lockoptions",
        for: "host-only-private"
    };

    // lock players
    gamedefs.games.duke3d.executables.produke.parameters.lockPlayers = {
        modeSupport: ["multiplayer"],
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
        value: "/disableautoaim",
        for: "private"
    };

    // exploit mode
    gamedefs.games.duke3d.executables.produke.parameters.exploitMode = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Exploit Mode (tiles + visiblity)",
        optional: false,
        value: "/exploitmode",
        for: "private"
    };

    // allow mods
    gamedefs.games.duke3d.executables.produke.parameters.allowMods = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Allow Mods (con / art / dat / etc)",
        optional: false,
        value: "/allowmods",
        for: "private"
    };

    // master/slave
    gamedefs.games.duke3d.executables.produke.parameters.masterSlave = {
        modeSupport: ["multiplayer"],
        type: "boolean",
        label: "Master/Slave mode (/i0)",
        optional: false,
        value: "/i0",
        for: "host-only-private"
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
            {label: "Alternative", value: "alternative"},
            {label: "Modern", value: "modern"},
            {label: "Hardcore", value: "hardcore"},
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
                            const selectedGamemode = c.ParamEl.multiplayerMode;
                            const selectedPreset = e.target.value.replace(/\"/g, "");
                            const preset = getFlags(selectedGamemode, selectedPreset);
                            setFlags(preset);
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

    // send /teampicker automatically if any team based mode is selected
    gamedefs.games.duke3d.executables.produke.parameters["teampicker"] = {
        modeSupport: ["singleplayer", "multiplayer"],
        type: "static",
        value: "/teampicker",
        addIf: c => {
            return [3,4,5,6,9].includes(parseInt(c.GameRoom.Params.multiplayerMode[0].replace("/c", "")));
        }        
    };

    // send -master automatically if /lockoption or /lockplayers or /i0 is set
    gamedefs.games.duke3d.executables.produke.parameters["master"] = {
        modeSupport: ["multiplayer"],
        type: "static",
        for: "host-only-private",
        value: "-master",
        addIf: c => {
            const p = c.GameRoom.Params;
            return p.lockOptions || p.lockPlayers || p.masterSlave;
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
            "disableAutoaim",
            "exploitMode",
            "allowMods",            
            "recordDmo",
            "playDmo",
            "lockOptions",
            "lockPlayers",
            "masterSlave",
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