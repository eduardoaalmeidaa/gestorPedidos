"use client";
import React from "react";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import "./EditarPedidoDialog.scss";

interface Pedido {
  id: number;
  produtoNome: string;
  quantidade: number;
}

interface EditarPedidoDialogProps {
  visible: boolean;
  pedido: Pedido | null;
  quantidade: number;
  onHide: () => void;
  onQuantidadeChange: (quantidade: number) => void;
  onSalvar: () => void;
}

export const EditarPedidoDialog: React.FC<EditarPedidoDialogProps> = ({
  visible,
  pedido,
  quantidade,
  onHide,
  onQuantidadeChange,
  onSalvar,
}) => {
  return (
    <Dialog
      header="Editar Pedido"
      visible={visible}
      onHide={onHide}
      className="custom-dialog"
    >
      {pedido && (
        <div>
          <p>
            <strong>Produto:</strong> {pedido.produtoNome}
          </p>
          <div className="field">
            <label>Quantidade:</label>
            <InputNumber
              value={quantidade}
              onValueChange={(e) => onQuantidadeChange(e.value ?? 1)}
              min={1}
              showButtons
              buttonLayout="horizontal"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </div>
          <div className="dialog-footer">
            <Button
              label="Salvar"
              className="p-button-success"
              onClick={onSalvar}
            />
            <Button
              label="Cancelar"
              className="p-button-secondary"
              onClick={onHide}
            />
          </div>
        </div>
      )}
    </Dialog>
  );
};
