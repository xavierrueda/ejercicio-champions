let numEquipos;
let equipos = [];
let partidosGenerados = [];
let ganadoresRondas = [];

function mostrarFormulario(num) {
    numEquipos = num;
    document.getElementById("menuPrincipal").style.display = "block";
    document.getElementById("vistaCampeonato").style.display = "none";
    equipos = [];
    ganadoresRondas = [];
    actualizarListaEquipos();
    document.getElementById("ganador").innerHTML = "";
}

function agregarEquipo() {
    const nombreEquipo = document.getElementById("nombreEquipo").value.trim();

    if (nombreEquipo !== "" && equipos.length < numEquipos) {
        equipos.push(nombreEquipo);
        actualizarListaEquipos();
        document.getElementById("nombreEquipo").value = "";
    }
}

function actualizarListaEquipos() {
    document.getElementById("listaEquipos").innerHTML = `Teams (${equipos.length}/${numEquipos})`;
    for (let i = 0; i < equipos.length; i++) {
        document.getElementById("listaEquipos").innerHTML += `<br>${equipos[i]}`;
    }
}

function iniciarCampeonato() {
    if (equipos.length === numEquipos) {
        localStorage.setItem("equipos", JSON.stringify(equipos));
        localStorage.setItem("numEquipos", numEquipos);

        document.getElementById("menuPrincipal").style.display = "none";
        document.getElementById("vistaCampeonato").style.display = "block";

        generarPartidosIniciales();
    }
}

function generarPartidosIniciales() {
    const partidosDiv = document.getElementById("partidos");
    partidosDiv.innerHTML = "";
    partidosGenerados = [];
    ganadoresRondas = [];

    if (numEquipos === 8) {
        ganadoresRondas[0] = generarRonda(equipos, 4, partidosDiv, "Quarter-finals");
        generarRondaEnBlanco(2, partidosDiv, "Semi-finals", ganadoresRondas[0]);
        generarRondaEnBlanco(1, partidosDiv, "Final", ganadoresRondas[1]);
    } else if (numEquipos === 16) {
        ganadoresRondas[0] = generarRonda(equipos, 8, partidosDiv, "Round of 16");
        generarRondaEnBlanco(4, partidosDiv, "Quarter-finals", ganadoresRondas[0]);
        generarRondaEnBlanco(2, partidosDiv, "Semi-finals", ganadoresRondas[1]);
        generarRondaEnBlanco(1, partidosDiv, "Final", ganadoresRondas[2]);
    }
    document.getElementById("ganador").innerHTML = "";
}

function generarPartidosFinales() {
    const partidosDiv = document.getElementById("partidos");
    partidosDiv.innerHTML = "";

    let ganadorTorneo = "";
    let equiposRonda = equipos.slice();

    if (numEquipos === 8) {
        ganadoresRondas[1] = generarRonda(ganadoresRondas[0], 2, partidosDiv, "Semi-finals");
        ganadorTorneo = generarRonda(ganadoresRondas[1], 1, partidosDiv, "Final")[0];
    } else if (numEquipos === 16) {
        ganadoresRondas[1] = generarRonda(ganadoresRondas[0], 4, partidosDiv, "Quarter-finals");
        ganadoresRondas[2] = generarRonda(ganadoresRondas[1], 2, partidosDiv, "Semi-finals");
        ganadorTorneo = generarRonda(ganadoresRondas[2], 1, partidosDiv, "Final")[0];
    }

    document.getElementById("ganador").innerHTML = `Ganador del Torneo: ${ganadorTorneo}`;
}

function generarRonda(equiposRonda, numPartidos, partidosDiv, nombreRonda) {
    const rondaDiv = document.createElement("div");
    rondaDiv.classList.add("ronda");
    rondaDiv.innerHTML = `<h3>${nombreRonda}</h3>`;

    let ganadoresRonda = [];

    for (let i = 0; i < numPartidos; i++) {
        const partidoDiv = document.createElement("div");
        partidoDiv.classList.add("partido");
        partidoDiv.innerHTML = `${equiposRonda[i * 2]} vs ${equiposRonda[i * 2 + 1]}`;
        rondaDiv.appendChild(partidoDiv);
        partidosGenerados.push(`${equiposRonda[i * 2]} vs ${equiposRonda[i * 2 + 1]}`);

        const ganador = Math.random() < 0.5 ? equiposRonda[i * 2] : equiposRonda[i * 2 + 1];
        ganadoresRonda.push(ganador);
        partidoDiv.innerHTML += `<br>Ganador: ${ganador}`;
    }

    partidosDiv.appendChild(rondaDiv);
    return ganadoresRonda;
}

function generarRondaEnBlanco(numPartidos, partidosDiv, nombreRonda, equiposRonda = []) {
    const rondaDiv = document.createElement("div");
    rondaDiv.classList.add("ronda");
    rondaDiv.innerHTML = `<h3>${nombreRonda}</h3>`;

    for (let i = 0; i < numPartidos; i++) {
        const partidoDiv = document.createElement("div");
        partidoDiv.classList.add("partido");
        if (equiposRonda.length > 0) {
            partidoDiv.innerHTML = `${equiposRonda[i * 2]} vs ${equiposRonda[i * 2 + 1]}`;
        } else {
            partidoDiv.innerHTML = "vs"; // Cuadro vacío
        }
        rondaDiv.appendChild(partidoDiv);
    }

    partidosDiv.appendChild(rondaDiv);
}

function simularCampeonato() {
    generarPartidosFinales();
}

function resetearVista() {
    document.getElementById("vistaCampeonato").style.display = "none";
    document.getElementById("menuPrincipal").style.display = "block";
    equipos = [];
    localStorage.removeItem("equipos");
    localStorage.removeItem("numEquipos");
    document.getElementById("ganador").innerHTML = "";
}

if (localStorage.getItem("equipos")) {
    equipos = JSON.parse(localStorage.getItem("equipos"));
    numEquipos = parseInt(localStorage.getItem("numEquipos"));
    document.getElementById("menuPrincipal").style.display = "none";
    document.getElementById("vistaCampeonato").style.display = "block";
    generarPartidosIniciales();
}

document.getElementById("nombreEquipo").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        agregarEquipo();
    }
});

