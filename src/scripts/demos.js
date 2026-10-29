document.addEventListener("DOMContentLoaded", async () => {

    const demosDatabaseUrl = "https://raw.githubusercontent.com/produke3d/archives/master/demos.gzip";
    //const demosDatabaseUrl = "https://cdn.jsdelivr.net/gh/produke3d/archives@master/demos.gzip";

    const gzipBytes = await (await fetch(demosDatabaseUrl)).arrayBuffer();
    const stream = new Blob([gzipBytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    const demoDatabase = JSON.parse(await new Response(stream).text());

    const trs = [];
    
    const isTeamMode = mode => [2,3,4,5,8].includes(mode);

    const GameMode = {
        DM: 0,
        COOP: 1,
        TDM: 2,
        CTF: 3,
        ONEFCTF: 4,
        ADCTF: 5,
        SURV: 6,
        LMS: 7,
        TLMS: 8,
        TERM: 9
    };

    const flagWinners = demo => {

        const durationInSeconds = demo.Tics / 26;
        const durationInMinutes = durationInSeconds / 60;

        switch (demo.Mode) {

            case GameMode.DM: case GameMode.TERM: {

                let goal = demo.ScoreLimit;

                if (demo.TimeLimit && durationInMinutes >= demo.TimeLimit) {
                    goal = demo.Players.max(p => p.Score);
                }

                for (const player of demo.Players) {
                    if (player.Score >= goal) {
                        player.Winner = true;
                    }
                }

                break;

            }

            case GameMode.LMS: {

                for (const player of demo.Players) {
                    if (player.Score >= 0) {
                        player.Winner = true;
                    }
                }

                break;

            }

            case GameMode.TDM: case GameMode.CTF: case GameMode.ONEFCTF: case GameMode.ADCTF: {

                const scoresByTeam = demo.Players.reduce((a, p) => {
                    if (!a[p.Team]) a[p.Team] = 0;
                    a[p.Team] += p.Score;
                    return a;
                }, []);

                let goal = demo.ScoreLimit;

                if (demo.TimeLimit && durationInMinutes >= demo.TimeLimit) {
                    goal = scoresByTeam.max(s => s);
                }

                for (const player of demo.Players) {
                    if (scoresByTeam[player.Team] >= goal) {
                        player.Winner = true;
                    }
                }

                break;

            }
            
            case GameMode.TLMS: {

                for (const player of demo.Players) {
                    if (player.Score >= 0) {
                        player.Winner = true;
                    }
                }

                break;

            }
            
        }

    };

    const gameModeDictionary = Object.keys(GameMode).reduce((dic, key) => {
        dic[GameMode[key]] = key;
        return dic;
    }, []);

    const getMap = demo => {
        if (demo.Volume === 0 && demo.Level === 7) {
            return demo.Map.toUpperCase().replace(".MAP", "");
        } else {
            return `E${demo.Volume+1}L${demo.Level+1}`;
        }
    };

    const getPlayers = demo => {

        const getPlayer = p => {
            let attr = "";
            if (isTeamMode(demo.Mode)) {
                attr = `data-team="${p.Team}"`;
            } else {
                attr = `data-color="${p.Id}"`;
            }
            return `
                <div class="flex-row flex-no-wrap flex-justify-content-end flex-gap-4" ${attr}>
                    <span>${p.Name}</span>
                    <span>[${p.Score}]</span>
                </div>
            `;            
        };

        let players = [];

        if (isTeamMode(demo.Mode)) {
            players = demo.Players.sort((a,b) => a.Team - b.Team).map(p => getPlayer(p));
        } else {
            players = demo.Players.sort((a,b) => a.Id - b.Id).map(p => getPlayer(p));
        }

        return `
            <div class="grid">${players.join("")}</div>
        `;

    };

    for (const demo of demoDatabase) {
        flagWinners(demo);
        trs.push(`
            <tr>
                <td>${demo.StartDateTime.replace(" ", "<br>")}</td>
                <td>${gameModeDictionary[demo.Mode]}</td>
                <td>${getMap(demo)}</td>
                <td>${getPlayers(demo)}</td>
                <td>${demo.Duration}</td>
            </tr>
        `);
    }

    document.querySelector("table#demos > tbody").insertAdjacentHTML("afterbegin", trs.join(""));

});