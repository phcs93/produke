document.addEventListener("DOMContentLoaded", () => {

    const netflagsAcount = 28;
    const netflagsBcount = 6;
    const netflagsCcount = 12;
    const weapflagscount = 11;
    const invflagscount = 11;

    // args object that holds the set values
    const args = {
        c: { max: 10, val: 1, char: "/", side: "host" },
        s: { max: 4, val: 0, char: "/", side: "host" },
        y: { max: 99, val: 20, char: "/", side: "host" },
        k: { max: 240, val: 0, char: "/", side: "host" },
        e: { max: 9, val: 0, char: "/", side: "host" },
        q: { max: 15, val: 0, char: "/", side: "host" },
        a: { max: 1, val: 0, char: "/", side: "host" },
        teampicker: { max: 1, val: 0, char: "/", side: "host" },
        lockoptions: { max: 1, val: 0, char: "/", side: "host" },
        lockplayers: { max: 1, val: 0, char: "/", side: "host" },        
        lockspecs: { max: 1, val: 0, char: "/", side: "host" },        
        netflagsA:{ max: Array(netflagsAcount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0, char: "/", side: "host" },
        netflagsB:{ max: Array(netflagsBcount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0, char: "/", side: "host" },
        netflagsC:{ max: Array(netflagsCcount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0, char: "/", side: "host" },
        weapflags:{ max: Array(weapflagscount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0, char: "/", side: "host" },
        invflags:{ max: Array(invflagscount).fill(0).reduce((max,_,i)=>max+=1<<i,0), val: 0, char: "/", side: "host" },
        name: { max: 10, val: "produker", char: "-", side: "user"},
        color: { max: 16, val: 0, char: "-", side: "user" },
        team: { max: 4, val: 0, char: "-", side: "user" },
        r: { max: 1, val: 1, char: "/", side: "user" },
        spec: { max: 1, val: 0, char: "-", side: "user" },
        exploitmode: { max: 1, val: 0, char: "/", side: "user" },
        allowmods: { max: 1, val: 0, char: "/", side: "user" },
        disableautoaim: { max: 1, val: 0, char: "/", side: "user" }        
    };

    // converts args object to game args string
    function argsToGameArgsString() {
        const hostargs = [];
        const userargs = [];
        for (const arg of Object.keys(args)) {
            if (args[arg].val) {
                const str = `${args[arg].char}${arg}${args[arg].char === "-" ? " " : ""}${args[arg].max > 1 ? args[arg].val : ""}`;
                if (args[arg].host) {
                    hostargs.push(str);
                } else {
                    userargs.push(str);
                }
            }
        }
        document.getElementById("arguments").value = hostargs.join(" ") + userargs.join(" ");
    }

    // update args object flags based on gamemode and preset
    function updateFlags(gamemode, preset) {
        const flags = getFlags(gamemode, preset);
        for (const key in flags) {
            args[key].val = flags[key];
        }
    }

    // get values from inputs and set to args variable
    function updateArgs() {        

        for (const arg of Object.keys(args)) {

            const input = document.getElementById(arg);

            const getInputValue = () => {
                if (input) {
                    switch (true) {
                        case input.tagName.toLowerCase() === "select": return input.value;                    
                        case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "text": return input.value;
                        case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "number": return input.value;
                        case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "checkbox": return input.checked ? "1" : "0";
                    }
                } else {
                    return "0"; // this will only happen with netflags
                }
            }

            const raw = getInputValue();            
            const val = parseInt(raw);

            if (isNaN(val)) {                
                args[arg].val = raw; // just for the -name argument
            } else {
                args[arg].val = val <= 0 ? 0 : (val > args[arg].max ? args[arg].max : val);
            }

        }

        // netflags
        document.querySelectorAll(`input[type="checkbox"].flag`).forEach(e => {
            if (e.checked) {
                args[e.dataset.flag].val += parseInt(e.id.split("-")[1]);
            }
        });

    }

    // get values from args var and set to inputs
    function updateInputs() {

        for (const arg of Object.keys(args)) {

            const input = document.getElementById(arg);

            const setInputValue = v => {
                if (input) {
                    switch (true) {
                        case input.tagName.toLowerCase() === "select": input.value = v; break;    
                        case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "text": input.value = v; break;
                        case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "number": input.value = v; break;
                        case input.tagName.toLowerCase() === "input" && input.attributes.type.value === "checkbox": input.checked = v === 1; break;
                    }
                } else {
                    return; // this will only happen with netflags
                }
            }

            setInputValue(args[arg].val);

        }

        // netflags
        document.querySelectorAll(`input[type="checkbox"].flag`).forEach(e => {
            e.checked = (args[e.dataset.flag].val & parseInt(e.id.split("-")[1])) !== 0;
        });

    }

    // on input of all controls => update args
    document.querySelectorAll(".arg").forEach(e => {
        e.addEventListener("input", () => {
            updateArgs();
            argsToGameArgsString();
        });
    });

    // preset input event
    document.getElementById("preset").addEventListener("input", e => {
        updateFlags(args.c.val, e.target.value);
        updateInputs();
        argsToGameArgsString();
    });

    // gamemode input event
    document.getElementById("c").addEventListener("input", e => {
        updateFlags(parseInt(e.target.value), document.getElementById("preset").value);
        updateInputs();
        argsToGameArgsString();
    });

    // copy all arguments
    document.getElementById("copy").onclick = e => {
        navigator.clipboard.writeText(document.getElementById("arguments").value);
    };

    // set teampicker if choosing any team types
    document.getElementById("c").addEventListener("input", e => {
        if ([3,4,5,6,9].includes(parseInt(e.target.value))) {
            document.getElementById("teampicker").checked = true;            
        } else {
            document.getElementById("teampicker").checked = false;
        }
        updateArgs();
        argsToGameArgsString();
    });

    // on startup => set default values to inputs
    updateFlags(args.c.val, "classic");
    updateInputs();
    argsToGameArgsString();

});