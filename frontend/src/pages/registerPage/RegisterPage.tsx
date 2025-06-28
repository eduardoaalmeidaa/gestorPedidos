"use client";
import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./RegisterPage.scss";

const RegisterPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validarSenha = (senha: string): boolean => {
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return senhaRegex.test(senha);
  };

  const handleRegister = async () => {
    if (!nome) {
      showError("Preencha Nome!");
      setTimeout(() => nomeRef.current?.focus(), 100);
      return;
    }

    if (!email) {
      showError("Preencha Email!");
      setTimeout(() => emailRef.current?.focus(), 100);
      return;
    } else if (email) {
      if (!validarEmail(email)) {
        showError("Por favor, insira um e-mail válido com domínio.");
        setTimeout(() => emailRef.current?.focus(), 100);
        return;
      }
    }

    if (!senha) {
      showError("Preencha Senha!");
      setTimeout(() => senhaRef.current?.focus(), 100);
      return;
    } else if (senha) {
      if (!validarSenha(senha)) {
        showError(
          "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial."
        );
        setTimeout(() => senhaRef.current?.focus(), 100);
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/Auth/register", {
        nome,
        email,
        senha,
      });

      showSuccess("Usuário cadastrado com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 2700);
    } catch (error: any) {
      if (error.response?.status === 400) {
        showError(error.response.data?.title || "Erro ao cadastrar usuário.");
      } else {
        showError("Erro ao cadastrar usuário.");
      }
      console.error(error);
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
    <div className="register-page">
      <Toast ref={toast} position="top-center" />

      <Card title="Cadastro de Usuário" className="register-card">
        <div className="field">
          <label>Nome</label>
          <InputText
            ref={nomeRef}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>
        <div className="field">
          <label>Email</label>
          <InputText
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>
        <div className="field">
          <label>Senha</label>
          <Password
            inputRef={senhaRef}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            toggleMask
            placeholder="Digite sua senha"
            feedback={false}
          />
        </div>
        <div className="register-actions">
          <Button
            label="Cadastrar"
            onClick={handleRegister}
            className="register-button"
          />
          <Button
            label="Voltar"
            className="p-button-secondary"
            onClick={() => navigate("/")}
          />
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
