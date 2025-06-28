"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "./ProdutosPage.scss";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
}

interface Pedido {
  id: number;
  produtoId: number;
}

export default function ProdutosPage() {
  const toast = useRef<Toast>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingProdutoId, setLoadingProdutoId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchProdutos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Produto[]>(
        "http://localhost:5000/api/Produtos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Pedido[]>(
        "http://localhost:5000/api/Pedidos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
    fetchPedidos();
  }, []);

  const handleFazerPedido = async (produto: Produto) => {
    try {
      setLoadingProdutoId(produto.id);

      const token = localStorage.getItem("token");
      if (!token) {
        showError("Você precisa estar logado para fazer um pedido.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/Pedidos",
        {
          produtoId: produto.id,
          quantidade: produto.quantidadeEstoque,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess("Pedido realizado com sucesso!");
      fetchProdutos();
      fetchPedidos();
    } catch (error) {
      console.error("Erro ao fazer o pedido", error);
      showError("Erro ao fazer o pedido.");
    } finally {
      setLoadingProdutoId(null);
    }
  };

  const handleExcluirProduto = (id: number) => {
    confirmDialog({
      message: "Tem certeza que deseja excluir este produto?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Não",
      acceptLabel: "Sim",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:5000/api/Produtos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          showSuccess("Produto excluído com sucesso!");
          fetchProdutos();
        } catch (error) {
          console.error("Erro ao excluir produto", error);
          showError("Erro ao excluir produto.");
        }
      },
    });
  };

  const handleLogout = () => {
    confirmDialog({
      message: "Deseja sair?",
      header: <span style={{ paddingRight: "1.5rem" }}>Confirmação</span>,
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Não",
      acceptLabel: "Sim",
      acceptClassName: "p-button-danger",
      accept: () => {
        localStorage.removeItem("token");
        navigate("/");
      },
    });
  };

  const showSuccess = (detail: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: detail,
      life: 4000,
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
    <div className="produtos-page">
      <Toast ref={toast} position="top-center" />
      <ConfirmDialog />

      <div className="header-right">
        <Button
          icon="pi pi-sign-in"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={handleLogout}
          tooltip="Logout"
          tooltipOptions={{ position: "left" }}
        />
      </div>
      <h2>Lista de Produtos</h2>
      <div className="produtos-lista">
        {produtos.length === 0 ? (
          <p>Nenhum produto disponível.</p>
        ) : (
          produtos.map((produto) => (
            <Card
              key={produto.id}
              title={produto.nome}
              className="produto-card"
            >
              <p className="preco">Preço: R$ {produto.preco.toFixed(2)}</p>
              <p>Quantidade: {produto.quantidadeEstoque}</p>
              <Button
                label="Fazer Pedido"
                className="p-button-success botao-fazer-pedido"
                onClick={() => handleFazerPedido(produto)}
                disabled={
                  produto.quantidadeEstoque <= 0 ||
                  pedidos.some((p) => p.produtoId === produto.id)
                }
                loading={loadingProdutoId === produto.id}
              />
              <div className="botoes-acoes-produto">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-sm p-button-warning"
                  onClick={() => navigate(`/editar-produto/${produto.id}`)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-sm p-button-danger"
                  onClick={() => handleExcluirProduto(produto.id)}
                />
              </div>
            </Card>
          ))
        )}
      </div>
      <div className="botoes-rodape">
        <Button
          label="Pedidos"
          className="p-button-secondary"
          onClick={() => navigate("/pedidos")}
        />
        <Button
          label="Cadastrar Produto"
          onClick={() => navigate("/cadastrar-produto")}
        />
      </div>
    </div>
  );
}
