import  { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";

interface Tarefa {
  id: number;
  texto: string;
  categoria: string;
  dataEntrega?: string;
  concluida: boolean;
}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("Prova");
  const [novaDataEntrega, setNovaDataEntrega] = useState("");
  const [filtro, setFiltro] = useState<"todas" | "pendentes" | "concluidas">("todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  // Carregar tarefas do localStorage ao iniciar
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (tarefasSalvas) {
      setTarefas(JSON.parse(tarefasSalvas));
    }
  }, []);

  // Salvar tarefas no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  function adicionarTarefa() {
    if (!novaTarefa.trim()) return;

    const nova: Tarefa = {
      id: Date.now(),
      texto: novaTarefa.trim(),
      categoria: novaCategoria,
      dataEntrega: novaDataEntrega || undefined,
      concluida: false,
    };

    setTarefas([...tarefas, nova]);
    setNovaTarefa("");
    setNovaCategoria("Prova");
    setNovaDataEntrega("");
  }

  function alternarConcluida(id: number) {
    setTarefas((old) =>
      old.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
    );
  }

  function removerTarefa(id: number) {
    setTarefas((old) => old.filter((t) => t.id !== id));
  }

  function editarTarefa(id: number, novoTexto: string) {
    setTarefas((old) =>
      old.map((t) => (t.id === id ? { ...t, texto: novoTexto } : t))
    );
  }

  function limparConcluidas() {
    setTarefas((old) => old.filter((t) => !t.concluida));
  }

  function exportarTarefas() {
    const texto = tarefas
      .map(
        (t) =>
          `${t.concluida ? "[X]" : "[ ]"} ${t.texto} (Categoria: ${
            t.categoria
          })${t.dataEntrega ? ` - Entrega: ${t.dataEntrega}` : ""}`
      )
      .join("\n");

    const blob = new Blob([texto], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "organizador-de-estudos.txt";
    link.click();
  }

  const tarefasFiltradas = tarefas.filter((t) => {
    if (filtro === "pendentes" && t.concluida) return false;
    if (filtro === "concluidas" && !t.concluida) return false;
    if (filtroCategoria !== "Todas" && t.categoria !== filtroCategoria)
      return false;
    return true;
  });

  const pendentes = tarefas.filter((t) => !t.concluida).length;
  const concluidas = tarefas.filter((t) => t.concluida).length;

  return (
    <div className="container">
      <h1>Organizador de Estudos</h1>

      <div>
        <input
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          placeholder="Digite a tarefa"
          onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
        />

        <select
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
        >
          <option value="Prova">Prova</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Leitura">Leitura</option>
          <option value="Outro">Outro</option>
        </select>

        <input
          type="date"
          value={novaDataEntrega}
          onChange={(e) => setNovaDataEntrega(e.target.value)}
        />

        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <div className="filtros">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as any)}
        >
          <option value="todas">Todas</option>
          <option value="pendentes">Pendentes</option>
          <option value="concluidas">Concluídas</option>
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="Todas">Todas</option>
          <option value="Prova">Prova</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Leitura">Leitura</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <p>
        <strong>Pendentes:</strong> {pendentes} | <strong>Concluídas:</strong>{" "}
        {concluidas}
      </p>

      <ul>
        {tarefasFiltradas.length === 0 && <li>Nenhuma tarefa encontrada.</li>}
        {tarefasFiltradas.map((t) => (
          <TodoItem
            key={t.id}
            tarefa={t}
            alternarConcluida={alternarConcluida}
            removerTarefa={removerTarefa}
            editarTarefa={editarTarefa}
          />
        ))}
      </ul>

      <div className="acoes">
        <button onClick={exportarTarefas}>Exportar tarefas</button>
        <button onClick={limparConcluidas}>Limpar concluídas</button>
      </div>
    </div>
  );
}
