window["load-args-builder"] = async () => {

    const netflagsAcount = 28;
    const netflagsBcount = 6;
    const netflagsCcount = 11;
    const weapflagscount = 11;
    const invflagscount = 11;

    const args = {
        c: { max: 10, val: 1 },
        y: { max: 99, val: 20 },
        k: { max: 240, val: 0 },
        e: { max: 9, val: 0 },
        q: { max: 7, val: 0 },
        r: { max: 1, val: 1 },
        teampicker: { max: 1, val: 0 },
        lockoptions: { max: 1, val: 0, host: true },
        lockplayers: { max: 1, val: 0, host: true },
        a: { max: 1, val: 0 },
        exploitmode: { max: 1, val: 0 },
        allowmods: { max: 1, val: 0 },
        disableautoaim: { max: 1, val: 0 },
        netflagsA:{ max: Array(netflagsAcount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0 },
        netflagsB:{ max: Array(netflagsBcount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0 },
        netflagsC:{ max: Array(netflagsCcount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0 },
        weapflags:{ max: Array(weapflagscount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0 },
        invflags:{ max: Array(invflagscount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0 }
    };

    // netflagsA definition
    const NetFlagsA = {
        GETWEAPONCE:                 1 << 0,   // 1
        RESPAWN_MONSTERS:            1 << 1,   // 2
        RESPAWN_ITEMS:               1 << 2,   // 4
        RESPAWN_INVENTORY:           1 << 3,   // 8
        MARKERS:                     1 << 4,   // 16
        NO_MONSTERS:                 1 << 5,   // 32
        NO_ACCESS:                   1 << 6,   // 64
        FRIENDLY_FIRE:               1 << 7,   // 128
        DMSWITCHES:                  1 << 8,   // 256
        MPITEMS:                     1 << 9,   // 512
        WEAPON_ALWAYS_DROP:          1 << 10,  // 1024
        REVEALED_AUTOMAP:            1 << 11,  // 2048
        DISABLE_TARGET_NAMES:        1 << 12,  // 4096
        DISABLE_MAP_EXIT:            1 << 13,  // 8192
        FORCE_RESPAWN:               1 << 14,  // 16384
        RESPAWN_FARTHEST:            1 << 15,  // 32768
        TEAM_USE_NORMAL_SPAWNS:      1 << 16,  // 65536
        TEAM_NO_SPYCAM_MAPVIEW:      1 << 17,  // 131072
        TEAM_AUTOAIM_ON_ALLIES:      1 << 18,  // 262144
        DAMAGENUMS:                  1 << 19,  // 524288
        COOP_TEAM_TRM_OVERHEAD:      1 << 20,  // 1048576
        COOP_TEAM_TRM_OUTLINES:      1 << 21,  // 2097152
        CTF_FLAG_OUTLINE:            1 << 22,  // 4194304
        CTF_FLAG_INSTANT_RETURN:     1 << 23,  // 8388608
        CTF_FLAG_AUTODETONATE:       1 << 24,  // 16777216
        T_LMS_RESTRICTED_SPYCAM:     1 << 25,  // 33554432
        T_LMS_RESTRICTED_CHAT:       1 << 26,  // 67108864
        SURV_TLMS_SHARED_LIVES:      1 << 27,  // 134217728
    };

    // netflagsB definition
    const NetFlagsB = {
        TEAM_LASER_COLORS:           1 << 0,   // 1
        CTF_NOROIDS:                 1 << 1,   // 2
        CTF_NOJPACK:                 1 << 2,   // 4
        TRM_NO_INFINITE_JPACK:       1 << 3,   // 8
        TRM_NO_SHRINKER_IMMUNITY:    1 << 4,   // 16
        TRM_NO_FREEZER_WEAKNESS:     1 << 5,   // 32
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
        ORIGBHV_COOP_LEVEL_TRANSITION_BUGS:  1 << 7,  // 128
        ORIGBHV_FFIRE_NO_SUICIDE:            1 << 8,  // 256
        ORIGBHV_DROWNING_RESPAWN:            1 << 9,  // 512
        ORIGBHV_NO_ALTWEAPON_FASTSWITCH:     1 << 10, // 1024
        ORIGBHV_EXPANDER_RADIUS:             1 << 11, // 2048
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
    const DEFAULT_NETFLAGS_PVP_SPWN   = 0 | NetFlagsA.MARKERS | NetFlagsA.NO_MONSTERS | NetFlagsA.NO_ACCESS | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.FRIENDLY_FIRE | NetFlagsA.DMSWITCHES | NetFlagsA.MPITEMS;
    const DEFAULT_NETFLAGS_PVP_NOSPWN = NetFlagsA.GETWEAPONCE | 0 | NetFlagsA.NO_MONSTERS | NetFlagsA.NO_ACCESS | 0 | 0 | NetFlagsA.FRIENDLY_FIRE | NetFlagsA.DMSWITCHES | NetFlagsA.MPITEMS;
    const DEFAULT_NETFLAGS_COOP       = NetFlagsA.GETWEAPONCE | 0 | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | 0 | NetFlagsA.FRIENDLY_FIRE | 0 | NetFlagsA.MPITEMS;

    // base netflags presets
    const BASE_TDM_TLMS           = NetFlagsA.TEAM_USE_NORMAL_SPAWNS | NetFlagsA.T_LMS_RESTRICTED_SPYCAM | NetFlagsA.T_LMS_RESTRICTED_CHAT;
    const BASE_LMS                = NetFlagsA.FORCE_RESPAWN | NetFlagsA.RESPAWN_FARTHEST;
    const BASE_MODERN             = NetFlagsA.WEAPON_ALWAYS_DROP | NetFlagsA.REVEALED_AUTOMAP | NetFlagsA.DISABLE_MAP_EXIT | NetFlagsA.DAMAGENUMS;
    const BASE_HARDCORE           = NetFlagsA.DISABLE_TARGET_NAMES;
    const BASE_CLASSIC_TEAMPLAY   = NetFlagsA.DISABLE_TARGET_NAMES | 0 | 0 | 0 | 0;
    const BASE_ALT_TEAMPLAY       = 0 | NetFlagsA.COOP_TEAM_TRM_OVERHEAD | 0 | 0 | 0;
    const BASE_MODERN_TEAMPLAY    = 0 | NetFlagsA.COOP_TEAM_TRM_OVERHEAD | NetFlagsA.COOP_TEAM_TRM_OUTLINES | 0 | 0;
    const BASE_HARDCORE_TEAMPLAY  = NetFlagsA.DISABLE_TARGET_NAMES | 0 | 0 | NetFlagsA.TEAM_NO_SPYCAM_MAPVIEW | NetFlagsA.TEAM_AUTOAIM_ON_ALLIES;

    // netflagsA preset combinations
    const PRESET_NETFLAGS_CLASSIC_COOP  = DEFAULT_NETFLAGS_COOP | BASE_CLASSIC_TEAMPLAY;
    const PRESET_NETFLAGS_ALT_COOP      = 0 | NetFlagsA.MARKERS | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.FRIENDLY_FIRE | 0 | NetFlagsA.MPITEMS | NetFlagsA.SURV_TLMS_SHARED_LIVES | BASE_ALT_TEAMPLAY;
    const PRESET_NETFLAGS_MODERN_COOP   = NetFlagsA.GETWEAPONCE | NetFlagsA.MARKERS | 0 | 0 | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | 0 | 0 | NetFlagsA.MPITEMS | 0 | BASE_MODERN_TEAMPLAY;
    const PRESET_NETFLAGS_HARDCORE_COOP = 0 | 0 | 0 | 0 | 0 | 0 | NetFlagsA.FRIENDLY_FIRE | 0 | 0 | NetFlagsA.SURV_TLMS_SHARED_LIVES | BASE_HARDCORE_TEAMPLAY;

    const PRESET_NETFLAGS_CLASSIC_FFA   = DEFAULT_NETFLAGS_PVP_SPWN | 0 | 0;
    const PRESET_NETFLAGS_ALT_FFA       = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0;
    const PRESET_NETFLAGS_MODERN_FFA    = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_MODERN;
    const PRESET_NETFLAGS_HARDCORE_FFA  = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_HARDCORE;

    const PRESET_NETFLAGS_CLASSIC_TEAM  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | 0 | BASE_CLASSIC_TEAMPLAY | 0;
    const PRESET_NETFLAGS_ALT_TEAM      = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0 | BASE_ALT_TEAMPLAY | 0;
    const PRESET_NETFLAGS_MODERN_TEAM   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_MODERN | BASE_MODERN_TEAMPLAY | 0;
    const PRESET_NETFLAGS_HARDCORE_TEAM = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA.SURV_TLMS_SHARED_LIVES;

    const PRESET_NETFLAGS_CLASSIC_CTF   = DEFAULT_NETFLAGS_PVP_SPWN | 0 | 0 | BASE_CLASSIC_TEAMPLAY | 0;
    const PRESET_NETFLAGS_ALT_CTF       = DEFAULT_NETFLAGS_PVP_NOSPWN | 0 | 0 | BASE_ALT_TEAMPLAY | NetFlagsA.CTF_FLAG_INSTANT_RETURN;
    const PRESET_NETFLAGS_MODERN_CTF    = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_MODERN | BASE_MODERN_TEAMPLAY | NetFlagsA.CTF_FLAG_OUTLINE;
    const PRESET_NETFLAGS_HARDCORE_CTF  = DEFAULT_NETFLAGS_PVP_SPWN | 0 | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA.CTF_FLAG_INSTANT_RETURN | NetFlagsA.CTF_FLAG_AUTODETONATE;

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
    const PRESET_NETFLAGSB_ALT            = NetFlagsB.TEAM_LASER_COLORS;
    const PRESET_NETFLAGSB_MODERN         = NetFlagsB.TEAM_LASER_COLORS;
    const PRESET_NETFLAGSB_HARDCORE       = 0;

    const PRESET_NETFLAGSB_CLASSIC_TERM   = PRESET_NETFLAGSB_CLASSIC | 0 | 0;
    const PRESET_NETFLAGSB_ALT_TERM       = PRESET_NETFLAGSB_ALT | 0 | NetFlagsB.TRM_NO_SHRINKER_IMMUNITY;
    const PRESET_NETFLAGSB_MODERN_TERM    = PRESET_NETFLAGSB_MODERN | NetFlagsB.TRM_NO_INFINITE_JPACK | 0;
    const PRESET_NETFLAGSB_HARDCORE_TERM  = PRESET_NETFLAGSB_HARDCORE | NetFlagsB.TRM_NO_INFINITE_JPACK | NetFlagsB.TRM_NO_SHRINKER_IMMUNITY;

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
                    case GameType.COOP: case GameType.SURV: {
                        netflagsA = PRESET_NETFLAGS_CLASSIC_COOP;
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
                    case GameType.COOP: case GameType.SURV: {
                        netflagsA = PRESET_NETFLAGS_ALT_COOP;
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
                    case GameType.COOP: case GameType.SURV: {
                        netflagsA = PRESET_NETFLAGS_MODERN_COOP;
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
                    case GameType.COOP: case GameType.SURV: {
                        netflagsA = PRESET_NETFLAGS_HARDCORE_COOP;
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

    // const netflagsPresets = {
    //     "---": {
    //         netflagsA: 0,
    //         netflagsB: 0,
    //         netflagsC: 0,
    //         weapflags: 1,
    //         invflags: 1
    //     },
    //     classic: {
    //         netflagsA: 398332,
    //         netflagsB: 1,
    //         netflagsC: 0,
    //         weapflags: 1,
    //         invflags: 1
    //     },
    //     teamplay: {
    //         netflagsA: 54004732,
    //         netflagsB: 0,
    //         netflagsC: 0,
    //         weapflags: 1,
    //         invflags: 1
    //     },
    //     rebalanced: {
    //         netflagsA: 50933756,
    //         netflagsB: 6,
    //         netflagsC: 1,
    //         weapflags: 1,
    //         invflags: 1
    //     },
    //     hardcore: {
    //         netflagsA: 63370220,
    //         netflagsB: 31,
    //         netflagsC: 106,
    //         weapflags: 1,
    //         invflags: 1
    //     },
    //     overpowered: {
    //         netflagsA: 3747708,
    //         netflagsB: 32,
    //         netflagsC: 20,
    //         weapflags: 2047,
    //         invflags: 2047
    //     }
    // };

    function getArgsFromUrlParams() {

        const params = new URLSearchParams(document.location.search);

        for (const arg of Object.keys(args)) {
            const val = parseInt(params.get(arg) || args[arg].val);
            args[arg].val = val <= 0 ? 0 : (val > args[arg].max ? args[arg].max : val);
        }

    }

    function getArgsFromText() {

    }

    function getArgsFromInputs() {

        for (const arg of Object.keys(args)) {

            const input = document.getElementById(arg);

            const getInputValue = () => {    
                switch (true) {
                    case input.tagName.toLowerCase() === "select": return input.value;                    
                    case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "number": return input.value;
                    case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "checkbox": return input.checked ? "1" : "0";
                    case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "hidden": return input.value;
                }
            }

            const val = parseInt(getInputValue());

            args[arg].val = val <= 0 ? 0 : (val > args[arg].max ? args[arg].max : val);

        }

    }

    function setArgsInUrlParams() {
        const url = new URL(window.location.href);
        for (const arg of Object.keys(args)) {
            url.searchParams.set(arg, args[arg].val);
        }
        window.history.replaceState({}, null, url);
        // const urlParams = Object.keys(args).map(arg => `${arg}=${args[arg].val}`).join("&");
        // window.history.pushState({}, null, `?p=${page}&${urlParams}`);
    }

    function setArgsOnText() {
        const commands = [];
        const hostonly = [];
        for (const arg of Object.keys(args)) {
            if (args[arg].val > 0) {
                if (args[arg].host) {
                    hostonly.push(`/${arg}${args[arg].max > 1 ? args[arg].val : ""}`);
                } else {
                    commands.push(`/${arg}${args[arg].max > 1 ? args[arg].val : ""}`);
                }
            }
        }
        document.getElementById("arguments").value = commands.join(" ");
        document.getElementById("arguments-host").value = hostonly.join(" ");
    }

    function setArgsOnInputs() {
        for (const arg of Object.keys(args)) {
            const input = document.getElementById(arg);  
            const setInputValue = (value) => {                    
                switch (true) {
                    case input.tagName.toLowerCase() === "select": input.value = value; break;
                    case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "number": input.value = value; break;
                    case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "checkbox": input.checked = value === 1; break;
                    case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "hidden": input.value = value; break;
                }
            }
            setInputValue(args[arg].val)
        }
    }

    function getFlagsFromCheckboxes () {
        let netflagsA = 0;
        let netflagsB = 0;
        let netflagsC = 0;
        let weapflags = 0;
        let invflags = 0;
        document.querySelectorAll(`input[type="checkbox"]`).forEach(e => {        
            if (e.checked) {
                switch (true) {
                    case e.id.startsWith("netflagA"): {
                        netflagsA += parseInt(e.id.split("-")[1]);
                        break;
                    }
                    case e.id.startsWith("netflagB"): {
                        netflagsB += parseInt(e.id.split("-")[1]);
                        break;
                    }
                    case e.id.startsWith("netflagC"): {
                        netflagsC += parseInt(e.id.split("-")[1]);
                        break;
                    }
                    case e.id.startsWith("weapflag"): {
                        weapflags += parseInt(e.id.split("-")[1]);
                        break;
                    }
                    case e.id.startsWith("invflag"): {
                        invflags += parseInt(e.id.split("-")[1]);
                        break;
                    }
                }
            }
        });
        return {netflagsA, netflagsB, netflagsC, weapflags, invflags};
    }

    function setFlagsInCheckboxes (flags) {

        document.querySelectorAll(`input[type="checkbox"].flag`).forEach(e => {
            e.checked = false;
        });

        for (let i = 0; i < netflagsAcount; i++) {
            const flag = (1 << i);
            if ((flag & flags.netflagsA) === flag) {
                document.getElementById(`netflagA-${flag}`).checked = true;
            }
        }
        for (let i = 0; i < netflagsBcount; i++) {
            const flag = (1 << i);
            if ((flag & flags.netflagsB) === flag) {
                document.getElementById(`netflagB-${flag}`).checked = true;
            }
        }
        for (let i = 0; i < netflagsCcount; i++) {
            const flag = (1 << i);
            if ((flag & flags.netflagsC) === flag) {
                document.getElementById(`netflagC-${flag}`).checked = true;
            }
        }

        for (let i = 0; i < weapflagscount; i++) {
            const flag = (1 << i);
            if ((flag & flags.weapflags) === flag) {
                document.getElementById(`weapflag-${flag}`).checked = true;
            }
        }

        for (let i = 0; i < invflagscount; i++) {
            const flag = (1 << i);
            if ((flag & flags.invflags) === flag) {
                document.getElementById(`invflag-${flag}`).checked = true;
            }
        }

    }

    // on input => getfrominput (sets to global) -> set all else
    document.querySelectorAll(".arg").forEach(e => {
        if (e.tagName === "input" && e.attributes.type.value === "hidden") {
            e.addEventListener("change", () => {
                getArgsFromInputs();
                setArgsInUrlParams();
                setArgsOnText();
            });
        } else {
            e.addEventListener("input", () => {
                getArgsFromInputs();
                setArgsInUrlParams();
                setArgsOnText();
            });
        }
    });

    // preset input
    document.getElementById("presets").onchange = e => {
        if (e.target.value === "custom") return;
        //const flags = netflagsPresets[e.target.value];
        const flags = getFlags(args.c.val, e.target.value);
        setFlagsInCheckboxes(flags);        
        for (const id of Object.keys(flags)) {
            document.getElementById(id).value = flags[id];
        }
        getArgsFromInputs();
        setArgsInUrlParams();
        setArgsOnText();
    };

    document.getElementById("c").addEventListener("change", e => {
        const preset = document.getElementById("presets").value;
        if (preset === "custom") return;
        //const flags = netflagsPresets[e.target.value];
        const flags = getFlags(parseInt(e.target.value), preset);
        setFlagsInCheckboxes(flags);        
        for (const id of Object.keys(flags)) {
            document.getElementById(id).value = flags[id];
        }
        getArgsFromInputs();
        setArgsInUrlParams();
        setArgsOnText();
    });

    // netflags inputs (bind to input hidden to simplify everything)
    document.querySelectorAll(`input[type="checkbox"].flag`).forEach(e => {
        e.oninput = () => {
            // resolve flags
            const flags = getFlagsFromCheckboxes();
            const id = e.dataset.flag;
            document.getElementById(id).value = flags[id];
            // main update
            getArgsFromInputs();
            setArgsInUrlParams();
            setArgsOnText();
        }
    });

    // copy all arguments
    document.getElementById("copy").onclick = e => {
        navigator.clipboard.writeText(document.getElementById("arguments").value);
    };

    document.getElementById("copy-host").onclick = e => {
        navigator.clipboard.writeText(document.getElementById("arguments-host").value);
    };

    // set teampicker if choosing any team types
    document.getElementById("c").addEventListener("input", e => {
        if ([3,4,5,6,9].includes(parseInt(e.target.value))) {
            document.getElementById("teampicker").checked = true;            
        } else {
            document.getElementById("teampicker").checked = false;
        }
        setArgsInUrlParams();
        setArgsOnText();
    });

    // on url => getfromurl (sets to global) -> set all else
    getArgsFromUrlParams();

    // if all flags are zero => load classic preset
    if ([
        args.netflagsA.val,
        args.netflagsB.val,
        args.netflagsC.val,
        args.weapflags.val,
        args.invflags.val
    ].every(v => !v)) {
        //const flags = netflagsPresets["classic"];
        const flags = getFlags(1, "classic");
        args.netflagsA.val = flags.netflagsA;
        args.netflagsB.val = flags.netflagsB;
        args.netflagsC.val = flags.netflagsC;
        args.weapflags.val = flags.weapflags;
        args.invflags.val = flags.invflags;
        document.getElementById("presets").value = "classic";
    }

    setArgsInUrlParams();
    setArgsOnText();
    setArgsOnInputs();
    setFlagsInCheckboxes({
        netflagsA: args.netflagsA.val,
        netflagsB: args.netflagsB.val,
        netflagsC: args.netflagsC.val,
        weapflags: args.weapflags.val,
        invflags: args.invflags.val
    });

    // on text => getfromtext (sets to global) -> set all else
    // ...

    // debug
    window.args = args;

};