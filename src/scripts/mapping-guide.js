window["load-mapping-guide"] = async () => {

    // menu and sections structure
    const structures = {
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
                "getting-started": {
                    "title": {
                        "en": "Getting Started",
                        "pt": "Começando"
                    }
                },
                "team-spawn-points": {
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
                    const res = await fetch(`src/pages/mapping-guide/${structureId}/${sectionId}.html`);
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