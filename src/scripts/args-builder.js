window["load-args-builder"] = async () => {
    
    const page = new URLSearchParams(document.location.search).get("p");

    const netflagsAcount = 26;
    const netflagsBcount = 6;
    const netflagsCcount = 7;
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
        const urlParams = Object.keys(args).map(arg => `${arg}=${args[arg].val}`).join("&");
        window.history.pushState({}, null, `?p=${page}&${urlParams}`);
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
        const flags = netflagsPresets[e.target.value];
        setFlagsInCheckboxes(flags);        
        for (const id of Object.keys(flags)) {
            document.getElementById(id).value = flags[id];
        }
        getArgsFromInputs();
        setArgsInUrlParams();
        setArgsOnText();
    };

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
        const flags = netflagsPresets["classic"];
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