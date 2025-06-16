"use client";
import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import { Toast } from "primereact/toast";
import fiescLogo from "../../assets/images/fiescLogo.png";

export default function LoginPage() {
  const toast = useRef<Toast>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email) {
      showError("Preencha Email!");
      setTimeout(() => emailRef.current?.focus(), 100);
      return;
    }
    if (!senha) {
      showError("Preencha Senha!");
      setTimeout(() => senhaRef.current?.focus(), 100);
      return;
    }

    if (!validateEmail(email)) {
      showError("Informe um email válido!");
      setTimeout(() => emailRef.current?.focus(), 100);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Auth/login",
        { email, senha }
      );

      localStorage.setItem("token", response.data.token);
      showSuccess("Login realizado com sucesso!");
      navigate("/produtos");
    } catch (error) {
      showError("Falha no login. Verifique o email e senha.");
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
    <div className="login-page">
      <Toast ref={toast} position="top-center" />

      <div className="login-card">
        <img src={fiescLogo} alt="FIESC Logo" className="fiesc-logo" />

        <h2>Login</h2>

        <div className="field">
          <label>Email:</label>
          <InputText
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>

        <div className="field">
          <label>Senha:</label>
          <Password
            inputRef={senhaRef}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            feedback={false}
            toggleMask
            placeholder="Digite sua senha"
          />
        </div>

        <Button label="Entrar" className="login-button" onClick={handleLogin} />

        <p className="link-cadastro">
          <span onClick={() => navigate("/register")}>Cadastre-se aqui</span>
        </p>
      </div>
    </div>
  );
}
