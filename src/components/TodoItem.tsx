import { useState } from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";

interface Props {
  tarefa: {
    id: number;
    texto: string;
    categoria: string;
    dataEntrega?: string;
    concluida: boolean;
  };
  alternarConcluida: (id: number) => void;
  removerTarefa: (id: number) => void;
  editarTarefa: (id: number, novoTexto: string) => void;
}

export default function TodoItem({
  tarefa,
  alternarConcluida,
  removerTarefa,
  editarTarefa,
}: Props) {
  const [editando, setEditando] = useState(false);
  const [novoTexto, setNovoTexto] = useState(tarefa.texto);

  function salvarEdicao() {
    if (novoTexto.trim()) {
      editarTarefa(tarefa.id, novoTexto.trim());
      setEditando(false);
    }
  }

  return (
    <li className={tarefa.concluida ? "concluida" : ""}>
      <div>
        {editando ? (
          <input
            value={novoTexto}
            onChange={(e) => setNovoTexto(e.target.value)}
            onBlur={salvarEdicao}
            onKeyDown={(e) => e.key === "Enter" && salvarEdicao()}
            autoFocus
          />
        ) : (
          <strong onDoubleClick={() => setEditando(true)}>{tarefa.texto}</strong>
        )}
        <br />
        <small>Categoria: {tarefa.categoria}</small> <br />
        {tarefa.dataEntrega && <small>Entrega: {tarefa.dataEntrega}</small>}
      </div>
      <span>
        <button
          onClick={() => alternarConcluida(tarefa.id)}
          title="Concluir"
          aria-label="Concluir tarefa"
        >
          <FiCheck />
        </button>
        <button
          onClick={() => removerTarefa(tarefa.id)}
          title="Excluir"
          aria-label="Excluir tarefa"
        >
          <FiTrash2 />
        </button>
      </span>
    </li>
  );
}
