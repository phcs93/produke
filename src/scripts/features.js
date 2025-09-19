window["load-features"] = async () => {

    // menu and sections structure
    const structures = {
        "new-game-modes": {
            "title": {
                "en": "NEW GAME MODES",
                "pt": "NOVOS MODOS DE JOGO"
            },
            "description": {
                "en": "There are a lot of new game modes now.",
                "pt": "Existem varios novos modos de jogo agora."
            },
            "sections": {
                "tdm": {
                   "title": {
                        "en": "Team Dukematch (TDM)",
                        "pt": "Team Dukematch (TDM)"
                   }
                },
                "ctf": {
                    "title": {
                        "en": "Catch The Flag (CTF)",
                        "pt": "Catch The Flag (CTF)"
                    }
                },
                "1fctf": {
                    "title": {
                        "en": "1-Flag CTF",
                        "pt": "1-Flag CTF"
                    }
                },
                "adctf": {
                    "title": {
                        "en": "ATK/DEF CTF",
                        "pt": "ATK/DEF CTF"
                    }
                },
                "survival": {
                    "title": {
                        "en": "Survival",
                        "pt": "Survival"
                    }
                },
                "lms": {
                    "title": {
                        "en": "Last Man Standing (LMS)",
                        "pt": "Last Man Standing (LMS)"
                    }
                },
                "tlms": {
                    "title": {
                        "en": "Team LMS",
                        "pt": "Team LMS"
                    }
                },                
                "terminator": {
                    "title": {
                        "en": "Terminator",
                        "pt": "Terminator"
                    }
                },
                "score-and-time-limit": {
                    "title": {
                        "en": "Score and Time Limit",
                        "pt": "Limite de Pontos e Tempo"
                    }
                }
            }
        },        
        "teamplay-improvements": {
            "title": {
                "en": "TEAMPLAY IMPROVEMENTS",
                "pt": "MELHORIAS DE MODOS TIME"
            },
            "description": {
                "en": "There are various optional features to make teamplay more fluid.",
                "pt": "Existem vários recursos opcionais para fazer os jogos de times ficarem mais fluidos."
            },
            "sections": {
                "team-outlines": {
                    "title": {
                        "en": "Team Outlines",
                        "pt": "Contornos do Time"
                    }
                },
                "team-info": {
                    "title": {
                        "en": "Team Overhead Info",
                        "pt": "Informações de Time"
                    }
                },
                "team-spawn-points": {
                    "title": {
                        "en": "Team Spawn Points",
                        "pt": "Pontos de Spawn por Time"
                    }
                },
                "team-chat": {
                    "title": {
                        "en": "Team Chat",
                        "pt": "Chat por Time"
                    }
                },
                "team-view": {
                    "title": {
                        "en": "Team View",
                        "pt": "Tela do Time"
                    }
                },
                "team-on-automap": {
                    "title": {
                        "en": "Team on Automap",
                        "pt": "Time no Automap"
                    }
                },
                "team-colored-tripboms": {
                    "title": {
                        "en": "Team Colored Tripbombs",
                        "pt": "Tripbombs Coloridas por Time"
                    }
                },
                "team-smart-autoaim": {
                    "title": {
                        "en": "Team Smart Autoaim",
                        "pt": "Mira Automatica Inteligente"
                    }
                },
                "team-smart-nightvision": {
                    "title": {
                        "en": "Team Smart Nightvision",
                        "pt": "Nightvision Inteligente"
                    }
                },
                "team-scorebar-modes": {
                    "title": {
                        "en": "Team Scorebar Modes",
                        "pt": "Modos de Scorebar de Time"
                    }
                },
                "team-friendly-fire": {
                    "title": {
                        "en": "Team Friendly Fire",
                        "pt": "Fogo Amigo de Time"
                    }
                },
                "team-picker": {
                    "title": {
                        "en": "Team Picker",
                        "pt": "Seletor de Times"
                    }
                }
            }
        },
        "gameplay-improvements": {
            "title": {
                "en": "GAMEPLAY IMPROVEMENTS",
                "pt": "MELHORIAS DE JOGABILIDADE"
            },
            "description": {
                "en": "There are various optional features to make general gameplay more fluid.",
                "pt": "Existem vários recursos opcionais para fazer os jogos em geral ficarem mais fluidos"
            },
            "sections": {
                "player-colors": {
                    "title": {
                        "en": "Player Colors",
                        "pt": "Cores dos Jogadores"
                    }
                },
                "target-names": {
                    "title": {
                        "en": "Target Names",
                        "pt": "Nomes dos Alvos"
                    }
                },
                "revealed-automap": {
                    "title": {
                        "en": "Revealed Automap",
                        "pt": "Mapa Revelado"
                    }
                },
                "always-drop-weapon": {
                    "title": {
                        "en": "Always Drop Weapon",
                        "pt": "Sempre Derrubar a Arma"
                    }
                },
                "disable-map-exit": {
                    "title": {
                        "en": "Disable Map Exit",
                        "pt": "Desabilitar a Saída do Mapa"
                    }
                },
                "force-respawn": {
                    "title": {
                        "en": "Force Respawn",
                        "pt": "Forçar Renascimento"
                    }
                },
                "respawn-farthest": {
                    "title": {
                        "en": "Respawn Farthest",
                        "pt": "Renascer Mais Distante"
                    }
                },
                "starting-weapons": {
                    "title": {
                        "en": "Starting Weapons",
                        "pt": "Armas Iniciais"
                    }
                },
                "starting-inventory": {
                    "title": {
                        "en": "Starting Inventory",
                        "pt": "Inventário Inicial"
                    }
                }
            }
        },
        "hud-improvements": {
            "title": {
                "en": "HUD IMPROVEMENTS",
                "pt": "MELHORIAS DO HUD"
            },
            "description": {
                "en": "Various improvements regarding the game HUD to make it less clutered and more intuitive.",
                "pt": "Várias melhorias na HUD do jogo para deixa-la menos obstrutiva e mais intuitiva."
            },
            "sections": {
                "obituaries": {
                    "title": {
                        "en": "Obituaries",
                        "pt": "Obituários"
                    }
                },
                "colored-chat": {
                    "title": {
                        "en": "Colored Chat",
                        "pt": "Chat Colorido"
                    }
                },
                "new-mini-hud": {
                    "title": {
                        "en": "New Mini HUD",
                        "pt": "Nova Mini HUD"
                    }
                },
                "lattency-indicators": {
                    "title": {
                        "en": "Lattency Indicators",
                        "pt": "Indicadores de Latencia"
                    }
                },
                "player-name-on-hud": {
                    "title": {
                        "en": "Player Name on HUD",
                        "pt": "Nome do Jogador na HUD"
                    }
                },
                "crosshair-selector": {
                    "title": {
                        "en": "Crosshair Selector",
                        "pt": "Seletor de Miras"
                    }
                },
                "in-game-clock": {
                    "title": {
                        "en": "In-Game Clock",
                        "pt": "Relógio da Partida"
                    }
                },
                "new-spycam-modes": {
                    "title": {
                        "en": "New Spycam Modes",
                        "pt": "Novos Modos de Spycam"
                    }
                },
                "new-automap-modes": {
                    "title": {
                        "en": "New Automap Modes",
                        "pt": "Novos Modos de Automap"
                    }
                }
            }
        },
        "qol-improvements": {
            "title": {
                "en": "QUALITY OF LIFE IMPROVEMENTS",
                "pt": "MELHORIAS DE QUALIDADE DE VIDA"
            },
            "description": {
                "en": "Various improvements at the game menu to make the game less dependant on a launcher.",
                "pt": "Várias melhorias no menu para fazer o jogo ser menos dependente de um launcher."
            },
            "sections": {
                "netflags": {
                    "title": {
                        "en": "NetFlags",
                        "pt": "NetFlags"
                    }
                },
                "player-setup": {
                    "title": {
                        "en": "Player Setup",
                        "pt": "Configuração do Jogador"
                    }
                },
                "weapon-switch-priority": {
                    "title": {
                        "en": "Weapon Switch Priority",
                        "pt": "Prioridade de Troca de Armas"
                    }
                },
                "user-map-selector": {
                    "title": {
                        "en": "User Map Selector",
                        "pt": "Seletor de User Maps"
                    }
                },
                "bot-menu": {
                    "title": {
                        "en": "BOTs Menu",
                        "pt": "Menu de BOTs"
                    }
                },
                "demo-selector": {
                    "title": {
                        "en": "Demo Selector",
                        "pt": "Seletor de Demo"
                    }
                },
                "macro-editor": {
                    "title": {
                        "en": "Macro Editor",
                        "pt": "Editor de Macros"
                    }
                },
                "auto-screenshots": {
                    "title": {
                        "en": "Auto Screenshots",
                        "pt": "Screenshots Automáticas"
                    }
                },
                "demo-autorecord": {
                    "title": {
                        "en": "Demo Autorecord",
                        "pt": "Sempre Gravar Demos"
                    }
                },
                "chat-on-demos": {
                    "title": {
                        "en": "Chat Saved on Demos",
                        "pt": "Chat Salvo nas Demos"
                    }
                },
                "demo-outlines": {
                    "title": {
                        "en": "Demo Outlines",
                        "pt": "Contornos em Demos"
                    }
                }
            }
        },
        "engine-improvements": {
            "title": {
                "en": "ENGINE IMPROVEMENTS",
                "pt": "MELHORIAS DA ENGINE"
            },
            "description": {
                "en": "Some basic improvements to make the game support more modern systems.",
                "pt": "Algumas melhorias básicas para que o jogo funcione melhor em sistemas modernos."
            },
            "sections": {
                "widescreen-support": {
                    "title": {
                        "en": "Widescreen Support",
                        "pt": "Suporte a Widescreen"
                    }
                },
                "win7-color-fix": {
                    "title": {
                        "en": "Win7 Color Fix",
                        "pt": "Correção de Cores no Win7"
                    }
                },
                "8bit-png-screenshots": {
                    "title": {
                        "en": "8bit PNG Screenshots",
                        "pt": "Screenshot em PNG de 8bits"
                    }
                }
            }
        },
        "security-improvements": {
            "title": {
                "en": "SECURITY IMPROVEMENTS",
                "pt": "MELHORIAS DE SEGURANÇA"
            },
            "description": {
                "en": "Improvements to prevent hacks and exploits.",
                "pt": "Melhorias para previnir hacks e abusos."
            },
            "sections": {
                "lock-options": {
                    "title": {
                        "en": "Lock Options",
                        "pt": "Travar Opções"
                    }
                },
                "lock-players": {
                    "title": {
                        "en": "Lock Players",
                        "pt": "Travar Jogadores"
                    }
                },
                "exploit-mode": {
                    "title": {
                        "en": "Exploit Mode",
                        "pt": "Pato Mode"
                    }
                },
                "allow-mods": {
                    "title": {
                        "en": "Allow Mods",
                        "pt": "Permitir Mods"
                    }
                }
            }
        },
        "arsenal-rebalance": {
            "title": {
                "en": "ARSENAL REBALANCE",
                "pt": "REBALANCEAMENTO DO ARSENAL"
            },
            "description": {
                "en": "Optional rebalancing of various game elements. The ideia here is to make some specific weapons and items a little bit more useful. You can enable it in the menu <pre>Netplay Options > NetFlags > Rebalanced Arsenal</pre>.",
                "pt": "Rebalanceamento opcional de varios elementos do jogo. A idéia é tornar algumas armas e items especificos um pouco mais úteis. Você pode habilitar no menu <pre>Netplay Options > NetFlags > Rebalanced Arsenal</pre>."
            },
            "sections": {
                "nightvision-full-visibility": {
                    "title": {
                        "en": "Nightvision Full Visibility",
                        "pt": "Visibilidade Máxima com Nightvision"
                    }
                },
                "faster-devastator-projectiles": {
                    "title": {
                        "en": "Faster Devastator Projectiles",
                        "pt": "Projéteis da Devastator mais Rápidos"
                    }
                },
                "freezer-speed-debuff": {
                    "title": {
                        "en": "Freezer Speed Debuff",
                        "pt": "Debuff de Velocidade da Freezer"
                    }
                },
                "boots-negates-freezer": {
                    "title": {
                        "en": "Boots Negates Freezer Debuff",
                        "pt": "Botas Negam o Debuff da Freezer"
                    }
                },
                "boots-halves-fall-damge": {
                    "title": {
                        "en": "Boots Halves Fall Damage",
                        "pt": "Botas Diminuem o Dano de Queda pela Metade"
                    }
                },
                "holoduke-triggers-autoaim": {
                    "title": {
                        "en": "Holoduke Triggers Autoaim",
                        "pt": "Holoduke Ativa a Mira Automática"
                    }
                }
            }
        },
        "restored-legacy-features": {
            "title": {
                "en": "RESTORED LEGACY FEATURES",
                "pt": "RECURSOS LEGADOS RESTAURADOS"
            },
            "description": {
                "en": "Features that were previously cut from the main game by 3D Realms.",
                "pt": "Coisas que foram originalmente cortadas do jogo pela 3D Realms."
            },
            "sections": {
                "freezer-shot-immunity": {
                    "title": {
                        "en": "Freezer Shot Immunity",
                        "pt": "Imunidade aos Projéteis de Freezer"
                    }
                },
                "destructable-cameras": {
                    "title": {
                        "en": "Destructable Cameras",
                        "pt": "Câmeras Destrutíveis"
                    }
                },
                "invisible-tripbomb-laser": {
                    "title": {
                        "en": "Invisible Tripbomb Laser",
                        "pt": "Laser das Tripbombs Invisivel"
                    }
                },
                "double-kick": {
                    "title": {
                        "en": "[1.3D] Double Kick",
                        "pt": "[1.3D] Chute Duplo"
                    }
                },
                "no-expander": {
                    "title": {
                        "en": "[1.3D] No Expander",
                        "pt": "[1.3D] Sem Expander"
                    }
                },
                "demo-cams": {
                    "title": {
                        "en": "Demo Cams",
                        "pt": "Cameras de Demo"
                    }
                }
            }
        },
        "original-bug-fixes": {
            "title": {
                "en": "ORIGINAL BUG FIXES",
                "pt": "CORREÇÕES DE BUGS ORIGINAIS"
            },
            "description": {
                "en": "Known bugs fixes from the original game (xDuke).",
                "pt": "Correção de bugs conhecidos do jogo original (xDuke)."
            },
            "sections": {
                "expander-autoaim-fix": {
                    "title": {
                        "en": "Expander Autoaim Fix",
                        "pt": "Correção da Autoaim da Expander"
                    }
                },
                "expander-frag-fix": {
                    "title": {
                        "en": "Expander Frag Fix",
                        "pt": "Correção da Pontuação da Expander"
                    }
                },
                "expander-fastswitch-fix": {
                    "title": {
                        "en": "Expander FastSwitch Fix",
                        "pt": "Correção da Troca Rápida da Expander"
                    }
                },
                "drowning-respawn-fix": {
                    "title": {
                        "en": "Drowning Respawn Fix",
                        "pt": "Correção do Renascimento de Afogamento"
                    }
                },
                "tripbomb-on-slopes-fix": {
                    "title": {
                        "en": "Tripbomb on Slopes Fix",
                        "pt": "Correção de Tripbombs em Rampas"
                    }
                },
                "screenshot-fix": {
                    "title": {
                        "en": "Screenshot Fix",
                        "pt": "Correção de Screenshots"
                    }
                },
                "friendly-fire-fix": {
                    "title": {
                        "en": "Friendly Fire Fix",
                        "pt": "Correção do Fogo Amigo"
                    }
                },
                "too-many-spawn-points-fix": {
                    "title": {
                        "en": "Too Many Spawn Points Fix",
                        "pt": "Correção da Quantidade de Pontos de Renascimento"
                    }
                },
                "insuficient-spawn-points-fix": {
                    "title": {
                        "en": "Insuficient Spawn Points Fix",
                        "pt": "Correção dos Pontos de Renascimento Insuficientes"
                    }
                },                
                "global-palette-fix": {
                    "title": {
                        "en": "Global Palette Reset Fix",
                        "pt": "Correção do Reset de Paletas Globais"
                    }
                },
                "game-crashes": {
                    "title": {
                        "en": "Game Crashes",
                        "pt": "Crashes"
                    }
                }
            }
        },
        "mapping-guide": {
            "title": {
                "en": "MAPPING GUIDE",
                "pt": "GUIA PARA CRIAR MAPAS"
            },
            "description": {
                "en": "Information for how to use produke's new features on usermaps.",
                "pt": "Informações sobre como utilizar os recursos novos do produke em usermaps."
            },
            "sections": {
                "mapping-guide-team-spawn-points": {
                    "title": {
                        "en": "Team Spawn Points",
                        "pt": "Pontos de Nascimento de Time"
                    }
                },
                "spawn-order": {
                    "title": {
                        "en": "Spawn Order",
                        "pt": "Ordem de Nascimento"
                    }
                },
                "flags": {
                    "title": {
                        "en": "Flags",
                        "pt": "Bandeiras"
                    }
                }
            }
        },
        "for-developers": {
            "title": {
                "en": "FOR DEVELOPERS",
                "pt": "PARA DESENVOLVEDORES"
            },
            "description": {
                "en": "Information for creators and developers.",
                "pt": "Informações para criadores e desenvolvedores."
            },
            "sections": {
                "command-line-arguments": {
                    "title": {
                        "en": "Command Line Arguments",
                        "pt": "Argumentos de Linha de Comando"
                    }
                }
            }
        }
    };

    // download all html parts and save in memory
    // for (const structureId of Object.keys(structures)) {
    //     for (const sectionId of Object.keys(structures[structureId].sections)) {
    //         const html = await (await fetch(`src/pages/features/${structureId}/${sectionId}.html`)).text();
    //         structures[structureId].sections[sectionId].html = html;
    //     }
    // }

    const structureEntries = Object.entries(structures);

    await Promise.all(
        structureEntries.map(async ([structureId, structure]) => {
            const sectionEntries = Object.entries(structure.sections);
            await Promise.all(
                sectionEntries.map(async ([sectionId, section]) => {
                    const res = await fetch(`src/pages/features/${structureId}/${sectionId}.html`);
                    const html = await res.text();
                    section.html = html;
                })
            );
        })
    );

    // generate menu
    document.querySelector("div#menu > ul").innerHTML = Object.keys(structures).map(structureId => `
        <li>
            <strong>
                <span lang="en">${structures[structureId].title.en}</span>
                <span lang="pt">${structures[structureId].title.pt}</span>
            </strong>
            <ul>
                ${Object.keys(structures[structureId].sections).map(sectionId => `
                    <li>
                        <a href="#${sectionId}">
                            <span lang="en">${structures[structureId].sections[sectionId].title.en}</span>
                            <span lang="pt">${structures[structureId].sections[sectionId].title.pt}</span>
                        </a>
                    </li>
                `).join("")}
            </ul>
        </li>
    `).join("");
    
    // generate sections
    document.getElementById("sections").innerHTML = Object.keys(structures).map(structureId => `
        
        <div id="${structureId}" class="content box flex-rows flex-gap-32">        
        
            <h1>
                <span lang="en">${structures[structureId].title.en}</span>
                <span lang="pt">${structures[structureId].title.pt}</span>
            </h1>

            <span lang="en">${structures[structureId].description.en}</span>
            <span lang="pt">${structures[structureId].description.pt}</span>

            <hr>

            ${Object.keys(structures[structureId].sections).map(sectionId => `
                
                <section id="${sectionId}-section">

                    <div class="flex-rows flex-gap-32">

                        <h2>
                            <span id="${sectionId}"></span>
                            <span lang="en">${structures[structureId].sections[sectionId].title.en}</span>
                            <span lang="pt">${structures[structureId].sections[sectionId].title.pt}</span>
                            <a href="#${sectionId}">#</a>
                        </h2>

                        ${structures[structureId].sections[sectionId].html}

                    </div>

                </section>

            `).join("<hr>")}

        </div>

    `).join("");

    // side menu autoscroll    
    document.body.onscroll = debounce(async e => {

        const sections = document.querySelectorAll("div.content section");

        const target = e.target.scrollingElement || document.documentElement;

        if (target.scrollTop <= 0) return;

        // by chatgpt
        const getTopMostVisibleElement = (elements) => {
            
            let topmostElement = null;
            let smallestTopOffset = Infinity;
        
            elements.forEach(element => {

                const rect = element.getBoundingClientRect();
        
                // check if the element is in the viewport
                if (rect.bottom > 51 /*my fixed header*/ && rect.top < window.innerHeight) {
                    if (rect.top < smallestTopOffset) {
                        smallestTopOffset = rect.top;
                        topmostElement = element;
                    }
                }

            });
        
            return topmostElement;

        };

        const topMostId = getTopMostVisibleElement(sections).id.replace("-section", "");

        window.history.pushState({}, null, `#${topMostId}`);

        document.querySelectorAll("div#menu li").forEach(e => e.classList.remove("highlight"));
        const li = document.querySelector(`a[href="#${topMostId}"]`).closest("li");
        li.classList.add("highlight");

        const menu = document.getElementById("menu");

        const menuHeight = menu.clientHeight;
        const itemOffsetTop = li.offsetTop;
        const itemHeight = li.clientHeight;

        const scrollTo = itemOffsetTop - (menuHeight / 2) + (itemHeight / 2);

        menu.scrollTo({
            top: scrollTo,
            behavior: "smooth"
        });

    }, 100);    

    // hack to prevent side menu scrolling from affecing body
    const menu = document.getElementById("menu");
    menu.addEventListener("wheel", function (e) {
        const atTop = menu.scrollTop === 0;
        const atBottom = menu.scrollHeight - menu.clientHeight === menu.scrollTop;    
        if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
            e.preventDefault();
        }
    }, { passive: false });

    // hack for proper anchoring after content loaded
    await sleep(1);

    // hack for proper anchoring after content loaded
    if (location.hash) {
        const hash = location.hash.slice(1);
        location.hash = "";
        location.hash = hash;
    }

};