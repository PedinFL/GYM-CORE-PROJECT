// Seleciona todos os botões do menu
const menuItems = document.querySelectorAll(".menu-item");

// Seleciona todas as telas
const pages = document.querySelectorAll(".page");

// Seleciona o título do cabeçalho
const pageTitle = document.querySelector("#page-title");


// Percorre os botões do menu
menuItems.forEach(function(item) {

    item.addEventListener("click", function() {

        // Identifica a tela selecionada
        const selectedPage = item.dataset.view;

        // Esconde todas as telas
        pages.forEach(function(page) {
            page.hidden = true;
        });

        // Mostra a tela selecionada
        document.getElementById(selectedPage).hidden = false;

        // Remove o destaque dos botões
        menuItems.forEach(function(button) {
            button.classList.remove("active");
        });

        // Destaca o botão selecionado
        item.classList.add("active");

        // Atualiza o título
        pageTitle.textContent = item.textContent.trim();

        if (selectedPage === "painel"){

            updateDashboard();
            updateCheckpointDashboard();
            updateDashboardSummaries();

        }

        if (selectedPage === "evolucao"){
            renderWeightChart();
        }

    });

});
// FORMULÁRIO DE PERFIL

const profileForm = document.querySelector("#profile-form");

const profileMessage = document.querySelector("#profile-message");


// Salvar perfil
profileForm.addEventListener("submit", function(event) {

    // Impede o recarregamento da página
    event.preventDefault();

    // Captura os valores dos campos
    const profile = {

        nome: document.querySelector("#nome").value,
        idade: document.querySelector("#idade").value,
        sexo: document.querySelector("#sexo").value,

        altura: document.querySelector("#altura").value,
        peso: document.querySelector("#peso").value,

        tempoTreino: document.querySelector("#tempo-treino").value,
        objetivo: document.querySelector("#objetivo").value

    };

    // Transforma o objeto em texto JSON
    const profileJSON = JSON.stringify(profile);

    // Armazena os dados no navegador
    localStorage.setItem("gymCoreProfile", profileJSON);
    updateDashboard();

    // Exibe confirmação
    profileMessage.textContent = "Perfil salvo com sucesso!";

});


// Recuperar perfil salvo
function loadProfile() {

    const savedProfile = localStorage.getItem("gymCoreProfile");

    // Verifica se existe um perfil armazenado
    if (savedProfile === null) {
        return;
    }

    // Converte o JSON em objeto JavaScript
    const profile = JSON.parse(savedProfile);

    // Preenche os campos
    document.querySelector("#nome").value = profile.nome;
    document.querySelector("#idade").value = profile.idade;
    document.querySelector("#sexo").value = profile.sexo;

    document.querySelector("#altura").value = profile.altura;
    document.querySelector("#peso").value = profile.peso;

    document.querySelector("#tempo-treino").value = profile.tempoTreino;
    document.querySelector("#objetivo").value = profile.objetivo;

}


// Executa ao abrir o sistema
loadProfile();

function updateDashboard() {

    // Recupera o perfil armazenado
    const savedProfile = localStorage.getItem("gymCoreProfile");

    // Verifica se existe um cadastro
    if (savedProfile === null) {

        document.querySelector("#welcome-name").textContent =
            "Bem-vindo ao GYM CORE!";

        document.querySelector("#welcome-goal").textContent =
            "Cadastre seu perfil para começar.";

        document.querySelector("#dashboard-weight").textContent =
            "-- kg";

        return;
    }

    // Converte os dados armazenados em objeto
    const profile = JSON.parse(savedProfile);

    // Atualiza a saudação
    document.querySelector("#welcome-name").textContent =
        `Olá, ${profile.nome}!`;

    // Atualiza o objetivo
    document.querySelector("#welcome-goal").textContent =
        `Seu objetivo atual: ${profile.objetivo}.`;

    // Atualiza o peso
    document.querySelector("#dashboard-weight").textContent =
        `${profile.peso} kg`;

}


// Atualiza o painel ao abrir o sistema
updateDashboard();

// MÓDULO DE TREINAMENTOS

const workoutForm = document.querySelector("#workout-form");

let editingWorkoutId = null;

const workoutList = document.querySelector("#workout-list");

const workoutMessage = document.querySelector("#workout-message");




// Recupera os exercícios salvos
function getWorkouts() {

    const savedWorkouts = localStorage.getItem("gymCoreWorkouts");

    return savedWorkouts ? JSON.parse(savedWorkouts) : [];

}


// Salva os exercícios
function saveWorkouts(workouts) {

    localStorage.setItem(
        "gymCoreWorkouts",
        JSON.stringify(workouts)
    );

}


// Adiciona um exercício
workoutForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const workout = {

        divisao: document.querySelector("#divisao").value,
        grupo: document.querySelector("#grupo-muscular").value,
        exercicio: document.querySelector("#exercicio").value.trim(),
        series: Number(document.querySelector("#series").value),
        repeticoes: Number(document.querySelector("#repeticoes").value),
        carga: Number(document.querySelector("#carga").value)

    };

    const workouts = getWorkouts();

    if (editingWorkoutId !== null) {

        // Atualiza o exercício existente
        const updatedWorkouts = workouts.map(function(item) {

            if (item.id === editingWorkoutId) {

                return {
                    ...workout,
                    id: item.id
                };

            }

            return item;

        });

        saveWorkouts(updatedWorkouts);

        workoutMessage.textContent = "Exercício atualizado!";

    } else {

        // Cadastra um novo exercício
        workout.id = Date.now();

        workouts.push(workout);

        saveWorkouts(workouts);

        workoutMessage.textContent = "Exercício adicionado!";

    }

    // Finaliza o processo de edição
    editingWorkoutId = null;

    workoutForm.reset();

    document.querySelector("#carga").value = "0";

    document.querySelector("#workout-submit").textContent =
        "Adicionar exercício";

    renderWorkouts();

});


// Exibe os exercícios na tela
function renderWorkouts() {

    const workouts = getWorkouts();

    workoutList.replaceChildren();

    if (workouts.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        message.textContent = "Nenhum exercício cadastrado.";

        workoutList.appendChild(message);

        return;

    }

    // Agrupa os exercícios por divisão
    const divisions = {};

    workouts.forEach(function(workout) {

        if (!divisions[workout.divisao]) {

            divisions[workout.divisao] = [];

        }

        divisions[workout.divisao].push(workout);

    });


    // Percorre as divisões
    Object.keys(divisions).forEach(function(division) {

        const group = document.createElement("div");

        group.className = "workout-group";

        const title = document.createElement("h3");

        title.textContent = division;

        group.appendChild(title);


        // Percorre os exercícios da divisão
        divisions[division].forEach(function(workout) {

            const exercise = document.createElement("div");

            exercise.className = "workout-exercise";


            const information = document.createElement("div");

            const name = document.createElement("strong");

            name.textContent = workout.exercicio;

            const details = document.createElement("p");

            details.textContent =
                `${workout.grupo} | ${workout.series} séries × ` +
                `${workout.repeticoes} repetições | ${workout.carga} kg`;


            information.appendChild(name);

            information.appendChild(details);


            // Botão de edição
const editButton = document.createElement("button");

editButton.type = "button";
editButton.className = "btn-edit";
editButton.textContent = "Editar";

editButton.addEventListener("click", function() {
    editWorkout(workout.id);
});


// Botão de exclusão
const deleteButton = document.createElement("button");

deleteButton.type = "button";
deleteButton.className = "btn-delete";
deleteButton.textContent = "Excluir";

deleteButton.addEventListener("click", function() {
    deleteWorkout(workout.id);
});


// Agrupamento dos botões
const actions = document.createElement("div");

actions.className = "workout-actions";

actions.appendChild(editButton);
actions.appendChild(deleteButton);


// Montagem do exercício
exercise.appendChild(information);
exercise.appendChild(actions);

group.appendChild(exercise);

});


        workoutList.appendChild(group);

    });

}


// Exclui um exercício
function deleteWorkout(id) {

    const workouts = getWorkouts();

    const updatedWorkouts = workouts.filter(function(workout) {

        return workout.id !== id;

    });

    saveWorkouts(updatedWorkouts);

    renderWorkouts();

}


// Carrega os exercícios ao abrir o sistema
renderWorkouts();

    // EDITAR EXERCÍCIO

function editWorkout(id) {

    const workouts = getWorkouts();

    const workout = workouts.find(function(item) {

        return item.id === id;

    });

    if (!workout) {
        return;
    }

    // Preenche o formulário
    document.querySelector("#divisao").value = workout.divisao;

    document.querySelector("#grupo-muscular").value = workout.grupo;

    document.querySelector("#exercicio").value = workout.exercicio;

    document.querySelector("#series").value = workout.series;

    document.querySelector("#repeticoes").value = workout.repeticoes;

    document.querySelector("#carga").value = workout.carga;

    // Guarda o identificador do exercício
    editingWorkoutId = id;

    // Altera o texto do botão
    document.querySelector("#workout-submit").textContent =
        "Salvar alterações";

    // Posiciona a tela no formulário
    workoutForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}
// ======================================
// MÓDULO CHECKPOINT DIÁRIO
// ======================================

const checkpointForm = document.querySelector("#checkpoint-form");
const checkpointList = document.querySelector("#checkpoint-list");
const checkpointMessage = document.querySelector("#checkpoint-message");
const checkpointSubmit = document.querySelector("#checkpoint-submit");

let editingCheckpointId = null;


// Define a data atual no formulário
function setCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    document.querySelector("#checkpoint-date").value =
        `${year}-${month}-${day}`;
}

setCurrentDate();


// Recupera os registros salvos
function getCheckpoints() {
    const savedCheckpoints = localStorage.getItem("gymCoreCheckpoints");

    return savedCheckpoints ? JSON.parse(savedCheckpoints) : [];
}


// Salva os registros
function saveCheckpoints(checkpoints) {
    localStorage.setItem(
        "gymCoreCheckpoints",
        JSON.stringify(checkpoints)
    );
}


// Cadastra ou atualiza um registro
checkpointForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const checkpoint = {
        data: document.querySelector("#checkpoint-date").value,
        sono: Number(document.querySelector("#checkpoint-sleep").value),
        agua: Number(document.querySelector("#checkpoint-water").value),
        energia: document.querySelector("#checkpoint-energy").value,
        treinamento: document.querySelector("#checkpoint-training").value,
        observacoes: document.querySelector("#checkpoint-notes").value.trim()
    };

    const checkpoints = getCheckpoints();

    if (editingCheckpointId !== null) {

        const updatedCheckpoints = checkpoints.map(function(item) {

            if (item.id === editingCheckpointId) {
                return {
                    ...checkpoint,
                    id: item.id
                };
            }

            return item;

        });

        saveCheckpoints(updatedCheckpoints);

        checkpointMessage.textContent = "Registro atualizado!";

    } else {

        checkpoint.id = Date.now();

        checkpoints.push(checkpoint);

        saveCheckpoints(checkpoints);

        checkpointMessage.textContent = "Registro salvo com sucesso!";

    }

    editingCheckpointId = null;

    checkpointForm.reset();

    checkpointSubmit.textContent = "Salvar registro";

    setCurrentDate();

    renderCheckpoints();

    updateCheckpointDashboard();

});


// Exibe o histórico na tela
function renderCheckpoints() {

    const checkpoints = getCheckpoints();

    checkpointList.replaceChildren();

    if (checkpoints.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";
        message.textContent = "Nenhum registro diário encontrado.";

        checkpointList.appendChild(message);

        return;
    }

    // Organiza os registros do mais recente para o mais antigo
    checkpoints.sort(function(a, b) {
        return b.data.localeCompare(a.data);
    });

    checkpoints.forEach(function(checkpoint) {

        const card = document.createElement("div");
        card.className = "workout-group";

        const title = document.createElement("h3");

        title.textContent = checkpoint.data.split("-").reverse().join("/");

        const details = document.createElement("p");

        details.textContent =
            `Sono: ${checkpoint.sono}h | ` +
            `Água: ${checkpoint.agua}L | ` +
            `Energia: ${checkpoint.energia} | ` +
            `Treinamento: ${checkpoint.treinamento}`;

        const notes = document.createElement("p");

        notes.textContent = checkpoint.observacoes || "Sem observações.";

        const actions = document.createElement("div");
        actions.className = "workout-actions";

        // Botão editar
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "btn-edit";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", function() {
            editCheckpoint(checkpoint.id);
        });

        // Botão excluir
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "btn-delete";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", function() {
            deleteCheckpoint(checkpoint.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(details);
        card.appendChild(notes);
        card.appendChild(actions);

        checkpointList.appendChild(card);

    });

}


// Preenche o formulário para edição
function editCheckpoint(id) {

    const checkpoints = getCheckpoints();

    const checkpoint = checkpoints.find(function(item) {
        return item.id === id;
    });

    if (!checkpoint) return;

    document.querySelector("#checkpoint-date").value = checkpoint.data;
    document.querySelector("#checkpoint-sleep").value = checkpoint.sono;
    document.querySelector("#checkpoint-water").value = checkpoint.agua;
    document.querySelector("#checkpoint-energy").value = checkpoint.energia;
    document.querySelector("#checkpoint-training").value = checkpoint.treinamento;
    document.querySelector("#checkpoint-notes").value = checkpoint.observacoes;

    editingCheckpointId = id;

    checkpointSubmit.textContent = "Salvar alterações";

    checkpointForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// Exclui um registro
function deleteCheckpoint(id) {

    const checkpoints = getCheckpoints();

    const updatedCheckpoints = checkpoints.filter(function(item) {
        return item.id !== id;
    });

    saveCheckpoints(updatedCheckpoints);

    if (editingCheckpointId === id) {
        editingCheckpointId = null;
        checkpointForm.reset();
        checkpointSubmit.textContent = "Salvar registro";
        setCurrentDate();
    }

    renderCheckpoints();

    updateCheckpointDashboard();

}


// Carrega o histórico ao abrir o sistema
renderCheckpoints();

// ======================================
// ATUALIZAÇÃO DOS INDICADORES DO DASHBOARD
// ======================================

function updateCheckpointDashboard() {

    const checkpoints = getCheckpoints();

    // Identifica o mês e ano atuais
    const today = new Date();

    const currentMonth =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    // Filtra os registros do mês atual
    const monthlyCheckpoints = checkpoints.filter(function(item) {
        return item.data.startsWith(currentMonth);
    });

    // Conta os treinamentos realizados
    const trainingDays = monthlyCheckpoints.filter(function(item) {
        return item.treinamento === "Realizado";
    });

    // Calcula as médias
    let averageSleep = 0;
    let averageWater = 0;

    if (monthlyCheckpoints.length > 0) {

        const totalSleep = monthlyCheckpoints.reduce(function(total, item) {
            return total + item.sono;
        }, 0);

        const totalWater = monthlyCheckpoints.reduce(function(total, item) {
            return total + item.agua;
        }, 0);

        averageSleep = totalSleep / monthlyCheckpoints.length;
        averageWater = totalWater / monthlyCheckpoints.length;
    }

    // Atualiza os indicadores na tela
    document.querySelector("#dashboard-checkpoints").textContent =
        monthlyCheckpoints.length;

    document.querySelector("#dashboard-training-days").textContent =
        trainingDays.length;

    document.querySelector("#dashboard-sleep").textContent =
        `${averageSleep.toFixed(1)}h`;

    document.querySelector("#dashboard-water").textContent =
        `${averageWater.toFixed(1)} L`;

}


// Atualiza os indicadores ao abrir o sistema
updateCheckpointDashboard();

// ==========================================
// MÓDULO: EVOLUÇÃO FÍSICA
// ==========================================

const evolutionForm = document.querySelector("#evolution-form");
const evolutionHistory = document.querySelector("#evolution-history");
const evolutionMessage = document.querySelector("#evolution-message");
const evolutionSubmit = document.querySelector("#evolution-submit");

let editingEvolutionId = null;


// Define a data atual
function setEvolutionDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    document.querySelector("#evolution-date").value =
        `${year}-${month}-${day}`;
}

setEvolutionDate();


// Busca os registros salvos
function getEvolutions() {
    const savedEvolutions = localStorage.getItem("gymCoreEvolution");

    return savedEvolutions ? JSON.parse(savedEvolutions) : [];
}


// Salva os registros
function saveEvolutions(evolutions) {
    localStorage.setItem(
        "gymCoreEvolution",
        JSON.stringify(evolutions)
    );
}


// Captura os dados do formulário
evolutionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const evolution = {
        data: document.querySelector("#evolution-date").value,
        peso: Number(document.querySelector("#evolution-weight").value),

        peitoral: document.querySelector("#evolution-chest").value
            ? Number(document.querySelector("#evolution-chest").value)
            : null,

        cintura: document.querySelector("#evolution-waist").value
            ? Number(document.querySelector("#evolution-waist").value)
            : null,

        braco: document.querySelector("#evolution-arm").value
            ? Number(document.querySelector("#evolution-arm").value)
            : null,

        coxa: document.querySelector("#evolution-thigh").value
            ? Number(document.querySelector("#evolution-thigh").value)
            : null,

        observacoes: document.querySelector("#evolution-notes").value.trim()
    };

    const evolutions = getEvolutions();

    // Verifica se está editando um registro
    if (editingEvolutionId !== null) {

        const updatedEvolutions = evolutions.map(function(item) {
            if (item.id === editingEvolutionId) {
                return { ...evolution, id: item.id };
            }

            return item;
        });

        saveEvolutions(updatedEvolutions);

        evolutionMessage.textContent = "Registro atualizado com sucesso!";

    } else {

        evolution.id = Date.now();

        evolutions.push(evolution);

        saveEvolutions(evolutions);

        evolutionMessage.textContent = "Registro salvo com sucesso!";
    }

    editingEvolutionId = null;

    evolutionForm.reset();

    evolutionSubmit.textContent = "Salvar registro";

    setEvolutionDate();

    renderEvolutions();
    updateEvolutionIndicators();
    renderWeightChart();

});


// Exibe o histórico de evolução
function renderEvolutions() {

    const evolutions = getEvolutions();

    evolutionHistory.replaceChildren();

    if (evolutions.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";
        message.textContent = "Nenhum registro de evolução encontrado.";

        evolutionHistory.appendChild(message);

        return;
    }

    // Ordena do registro mais recente para o mais antigo
    evolutions.sort(function(a, b) {
        return b.data.localeCompare(a.data);
    });

    evolutions.forEach(function(item) {

        const card = document.createElement("div");
        card.className = "workout-group";

        const title = document.createElement("h3");

        title.textContent = item.data.split("-").reverse().join("/");

        const details = document.createElement("p");

        details.textContent =
            `Peso: ${item.peso} kg | ` +
            `Peitoral: ${item.peitoral ?? "--"} cm | ` +
            `Cintura: ${item.cintura ?? "--"} cm | ` +
            `Braço: ${item.braco ?? "--"} cm | ` +
            `Coxa: ${item.coxa ?? "--"} cm`;

        const notes = document.createElement("p");

        notes.textContent = item.observacoes || "Sem observações.";

        const actions = document.createElement("div");
        actions.className = "workout-actions";

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "btn-edit";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", function() {
            editEvolution(item.id);
        });

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "btn-delete";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", function() {
            deleteEvolution(item.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(details);
        card.appendChild(notes);
        card.appendChild(actions);

        evolutionHistory.appendChild(card);
    });
}


// Preenche o formulário para edição
function editEvolution(id) {

    const evolutions = getEvolutions();

    const evolution = evolutions.find(function(item) {
        return item.id === id;
    });

    if (!evolution) return;

    document.querySelector("#evolution-date").value = evolution.data;
    document.querySelector("#evolution-weight").value = evolution.peso;
    document.querySelector("#evolution-chest").value = evolution.peitoral ?? "";
    document.querySelector("#evolution-waist").value = evolution.cintura ?? "";
    document.querySelector("#evolution-arm").value = evolution.braco ?? "";
    document.querySelector("#evolution-thigh").value = evolution.coxa ?? "";
    document.querySelector("#evolution-notes").value = evolution.observacoes;

    editingEvolutionId = id;

    evolutionSubmit.textContent = "Salvar alterações";

    evolutionForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Exclui um registro
function deleteEvolution(id) {

    const evolutions = getEvolutions();

    const updatedEvolutions = evolutions.filter(function(item) {
        return item.id !== id;
    });

    saveEvolutions(updatedEvolutions);

    if (editingEvolutionId === id) {

        editingEvolutionId = null;

        evolutionForm.reset();

        evolutionSubmit.textContent = "Salvar registro";

        setEvolutionDate();
    }

    renderEvolutions();

    updateEvolutionIndicators();
    
    renderWeightChart();

    
}


// Atualiza os indicadores de evolução
function updateEvolutionIndicators() {

    const metricSelector = document.querySelector("#evolution-metric");
    const selectedMetric = metricSelector.value;

    const metricNames = {
        peso: "Peso",
        peitoral: "Peitoral",
        cintura: "Cintura",
        braco: "Braço",
        coxa: "Coxa"
    };

    const unit = selectedMetric === "peso" ? "kg" : "cm";

    // Atualiza os títulos dos cartões
    document.querySelector("#initial-weight-title").textContent =
        `${metricNames[selectedMetric]} inicial`;

    document.querySelector("#current-weight-title").textContent =
        `${metricNames[selectedMetric]} atual`;

    document.querySelector("#weight-variation-title").textContent =
        `Variação de ${metricNames[selectedMetric].toLowerCase()}`;

    const initialWeight = document.querySelector("#initial-weight");
    const currentWeight = document.querySelector("#current-weight");
    const weightVariation = document.querySelector("#weight-variation");

    // Recupera apenas registros com a métrica selecionada
    const evolutions = getEvolutions()
        .filter(function(item) {
            return item[selectedMetric] !== null &&
                item[selectedMetric] !== undefined &&
                item[selectedMetric] !== "";
        })
        .sort(function(a, b) {
            return a.data.localeCompare(b.data);
        });

    // Verifica se existem registros
    if (evolutions.length === 0) {

        initialWeight.textContent = `-- ${unit}`;
        currentWeight.textContent = `-- ${unit}`;
        weightVariation.textContent = `-- ${unit}`;

        return;
    }

    // Primeiro e último registro da métrica
    const firstRecord = Number(evolutions[0][selectedMetric]);

    const lastRecord = Number(
        evolutions[evolutions.length - 1][selectedMetric]
    );

    // Calcula a variação
    const variation = lastRecord - firstRecord;

    initialWeight.textContent = `${firstRecord.toFixed(1)} ${unit}`;

    currentWeight.textContent = `${lastRecord.toFixed(1)} ${unit}`;

    const signal = variation > 0 ? "+" : "";

    weightVariation.textContent =
        `${signal}${variation.toFixed(1)} ${unit}`;

}


// Inicialização do módulo
renderEvolutions();
updateEvolutionIndicators();

// ==========================================
// MÓDULO: BIBLIOTECA DE EXERCÍCIOS
// ==========================================

const exerciseForm = document.querySelector("#exercise-form");
const exerciseList = document.querySelector("#exercise-list");
const exerciseMessage = document.querySelector("#exercise-message");
const exerciseSubmit = document.querySelector("#exercise-submit");
const exerciseFilter = document.querySelector("#exercise-filter");

let editingExerciseId = null;


// Recupera os exercícios salvos
function getExercises() {
    const savedExercises = localStorage.getItem("gymCoreExercises");

    return savedExercises ? JSON.parse(savedExercises) : [];
}


// Salva os exercícios
function saveExercises(exercises) {
    localStorage.setItem(
        "gymCoreExercises",
        JSON.stringify(exercises)
    );
}


// Cadastra ou atualiza um exercício
exerciseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const exercise = {
        nome: document.querySelector("#exercise-name").value.trim(),
        grupo: document.querySelector("#exercise-group").value,
        descricao: document.querySelector("#exercise-description").value.trim()
    };

    const exercises = getExercises();

    if (editingExerciseId !== null) {

        const updatedExercises = exercises.map(function(item) {

            if (item.id === editingExerciseId) {
                return { ...exercise, id: item.id };
            }

            return item;
        });

        saveExercises(updatedExercises);

        exerciseMessage.textContent = "Exercício atualizado com sucesso!";

    } else {

        exercise.id = Date.now();

        exercises.push(exercise);

        saveExercises(exercises);

        exerciseMessage.textContent = "Exercício cadastrado com sucesso!";
    }

    editingExerciseId = null;

    exerciseForm.reset();

    exerciseSubmit.textContent = "Cadastrar exercício";

    renderExercises();
});


// Exibe os exercícios cadastrados
function renderExercises() {

    const exercises = getExercises();

    const selectedGroup = exerciseFilter.value;

    exerciseList.replaceChildren();

    // Aplica o filtro selecionado
    const filteredExercises = exercises.filter(function(item) {

        return selectedGroup === "" || item.grupo === selectedGroup;

    });

    if (filteredExercises.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        message.textContent = exercises.length === 0
            ? "Nenhum exercício cadastrado."
            : "Nenhum exercício encontrado neste grupo muscular.";

        exerciseList.appendChild(message);

        return;
    }

    // Organiza alfabeticamente
    filteredExercises.sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    });

    filteredExercises.forEach(function(item) {

        const card = document.createElement("div");

        card.className = "workout-group";

        const title = document.createElement("h3");
        title.textContent = item.nome;

        const group = document.createElement("p");
        group.textContent = `Grupo muscular: ${item.grupo}`;

        const description = document.createElement("p");
        description.textContent = item.descricao || "Sem descrição.";

        const actions = document.createElement("div");
        actions.className = "workout-actions";

        // Botão editar
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "btn-edit";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", function() {
            editExercise(item.id);
        });

        // Botão excluir
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "btn-delete";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", function() {
            deleteExercise(item.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(group);
        card.appendChild(description);
        card.appendChild(actions);

        exerciseList.appendChild(card);
    });
}


// Carrega os dados para edição
function editExercise(id) {

    const exercises = getExercises();

    const exercise = exercises.find(function(item) {
        return item.id === id;
    });

    if (!exercise) return;

    document.querySelector("#exercise-name").value = exercise.nome;

    document.querySelector("#exercise-group").value = exercise.grupo;

    document.querySelector("#exercise-description").value =
        exercise.descricao;

    editingExerciseId = id;

    exerciseSubmit.textContent = "Salvar alterações";

    exerciseForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Exclui um exercício
function deleteExercise(id) {

    const exercises = getExercises();

    const updatedExercises = exercises.filter(function(item) {
        return item.id !== id;
    });

    saveExercises(updatedExercises);

    if (editingExerciseId === id) {

        editingExerciseId = null;

        exerciseForm.reset();

        exerciseSubmit.textContent = "Cadastrar exercício";
    }

    renderExercises();
}


// Evento do filtro
exerciseFilter.addEventListener("change", function() {
    renderExercises();
});


// Inicializa a biblioteca
renderExercises();

// ==========================================
// MÓDULO: NUTRIÇÃO
// ==========================================

const nutritionForm = document.querySelector("#nutrition-form");
const nutritionHistory = document.querySelector("#nutrition-history");
const nutritionMessage = document.querySelector("#nutrition-message");
const nutritionSubmit = document.querySelector("#nutrition-submit");
const nutritionFilterDate = document.querySelector("#nutrition-filter-date");

const nutritionGoalForm = document.querySelector("#nutrition-goal-form");
const nutritionGoalMessage = document.querySelector("#nutrition-goal-message");

let editingNutritionId = null;


// ==========================================
// DATAS
// ==========================================

function setNutritionDates() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const currentDate = `${year}-${month}-${day}`;

    document.querySelector("#nutrition-date").value = currentDate;
    nutritionFilterDate.value = currentDate;
}

setNutritionDates();


// ==========================================
// ARMAZENAMENTO DOS ALIMENTOS
// ==========================================

function getNutritionRecords() {

    const savedRecords = localStorage.getItem("gymCoreNutrition");

    return savedRecords ? JSON.parse(savedRecords) : [];
}


function saveNutritionRecords(records) {

    localStorage.setItem(
        "gymCoreNutrition",
        JSON.stringify(records)
    );
}


// ==========================================
// ARMAZENAMENTO DAS METAS
// ==========================================

function getNutritionGoals() {

    const savedGoals = localStorage.getItem("gymCoreNutritionGoals");

    return savedGoals
        ? JSON.parse(savedGoals)
        : {
            calorias: 0,
            proteinas: 0,
            carboidratos: 0,
            gorduras: 0
        };
}


function saveNutritionGoals(goals) {

    localStorage.setItem(
        "gymCoreNutritionGoals",
        JSON.stringify(goals)
    );
}


// Carrega as metas salvas no formulário
function loadNutritionGoals() {

    const goals = getNutritionGoals();

    document.querySelector("#goal-calories").value =
        goals.calorias || "";

    document.querySelector("#goal-protein").value =
        goals.proteinas || "";

    document.querySelector("#goal-carbs").value =
        goals.carboidratos || "";

    document.querySelector("#goal-fats").value =
        goals.gorduras || "";
}

loadNutritionGoals();


// ==========================================
// CADASTRO E EDIÇÃO DE ALIMENTOS
// ==========================================

nutritionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const nutrition = {

        data: document.querySelector("#nutrition-date").value,

        refeicao: document.querySelector("#meal-type").value,

        alimento: document.querySelector("#food-name").value.trim(),

        quantidade: Number(document.querySelector("#food-quantity").value),

        calorias: Number(document.querySelector("#food-calories").value),

        proteinas: Number(document.querySelector("#food-protein").value),

        carboidratos: Number(document.querySelector("#food-carbs").value),

        gorduras: Number(document.querySelector("#food-fats").value)
    };

    const records = getNutritionRecords();

    if (editingNutritionId !== null) {

        const updatedRecords = records.map(function(item) {

            if (item.id === editingNutritionId) {
                return { ...nutrition, id: item.id };
            }

            return item;
        });

        saveNutritionRecords(updatedRecords);

        nutritionMessage.textContent = "Alimento atualizado com sucesso!";

    } else {

        nutrition.id = Date.now();

        records.push(nutrition);

        saveNutritionRecords(records);

        nutritionMessage.textContent = "Alimento registrado com sucesso!";
    }

    editingNutritionId = null;

    nutritionForm.reset();

    nutritionSubmit.textContent = "Registrar alimento";

    document.querySelector("#nutrition-date").value = nutrition.data;

    // Atualiza a consulta para a data do registro
    nutritionFilterDate.value = nutrition.data;

    renderNutrition();
    updateNutritionIndicators();
});


// ==========================================
// HISTÓRICO ALIMENTAR
// ==========================================

function renderNutrition() {

    const records = getNutritionRecords();

    const selectedDate = nutritionFilterDate.value;

    nutritionHistory.replaceChildren();

    const filteredRecords = records.filter(function(item) {

        return item.data === selectedDate;

    });

    if (filteredRecords.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";
        message.textContent = "Nenhum alimento registrado nesta data.";

        nutritionHistory.appendChild(message);

        return;
    }

    // Ordena por tipo de refeição
    filteredRecords.sort(function(a, b) {

        return a.refeicao.localeCompare(b.refeicao);

    });

    filteredRecords.forEach(function(item) {

        const card = document.createElement("div");

        card.className = "workout-group";

        const title = document.createElement("h3");

        title.textContent = item.alimento;

        const meal = document.createElement("p");

        meal.textContent = item.refeicao;

        const details = document.createElement("p");

        details.textContent =
            `Quantidade: ${item.quantidade} g | ` +
            `Calorias: ${item.calorias} kcal`;

        const macros = document.createElement("p");

        macros.textContent =
            `Proteínas: ${item.proteinas} g | ` +
            `Carboidratos: ${item.carboidratos} g | ` +
            `Gorduras: ${item.gorduras} g`;

        const actions = document.createElement("div");

        actions.className = "workout-actions";

        // Botão editar
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "btn-edit";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", function() {

            editNutrition(item.id);

        });

        // Botão excluir
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "btn-delete";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", function() {

            deleteNutrition(item.id);

        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(meal);
        card.appendChild(details);
        card.appendChild(macros);
        card.appendChild(actions);

        nutritionHistory.appendChild(card);
    });
}


// ==========================================
// EDIÇÃO DE ALIMENTOS
// ==========================================

function editNutrition(id) {

    const records = getNutritionRecords();

    const nutrition = records.find(function(item) {

        return item.id === id;

    });

    if (!nutrition) return;

    document.querySelector("#nutrition-date").value = nutrition.data;

    document.querySelector("#meal-type").value = nutrition.refeicao;

    document.querySelector("#food-name").value = nutrition.alimento;

    document.querySelector("#food-quantity").value = nutrition.quantidade;

    document.querySelector("#food-calories").value = nutrition.calorias;

    document.querySelector("#food-protein").value = nutrition.proteinas;

    document.querySelector("#food-carbs").value = nutrition.carboidratos;

    document.querySelector("#food-fats").value = nutrition.gorduras;

    editingNutritionId = id;

    nutritionSubmit.textContent = "Salvar alterações";

    nutritionForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================
// EXCLUSÃO DE ALIMENTOS
// ==========================================

function deleteNutrition(id) {

    const records = getNutritionRecords();

    const updatedRecords = records.filter(function(item) {

        return item.id !== id;

    });

    saveNutritionRecords(updatedRecords);

    if (editingNutritionId === id) {

        editingNutritionId = null;

        nutritionForm.reset();

        nutritionSubmit.textContent = "Registrar alimento";

        document.querySelector("#nutrition-date").value =
            nutritionFilterDate.value;
    }

    renderNutrition();

    updateNutritionIndicators();
}


// ==========================================
// CADASTRO DAS METAS NUTRICIONAIS
// ==========================================

nutritionGoalForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const goals = {

        calorias: Number(document.querySelector("#goal-calories").value),

        proteinas: Number(document.querySelector("#goal-protein").value),

        carboidratos: Number(document.querySelector("#goal-carbs").value),

        gorduras: Number(document.querySelector("#goal-fats").value)
    };

    saveNutritionGoals(goals);

    nutritionGoalMessage.textContent = "Metas atualizadas com sucesso!";

    updateNutritionIndicators();
});


// ==========================================
// INDICADORES NUTRICIONAIS
// ==========================================

function updateNutritionIndicators() {

    const records = getNutritionRecords();

    const selectedDate = nutritionFilterDate.value;

    const goals = getNutritionGoals();

    // Seleciona apenas os alimentos da data consultada
    const dailyRecords = records.filter(function(item) {

        return item.data === selectedDate;

    });

    // Soma os valores nutricionais
    const totals = dailyRecords.reduce(function(total, item) {

        total.calorias += item.calorias;

        total.proteinas += item.proteinas;

        total.carboidratos += item.carboidratos;

        total.gorduras += item.gorduras;

        return total;

    }, {
        calorias: 0,
        proteinas: 0,
        carboidratos: 0,
        gorduras: 0
    });

    // Atualiza os indicadores na tela
    document.querySelector("#nutrition-calories").textContent =
        `${totals.calorias.toFixed(0)} / ${goals.calorias || "--"} kcal`;

    document.querySelector("#nutrition-protein").textContent =
        `${totals.proteinas.toFixed(1)} / ${goals.proteinas || "--"} g`;

    document.querySelector("#nutrition-carbs").textContent =
        `${totals.carboidratos.toFixed(1)} / ${goals.carboidratos || "--"} g`;

    document.querySelector("#nutrition-fats").textContent =
        `${totals.gorduras.toFixed(1)} / ${goals.gorduras || "--"} g`;
}


// ==========================================
// FILTRO POR DATA
// ==========================================

nutritionFilterDate.addEventListener("change", function() {

    renderNutrition();

    updateNutritionIndicators();

});


// ==========================================
// INICIALIZAÇÃO DO MÓDULO
// ==========================================

renderNutrition();

updateNutritionIndicators();

// ==========================================
// ATUALIZAÇÃO DOS RESUMOS DO PAINEL
// ==========================================

function updateDashboardSummaries() {

    // 1. RESUMO DA ROTINA DE TREINO

    const workouts = getWorkouts();

    const workoutCount = document.querySelector("#dashboard-workout-count");
    const workoutDivisions = document.querySelector("#dashboard-workout-divisions");

    const divisions = [...new Set(
        workouts.map(function(item) {
            return item.divisao;
        })
    )];

    if (workouts.length === 0) {

        workoutCount.textContent = "Nenhum exercício cadastrado.";
        workoutDivisions.textContent = "Cadastre seus treinamentos.";

    } else {

        workoutCount.textContent =
            `${workouts.length} exercício(s) cadastrado(s).`;

        workoutDivisions.textContent =
            `Divisões: ${divisions.join(", ")}`;

    }


    // 2. RESUMO NUTRICIONAL DE HOJE

    const today = new Date();

    const currentDate =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const nutritionRecords = getNutritionRecords();

    const goals = getNutritionGoals();

    const todayRecords = nutritionRecords.filter(function(item) {
        return item.data === currentDate;
    });

    const nutritionTotals = todayRecords.reduce(function(total, item) {

        total.calorias += Number(item.calorias);
        total.proteinas += Number(item.proteinas);

        return total;

    }, {
        calorias: 0,
        proteinas: 0
    });

    document.querySelector("#dashboard-nutrition-calories").textContent =
        `${nutritionTotals.calorias.toFixed(0)} / ${goals.calorias || "--"} kcal`;

    document.querySelector("#dashboard-nutrition-protein").textContent =
        `${nutritionTotals.proteinas.toFixed(1)} / ${goals.proteinas || "--"} g de proteína`;


    // 3. ÚLTIMA EVOLUÇÃO FÍSICA

    const evolutions = getEvolutions();

    const evolutionWeight = document.querySelector("#dashboard-evolution-weight");
    const evolutionDate = document.querySelector("#dashboard-evolution-date");

    if (evolutions.length === 0) {

        evolutionWeight.textContent = "Nenhuma medição registrada.";
        evolutionDate.textContent = "Registre sua evolução física.";

    } else {

        // Cria uma cópia e organiza da mais recente para a mais antiga
        const latestEvolution = [...evolutions].sort(function(a, b) {
            return b.data.localeCompare(a.data);
        })[0];

        const formattedDate =
            latestEvolution.data.split("-").reverse().join("/");

        evolutionWeight.textContent =
            `Peso registrado: ${latestEvolution.peso} kg`;

        evolutionDate.textContent =
            `Última atualização: ${formattedDate}`;

    }

}


// Atualiza os resumos quando o sistema é aberto
updateDashboardSummaries();

// ==========================================
// GRÁFICO DE EVOLUÇÃO DO PESO
// ==========================================

function renderWeightChart() {

    const canvas = document.querySelector("#weight-chart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Recupera os registros e ordena por data
        // Indicador selecionado
    const metricSelector = document.querySelector("#evolution-metric");

    const selectedMetric = metricSelector.value;

    // Nome e unidade do indicador
    const metricNames = {
        peso: "Peso corporal",
        peitoral: "Peitoral",
        cintura: "Cintura",
        braco: "Braço",
        coxa: "Coxa"
    };

    // Mudança
    document.querySelector("#evolution-chart-title").textContent = 
     `Evolução de ${metricNames[selectedMetric].toLowerCase()}`;

    const unit = selectedMetric === "peso" ? "kg" : "cm";

    // Recupera apenas registros que possuem a medida selecionada
    const evolutions = getEvolutions()
        .filter(function(item) {
            return item[selectedMetric] !== null &&
                item[selectedMetric] !== undefined &&
                item[selectedMetric] !== "";
        })
        .sort(function(a, b) {
            return a.data.localeCompare(b.data);
        });

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Evita desenhar quando a seção está oculta
    if (width === 0 || height === 0) return;

    // Ajusta a resolução para telas de alta densidade
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    // Limpa o gráfico anterior
    ctx.clearRect(0, 0, width, height);

    // Configurações visuais
    const margin = {
        top: 20,
        right: 20,
        bottom: 45,
        left: 45
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Mensagem quando não existem registros
    if (evolutions.length === 0) {

        ctx.fillStyle = "#9CA3AF";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "Registre seu peso para visualizar a evolução.",
            width / 2,
            height / 2
        );

        return;
    }

    // Identifica os valores mínimo e máximo
    const weights = evolutions.map(function(item) {
        return Number(item[selectedMetric]);
    });

    let minWeight = Math.floor(Math.min(...weights) - 1);
    let maxWeight = Math.ceil(Math.max(...weights) + 1);

    if (minWeight === maxWeight) {
        minWeight -= 1;
        maxWeight += 1;
    }

    // Converte peso em posição vertical
    function getY(weight) {

        return margin.top +
            chartHeight -
            ((weight - minWeight) / (maxWeight - minWeight)) *
            chartHeight;
    }

    // Converte índice em posição horizontal
    function getX(index) {

        if (evolutions.length === 1) {
            return margin.left + chartWidth / 2;
        }

        return margin.left +
            (index / (evolutions.length - 1)) * chartWidth;
    }

    // Desenha as linhas horizontais e os valores
    ctx.font = "11px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= 4; i++) {

        const value = minWeight +
            ((maxWeight - minWeight) / 4) * i;

        const y = getY(value);

        ctx.beginPath();
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 1;

        ctx.moveTo(margin.left, y);
        ctx.lineTo(width - margin.right, y);

        ctx.stroke();

        ctx.fillStyle = "#9CA3AF";

        ctx.fillText(
            value.toFixed(1),
            margin.left - 8,
            y
        );
    }

    // Desenha a linha de evolução
    ctx.beginPath();
    ctx.strokeStyle = "#A3E635";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    evolutions.forEach(function(item, index) {

        const x = getX(index);
        const y = getY(Number(item[selectedMetric]));

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

    });

    ctx.stroke();

    // Desenha os pontos e seus valores
    evolutions.forEach(function(item, index) {

        const x = getX(index);
        const y = getY(Number(item[selectedMetric]));

        // Ponto
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);

        ctx.fillStyle = "#A3E635";
        ctx.fill();

        ctx.strokeStyle = "#1F2937";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Valor do peso
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            `${Number(item[selectedMetric]).toFixed(1)} ${unit}`,
            x,
            y - 14
        );

        // Data
        const formattedDate =
            item.data.split("-").reverse().slice(0, 2).join("/");

        ctx.fillStyle = "#9CA3AF";
        ctx.font = "10px Arial";

        ctx.fillText(
            formattedDate,
            x,
            height - 18
        );

    });

}

// Atualiza o gráfico quando a janela muda de tamanho
window.addEventListener("resize", renderWeightChart);

document.querySelector("#evolution-metric")
    .addEventListener("change", function() {

        renderWeightChart();

        updateEvolutionIndicators();
});