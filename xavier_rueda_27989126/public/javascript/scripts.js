let numEquipos;
let equipos = [];
let partidosGenerados = [];
let ganadoresRondas = [];
let rondaActual = 0; // Agregamos una variable para rastrear la ronda actual

function mostrarFormulario(num) {
    numEquipos = num;
    document.getElementById("menuPrincipal").style.display = "block";
    document.getElementById("vistaCampeonato").style.display = "none";
    equipos = [];
    ganadoresRondas = [];
    rondaActual = 0; // Reiniciamos la ronda actual
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

        // Mostrar solo los equipos participantes
        const partidosDiv = document.getElementById("partidos");
        partidosDiv.innerHTML = "<h3>Equipos Participantes</h3>";
        equipos.forEach(equipo => {
            partidosDiv.innerHTML += `<p>${equipo}</p>`;
        });

        // Agregar el botón "Jugar Ronda"
        const jugarRondaBtn = document.createElement("button");
        jugarRondaBtn.textContent = "Jugar Ronda";
        jugarRondaBtn.onclick = jugarRonda;
        partidosDiv.appendChild(jugarRondaBtn);

        // Agregar el botón "Volver al Menú Principal"
        const volverMenuBtn = document.createElement("button");
        volverMenuBtn.textContent = "Volver al Menú Principal";
        volverMenuBtn.onclick = volverAlMenuPrincipal;
        partidosDiv.appendChild(volverMenuBtn);
    }
}

function jugarRonda() {
    const partidosDiv = document.getElementById("partidos");
    partidosDiv.innerHTML = ""; // Limpiamos los partidos anteriores

    let nombreRonda = "";

    if (numEquipos === 16) {
        if (rondaActual === 0) {
            nombreRonda = "Round of 16";
        } else if (rondaActual === 1) {
            nombreRonda = "Quarter-finals";
        } else if (rondaActual === 2) {
            nombreRonda = "Semi-finals";
        } else if (rondaActual === 3) {
            nombreRonda = "Final";
        }
    } else if (numEquipos === 8) {
        if (rondaActual === 0) {
            nombreRonda = "Quarter-finals";
        } else if (rondaActual === 1) {
            nombreRonda = "Semi-finals";
        } else if (rondaActual === 2) {
            nombreRonda = "Final";
        }
    }

    if (nombreRonda === "Final") {
        const ganadorTorneo = generarRonda(ganadoresRondas[rondaActual - 1], 1, partidosDiv, nombreRonda)[0];
        document.getElementById("ganador").innerHTML = `<h1>Ganador del Torneo: ${ganadorTorneo}</h1>`;
        return; // Detenemos la ejecución después de la final
    }

    ganadoresRondas[rondaActual] = generarRonda(rondaActual === 0 ? equipos : ganadoresRondas[rondaActual - 1], numEquipos / Math.pow(2, rondaActual), partidosDiv, nombreRonda);

    rondaActual++;

    // Agregar el botón "Pasar a la siguiente fase del torneo"
    const siguienteRondaBtn = document.createElement("button");
    siguienteRondaBtn.textContent = "Pasar a la siguiente fase del torneo";
    siguienteRondaBtn.onclick = jugarRonda;
    partidosDiv.appendChild(siguienteRondaBtn);

    // Agregar el botón "Volver al Menú Principal"
    const volverMenuBtn = document.createElement("button");
    volverMenuBtn.textContent = "Volver al Menú Principal";
    volverMenuBtn.onclick = volverAlMenuPrincipal;
    partidosDiv.appendChild(volverMenuBtn);
}

function generarRonda(equiposRonda, numPartidos, partidosDiv, nombreRonda) {
    const rondaDiv = document.createElement("div");
    rondaDiv.classList.add("ronda");
    rondaDiv.innerHTML = `<h3>${nombreRonda}</h3>`;

    let ganadoresRonda = [];

    // Aseguramos que solo se generen los partidos necesarios
    const partidosGeneradosRonda = Math.min(numPartidos, equiposRonda.length / 2);

    for (let i = 0; i < partidosGeneradosRonda; i++) {
        const partidoDiv = document.createElement("div");
        partidoDiv.classList.add("partido");
        partidoDiv.innerHTML = `${equiposRonda[i * 2]} vs ${equiposRonda[i * 2 + 1]}`;
        rondaDiv.appendChild(partidoDiv);
        partidosGenerados.push(`${equiposRonda[i * 2]} vs ${equiposRonda[i * 2 + 1]}`);

        const ganador = Math.random() < 0.5 ? equiposRonda[i * 2] : equiposRonda[i * 2 + 1];
        ganadoresRonda.push(ganador);
        partidoDiv.innerHTML += `<br>Ganador: <b>${ganador}</b>`; // Aplicamos negrita al ganador
    }

    partidosDiv.appendChild(rondaDiv);
    return ganadoresRonda;
}

function resetearVista() {
    // Limpiar los partidos generados y mostrar solo los equipos participantes
    const partidosDiv = document.getElementById("partidos");
    partidosDiv.innerHTML = "<h3>Equipos Participantes</h3>";
    equipos.forEach(equipo => {
        partidosDiv.innerHTML += `<p>${equipo}</p>`;
    });
    document.getElementById("ganador").innerHTML = "";

    // Volver a agregar el botón "Jugar Ronda"
    const jugarRondaBtn = document.createElement("button");
    jugarRondaBtn.textContent = "Jugar Ronda";
    jugarRondaBtn.onclick = jugarRonda;
    partidosDiv.appendChild(jugarRondaBtn);

    // Agregar el botón "Volver al Menú Principal"
    const volverMenuBtn = document.createElement("button");
    volverMenuBtn.textContent = "Volver al Menú Principal";
    volverMenuBtn.onclick = volverAlMenuPrincipal;
    partidosDiv.appendChild(volverMenuBtn);

    rondaActual = 0; // Restablecemos la ronda actual a 0
}

function volverAlMenuPrincipal() {
    document.getElementById("vistaCampeonato").style.display = "none";
    document.getElementById("menuPrincipal").style.display = "block";
    equipos = [];
    ganadoresRondas = [];
    rondaActual = 0; // Reiniciamos la ronda actual
    localStorage.removeItem("equipos");
    localStorage.removeItem("numEquipos");
    document.getElementById("ganador").innerHTML = "";
}

if (localStorage.getItem("equipos")) {
    equipos = JSON.parse(localStorage.getItem("equipos"));
    numEquipos = parseInt(localStorage.getItem("numEquipos"));
    document.getElementById("menuPrincipal").style.display = "none";
    document.getElementById("vistaCampeonato").style.display = "block";

    // Mostrar solo los equipos participantes
    const partidosDiv = document.getElementById("partidos");
    partidosDiv.innerHTML = "<h3>Equipos Participantes</h3>";
    equipos.forEach(equipo => {
        partidosDiv.innerHTML += `<p>${equipo}</p>`;
    });

    // Agregar el botón "Jugar Ronda"
    const jugarRondaBtn = document.createElement("button");
    jugarRondaBtn.textContent = "Jugar Ronda";
    jugarRondaBtn.onclick = jugarRonda;
    partidosDiv.appendChild(jugarRondaBtn);

    // Agregar el botón "Volver al Menú Principal"
    const volverMenuBtn = document.createElement("button");
    volverMenuBtn.textContent = "Volver al Menú Principal";
    volverMenuBtn.onclick = volverAlMenuPrincipal;
    partidosDiv.appendChild(volverMenuBtn);
}

document.getElementById("nombreEquipo").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        agregarEquipo();
    }
});