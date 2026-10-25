// To Do List com jQuery
// As tarefas ficam num array e a tela é redesenhada a partir dele (função render).

const CHAVE_STORAGE = "toDoItems";

// Cada tarefa: { id, texto, concluida }
let tarefas = [];

// Tarefas de exemplo, mostradas só na primeira visita (nada salvo ainda)
const EXEMPLOS = [
    { id: 1, texto: "Revisar o README", concluida: false },
    { id: 2, texto: "Aprender .fadeOut()", concluida: false },
    { id: 3, texto: "Ler a documentação de eventos do jQuery e testar delegação com .on()", concluida: false },
    { id: 4, texto: "Configurar o projeto", concluida: true },
    { id: 5, texto: "Criar o layout com CSS", concluida: true }
];

$(function () {
    tarefas = carregarTarefas();
    render();

    // Adicionar tarefa (Enter no campo ou clique no botão)
    $("#form-tarefa").on("submit", function (e) {
        e.preventDefault();

        const campo = $("#nova-tarefa");
        const texto = $.trim(campo.val());

        if (texto === "") {
            mostrarAviso("Digite uma descrição para a tarefa.");
            campo.trigger("focus");
            return;
        }

        tarefas.push({ id: Date.now(), texto: texto, concluida: false });
        salvarTarefas();
        render();

        campo.val("").trigger("focus");
        mostrarAviso("");

        // Destaque rápido na tarefa recém-criada
        $("#lista-pendentes li").last().hide().fadeIn(250);
    });

    // Ações dos botões de cada tarefa (delegação de eventos)
    $(".tarefas").on("click", "button[data-acao]", function () {
        const item = $(this).closest("li");
        const id = item.data("id");
        const acao = $(this).data("acao");

        if (acao === "alternar") alternarTarefa(id);
        if (acao === "editar") editarTarefa(item);
        if (acao === "remover") removerTarefa(item, id);
    });
});

// ------------------------------------------------------------------
// Ações

function alternarTarefa(id) {
    const tarefa = buscarTarefa(id);
    tarefa.concluida = !tarefa.concluida;
    salvarTarefas();
    render();

    // Mantém o foco no botão da tarefa movida, para quem usa o teclado
    $(`li[data-id="${id}"] button[data-acao="alternar"]`).trigger("focus");
}

function removerTarefa(item, id) {
    item.fadeOut(200, function () {
        tarefas = tarefas.filter((t) => t.id !== id);
        salvarTarefas();
        render();
        $("#nova-tarefa").trigger("focus");
    });
}

// Troca o texto por um campo de edição. Enter salva, Esc cancela.
function editarTarefa(item) {
    const tarefa = buscarTarefa(item.data("id"));

    const campo = $("<input>")
        .attr({ type: "text", maxlength: 200, "aria-label": "Editar tarefa" })
        .addClass("campo-edicao")
        .val(tarefa.texto);

    item.find(".texto").replaceWith(campo);
    item.find(".acoes").hide();
    campo.trigger("focus").trigger("select");

    let terminou = false;

    function terminar(salvar) {
        if (terminou) return;
        terminou = true;

        const novoTexto = $.trim(campo.val());
        if (salvar && novoTexto !== "") {
            tarefa.texto = novoTexto;
            salvarTarefas();
        }
        render();
        $(`li[data-id="${tarefa.id}"] button[data-acao="editar"]`).trigger("focus");
    }

    campo.on("keydown", function (e) {
        if (e.key === "Enter") terminar(true);
        if (e.key === "Escape") terminar(false);
    });
    campo.on("blur", () => terminar(true));
}

// ------------------------------------------------------------------
// Tela

function render() {
    const pendentes = tarefas.filter((t) => !t.concluida);
    const concluidas = tarefas.filter((t) => t.concluida);

    $("#lista-pendentes").empty().append(pendentes.map(criarItem));
    $("#lista-concluidas").empty().append(concluidas.map(criarItem));

    $("#contador-pendentes").text(pendentes.length);
    $("#contador-concluidas").text(concluidas.length);

    // Estados vazios
    $("#vazio-pendentes").toggle(pendentes.length === 0);
    $("#vazio-concluidas").toggle(concluidas.length === 0);
}

// Monta o <li> de uma tarefa. O texto entra com .text(), nunca como HTML.
function criarItem(tarefa) {
    const item = $("<li>").addClass("task").attr("data-id", tarefa.id);

    const texto = $("<span>").addClass("texto").text(tarefa.texto);

    const acoes = $("<div>").addClass("acoes").append(
        tarefa.concluida
            ? criarBotao("alternar", "fa-undo", "Voltar para pendentes")
            : criarBotao("alternar", "fa-check", "Concluir tarefa"),
        criarBotao("editar", "fa-edit", "Editar tarefa"),
        criarBotao("remover", "fa-trash-alt", "Remover tarefa")
    );

    return item.append(texto, acoes);
}

function criarBotao(acao, icone, rotulo) {
    return $("<button>")
        .attr({ type: "button", "data-acao": acao, title: rotulo, "aria-label": rotulo })
        .addClass("btn-acao btn-" + acao)
        .append($("<i>").addClass("fas " + icone).attr("aria-hidden", "true"));
}

function mostrarAviso(mensagem) {
    $("#aviso").text(mensagem);
}

function buscarTarefa(id) {
    return tarefas.find((t) => t.id === id);
}

// ------------------------------------------------------------------
// localStorage (com try/catch: pode estar bloqueado ou cheio)

function carregarTarefas() {
    try {
        const salvo = localStorage.getItem(CHAVE_STORAGE);

        // Primeira visita: começa com os exemplos
        if (salvo === null) return EXEMPLOS.slice();

        const dados = JSON.parse(salvo) || [];

        // Converte o formato antigo ([texto, concluida]) para objetos
        return dados.map((t, i) =>
            Array.isArray(t)
                ? { id: Date.now() + i, texto: String(t[0]), concluida: Boolean(t[1]) }
                : t
        );
    } catch (e) {
        return EXEMPLOS.slice();
    }
}

function salvarTarefas() {
    try {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
    } catch (e) {
        mostrarAviso("Não foi possível salvar as tarefas neste navegador.");
    }
}
