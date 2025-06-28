"use client";
import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./ProdutosFormPage.scss";
import { Toast } from "primereact/toast";

export default function ProdutosFormPage() {
  const toast = useRef<Toast>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const precoRef = useRef<HTMLInputElement>(null);
  const quantidadeEstoqueRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState<number | null>(null);
  const [quantidadeEstoque, setQuantidadeEstoque] = useState<number>(1);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      carregarProduto();
      setIsEditMode(true);
    }
  }, [id]);

  const carregarProduto = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/Produtos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const produto = response.data.find(
        (p: any) => p.id === parseInt(id ?? "0")
      );
      if (produto) {
        setNome(produto.nome);
        setPreco(produto.preco);
        setQuantidadeEstoque(produto.quantidadeEstoque);
      } else {
        showError("Produto não encontrado.");
      }
    } catch (error) {
      console.error(error);
      showError("Erro ao carregar produto para edição.");
    }
  };

  const handleSalvarProduto = async () => {
    if (!nome) {
      showError("Preencha Nome!");
      setTimeout(() => nomeRef.current?.focus(), 100);
      return;
    }
    if (!preco) {
      showError("Preencha Preço");
      setTimeout(() => precoRef.current?.focus(), 100);
      return;
    }
    if (!quantidadeEstoque) {
      showError("Preencha Quantidade!");
      setTimeout(() => quantidadeEstoqueRef.current?.focus(), 100);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/Produtos/${id}`,
          {
            nome,
            preco,
            quantidadeEstoque,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showSuccess("Produto atualizado com sucesso!");
      } else {
        await axios.post(
          "http://localhost:5000/api/Produtos",
          {
            nome,
            preco,
            quantidadeEstoque,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showSuccess("Produto cadastrado com sucesso!");
      }

      setTimeout(() => navigate("/produtos"), 1000);
    } catch (error) {
      console.error(error);
      showError("Erro ao salvar o produto.");
    }
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
    <div className="produtos-form-page">
      <Toast ref={toast} position="top-center" />
      <h2>{isEditMode ? "Editar Produto" : "Cadastrar Novo Produto"}</h2>
      <div className="field">
        <label>Nome:</label>
        <InputText
          ref={nomeRef}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome do produto"
        />
      </div>
      <div className="field">
        <label>Preço:</label>
        <InputNumber
          inputRef={precoRef}
          value={preco}
          onValueChange={(e) => setPreco(e.value ?? null)}
          mode="currency"
          currency="BRL"
          locale="pt-BR"
          placeholder="Digite o preço"
        />
      </div>
      <div className="field">
        <label>Quantidade em Estoque:</label>
        <InputNumber
          inputRef={quantidadeEstoqueRef}
          value={quantidadeEstoque}
          onValueChange={(e) => setQuantidadeEstoque(e.value ?? 1)}
          showButtons
          min={1}
        />
      </div>
      <div className="buttons-container">
        <Button
          label={isEditMode ? "Salvar Alterações" : "Cadastrar Produto"}
          onClick={handleSalvarProduto}
        />
        <Button
          label="Voltar"
          className="p-button-secondary"
          onClick={() => navigate("/produtos")}
        />
      </div>
    </div>
  );
}
