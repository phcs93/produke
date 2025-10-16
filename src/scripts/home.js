window["load-home"] = async () => {

    document.getElementById("download").onclick = () => {

        switch (document.getElementById("lang").value) {
            case "en": alert("Available soon! We are beta testing it and will release the official version in a couple of days!"); break;
            case "pt": alert("Disponível em breve! Estamos fazendo testes e já vamos lançar a versão oficial dentro de alguns dias!"); break;
        }

    };

};