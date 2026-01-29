import tkinter as tk
from tkinter import ttk, messagebox
import json
import ftplib
from datetime import datetime
import os

# --- CONFIGURAÇÕES FTP ---
FTP_HOST = "ftp.rota62go.com.br"
FTP_USER = "u718718103.admin.rota62go.com.br"
FTP_PASS = "Mpc@102030"
ARQUIVO_LOCAL = "waze_data.json"

# LISTA COMPLETA
TIPOS_ALERTA = [
    "Alerta Defesa Civil",
    "Acidente de carro",
    "Obras na via",         # <--- NOVO
    "Perigo na via",
    "Trânsito intenso",
    "Via interditada",
    "Alagamento",
    "Falha no semáforo",
    "Carro parado na via",
    "Perigo climático",
    "Aviso Rota 62"
]

class PainelRota62:
    def __init__(self, root):
        self.root = root
        self.root.title("Painel Manual - Rota 62")
        self.root.geometry("600x600")
        self.root.configure(bg="#202020")
        
        self.fila_envio = [] 
        self.dados_atuais = {"lista_mista": [], "clima": []}
        self.carregar_dados_do_arquivo()

        ttk.Label(root, text="📢 GERENCIADOR DE ALERTAS", font=("Arial", 14, "bold"), foreground="#33CCFF", background="#202020").pack(pady=10)

        # --- FORMULÁRIO ---
        frame_form = tk.Frame(root, bg="#303030", bd=1, relief="solid")
        frame_form.pack(pady=5, padx=10, fill="x")

        ttk.Label(frame_form, text="1. Selecione o Tipo:", background="#303030", foreground="white").grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.combo = ttk.Combobox(frame_form, values=TIPOS_ALERTA, width=30, state="readonly")
        self.combo.current(0)
        self.combo.grid(row=0, column=1, padx=5, pady=5)

        ttk.Label(frame_form, text="2. Texto do Alerta:", background="#303030", foreground="white").grid(row=1, column=0, padx=5, pady=5, sticky="w")
        self.entry = ttk.Entry(frame_form, width=40)
        self.entry.grid(row=1, column=1, padx=5, pady=5)
        
        tk.Button(frame_form, text="⬇️ ADICIONAR À LISTA", bg="#FF9800", fg="black", font=("Arial", 10, "bold"), command=self.adicionar_fila).grid(row=2, column=0, columnspan=2, pady=10, sticky="we", padx=10)

        # --- FILA ---
        ttk.Label(root, text="Itens prontos para enviar:", font=("Arial", 10, "bold"), background="#202020", foreground="white").pack(pady=(15,0))
        
        self.listbox = tk.Listbox(root, height=10, bg="#404040", fg="white", font=("Arial", 10), selectbackground="#33CCFF")
        self.listbox.pack(padx=10, pady=5, fill="x")

        frame_botoes = tk.Frame(root, bg="#202020")
        frame_botoes.pack(fill="x", padx=10)
        tk.Button(frame_botoes, text="❌ Remover", bg="#f44336", fg="white", font=("Arial", 9), command=self.remover_selecionado).pack(side="left")
        tk.Button(frame_botoes, text="🧹 Limpar", bg="#777", fg="white", font=("Arial", 9), command=self.limpar_fila).pack(side="right")

        tk.Button(root, text="🚀 ENVIAR TUDO", bg="#4CAF50", fg="white", font=("Arial", 12, "bold"), height=2, command=self.enviar_ftp).pack(pady=20, padx=10, fill="x")
        tk.Button(root, text="⚠️ APAGAR SITE", bg="#8B0000", fg="white", command=self.limpar_site).pack(pady=5)

    def carregar_dados_do_arquivo(self):
        if os.path.exists(ARQUIVO_LOCAL):
            try:
                with open(ARQUIVO_LOCAL, 'r', encoding='utf-8') as f:
                    self.dados_atuais = json.load(f).get("dados", self.dados_atuais)
            except: pass

    def get_color(self, t):
        if "Defesa Civil" in t: return "text-red-600 font-black"
        if "Acidente" in t or "interditada" in t: return "text-red-500 font-black"
        # OBRAS NA VIA: Laranja, mas diferente do trânsito comum
        if "Obras" in t: return "text-orange-500 font-black"
        if "Perigo" in t: return "text-orange-600 font-black" 
        if "intenso" in t or "Falha" in t: return "text-orange-500 font-bold"
        if "Alagamento" in t: return "text-blue-400 font-bold"
        return "text-yellow-400"

    def adicionar_fila(self):
        tipo = self.combo.get()
        texto = self.entry.get()
        if not texto: return
        
        item = {
            "titulo": tipo,
            "texto": texto,
            "corTitulo": self.get_color(tipo),
            "origem": "manual",
            "timestamp": datetime.now().timestamp(),
            "atraso": "+ Manual"
        }
        self.fila_envio.append(item)
        self.listbox.insert(tk.END, f"[{tipo}] {texto}")
        self.entry.delete(0, tk.END)

    def remover_selecionado(self):
        try:
            index = self.listbox.curselection()[0]
            self.listbox.delete(index)
            self.fila_envio.pop(index)
        except: pass

    def limpar_fila(self):
        self.fila_envio = []
        self.listbox.delete(0, tk.END)

    def limpar_site(self):
        if messagebox.askyesno("Confirmar", "Zerar o site?"):
            self.dados_atuais["lista_mista"] = []
            self.salvar_json_e_subir()

    def enviar_ftp(self):
        if not self.fila_envio: return
        self.carregar_dados_do_arquivo()
        self.dados_atuais["lista_mista"] = self.fila_envio + self.dados_atuais["lista_mista"]
        if self.salvar_json_e_subir():
            messagebox.showinfo("Sucesso", "Enviado!")
            self.limpar_fila()

    def salvar_json_e_subir(self):
        try:
            payload = {"atualizacao": datetime.now().strftime("%d/%m/%Y %H:%M"), "dados": self.dados_atuais}
            with open(ARQUIVO_LOCAL, "w", encoding="utf-8") as f: json.dump(payload, f, indent=4, ensure_ascii=False)
            ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
            with open(ARQUIVO_LOCAL, 'rb') as f: ftp.storbinary(f'STOR {ARQUIVO_LOCAL}', f)
            ftp.quit()
            return True
        except Exception as e:
            messagebox.showerror("Erro", str(e)); return False

if __name__ == "__main__":
    root = tk.Tk(); app = PainelRota62(root); root.mainloop()