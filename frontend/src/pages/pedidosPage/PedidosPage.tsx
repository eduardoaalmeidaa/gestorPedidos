"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "./PedidosPage.scss";
import { EditarPedidoDialog } from "../../components/EditarPedidoDialog";

interface Pedido {
  id: number;
  produtoNome: string;
  quantidade: number;
  dataCriacao: string;
}

export default function PedidosPage() {
  const toast = useRef<Toast>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(
    null
  );
  const [quantidadeEditada, setQuantidadeEditada] = useState<number>(1);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const carregarPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/Pedidos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(response.data);
    } catch (error) {
      showError("Erro ao carregar os pedidos. Faça login novamente.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const excluirPedido = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/Pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Pedido excluído com sucesso!");
      carregarPedidos();
    } catch (error) {
      showError("Erro ao excluir o pedido.");
    }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({
      message: "Tem certeza que deseja excluir este pedido?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Não",
      acceptLabel: "Sim",
      acceptClassName: "p-button-danger",
      accept: () => excluirPedido(id),
    });
  };

  const openDialogEditar = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setQuantidadeEditada(pedido.quantidade);
    setShowDialog(true);
  };

  const handleSalvarEdicao = async () => {
    if (!pedidoSelecionado) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/Pedidos/${pedidoSelecionado.id}`,
        { quantidade: quantidadeEditada },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showSuccess("Pedido atualizado com sucesso!");
      setShowDialog(false);
      carregarPedidos();
    } catch (error) {
      showError("Erro ao atualizar pedido.");
    }
  };

  const renderAcoes = (rowData: Pedido) => (
    <div className="action-buttons">
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-warning"
        onClick={() => openDialogEditar(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-sm p-button-danger"
        onClick={() => confirmDelete(rowData.id)}
      />
    </div>
  );

  const showSuccess = (detail: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: detail,
      life: 3000,
    });
  };
  const showError = (detail: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Erro",
      detail: detail,
      life: 4000,
    });
  };

  return (
    <div className="pedidos-page">
      <h2>Meus Pedidos</h2>
      <Toast ref={toast} position="top-center" />
      <ConfirmDialog />
      <DataTable
        value={pedidos}
        loading={loading}
        stripedRows
        responsiveLayout="scroll"
        emptyMessage="Nenhum pedido encontrado."
      >
        <Column field="id" header="ID" style={{ width: "50px" }} />
        <Column field="produtoNome" header="Produto" />
        <Column field="quantidade" header="Qtd" style={{ width: "80px" }} />
        <Column
          field="dataCriacao"
          header="Data"
          body={(row) => new Date(row.dataCriacao).toLocaleString()}
        />
        <Column header="Ações" body={renderAcoes} style={{ width: "100px" }} />
      </DataTable>
      <div className="voltar-button-container">
        <Button
          label="Voltar"
          className="p-button-secondary"
          onClick={() => navigate("/produtos")}
        />
      </div>
      <EditarPedidoDialog
        visible={showDialog}
        pedido={pedidoSelecionado}
        quantidade={quantidadeEditada}
        onHide={() => setShowDialog(false)}
        onQuantidadeChange={setQuantidadeEditada}
        onSalvar={handleSalvarEdicao}
      />
    </div>
  );
}
