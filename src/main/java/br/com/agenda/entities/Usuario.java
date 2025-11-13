package br.com.agenda.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 3, max = 80, message = "O nome deve ter entre 3 e 80 caracteres")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve ser válido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, max = 20, message = "A senha deve ter entre 6 e 20 caracteres")
    private String senha;

    @Lob
    @Column(name = "foto_perfil", columnDefinition = "MEDIUMBLOB")
    private byte[] fotoPerfil;

    @Column(name = "notificacao_email")
    private boolean notificacaoEmail = true;

    @Column(name = "resumo_semanal")
    private boolean resumoSemanal = true;

    @Column(name = "data_cadastro")
    private final LocalDate dataCadastro = LocalDate.now();

    @Column(name = "ultimo_login")
    private LocalDate ultimoLogin = null;

    public Usuario() {
    }

    public Usuario(String nome, String email, String senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public boolean getNotificacaoEmail() {
        return notificacaoEmail;
    }

    public void setNotificacaoEmail(boolean notificacaoEmail) {
        this.notificacaoEmail = notificacaoEmail;
    }

    public boolean getResumoSemanal() {
        return resumoSemanal;
    }

    public void setResumoSemanal(boolean resumoSemanal) {
        this.resumoSemanal = resumoSemanal;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }

    public LocalDate getUltimoLogin() {
        return ultimoLogin;
    }

    public void setUltimoLogin(LocalDate ultimoLogin) {
        this.ultimoLogin = ultimoLogin;
    }

    public byte[] getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(byte[] fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }
}
