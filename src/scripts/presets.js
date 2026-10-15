
 // netflagsA definition (matches NetFlagsA in presets.c)
const NetFlagsA = {
    GETWEAPONCE:                 1 << 0,   // 1
    RESPAWN_MONSTERS:            1 << 1,   // 2
    RESPAWN_ITEMS:               1 << 2,   // 4
    RESPAWN_INVENTORY:           1 << 3,   // 8
    MARKERS:                     1 << 4,   // 16
    NO_MONSTERS:                 1 << 5,   // 32
    NO_ACCESS:                   1 << 6,   // 64
    DMSWITCHES:                  1 << 7,   // 128
    MPITEMS:                     1 << 8,   // 256
    FRIENDLY_FIRE:               1 << 9,   // 512
    TEAM_AUTOAIM_ON_ALLIES:      1 << 10,  // 1024
    TEAM_GLOBAL_ALLY_SOUNDS:     1 << 11,  // 2048
    TEAM_NO_SPYCAM_MAPVIEW:      1 << 12,  // 4096
    REVEALED_AUTOMAP:            1 << 13,  // 8192
    DISABLE_MAP_EXIT:            1 << 14,  // 16384
    DISABLE_TARGET_NAMES:        1 << 15,  // 32768
    WEAPON_ALWAYS_DROP:          1 << 16,  // 65536
    FORCE_RESPAWN:               1 << 17,  // 131072
    RESPAWN_FARTHEST:            1 << 18,  // 262144
    TEAM_USE_NORMAL_SPAWNS:      1 << 19,  // 524288
    DAMAGENUMS:                  1 << 20,  // 1048576
    COOP_TEAM_TRM_OVERHEAD:      1 << 21,  // 2097152
    COOP_TEAM_TRM_OUTLINES:      1 << 22,  // 4194304
    CTF_FLAG_OUTLINE:            1 << 23,  // 8388608
    CTF_FLAG_INSTANT_RETURN:     1 << 24,  // 16777216
    CTF_FLAG_AUTODETONATE:       1 << 25,  // 33554432
    T_LMS_RESTRICTED_SPYCAM:     1 << 26,  // 67108864
    T_LMS_RESTRICTED_CHAT:       1 << 27,  // 134217728
    COOP_SHARED_ACCESS:          1 << 28,  // 268435456
    SURV_TLMS_SHARED_LIVES:      1 << 29,  // 536870912
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

// netflagsC definition (matches NetFlagsC in presets.c)
const NetFlagsC = {
    ARSENAL_REBALANCE:                   1 << 0,  // 1
    LASERMODE_HEAT:                      1 << 1,  // 2
    FREEZER_CANT_HURT_OWNER:             1 << 2,  // 4
    DESTRUCTABLE_CAMERAS:                1 << 3,  // 8
    _13D_ENABLE_DOUBLE_KICK:             1 << 4,  // 16
    _13D_DISABLE_EXPANDER:               1 << 5,  // 32
    FIX_TRIPBOMB_ON_SLOPES:              1 << 6,  // 64
    ORIGBHV_CLASSIC_MAP_START_BEHAVIOR:  1 << 7,  // 128
    ORIGBHV_FFIRE_EXCLUDES_SELF:         1 << 8,  // 256
    ORIGBHV_DROWNING_RESPAWN:            1 << 9,  // 512
    ORIGBHV_INVALID_SHRINK_STATES:       1 << 10, // 1024
    ORIGBHV_BAD_SHRINKER_HIT_DETECTION:  1 << 11, // 2048
    ORIGBHV_BAD_EXPANDER_RADIUS:         1 << 12, // 4096
    ORIGBHV_WEAPON_SWITCHING_BUGS:       1 << 13, // 8192
    ORIGBHV_DEAD_PLAYER_SWAPING_BUGS:    1 << 14, // 16384
    ORIGBHV_BAD_NIGHTVISION_GLOW:        1 << 15, // 32768
    ORIGBHV_BAD_AUTO_RPG_HIT_DETECTION:  1 << 16, // 65536
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
const DEFAULT_NETFLAGS_PVP_SPWN   = NetFlagsA.MARKERS | NetFlagsA.NO_MONSTERS | NetFlagsA.NO_ACCESS | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.DMSWITCHES | NetFlagsA.MPITEMS | NetFlagsA.FRIENDLY_FIRE;
const DEFAULT_NETFLAGS_PVP_NOSPWN = NetFlagsA.GETWEAPONCE | NetFlagsA.NO_MONSTERS | NetFlagsA.NO_ACCESS | NetFlagsA.DMSWITCHES | NetFlagsA.MPITEMS | NetFlagsA.FRIENDLY_FIRE;
const DEFAULT_NETFLAGS_COOP       = NetFlagsA.GETWEAPONCE | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.MPITEMS | NetFlagsA.FRIENDLY_FIRE;

// base netflags presets
const BASE_TDM_TLMS           = NetFlagsA.TEAM_USE_NORMAL_SPAWNS | NetFlagsA.T_LMS_RESTRICTED_SPYCAM | NetFlagsA.T_LMS_RESTRICTED_CHAT;
const BASE_LMS                = NetFlagsA.FORCE_RESPAWN | NetFlagsA.RESPAWN_FARTHEST;
const BASE_MODERN             = NetFlagsA.REVEALED_AUTOMAP | NetFlagsA.DISABLE_MAP_EXIT | NetFlagsA.WEAPON_ALWAYS_DROP | NetFlagsA.DAMAGENUMS;
const BASE_HARDCORE           = NetFlagsA.DISABLE_TARGET_NAMES;
const BASE_CLASSIC_TEAMPLAY   = NetFlagsA.DISABLE_TARGET_NAMES;
const BASE_ALT_TEAMPLAY       = NetFlagsA.COOP_TEAM_TRM_OVERHEAD;
const BASE_MODERN_TEAMPLAY    = NetFlagsA.COOP_TEAM_TRM_OVERHEAD | NetFlagsA.COOP_TEAM_TRM_OUTLINES;
const BASE_HARDCORE_TEAMPLAY  = NetFlagsA.TEAM_NO_SPYCAM_MAPVIEW | NetFlagsA.TEAM_AUTOAIM_ON_ALLIES | NetFlagsA.DISABLE_TARGET_NAMES;

// netflagsA preset combinations
const PRESET_NETFLAGS_CLASSIC_COOP  = DEFAULT_NETFLAGS_COOP | NetFlagsA.TEAM_GLOBAL_ALLY_SOUNDS | BASE_CLASSIC_TEAMPLAY;
const PRESET_NETFLAGS_ALT_COOP      = NetFlagsA.MARKERS | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.MPITEMS | NetFlagsA.FRIENDLY_FIRE | NetFlagsA.SURV_TLMS_SHARED_LIVES | BASE_ALT_TEAMPLAY;
const PRESET_NETFLAGS_MODERN_COOP   = NetFlagsA.GETWEAPONCE | NetFlagsA.MARKERS | NetFlagsA.RESPAWN_INVENTORY | NetFlagsA.RESPAWN_ITEMS | NetFlagsA.MPITEMS | BASE_MODERN_TEAMPLAY;
const PRESET_NETFLAGS_HARDCORE_COOP = NetFlagsA.FRIENDLY_FIRE | NetFlagsA.SURV_TLMS_SHARED_LIVES | BASE_HARDCORE_TEAMPLAY;

const PRESET_NETFLAGS_CLASSIC_SURV  = PRESET_NETFLAGS_CLASSIC_COOP | NetFlagsA.COOP_SHARED_ACCESS;
const PRESET_NETFLAGS_ALT_SURV      = PRESET_NETFLAGS_ALT_COOP | NetFlagsA.COOP_SHARED_ACCESS;
const PRESET_NETFLAGS_MODERN_SURV   = PRESET_NETFLAGS_MODERN_COOP | NetFlagsA.COOP_SHARED_ACCESS;
const PRESET_NETFLAGS_HARDCORE_SURV = PRESET_NETFLAGS_HARDCORE_COOP | NetFlagsA.COOP_SHARED_ACCESS;

const PRESET_NETFLAGS_CLASSIC_FFA   = DEFAULT_NETFLAGS_PVP_SPWN;
const PRESET_NETFLAGS_ALT_FFA       = DEFAULT_NETFLAGS_PVP_NOSPWN;
const PRESET_NETFLAGS_MODERN_FFA    = DEFAULT_NETFLAGS_PVP_SPWN | BASE_MODERN;
const PRESET_NETFLAGS_HARDCORE_FFA  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_HARDCORE;

const PRESET_NETFLAGS_CLASSIC_TEAM  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_CLASSIC_TEAMPLAY;
const PRESET_NETFLAGS_ALT_TEAM      = DEFAULT_NETFLAGS_PVP_NOSPWN | BASE_ALT_TEAMPLAY;
const PRESET_NETFLAGS_MODERN_TEAM   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_MODERN | BASE_MODERN_TEAMPLAY;
const PRESET_NETFLAGS_HARDCORE_TEAM = DEFAULT_NETFLAGS_PVP_SPWN | BASE_TDM_TLMS | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA.SURV_TLMS_SHARED_LIVES;

const PRESET_NETFLAGS_CLASSIC_CTF   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_CLASSIC_TEAMPLAY;
const PRESET_NETFLAGS_ALT_CTF       = DEFAULT_NETFLAGS_PVP_NOSPWN | BASE_ALT_TEAMPLAY | NetFlagsA.CTF_FLAG_INSTANT_RETURN;
const PRESET_NETFLAGS_MODERN_CTF    = DEFAULT_NETFLAGS_PVP_SPWN | BASE_MODERN | BASE_MODERN_TEAMPLAY | NetFlagsA.CTF_FLAG_OUTLINE;
const PRESET_NETFLAGS_HARDCORE_CTF  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA.CTF_FLAG_INSTANT_RETURN | NetFlagsA.CTF_FLAG_AUTODETONATE;

const PRESET_NETFLAGS_CLASSIC_LMS   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS;
const PRESET_NETFLAGS_ALT_LMS       = DEFAULT_NETFLAGS_PVP_NOSPWN;
const PRESET_NETFLAGS_MODERN_LMS    = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS | BASE_MODERN;
const PRESET_NETFLAGS_HARDCORE_LMS  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_LMS | BASE_HARDCORE;

const PRESET_NETFLAGS_CLASSIC_TERM  = DEFAULT_NETFLAGS_PVP_SPWN | BASE_CLASSIC_TEAMPLAY;
const PRESET_NETFLAGS_ALT_TERM      = DEFAULT_NETFLAGS_PVP_NOSPWN | BASE_ALT_TEAMPLAY;
const PRESET_NETFLAGS_MODERN_TERM   = DEFAULT_NETFLAGS_PVP_SPWN | BASE_MODERN | BASE_MODERN_TEAMPLAY;
const PRESET_NETFLAGS_HARDCORE_TERM = DEFAULT_NETFLAGS_PVP_SPWN | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY;

// netflagsB preset combinations
const PRESET_NETFLAGSB_CLASSIC        = 0;
const PRESET_NETFLAGSB_ALT            = NetFlagsB.TEAM_LASER_COLORS;
const PRESET_NETFLAGSB_MODERN         = NetFlagsB.TEAM_LASER_COLORS;
const PRESET_NETFLAGSB_HARDCORE       = 0;

const PRESET_NETFLAGSB_CLASSIC_TERM   = PRESET_NETFLAGSB_CLASSIC;
const PRESET_NETFLAGSB_ALT_TERM       = PRESET_NETFLAGSB_ALT | NetFlagsB.TRM_NO_SHRINKER_IMMUNITY;
const PRESET_NETFLAGSB_MODERN_TERM    = PRESET_NETFLAGSB_MODERN | NetFlagsB.TRM_NO_INFINITE_JPACK;
const PRESET_NETFLAGSB_HARDCORE_TERM  = PRESET_NETFLAGSB_HARDCORE | NetFlagsB.TRM_NO_INFINITE_JPACK | NetFlagsB.TRM_NO_SHRINKER_IMMUNITY;

// weapflags presets
const DEFAULT_WEAPFLAGS              = StartingWeapon.PISTOL;
const PRESET_WEAPFLAGS_HARDCORE_TERM = StartingWeapon.PISTOL | StartingWeapon.FREEZE;

// invflags presets
const DEFAULT_INVFLAGS     = 0;
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
                case GameType.SURV: {
                    netflagsA = PRESET_NETFLAGS_CLASSIC_SURV;
                    netflagsB = PRESET_NETFLAGSB_CLASSIC;
                    weapflags = DEFAULT_WEAPFLAGS;
                    invflags  = DEFAULT_INVFLAGS;
                    break;
                }
                case GameType.COOP: {
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
                case GameType.SURV: {
                    netflagsA = PRESET_NETFLAGS_ALT_SURV;
                    netflagsB = PRESET_NETFLAGSB_ALT;
                    weapflags = DEFAULT_WEAPFLAGS;
                    invflags  = DEFAULT_INVFLAGS;
                    break;
                }
                case GameType.COOP: {
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
                case GameType.SURV: {
                    netflagsA = PRESET_NETFLAGS_MODERN_SURV;
                    netflagsB = PRESET_NETFLAGSB_MODERN;
                    weapflags = DEFAULT_WEAPFLAGS;
                    invflags  = DEFAULT_INVFLAGS;
                    break;
                }
                case GameType.COOP: {
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
                case GameType.SURV: {
                    netflagsA = PRESET_NETFLAGS_HARDCORE_SURV;
                    netflagsB = PRESET_NETFLAGSB_HARDCORE;
                    weapflags = DEFAULT_WEAPFLAGS;
                    invflags  = DEFAULT_INVFLAGS;
                    break;
                }
                case GameType.COOP: {
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