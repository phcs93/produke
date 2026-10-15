//HF: Netflags
//Netflags A: General settings that are NOT game specific
//NOTE: Adding new NetFlagsA ? Remember to update netflagsA_desc[] !!
//NOTE: Zeroed value must be SP behavior !!
enum NetFlagsA {                         //32 flags: 0~31 (we'll have it as an int32)
    NetFlagsA_GETWEAPONCE               = (BIT(0)),     //[1]   Can only pick weapons once   [Co-op and DM(No Spawn) behavior]
    NetFlagsA_RESPAWN_MONSTERS          = (BIT(1)),     //[2]   ud.respawn_monsters   (/t cmd line - CAN come from the game mode as well)
    NetFlagsA_RESPAWN_ITEMS             = (BIT(2)),     //[4]   ud.respawn_items      (/t cmd line - CAN come from the game mode as well)
    NetFlagsA_RESPAWN_INVENTORY         = (BIT(3)),     //[8]   ud.respawn_inventory  (/t cmd line - CAN come from the game mode as well)
    NetFlagsA_MARKERS                   = (BIT(4)),     //[16]  ud.markers  (this was NOT saved in dmos before!!! This did NOT cause issues on demo playback though)
    NetFlagsA_NO_MONSTERS               = (BIT(5)),     //[32]  ud.monsters_off       (/m cmd line)
    NetFlagsA_NO_ACCESS                 = (BIT(6)),     //[64]  Do not spawn access cards    [DM(Spawn) and DM(No Spawn) behavior]
    NetFlagsA_DMSWITCHES                = (BIT(7)),     //[128] Spawn DM only switches      [DM(Spawn) and DM(No Spawn) behavior]
    NetFlagsA_MPITEMS                   = (BIT(8)),     //[256] Spawn MP only items         [All MP modes behavior]
    NetFlagsA_COOPTEAM__FRIENDLY_FIRE   = (BIT(9)),     //[512] ud.ffire              (only from the menus)   

    //New stuff below:
    NetFlagsA_COOPTEAM__AUTOAIM_ON_ALLIES   = (BIT(10)),    //[1024]
    NetFlagsA_COOPTEAM__GLOBAL_ALLY_SOUNDS  = (BIT(11)),    //[2048]
    NetFlagsA_COOPTEAM__NO_SPYCAM_MAPVIEW   = (BIT(12)),    //[4096]
    
    NetFlagsA_REVEALED_AUTOMAP              = (BIT(13)),    //[8192]
    NetFlagsA_NO_MAP_EXIT                   = (BIT(14)),    //[16384]
    NetFlagsA_NO_TARGET_NAMES               = (BIT(15)),    //[32768]
    NetFlagsA_WEAPON_ALWAYS_DROP            = (BIT(16)),    //[65536]

    NetFlagsA_FORCE_RESPAWN                 = (BIT(17)),    //[131072]
    NetFlagsA_RESPAWN_FARTHEST              = (BIT(18)),    //[262144]
    NetFlagsA_TEAM__MIXED_TEAM_SPAWNS       = (BIT(19)),    //[524288]

    NetFlagsA_DAMAGENUMS                    = (BIT(20)),    //[1048576]
    NetFlagsA_TRMCOOPTEAM__OVERHEAD         = (BIT(21)),    //[2097152]
    NetFlagsA_TRMCOOPTEAM__OUTLINES         = (BIT(22)),    //[4194304]             //just to display it... to be seen thru walls NetFlagsA_COOP_TEAM_TRM_OUTLINES is required !
    NetFlagsA_CTF__FLAG_OUTLINE             = (BIT(23)),    //[8388608]

    NetFlagsA_CTF__FLAG_INSTANT_RETURN      = (BIT(24)),    //[16777216]
    NetFlagsA_CTF__FLAG_AUTODETONATE        = (BIT(25)),    //[33554432]

    NetFlagsA_T_LMS__RESTRICTED_SPYCAM      = (BIT(26)),    //[67108864]
    NetFlagsA_T_LMS__RESTRICTED_CHAT        = (BIT(27)),    //[134217728]

    NetFlagsA_COOP__SHARED_ACCESS           = (BIT(28)),    //[268435456]
    NetFlagsA_SURVTLMS__SHARED_LIVES        = (BIT(29)),    //[536870912]
    //NetFlagsA_SURV__PERSISTENT_LIVES      = (BIT(30)),    //[1073741824]         //HFTODO: coming in... v0.4 ??

    //REMOVED NetFlagsA that are commented out in code (implemented):
    //NetFlags_RANDOM_1ST_SPAWN           = (BIT(?),      //Doesnt work properly... the random start is always the same!  TRAND is not a true random!
};
#define MAX_NETFLAGSA                         30      //Last used + 1
    
//Check MAIN_LOOP_RESTART on game.c to know where the defaults come from    (except for NetFlagsA_FRIENDLY_FIRE that are now given to PVP modes, because of TDM - has no effect on FFA modes)
#define DEFAULT_NETFLAGS_SP                       0
#define DEFAULT_NETFLAGS_PVP_SPWN                 0           | NetFlagsA_MARKERS | NetFlagsA_NO_MONSTERS | NetFlagsA_NO_ACCESS | NetFlagsA_RESPAWN_INVENTORY | NetFlagsA_RESPAWN_ITEMS | NetFlagsA_DMSWITCHES | NetFlagsA_MPITEMS | NetFlagsA_COOPTEAM__FRIENDLY_FIRE
#define DEFAULT_NETFLAGS_PVP_NOSPWN     NetFlagsA_GETWEAPONCE |         0         | NetFlagsA_NO_MONSTERS | NetFlagsA_NO_ACCESS |              0              |            0            | NetFlagsA_DMSWITCHES | NetFlagsA_MPITEMS | NetFlagsA_COOPTEAM__FRIENDLY_FIRE
#define DEFAULT_NETFLAGS_COOP           NetFlagsA_GETWEAPONCE |         0         |           0           |         0           | NetFlagsA_RESPAWN_INVENTORY |            0            |          0           | NetFlagsA_MPITEMS | NetFlagsA_COOPTEAM__FRIENDLY_FIRE
                                        
    #define BASE_TDM_TLMS           NetFlagsA_TEAM__MIXED_TEAM_SPAWNS | NetFlagsA_T_LMS__RESTRICTED_SPYCAM | NetFlagsA_T_LMS__RESTRICTED_CHAT
    #define BASE_LMS                NetFlagsA_FORCE_RESPAWN | NetFlagsA_RESPAWN_FARTHEST

    #define BASE_MODERN             NetFlagsA_REVEALED_AUTOMAP | NetFlagsA_NO_MAP_EXIT | NetFlagsA_WEAPON_ALWAYS_DROP | NetFlagsA_DAMAGENUMS
    #define BASE_HARDCORE           NetFlagsA_NO_TARGET_NAMES //Also appears on the TEAMPLAY base sets below (intentional - this flag is less meaningful in ffa due to the player colors)
    
    #define BASE_CLASSIC_TEAMPLAY                     0                   |                   0                   | NetFlagsA_NO_TARGET_NAMES |                0                |                 0              
    #define BASE_ALT_TEAMPLAY                         0                   |                   0                   |            0              | NetFlagsA_TRMCOOPTEAM__OVERHEAD |                 0              
    #define BASE_MODERN_TEAMPLAY                      0                   |                   0                   |            0              | NetFlagsA_TRMCOOPTEAM__OVERHEAD | NetFlagsA_TRMCOOPTEAM__OUTLINES
    #define BASE_HARDCORE_TEAMPLAY  NetFlagsA_COOPTEAM__NO_SPYCAM_MAPVIEW | NetFlagsA_COOPTEAM__AUTOAIM_ON_ALLIES | NetFlagsA_NO_TARGET_NAMES |                0                |                 0

//The presets from the menu:
#define PRESET_NETFLAGS_CLASSIC_COOP    DEFAULT_NETFLAGS_COOP                                                                                                                                                                                                          | NetFlagsA_COOPTEAM__GLOBAL_ALLY_SOUNDS |                 0                 | BASE_CLASSIC_TEAMPLAY
#define PRESET_NETFLAGS_ALT_COOP                  0           | NetFlagsA_MARKERS |           0           |         0           | NetFlagsA_RESPAWN_INVENTORY | NetFlagsA_RESPAWN_ITEMS |          0           | NetFlagsA_MPITEMS | NetFlagsA_COOPTEAM__FRIENDLY_FIRE |                  0                     | NetFlagsA_SURVTLMS__SHARED_LIVES | BASE_ALT_TEAMPLAY
#define PRESET_NETFLAGS_MODERN_COOP     NetFlagsA_GETWEAPONCE | NetFlagsA_MARKERS |           0           |         0           | NetFlagsA_RESPAWN_INVENTORY | NetFlagsA_RESPAWN_ITEMS |          0           | NetFlagsA_MPITEMS | NetFlagsA_COOPTEAM__FRIENDLY_FIRE |                  0                     |                 0                 | BASE_MODERN_TEAMPLAY
#define PRESET_NETFLAGS_HARDCORE_COOP             0           |         0         |           0           |         0           |               0             |            0            |          0           |         0         | NetFlagsA_COOPTEAM__FRIENDLY_FIRE |                  0                     | NetFlagsA_SURVTLMS__SHARED_LIVES | BASE_HARDCORE_TEAMPLAY

//SURV is the same as COOP but with NetFlagsA_COOP__SHARED_ACCESS added
#define PRESET_NETFLAGS_CLASSIC_SURV    PRESET_NETFLAGS_CLASSIC_COOP  | NetFlagsA_COOP__SHARED_ACCESS
#define PRESET_NETFLAGS_ALT_SURV        PRESET_NETFLAGS_ALT_COOP      | NetFlagsA_COOP__SHARED_ACCESS
#define PRESET_NETFLAGS_MODERN_SURV     PRESET_NETFLAGS_MODERN_COOP   | NetFlagsA_COOP__SHARED_ACCESS
#define PRESET_NETFLAGS_HARDCORE_SURV   PRESET_NETFLAGS_HARDCORE_COOP | NetFlagsA_COOP__SHARED_ACCESS

#define PRESET_NETFLAGS_CLASSIC_FFA     DEFAULT_NETFLAGS_PVP_SPWN   |       0       |       0       
#define PRESET_NETFLAGS_ALT_FFA         DEFAULT_NETFLAGS_PVP_NOSPWN |       0       |       0       
#define PRESET_NETFLAGS_MODERN_FFA      DEFAULT_NETFLAGS_PVP_SPWN   |       0       |  BASE_MODERN  
#define PRESET_NETFLAGS_HARDCORE_FFA    DEFAULT_NETFLAGS_PVP_SPWN   |       0       | BASE_HARDCORE 

#define PRESET_NETFLAGS_CLASSIC_TEAM    DEFAULT_NETFLAGS_PVP_SPWN   | BASE_TDM_TLMS |       0       | BASE_CLASSIC_TEAMPLAY  |                0
#define PRESET_NETFLAGS_ALT_TEAM        DEFAULT_NETFLAGS_PVP_NOSPWN |       0       |       0       |    BASE_ALT_TEAMPLAY   |                0
#define PRESET_NETFLAGS_MODERN_TEAM     DEFAULT_NETFLAGS_PVP_SPWN   | BASE_TDM_TLMS |  BASE_MODERN  |  BASE_MODERN_TEAMPLAY  |                0
#define PRESET_NETFLAGS_HARDCORE_TEAM   DEFAULT_NETFLAGS_PVP_SPWN   | BASE_TDM_TLMS | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA_SURVTLMS__SHARED_LIVES

#define PRESET_NETFLAGS_CLASSIC_CTF     DEFAULT_NETFLAGS_PVP_SPWN   |       0       |       0       | BASE_CLASSIC_TEAMPLAY  |                0
#define PRESET_NETFLAGS_ALT_CTF         DEFAULT_NETFLAGS_PVP_NOSPWN |       0       |       0       |    BASE_ALT_TEAMPLAY   | NetFlagsA_CTF__FLAG_INSTANT_RETURN
#define PRESET_NETFLAGS_MODERN_CTF      DEFAULT_NETFLAGS_PVP_SPWN   |       0       |  BASE_MODERN  |  BASE_MODERN_TEAMPLAY  | NetFlagsA_CTF__FLAG_OUTLINE
#define PRESET_NETFLAGS_HARDCORE_CTF    DEFAULT_NETFLAGS_PVP_SPWN   |       0       | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY | NetFlagsA_CTF__FLAG_INSTANT_RETURN | NetFlagsA_CTF__FLAG_AUTODETONATE

#define PRESET_NETFLAGS_CLASSIC_LMS     DEFAULT_NETFLAGS_PVP_SPWN   |   BASE_LMS    |       0       
#define PRESET_NETFLAGS_ALT_LMS         DEFAULT_NETFLAGS_PVP_NOSPWN |       0       |       0       
#define PRESET_NETFLAGS_MODERN_LMS      DEFAULT_NETFLAGS_PVP_SPWN   |   BASE_LMS    |  BASE_MODERN  
#define PRESET_NETFLAGS_HARDCORE_LMS    DEFAULT_NETFLAGS_PVP_SPWN   |   BASE_LMS    | BASE_HARDCORE 

#define PRESET_NETFLAGS_CLASSIC_TRM     DEFAULT_NETFLAGS_PVP_SPWN   |       0       |       0       | BASE_CLASSIC_TEAMPLAY
#define PRESET_NETFLAGS_ALT_TRM         DEFAULT_NETFLAGS_PVP_NOSPWN |       0       |       0       |    BASE_ALT_TEAMPLAY
#define PRESET_NETFLAGS_MODERN_TRM      DEFAULT_NETFLAGS_PVP_SPWN   |       0       |  BASE_MODERN  |  BASE_MODERN_TEAMPLAY
#define PRESET_NETFLAGS_HARDCORE_TRM    DEFAULT_NETFLAGS_PVP_SPWN   |       0       | BASE_HARDCORE | BASE_HARDCORE_TEAMPLAY

//This one holds the netflagsA that are altered automatically when switching through the game modes
#define NETFLAGS_TOGGLING       NetFlagsA_GETWEAPONCE | NetFlagsA_MARKERS | NetFlagsA_NO_MONSTERS | NetFlagsA_NO_ACCESS | NetFlagsA_RESPAWN_INVENTORY | NetFlagsA_RESPAWN_ITEMS | NetFlagsA_DMSWITCHES | NetFlagsA_MPITEMS | NetFlagsA_COOPTEAM__FRIENDLY_FIRE

//HF: Netflags
//Netflags B: General settings that ARE game specific
enum NetFlagsB {
    NetFlagsB_TEAM__LASER_COLORS        = (BIT(0)),     //[1]
    NetFlagsB_CTF__NO_ROIDS             = (BIT(1)),     //[2]
    NetFlagsB_CTF__NO_JETPACK           = (BIT(2)),     //[4]
    
    NetFlagsB_TRM__NO_INFINITE_JETPACK  = (BIT(3)),     //[8]
    NetFlagsB_TRM__NO_SHRINKER_IMMUNITY = (BIT(4)),     //[16]
    NetFlagsB_TRM__NO_FREEZER_WEAKNESS  = (BIT(5)),     //[32]
};
#define MAX_NETFLAGSB                           6      //Last used + 1

#define PRESET_NETFLAGSB_CLASSIC                      0
#define PRESET_NETFLAGSB_ALT            NetFlagsB_TEAM__LASER_COLORS
#define PRESET_NETFLAGSB_MODERN         NetFlagsB_TEAM__LASER_COLORS
#define PRESET_NETFLAGSB_HARDCORE                     0

#define PRESET_NETFLAGSB_CLASSIC_TRM    PRESET_NETFLAGSB_CLASSIC  |               0                 |                 0                 
#define PRESET_NETFLAGSB_ALT_TRM        PRESET_NETFLAGSB_ALT      |               0                 | NetFlagsB_TRM__NO_SHRINKER_IMMUNITY
#define PRESET_NETFLAGSB_MODERN_TRM     PRESET_NETFLAGSB_MODERN   | NetFlagsB_TRM__NO_INFINITE_JETPACK |                 0                 
#define PRESET_NETFLAGSB_HARDCORE_TRM   PRESET_NETFLAGSB_HARDCORE | NetFlagsB_TRM__NO_INFINITE_JETPACK | NetFlagsB_TRM__NO_SHRINKER_IMMUNITY

#define DEFAULT_NETFLAGSB               0

//HF: Netflags
//Netflags C: game balance related
enum NetFlagsC {
    NetFlagsC_ARSENAL_REBALANCE                 = (BIT(0)),     //[1]
    /*ARSENAL REBALANCE do a few things to the unused items of the game to attempt to make them be more powerful on PVP modes
        see netflags_rebalanced_desc[] for complete info*/

    NetFlagsC_LASERMODE_HEAT                        = (BIT(1)),     //[2]            //Similar to 'lasermode' CON command, but its team smart
    NetFlagsC_FREEZER_CANT_HURT_OWNER               = (BIT(2)),     //[4]
    NetFlagsC_DESTRUCTABLE_CAMERAS                  = (BIT(3)),     //[8]
    
    NetFlagsC_13D_ENABLE_DOUBLE_KICK                = (BIT(4)),     //[16]
    NetFlagsC_13D_DISABLE_EXPANDER                  = (BIT(5)),     //[32]

    NetFlagsC_FIX_TRIPBOMB_ON_SLOPES                = (BIT(6)),     //[64]

    NetFlagsC_ORIGBHV_CLASSIC_MAP_START_BEHAVIOR    = (BIT(7)),     //[128]
    NetFlagsC_ORIGBHV_FFIRE_EXCLUDES_SELF           = (BIT(8)),     //[256]
    NetFlagsC_ORIGBHV_DROWNING_RESPAWN              = (BIT(9)),     //[512]
    NetFlagsC_ORIGBHV_INVALID_SHRINK_STATES         = (BIT(10)),    //[1024]
    NetFlagsC_ORIGBHV_BAD_SHRINKER_HIT_DETECTION    = (BIT(11)),    //[2048]
    NetFlagsC_ORIGBHV_BAD_EXPANDER_RADIUS           = (BIT(12)),    //[4096]
    NetFlagsC_ORIGBHV_WEAPON_SWITCHING_BUGS         = (BIT(13)),    //[8192]
    NetFlagsC_ORIGBHV_DEAD_PLAYER_SWAPING_BUGS      = (BIT(14)),    //[16384]
    NetFlagsC_ORIGBHV_BAD_NIGHTVISION_GLOW          = (BIT(15)),    //[32768]
    NetFlagsC_ORIGBHV_BAD_AUTO_RPG_HIT_DETECTION    = (BIT(16)),    //[65536]
};
#define MAX_NETFLAGSC                           17      //Last used + 1

#define DOS_DEMOS_COMPAT_FLAGS  NetFlagsC_ORIGBHV_CLASSIC_MAP_START_BEHAVIOR | NetFlagsC_ORIGBHV_FFIRE_EXCLUDES_SELF | NetFlagsC_ORIGBHV_DROWNING_RESPAWN | NetFlagsC_ORIGBHV_INVALID_SHRINK_STATES | NetFlagsC_ORIGBHV_BAD_SHRINKER_HIT_DETECTION | \
                                NetFlagsC_ORIGBHV_BAD_EXPANDER_RADIUS | NetFlagsC_ORIGBHV_WEAPON_SWITCHING_BUGS | NetFlagsC_ORIGBHV_DEAD_PLAYER_SWAPING_BUGS | NetFlagsC_ORIGBHV_BAD_NIGHTVISION_GLOW | NetFlagsC_ORIGBHV_BAD_AUTO_RPG_HIT_DETECTION

#define DEFAULT_NETFLAGSC                       0

/*
//HF: nDuke Flags (2.0)		//16 flags: 0~15 (it's an int)
#define NDUKE_FLAGS_BLANK						(BIT(0))	//TODO: 'NO SPAWN' option (separate from the game modes)
#define NDUKE_FLAGS_FIXED_COLORS				(BIT(1))
#define NDUKE_FLAGS_FIXED_TEAMS					(BIT(2))
#define NDUKE_FLAGS_NO_TARGET_NAMES				(BIT(3))
#define NDUKE_FLAGS_DISABLE_MAP_EXIT			(BIT(4))
#define NDUKE_FLAGS_FORCE_RESPAWN				(BIT(5))
#define NDUKE_FLAGS_TEAM_COOP_NO_SPY			(BIT(6))
#define NDUKE_FLAGS_TEAM_AUTOAIM_ON_ALLIES		(BIT(7))
#define NDUKE_FLAGS_TEAM_NO_TEAM_COLORED_LASER	(BIT(8))
#define NDUKE_FLAGS_TEAM_HEAT_ON_ALLIES			(BIT(9))
#define NDUKE_FLAGS_CTF_NOROIDS					(BIT(10))
#define NDUKE_FLAGS_CTF_NOJPACK					(BIT(11))
#define NDUKE_FLAGS_CTF_NOHOLOFLAG				(BIT(12))
*/

//HF: Starting Weapon
//NOTE: first time spawns on damaging sectors STILL spawn the player without anything, to respect map compatibillity
enum StartingWeapon {
    StartingWeapon_PISTOL       = (BIT((PISTOL_WEAPON-1))),     //[1]   //[DEFAULT] Pistol + 48 ammo 
    StartingWeapon_SHOTGUN      = (BIT((SHOTGUN_WEAPON-1))),    //[2]       //Shotgun + 10 ammo
    StartingWeapon_CHAINGUN     = (BIT((CHAINGUN_WEAPON-1))),   //[4]       //Chaingun + 50 ammo
    StartingWeapon_RPG          = (BIT((RPG_WEAPON-1))),        //[8]       //RPG + 5 ammo
    StartingWeapon_HANDBOMB     = (BIT((HANDBOMB_WEAPON-1))),   //[16]      //5 Pipebombs
    StartingWeapon_SHRINKER     = (BIT((SHRINKER_WEAPON-1))),   //[32]      //Shrinker + 10 ammo (+ Expander with 0 ammo)
    StartingWeapon_DEVISTATOR   = (BIT((DEVISTATOR_WEAPON-1))), //[64]      //Devistator + 15 ammo
    StartingWeapon_TRIPBOMB     = (BIT((TRIPBOMB_WEAPON-1))),   //[128]     //5 Tripbombs (1 would be too little)
    StartingWeapon_FREEZE       = (BIT((FREEZE_WEAPON-1))),     //[256]     //Freezer + 25 ammo (+ Shrinker with 0 ammo)
    StartingWeapon_FULL_AMMO    = (BIT(9)),                     //[512]     //STARTING WEAPONS will come with full ammo, otherwise, will come with just basic ammo
    StartingWeapon_GROW         = (BIT((GROW_WEAPON-1))),       //[1024]    //Expander + 20 ammo (+ Shrinker with 0 ammo)
    
    //StartingWeapon_INCINERATOR  = (BIT(11)),                    //[2048]        //(WORLD TOUR) Incinerator + 25 ammo
};
#define MAX_WEAPFLAGS                   11

#define DEFAULT_WEAPFLAGS               StartingWeapon_PISTOL
#define PRESET_WEAPFLAGS_HARDCORE_TERM  StartingWeapon_PISTOL | StartingWeapon_FREEZE

//HF: Starting Inventory
//NOTE: first time spawns on damaging sectors STILL spawn the player without anything, to respect map compatibillity
enum StartingInventory {
    StartingInventory_ACCESS    = (BIT(0)),             //[1]       //[DM(Spawn) and DM(No Spawn) behavior] Spawns with the Access cards
    StartingInventory_FIRSTAID  = (BIT(ICON_FIRSTAID)), //[2]
    StartingInventory_STEROIDS  = (BIT(ICON_STEROIDS)), //[4]
    StartingInventory_HOLODUKE  = (BIT(ICON_HOLODUKE)), //[8]
    StartingInventory_JETPACK   = (BIT(ICON_JETPACK)),  //[16]
    StartingInventory_HEAT      = (BIT(ICON_HEATS)),    //[32]
    StartingInventory_AIRTANK   = (BIT(ICON_SCUBA)),    //[64]
    StartingInventory_BOOTS     = (BIT(ICON_BOOTS)),    //[128]
    StartingInventory_ARMOR     = (BIT(8)),             //[256]
    StartingInventory_ATOMIC1   = (BIT(9)),             //[512]         //Enable both to start with 200hp
    StartingInventory_ATOMIC2   = (BIT(10)),            //[1024]        //Enable both to start with 200hp
};
#define MAX_INVFLAGS                    11

#define DEFAULT_INVFLAGS        0
#define DEFAULT_INVFLAGS_PVP    StartingInventory_ACCESS

//HF: Net Options Presets
enum NetPresets {    
    NetPresets_CLASSIC                  = 0,        //PVP (SPAWN) + Classic COOP
    NetPresets_ALTERNATIVE              = 1,        //PVP (NO SPAWN) + Inverted COOP
    NetPresets_MODERN                   = 2,        //The easier/friendly mode
    NetPresets_HARDCORE                 = 3         //The harder mode
};
#define MAX_NETFLAGS_PRESETS                4