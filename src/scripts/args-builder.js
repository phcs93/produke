window["load-args-builder"] = async () => {
    
    const page = new URLSearchParams(document.location.search).get("p");

    const netflagsPresets = {
        "---": {
            "netflagsA": 0,
            "netflagsB": 0,
            "netflagsC": 0,
            "weapflags": 0,
            "invflags": 0
        },
        "classic": {
            "netflagsA": 398332,
            "netflagsB": 1,
            "netflagsC": 0,
            "weapflags": 0,
            "invflags": 0
        },
        "teamplay": {
            "netflagsA": 54004732,
            "netflagsB": 0,
            "netflagsC": 0,
            "weapflags": 0,
            "invflags": 0
        },
        "rebalanced": {
            "netflagsA": 50933756,
            "netflagsB": 6,
            "netflagsC": 1,
            "weapflags": 0,
            "invflags": 0
        },
        "hardcore": {
            "netflagsA": 63370220,
            "netflagsB": 15,
            "netflagsC": 42,
            "weapflags": 0,
            "invflags": 0
        },
        "overpowered": {
            "netflagsA": 3747708,
            "netflagsB": 0,
            "netflagsC": 20,
            "weapflags": 2047,
            "invflags": 2047
        }
    };

    const netflagsAcount = 26;
    const netflagsBcount = 4;
    const netflagsCcount = 6;
    const weapflagscount = 11;
    const invflagscount = 11;

    const metadata = {
        "game-mode": 10,
        netflagsA:{
            max: Array(netflagsAcount).fill(0).reduce((max,_,i)=>max+=1<<i,0)
        },
        netflagsB:{
            max: Array(netflagsBcount).fill(0).reduce((max,_,i)=>max+=1<<i,0)
        },
        netflagsC:{
            max: Array(netflagsCcount).fill(0).reduce((max,_,i)=>max+=1<<i,0)
        },
        weapflags:{
            max: Array(weapflagscount).fill(0).reduce((max,_,i)=>max+=1<<i,0)
        },
        invflags:{
            max: Array(invflagscount).fill(0).reduce((max,_,i)=>max+=1<<i,0)
        }
    };

    function getArgsFromUrlParams() {

        const params = new URLSearchParams(document.location.search);

        return Object.keys(metadata).reduce((obj, arg) => {            
            const val = parseInt(params.get(arg) || "0");
            obj[arg] = val > metadata[arg].max ? 0 : val;
            return obj;
        }, {});

    }

    function setArgsInUrlParams(args) {
        const urlParams = Object.keys(args).map(arg => `${arg}=${args[arg]}`).join("&");
        window.history.pushState({}, null, `?p=${page}&${urlParams}`);
    }

    function getArgsFromCheckboxes () {
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

    function setArgsInCheckboxes (args) {

        document.querySelectorAll(`input[type="checkbox"]`).forEach(e => {
            e.checked = false;
        });

        for (let i = 0; i < netflagsAcount; i++) {
            const flag = (1 << i);
            if ((flag & args.netflagsA) === flag) {
                document.getElementById(`netflagA-${flag}`).checked = true;
            }
        }
        for (let i = 0; i < netflagsBcount; i++) {
            const flag = (1 << i);
            if ((flag & args.netflagsB) === flag) {
                document.getElementById(`netflagB-${flag}`).checked = true;
            }
        }
        for (let i = 0; i < netflagsCcount; i++) {
            const flag = (1 << i);
            if ((flag & args.netflagsC) === flag) {
                document.getElementById(`netflagC-${flag}`).checked = true;
            }
        }

        for (let i = 0; i < weapflagscount; i++) {
            const flag = (1 << i);
            if ((flag & args.weapflags) === flag) {
                document.getElementById(`weapflag-${flag}`).checked = true;
            }
        }

        for (let i = 0; i < invflagscount; i++) {
            const flag = (1 << i);
            if ((flag & args.invflags) === flag) {
                document.getElementById(`invflag-${flag}`).checked = true;
            }
        }

    }

    function getArgsFromTextboxes () {
        const netflagsAtext = document.getElementById("netflagsA").value;
        const netflagsBtext = document.getElementById("netflagsB").value;
        const netflagsCtext = document.getElementById("netflagsC").value;
        const weapflagstext = document.getElementById("weapflags").value;
        const invflagstext = document.getElementById("invflags").value;
        const netflagsARegex = /(?<=\/netflagsA)\d*/g;
        const netflagsBRegex = /(?<=\/netflagsB)\d*/g;
        const netflagsCRegex = /(?<=\/netflagsC)\d*/g;
        const weapflagsRegex = /(?<=\/weapflags)\d*/g;
        const invflagsRegex = /(?<=\/invflags)\d*/g;
        let netflagsA = parseInt(netflagsAtext.match(netflagsARegex)[0]);
        let netflagsB = parseInt(netflagsBtext.match(netflagsBRegex)[0]);
        let netflagsC = parseInt(netflagsCtext.match(netflagsCRegex)[0]);
        let weapflags = parseInt(weapflagstext.match(weapflagsRegex)[0]);
        let invflags = parseInt(invflagstext.match(invflagsRegex)[0]);
        netflagsA = !netflagsA || netflagsA > maxnetflagsA ? 0 : netflagsA;
        netflagsB = !netflagsB || netflagsB > maxnetflagsB ? 0 : netflagsB;
        netflagsC = !netflagsC || netflagsC > maxnetflagsC ? 0 : netflagsC;
        weapflags = !weapflags || weapflags > maxweapflags ? 0 : weapflags;
        invflags = !invflags || invflags > maxinvflags ? 0 : invflags;
        return {netflagsA,netflagsB,netflagsC,weapflags,invflags};
    }

    function setArgsInTextboxes (args) {    
        document.getElementById("netflagsA").value = `/netflagsA${args.netflagsA}`;
        document.getElementById("netflagsB").value = `/netflagsB${args.netflagsB}`;
        document.getElementById("netflagsC").value = `/netflagsC${args.netflagsC}`;
        document.getElementById("weapflags").value = `/weapflags${args.weapflags}`;
        document.getElementById("invflags").value = `/invflags${args.invflags}`;
    }

    function getPresetMatch(args) {
        for (const preset of Object.keys(presets)) {
            if (Object.keys(presets[preset]).every(key => presets[preset][key] === args[key])) {
                return preset;
            }
        }
        return null;
    }

    // first loading (url input)
    let argsFromUrlParams = getArgsFromUrlParams();

    // if all args are zero => load classic preset
    if (Object.values(argsFromUrlParams).every(v => !v)) {
        argsFromUrlParams = presets["classic"];
        document.getElementById("presets").value = "classic";
    } else {
        // if args match any preset => set that preset
        const match = getPresetMatch(argsFromUrlParams);
        if (match) {
            document.getElementById("presets").value = match;
        } else {
            document.getElementById("presets").value = "custom";
        }
    }

    setArgsInUrlParams(argsFromUrlParams);
    setArgsInCheckboxes(argsFromUrlParams);
    setArgsInTextboxes(argsFromUrlParams);

    // checkbox input
    document.querySelectorAll(`input[type="checkbox"]`).forEach(e => {
        e.onchange = () => {
            const args = getArgsFromCheckboxes();
            setArgsInTextboxes(args);
            setArgsInUrlParams(args);    
        }
    });

    // textbox input
    document.querySelectorAll(`input[type="text"]`).forEach(e => {
        e.oninput = () => {
            const args = getArgsFromTextboxes();
            setArgsInCheckboxes(args);
            setArgsInUrlParams(args);   
        }
    });

    // preset input
    document.getElementById("presets").onchange = e => {
        if (e.target.value === "custom") return;
        const args = netflagsPresets[e.target.value];
        setArgsInUrlParams(args);
        setArgsInCheckboxes(args);
        setArgsInTextboxes(args);
    };

    // copy all arguments
    document.getElementById("copy").onclick = e => {
        const args = getArgsFromUrlParams();
        const text = Object.keys(args).map(a => args[a] > 0 ? `/${a}${args[a]}` : null);
        navigator.clipboard.writeText(text.filter(v => v).join(" "));
    };

};