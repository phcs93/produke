// custom NukemNet support for proDuke written by LARD (phcs93)
module.exports = function({deepClone, utils, mainStore }, gamedefs) {

    const fs = require("fs");
    const path = require("path");

    // log messages to the chat (local only)
    const log = str => {

        const [channelKey, room] = Object.entries(mainStore.joinedChannels).find(([channel]) => mainStore.isChannelGameRoom(channel)) || [];

        if (channelKey && room) {
            mainStore.addEventTo('channel', channelKey, room, {
                type: 'notice',
                ts: Date.now(),
                channel: room.name || channelKey,
                text: `${str}`
            });
        }

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

    // netflags A labels
    const netFlagsADefs = {
        "Weapons Pickable Once": 1,
        "Respawn Monsters": 2,
        "Respawn Items": 4,
        "Respawn Inventory": 8,
        "Markers": 16,
        "Don't Spawn Monsters": 32,
        "Don't Spawn Keycards": 64,
        "Spawn DM Only Switches": 128,
        "Spawn MP Only Items": 256,
        "[COOP/TEAMS] Friendly Fire": 512,
        "[COOP/TEAMS] Autoaim On Allies": 1024,
        "[COOP/TEAMS] Global Ally Sounds": 2048,
        "[COOP/TEAMS] No Spycam/Mapview": 4096,
        "Revealed Automap": 8192,
        "No Map Exit": 16384,
        "No Target Names": 32768,
        "Weapon Always Drops On Kill": 65536,
        "Force Respawn": 131072,
        "[PVP] Respawn Farthest": 262144,
        "[TEAMS] Mixed Team Spawn Points": 524288,
        "Damage Numbers": 1048576,
        "[COOP/TEAMS/TERM] Overhead Info": 2097152,
        "[COOP/TEAMS/TERM] Outlines": 4194304,
        "[CTF] Outline On Flags": 8388608,
        "[CTF] Flag Return Instantly": 16777216,
        "[CTF] Flag Auto Detonate": 33554432,
        "[T/LMS] Restricted Spycam": 67108864,
        "[T/LMS] Restricted Chat": 134217728,
        "[COOP] KeyCards Are Shared": 268435456,
        "[SURV/TLMS] Lives Are Shared": 536870912
    };

    // netflags B labels
    const netFlagsBDefs = {
        "[TEAMS] Colored Tripbombs": 1,
        "[CTF] No Steroids If With Flag": 2,
        "[CTF] No Jetpack If With Flag": 4,
        "[TERM] No Infinite Jetpack": 8,
        "[TERM] No Shrinker Immunity": 16,
        "[TERM] No Freezer Weakness": 32
    };

    // netflags C labels
    const netFlagsCDefs = {
        "Arsenal Rebalance": 1,
        "Laser Invisible W/O Nightvision": 2,
        "Freezer Can't Hurt Owner": 4,
        "Destructable Cameras": 8,
        "[1.3D] Double Kick": 16,
        "[1.3D] No Expander": 32,
        "Fix Tripbombs On Slopes": 64,
        "[DOS] Classic Map Start Behaviors": 128,
        "[DOS] FFire Excludes Self": 256,
        "[DOS] Can Respawn Drowning": 512,
        "[DOS] Invalid Shrink States": 1024,
        "[DOS] Bad Shrinker Hit Detection": 2048,
        "[DOS] Bad Grow Explosion Owner": 4096,
        "[DOS] Weapon Switching Bugs": 8192,
        "[DOS] Dead Player Swapping Bugs": 16384,
        "[DOS] Useless Nightvision": 32768,
        "[DOS] Auto-aimed RPGs Bugs": 65536
    };

    // weapflags labels
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

    // invflags labels
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

    // netflagsA definition (only used for presets)
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
        NO_MAP_EXIT:                  1 << 14,  // 16384
        NO_TARGET_NAMES:              1 << 15,  // 32768
        WEAPON_ALWAYS_DROP:           1 << 16,  // 65536
        FORCE_RESPAWN:                1 << 17,  // 131072
        RESPAWN_FARTHEST:             1 << 18,  // 262144
        TEAM__MIXED_TEAM_SPAWNS:      1 << 19,  // 524288        
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

    // netflagsB definition (only used for presets)
    const NetFlagsB = {
        TEAM__LASER_COLORS:        1 << 0,   // 1
        CTF__NO_ROIDS:             1 << 1,   // 2
        CTF__NO_JETPACK:           1 << 2,   // 4
        TRM__NO_INFINITE_JETPACK:  1 << 3,   // 8
        TRM__NO_SHRINKER_IMMUNITY: 1 << 4,   // 16
        TRM__NO_FREEZER_WEAKNESS:  1 << 5,   // 32
    };

    // netflagsC definition (only used for presets)
    const NetFlagsC = {
        ARSENAL_REBALANCE:                  1 << 0,  // 1
        LASERMODE_HEAT:                     1 << 1,  // 2
        FREEZER_CANT_HURT_OWNER:            1 << 2,  // 4
        DESTRUCTABLE_CAMERAS:               1 << 3,  // 8
        _13D_ENABLE_DOUBLE_KICK:            1 << 4,  // 16
        _13D_DISABLE_EXPANDER:              1 << 5,  // 32
        FIX_TRIPBOMB_ON_SLOPES:             1 << 6,  // 64
        ORIGBHV_CLASSIC_MAP_START_BEHAVIOR: 1 << 7,  // 128
        ORIGBHV_FFIRE_EXCLUDES_SELF:        1 << 8,  // 256
        ORIGBHV_DROWNING_RESPAWN:           1 << 9,  // 512
        ORIGBHV_INVALID_SHRINK_STATES:      1 << 10, // 1024
        ORIGBHV_BAD_SHRINKER_HIT_DETECTION: 1 << 11, // 2048
        ORIGBHV_BAD_EXPANDER_RADIUS:        1 << 12, // 4096
        ORIGBHV_WEAPON_SWITCHING_BUGS:      1 << 13, // 8192
        ORIGBHV_DEAD_PLAYER_SWAPING_BUGS:   1 << 14, // 16384
        ORIGBHV_BAD_NIGHTVISION_GLOW:       1 << 15, // 32768
        ORIGBHV_BAD_AUTO_RPG_HIT_DETECTION: 1 << 16, // 65536
    };

    // weapflags definition (only used for presets)
    const StartingWeapon = {
        PISTOL:     1 << 0,   // 1   
        SHOTGUN:    1 << 1,   // 2   
        CHAINGUN:   1 << 2,   // 4   
        RPG:        1 << 3,   // 8   
        HANDBOMB:   1 << 4,   // 16  
        SHRINKER:   1 << 5,   // 32  
        DEVISTATOR: 1 << 6,   // 64  
        TRIPBOMB:   1 << 7,   // 128 
        FREEZE:     1 << 8,   // 256 
        FULL_AMMO:  1 << 9,   // 512 
        GROW:       1 << 10,  // 1024
    };

    // invflags definition (only used for presets)
    const StartingInventory = {
        ACCESS:   1 << 0,  // 1     
        FIRSTAID: 1 << 1,  // 2     
        STEROIDS: 1 << 2,  // 4
        HOLODUKE: 1 << 3,  // 8
        JETPACK:  1 << 4,  // 16
        HEAT:     1 << 5,  // 32    
        AIRTANK:  1 << 6,  // 64    
        BOOTS:    1 << 7,  // 128
        ARMOR:    1 << 8,  // 256
        ATOMIC1:  1 << 9,  // 512   
        ATOMIC2:  1 << 10, // 1024  
    };

    // netflags presets per game mode category
    const DEFAULT_NETFLAGS_SP            = 0;
    const DEFAULT_NETFLAGS_PVP_SPWN      = 0 | NetFlagsA.MARKERS | NetFlagsA.NO_MONSTERS | NetFlagsA.NO_ACCESS | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | NetFlagsA.DMSWITCHES | NetFlagsA.MPITEMS;
    const DEFAULT_NETFLAGS_PVP_NOSPWN    = NetFlagsA.GETWEAPONCE | 0 | NetFlagsA.NO_MONSTERS | NetFlagsA.NO_ACCESS | 0 | 0 | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | NetFlagsA.DMSWITCHES | NetFlagsA.MPITEMS;
    const DEFAULT_NETFLAGS_COOP          = NetFlagsA.GETWEAPONCE | 0 | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | 0 | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | 0 | NetFlagsA.MPITEMS;
    const BASE_TDM_TLMS                  = NetFlagsA.TEAM__MIXED_TEAM_SPAWNS | NetFlagsA.T_LMS__RESTRICTED_SPYCAM | NetFlagsA.T_LMS__RESTRICTED_CHAT;
    const BASE_LMS                       = NetFlagsA.FORCE_RESPAWN | NetFlagsA.RESPAWN_FARTHEST;
    const BASE_MODERN                    = NetFlagsA.WEAPON_ALWAYS_DROP | NetFlagsA.REVEALED_AUTOMAP | NetFlagsA.NO_MAP_EXIT | NetFlagsA.DAMAGENUMS;
    const BASE_HARDCORE                  = NetFlagsA.NO_TARGET_NAMES;
    const BASE_CLASSIC_TEAMPLAY          = NetFlagsA.NO_TARGET_NAMES | 0 | 0 | 0 | 0;
    const BASE_ALT_TEAMPLAY              = 0 | NetFlagsA.TRMCOOPTEAM__OVERHEAD | 0 | 0 | 0;
    const BASE_MODERN_TEAMPLAY           = 0 | NetFlagsA.TRMCOOPTEAM__OVERHEAD | NetFlagsA.TRMCOOPTEAM__OUTLINES | 0 | 0;
    const BASE_HARDCORE_TEAMPLAY         = NetFlagsA.NO_TARGET_NAMES | 0 | 0 | NetFlagsA.COOPTEAM__NO_SPYCAM_MAPVIEW | NetFlagsA.COOPTEAM__AUTOAIM_ON_ALLIES;
    const PRESET_NETFLAGS_CLASSIC_COOP   = DEFAULT_NETFLAGS_COOP | NetFlagsA.COOPTEAM__GLOBAL_ALLY_SOUNDS | BASE_CLASSIC_TEAMPLAY;
    const PRESET_NETFLAGS_ALT_COOP       = 0 | NetFlagsA.MARKERS | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | 0 | NetFlagsA.MPITEMS | NetFlagsA.SURVTLMS__SHARED_LIVES | BASE_ALT_TEAMPLAY;
    const PRESET_NETFLAGS_MODERN_COOP    = NetFlagsA.GETWEAPONCE | NetFlagsA.MARKERS | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | 0 | 0 | NetFlagsA.MPITEMS | 0 | BASE_MODERN_TEAMPLAY;
    const PRESET_NETFLAGS_HARDCORE_COOP  = 0 | 0 | 0 | 0 | 0 | 0 | NetFlagsA.COOPTEAM__FRIENDLY_FIRE | 0 | 0 | NetFlagsA.SURVTLMS__SHARED_LIVES | BASE_HARDCORE_TEAMPLAY;
    const PRESET_NETFLAGS_CLASSIC_SURV   = PRESET_NETFLAGS_CLASSIC_COOP | NetFlagsA.COOP__SHARED_ACCESS;
    const PRESET_NETFLAGS_ALT_SURV       = PRESET_NETFLAGS_ALT_COOP | NetFlagsA.COOP__SHARED_ACCESS;
    const PRESET_NETFLAGS_MODERN_SURV    = PRESET_NETFLAGS_MODERN_COOP | NetFlagsA.COOP__SHARED_ACCESS;
    const PRESET_NETFLAGS_HARDCORE_SURV  = PRESET_NETFLAGS_HARDCORE_COOP | NetFlagsA.COOP__SHARED_ACCESS;
    const PRESET_NETFLAGS_CLASSIC_FFA    = DEFAULT_NETFLAGS_PVP_SPWN | 0 | 0;
    const PRESET_NETFLAGS_ALT_FFA        = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0;
    const PRESET_NETFLAGS_MODERN_FFA     = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_MODERN;
    const PRESET_NETFLAGS_HARDCORE_FFA   = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_HARDCORE;
    const PRESET_NETFLAGS_CLASSIC_TEAM   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | 0 | BASE_CLASSIC_TEAMPLAY | 0;
    const PRESET_NETFLAGS_ALT_TEAM       = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0 | BASE_ALT_TEAMPLAY | 0;
    const PRESET_NETFLAGS_MODERN_TEAM    = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_MODERN | BASE_MODERN_TEAMPLAY | 0;
    const PRESET_NETFLAGS_HARDCORE_TEAM  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA.SURVTLMS__SHARED_LIVES;
    const PRESET_NETFLAGS_CLASSIC_CTF    = DEFAULT_NETFLAGS_PVP_SPWN | 0 | 0 | BASE_CLASSIC_TEAMPLAY | 0;
    const PRESET_NETFLAGS_ALT_CTF        = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0 | BASE_ALT_TEAMPLAY | NetFlagsA.CTF__FLAG_INSTANT_RETURN;
    const PRESET_NETFLAGS_MODERN_CTF     = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_MODERN | BASE_MODERN_TEAMPLAY | NetFlagsA.CTF__FLAG_OUTLINE;
    const PRESET_NETFLAGS_HARDCORE_CTF   = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA.CTF__FLAG_INSTANT_RETURN | NetFlagsA.CTF__FLAG_AUTODETONATE;
    const PRESET_NETFLAGS_CLASSIC_LMS    = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS | 0;
    const PRESET_NETFLAGS_ALT_LMS        = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0;
    const PRESET_NETFLAGS_MODERN_LMS     = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS | BASE_MODERN;
    const PRESET_NETFLAGS_HARDCORE_LMS   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS | BASE_HARDCORE;
    const PRESET_NETFLAGS_CLASSIC_TRM    = DEFAULT_NETFLAGS_PVP_SPWN | 0 | 0 | BASE_CLASSIC_TEAMPLAY;
    const PRESET_NETFLAGS_ALT_TRM        = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0 | BASE_ALT_TEAMPLAY;
    const PRESET_NETFLAGS_MODERN_TRM     = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_MODERN | BASE_MODERN_TEAMPLAY;
    const PRESET_NETFLAGS_HARDCORE_TRM   = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY;
    const PRESET_NETFLAGSB_CLASSIC       = 0;
    const PRESET_NETFLAGSB_ALT           = NetFlagsB.TEAM__LASER_COLORS;
    const PRESET_NETFLAGSB_MODERN        = NetFlagsB.TEAM__LASER_COLORS;
    const PRESET_NETFLAGSB_HARDCORE      = 0;
    const PRESET_NETFLAGSB_CLASSIC_TRM   = PRESET_NETFLAGSB_CLASSIC | 0 | 0;
    const PRESET_NETFLAGSB_ALT_TRM       = PRESET_NETFLAGSB_ALT | 0 | NetFlagsB.TRM__NO_SHRINKER_IMMUNITY;
    const PRESET_NETFLAGSB_MODERN_TRM    = PRESET_NETFLAGSB_MODERN | NetFlagsB.TRM__NO_INFINITE_JETPACK | 0;
    const PRESET_NETFLAGSB_HARDCORE_TRM  = PRESET_NETFLAGSB_HARDCORE | NetFlagsB.TRM__NO_INFINITE_JETPACK | NetFlagsB.TRM__NO_SHRINKER_IMMUNITY;
    const DEFAULT_WEAPFLAGS              = StartingWeapon.PISTOL;
    const PRESET_WEAPFLAGS_HARDCORE_TERM = StartingWeapon.PISTOL | StartingWeapon.FREEZE;
    const DEFAULT_INVFLAGS               = 0;
    const DEFAULT_INVFLAGS_PVP           = StartingInventory.ACCESS;

    // get flags corresponding to selected gamemode and preset
    const getFlags = (gametype, preset) => {

        // gametype enum for easier reading
        const GameType = {
            DM: 1,
            COOP: 2,
            TDM: 3,
            CTF: 4,
            F1CTF: 5,
            ADCTF: 6,
            SURV: 7,
            LMS: 8,
            TLMS: 9,
            TERM: 10
        };

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
                        netflagsA = PRESET_NETFLAGS_CLASSIC_TRM;
                        netflagsB = PRESET_NETFLAGSB_CLASSIC_TRM;
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
                        netflagsA = PRESET_NETFLAGS_ALT_TRM;
                        netflagsB = PRESET_NETFLAGSB_ALT_TRM;
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
                        netflagsA = PRESET_NETFLAGS_MODERN_TRM;
                        netflagsB = PRESET_NETFLAGSB_MODERN_TRM;
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
                        netflagsA = PRESET_NETFLAGS_HARDCORE_TRM;
                        netflagsB = PRESET_NETFLAGSB_HARDCORE_TRM;
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

    // set flags in the UI based on preset
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

    // remove arguments that have been moved to netflags
    delete gamedefs.games.duke3d.executables.produke.parameters.noMonsters;
    delete gamedefs.games.duke3d.executables.produke.parameters.respawn;

    // remove irrelevant fields
    delete gamedefs.games.duke3d.executables.produke.parameters.con;
    delete gamedefs.games.duke3d.executables.produke.parameters.grp;

    // change xduke to produke name and executable
    gamedefs.games.duke3d.executables.produke.name = "proDuke";
    gamedefs.games.duke3d.executables.produke.files.main.path = "produke.exe";
    gamedefs.games.duke3d.executables.produke.networking = { modes: ['p2p'], ipv6: true };

    // here we override how NN writes netlist.txt
    // we use the user's detected external ip instead of using a virtual interface (0.0.0.0 or [::])
    // this is "allegedly" a better approach for P2P networking
    gamedefs.games.duke3d.executables.produke.runnables.multiplayer.beforeRun = [{"cmd":"function", async run(ctx) {

        const ipv4 = mainStore.myExternalIpV4;
        const ipv6 = mainStore.myExternalIpV6;
        const port = ctx.GameRoom.MyPort;

        const netlistFileName = "netlist.txt";
        const nickToIpDetails = ctx.GameRoom.PlayersIpAndPorts;
        const othersIpDetails = Object.values(nickToIpDetails);

        let netlistText = "mode peer\r\n";
        let foundIpv6 = false;

        for (const ipd of othersIpDetails) {

            const entryIp = (() => {

                if (ipd.ip.includes(":")) {
                    foundIpv6 = true;
                    return `[${ipd.ip}]`;
                }

                return ipd.ip;

            })();

            netlistText += `allow ${entryIp}:${ipd.port}\r\n`

        }

        netlistText = `interface ${foundIpv6 ? `[${ipv6}]:${port}` : `${ipv4}:${port}`}\r\n` + netlistText; 
        
        fs.writeFileSync(path.resolve(ctx.GameDir, netlistFileName), netlistText);

    }}];

    // here we handle the .dmo upload
    gamedefs.games.duke3d.executables.produke.procStarted = async (ctx, proc) => {

        if (ctx.GameRoom.Params.uploadDemos?.[0] === "yes") {

            const dmoDir = path.join(ctx.GameDir, "dmos");
            const start = new Date();

            proc.on("exit", () => {

                const end = new Date();
                const files = fs.readdirSync(dmoDir);

                const dmoFiles = files.filter(fileName => {

                    if (!fileName.toLocaleLowerCase().endsWith(".dmo")) return false;

                    const filePath = path.join(dmoDir, fileName);
                    const stats = fs.statSync(filePath);

                    return stats.birthtime >= start && stats.birthtime <= end;

                });

                log(`Uploading [${dmoFiles.length}] demos...`);

                for (const dmoFile of dmoFiles) {
                    log(`Uploading "${dmoFile}"...`);
                }

            });

        }

    };

    // upload demo input checkbox
    gamedefs.games.duke3d.executables.produke.parameters.uploadDemos = {
        modeSupport: ["multiplayer"],
        type: "boolean",
        label: "Upload Demos",
        optional: false,
        syncOnly: true,
        value: "yes",
        for: "host-only-private"
    };

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
    gamedefs.games.duke3d.executables.produke.parameters.recordDmo.label = "Record Demo";
    gamedefs.games.duke3d.executables.produke.parameters.recordDmo.for = "private";

    // play demo
    gamedefs.games.duke3d.executables.produke.parameters.playDmo.label = "Play Demo";

    // color
    gamedefs.games.duke3d.executables.produke.parameters.color = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "choice",
        label: "Color",
        optional: false,
        for: "private",
        value: c => '-color ' + c.value,
        choices: [
            {label: "Auto", value: "0"},
            {label: "Blue", value: "1"},
            {label: "Red", value: "2"},
            {label: "Green", value: "3"},
            {label: "Gray", value: "4"},
            {label: "Dark Gray", value: "5"},
            {label: "Dark Green", value: "6"},
            {label: "Brown", value: "7"},
            {label: "Dark Blue", value: "8"},
            {label: "Bright Red", value: "9"},
            {label: "Dark Brown", value: "10"},
            {label: "Cement", value: "11"},
            {label: "Black", value: "12"},
            {label: "Off White", value: "13"},
            {label: "Orange", value: "14"},
            {label: "Yellow", value: "15"},
            {label: "Purple", value: "16"}
        ],
        dependsOn: {
            params: "multiplayerMode", 
            show: c => c?.ParamEl?.multiplayerMode && ![3,4,5,6,9].includes(c.ParamEl.multiplayerMode)
        }
    };

    // team
    gamedefs.games.duke3d.executables.produke.parameters.team = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "choice",
        label: "Team",
        optional: false,
        for: "private",
        value: c => '-team ' + c.value,
        choices: [
            {label: "Blue", value: "1"},
            {label: "Red", value: "2"},
            {label: "Green", value: "3"},
            {label: "Brown", value: "4"}
        ],
        dependsOn: {
            params: "multiplayerMode", 
            show: c => c?.ParamEl?.multiplayerMode && [3,4,5,6,9].includes(c.ParamEl.multiplayerMode)
        }
    };

    // spectator
    gamedefs.games.duke3d.executables.produke.parameters.spec = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Spectator",
        optional: false,
        value: "-spec",
        for: "private"
    };

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

    // lock specs
    gamedefs.games.duke3d.executables.produke.parameters.lockSpecs = {
        modeSupport: ["multiplayer"],
        type: "boolean",
        label: "Lock Spectators",
        optional: false,
        value: "/lockspecs",
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
        label: "Exploit Mode",
        optional: false,
        value: "/exploitmode",
        for: "private"
    };

    // allow mods
    gamedefs.games.duke3d.executables.produke.parameters.allowMods = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "Allow Mods",
        optional: false,
        value: "/allowmods",
        for: "private"
    };

    // master/slave
    gamedefs.games.duke3d.executables.produke.parameters.masterSlave = {
        modeSupport: ["multiplayer"],
        type: "boolean",
        label: "Master/Slave",
        optional: false,
        value: "/i0",
        for: "host-only-private"
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

    // send /teampicker automatically if any team based mode is selected
    gamedefs.games.duke3d.executables.produke.parameters["teampicker"] = {
        modeSupport: ["singleplayer", "multiplayer"],
        type: "static",
        value: "/teampicker",
        addIf: c => {
            return [3,4,5,6,9].includes(parseInt(c.GameRoom.Params.multiplayerMode[0].replace("/c", "")));
        }
    };

    // netflags presets input
    gamedefs.games.duke3d.executables.produke.parameters.presets = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "choice",
        label: "Preset",
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

    // manipulate the html
    gamedefs.games.duke3d.executables.produke.parameters.html = {
        modeSupport: ["multiplayer", "singleplayer"],
        type: "boolean",
        label: "",
        optional: false,
        syncOnly: true,
        for: "private",
        dependsOn: {
            params: "html",
            show: () => {

                console.log(`produkeCSSInjected = ${window.produkeCSSInjected}`);

                // =================================================================================
                // HELPER VARIABLES
                // =================================================================================

                console.log("HELPER VARIABLES...");

                const root = document.getElementById("mode")?.parentNode?.nextSibling;
                const isReady = document.querySelectorAll(`[id^="game-param"]`).length > 0;
                const isProduke = document.getElementById("exec").value === "produke";
                const isMultiplayer = document.getElementById("mode").value === "multiplayer";
                const isHost = true;
               
                // dont run if current game is not produke
                if (!isProduke) return;
                
                // dont run if root is not present
                if (!root) return;

                // dont run if game params are not present yet
                if (!isReady) return;

                console.log("HELPER VARIABLES // OK");

                // =================================================================================
                // HELPER FUNCTIONS
                // =================================================================================

                console.log("HELPER FUNCTIONS...");

                // creates a box div
                const CreateBox = (title, elements) => {

                    // filter undefined entries
                    elements = elements.filter(Boolean);

                    // determine id based on title
                    const id = title.replace(" ", "-").toLocaleLowerCase();

                    // try to get box element
                    let box = document.getElementById(id);

                    // create box element if it doesn't exist 
                    if (!box) {
                        box = document.createElement("div");
                        box.id = id;
                        box.className = "box";
                        const span = document.createElement("span");
                        span.textContent = title;
                        box.appendChild(span);
                    }

                    // move box to the correct spot
                    root.insertAdjacentElement("beforeend", box);

                    // move elements from the document to inside the box
                    box.append(...elements);

                    // if box has switches
                    if (elements.some(e => e.innerHTML.indexOf("form-switch") >= 0)) {

                        // try to get subbox element
                        let subbox = box.querySelector("div.subbox");

                        // create subbox element if it doesn't exist 
                        if (!subbox) {
                            subbox = document.createElement("div");
                            subbox.className = "subbox";
                        }

                        // move switches to subbox inside box element
                        subbox.append(...(elements.filter(e => e.innerHTML.indexOf("form-switch") >= 0)));

                        // attach subbox to main box
                        box.append(subbox);

                    }

                    // return reference to box element (why not?)
                    return box;

                };

                // converts a checkbox input to a switch style
                const CheckBoxToSwitch = id => {
                    const input = document.getElementById(id);
                    if (!input) return;
                    if (input.closest("div.form-switch")) return;
                    input.parentNode.classList.add("form-check", "form-switch");
                    input.classList.add("form-check-input");
                    input.insertAdjacentElement("afterend", input.parentNode.parentNode.nextElementSibling);
                };

                // creates a dummy switch element just to use as placeholder
                const CreateDummySwitch = () => {
                    const div = document.createElement("div");
                    const dummy = document.createElement("div");
                    dummy.className= "form-switch";
                    div.append(dummy);
                    return div;
                };

                console.log("HELPER FUNCTIONS // OK");

                // =================================================================================
                // INJECT CSS
                // =================================================================================

                console.log("INJECT CSS...");

                // check if css is already injected
                if (!window.produkeCSSInjected) {

                    // flag as injected
                    window.produkeCSSInjected = true;                                    

                    // inject css
                    document.body.insertAdjacentHTML("afterbegin", `

                        <style>

                            /* prevent style from applying to other ports */
                            div.modal-body:has(select#exec > optgroup > option[value="produke"]:checked) {

                                /* ================================================================================= */
                                /* MAIN COMPONENTS                                                                   */
                                /* ================================================================================= */

                                /* root div */
                                div:has(>#mode) + div {
                                    display: flex; 
                                    flex-direction: column; 
                                    gap: 16px; 
                                    margin-bottom: 0px;
                                    margin-top: 16px;
                                }

                                div:has(>div>#game-param-html) {
                                    display: none;
                                }

                                div.box {
                                    background-color: #17191c;
                                    display: flex;
                                    flex-direction: column;
                                    gap: 8px;
                                    border: 1px solid #495057;
                                    border-radius: 5px;
                                    padding: 16px;
                                }

                                div.box > span {                
                                    display: inline-block;
                                    padding-bottom: 16px;
                                    margin-bottom: 16px;
                                    font-weight: bolder;
                                    border-bottom: 1px solid #495057;
                                }

                                div.subbox {
                                    width: 470px;
                                    display: grid;
                                    grid-template-columns: repeat(3, 1fr);
                                    grid-auto-rows: 32px;
                                    align-self: flex-end;
                                }

                                div#netflags-box {
                                    margin-top: 16px;
                                }

                                div.flags > span {
                                    display: block;
                                    font-family: "Candara";
                                    font-size: 14px;
                                    font-weight: bold;
                                    padding-bottom: 8px;
                                    border-bottom: 1px solid #495057;
                                    margin-bottom: 8px;
                                }

                                /* ================================================================================= */
                                /* INPUTS                                                                            */
                                /* ================================================================================= */

                                .param-hidden, .param-hiden * {
                                    display: none !important;
                                }

                                div:has(>div>select[id^="game-param"]):not(.param-hidden),
                                div:has(>div>span>input[id^="game-param"]):not(.param-hidden) {
                                    height: 38px !important;
                                    min-height: 38px !important;
                                }

                                div:has(>input) > label,
                                div:has(>div>div>input[id^="game-param"]) > div:not(:has(div>input)),
                                div:has(>div>select[id^="game-param"]) > div:not(:has(select)),
                                div:has(>div>span>input[id^="game-param"]) > div:not(:has(span>input)) {
                                    display: flex;
                                    flex-grow: 1;
                                    user-select: none; 
                                    text-wrap: nowrap;
                                }
                                
                                div:has(>div>div>input[id^="game-param"]) > div:has(div>input:not([type="checkbox"])),
                                div:has(>div>select[id^="game-param"]) > div:has(select),            
                                div:has(>div>span>input[id^="game-param"]) > div:has(span>input)            
                                {
                                    width: 470px !important;
                                }

                                input[type="plain"],
                                input[type="password"],
                                select[id^="game-param"] {
                                    width: 470px;
                                }

                                input[type="number"] {
                                    width: 60px;
                                    margin-right: 16px;
                                }

                                input[type="range"] {
                                    width: 394px;
                                }

                                div.form-switch {
                                    display: inline-block !important;
                                }

                                /* ================================================================================= */
                                /* ROOM SETTINGS                                                                     */
                                /* ================================================================================= */

                                div:has(>input[placeholder="Room Name"]),
                                div:has(>input[placeholder="Password"]) {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                }

                                /* ================================================================================= */
                                /* GRAY INFO TEXT (unused for now)                                                   */
                                /* ================================================================================= */

                                /*
                                div:has(> div > div > #game-param-uploadDemos) > div[style*="user-select:none"]::after {
                                    content: "(produke.com.br/en/demos)";
                                    font-style: italic;
                                    color: #777777;
                                    margin-left: 8px;
                                }

                                div:has(> div > div > #game-param-exploitMode) > div[style*="user-select:none"]::after,
                                div:has(> div > div > #game-param-allowMods) > div[style*="user-select:none"]::after,
                                div:has(> div > div > #game-param-disableAutoaim) > div[style*="user-select:none"]::after {
                                    content: "(voting required)";
                                    font-style: italic;
                                    color: #777777;
                                    margin-left: 8px;
                                }
                                */

                            }

                        </style>

                    `);

                }

                console.log("INJECT CSS // OK");

                // =================================================================================
                // RESTYLE SOME ELEMENTS
                // =================================================================================

                console.log("RESTYLE SOME ELEMENTS...");

                // inject room name label
                document.querySelector("[placeholder='Room Name']")?.insertAdjacentHTML("beforebegin", `
                    <label>Room Name</label>
                `);

                // inject password label
                document.getElementById("password")?.insertAdjacentHTML("beforebegin", `
                    <label>Password</label>
                `);
                
                // transform some checkboxes into switches                                
                CheckBoxToSwitch("game-param-masterSlave");
                CheckBoxToSwitch("game-param-uploadDemos");
                CheckBoxToSwitch("game-param-lockOptions");
                CheckBoxToSwitch("game-param-lockPlayers");
                CheckBoxToSwitch("game-param-lockSpecs");
                CheckBoxToSwitch("game-param-botsAi");
                CheckBoxToSwitch("game-param-recordDmo");
                CheckBoxToSwitch("game-param-spec");
                CheckBoxToSwitch("game-param-exploitMode");
                CheckBoxToSwitch("game-param-allowMods");
                CheckBoxToSwitch("game-param-disableAutoaim");
                CheckBoxToSwitch("game-param-_nn_ipv6");

                console.log("RESTYLE SOME ELEMENTS // OK");

                // =================================================================================
                // ROOM SETTINGS
                // =================================================================================

                console.log("ROOM SETTINGS...");

                if (isMultiplayer) {
                    CreateBox("ROOM SETTINGS", [
                        document.querySelector("[placeholder='Room Name']").parentNode,
                        document.getElementById("password").parentNode,
                        document.getElementById("max-players").parentNode,
                        document.getElementById("game-param-_nn_ipv6").parentNode.parentNode.parentNode,
                        document.getElementById("game-param-uploadDemos").parentNode.parentNode.parentNode,
                        document.getElementById("game-param-masterSlave").parentNode.parentNode.parentNode,                    
                        document.getElementById("game-param-lockOptions").parentNode.parentNode.parentNode,
                        document.getElementById("game-param-lockPlayers").parentNode.parentNode.parentNode,
                        document.getElementById("game-param-lockSpecs").parentNode.parentNode.parentNode,
                        // "hide room" checkbox
                        // adding last so it stays in the third line
                        // since it disappears once the room is created
                        //document.querySelector(`div.form-switch:has(label[title=""])`)?.parentNode
                    ]);
                }

                console.log("ROOM SETTINGS // OK");
                
                

                // =================================================================================
                // MATCH SETTINGS
                // =================================================================================

                console.log("MATCH SETTINGS...");

                CreateBox("MATCH SETTINGS", [
                    document.getElementById("game-param-multiplayerMode").parentNode.parentNode,
                    document.getElementById("game-param-monstersSkill").parentNode.parentNode,
                    document.getElementById("game-param-mapType").parentNode.parentNode,
                    document.getElementById("game-param-episodeAndLevel").parentNode.parentNode,
                    document.getElementById("game-param-map").parentNode.parentNode.parentNode,
                    document.getElementById("game-param-scoreLimit").parentNode.parentNode.parentNode,
                    document.getElementById("game-param-timeLimit").parentNode.parentNode.parentNode,
                    document.getElementById("game-param-extraLives").parentNode.parentNode.parentNode,
                    document.getElementById("game-param-botsNum").parentNode.parentNode.parentNode,
                    document.getElementById("game-param-botsAi").parentNode.parentNode.parentNode
                ]);    

                console.log("MATCH SETTINGS // OK");

                // =================================================================================
                // USER SETTINGS
                // =================================================================================

                console.log("USER SETTINGS...");

                CreateBox("USER SETTINGS", [
                    document.getElementById("game-param-color").parentNode.parentNode,
                    document.getElementById("game-param-team").parentNode.parentNode,
                    document.getElementById("game-param-recordDmo").parentNode.parentNode.parentNode,
                    document.getElementById("game-param-spec").parentNode.parentNode.parentNode,
                    CreateDummySwitch(), // empty placeholder for switch alignment
                    document.getElementById("game-param-exploitMode").parentNode.parentNode.parentNode,
                    document.getElementById("game-param-allowMods").parentNode.parentNode.parentNode,
                    document.getElementById("game-param-disableAutoaim").parentNode.parentNode.parentNode,
                ]);

                console.log("USER SETTINGS // OK");

                // =================================================================================
                // NETFLAGS
                // =================================================================================

                console.log("NETFLAGS...");

                // first we need to create the subboxes for each netflag group
                root.insertAdjacentHTML("afterbegin", `
                    <div id="netflags-box" style="display: flex; flex-direction: column; gap: 16px;">
                        <div style="display: flex; flex-direction: row; gap: 16px;">
                            <div style="flex: 1; min-width: 0;">
                                <div id="netflagsA" class="flags">
                                    <span>NETFLAGS A</span>
                                </div>
                            </div>
                            <div style="display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 16px;">
                                <div id="netflagsB" class="flags">
                                    <span>NETFLAGS B</span>
                                </div>
                                <div id="netflagsC" class="flags"">
                                    <span>NETFLAGS C</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: row; gap: 16px;">
                            <div id="weapFlags" style="flex: 1; min-width: 0;" class="flags">
                                <span>STARTING WEAPONS</span>
                            </div>
                            <div id="invFlags" style="flex: 1; min-width: 0;" class="flags">
                                <span>STARTING INVENTORY</span>
                            </div>
                        </div>
                    </div>    
                `);

                // now we move each netflag checkbox to its corresponding subbox
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

                // now we can finally create the main netflags box
                CreateBox("NETFLAGS", [
                    document.getElementById("game-param-presets").parentNode.parentNode,
                    // now we can reference the subboxes as a concrete element
                    document.getElementById("netflags-box")
                ]);

                console.log("NETFLAGS // OK");                
                
                // move extra args back to end of modal body
                console.log("MOVE EXTRA ARGS...");
                root.append(document.getElementById("manual-param-controls").parentNode);
                console.log("MOVE EXTRA ARGS // OK");

                // return false so the dummy control doesn't show
                return;
                
            }
        }
    };

}