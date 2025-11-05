package br.com.agenda.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Entity
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long idUsuario;

    @NotBlank(message = "O nome do evento é obrigatório.")
    @Size(max = 100, message = "O nome do evento deve ter no máximo 100 caracteres.")
    private String titulo;

    @NotNull(message = "A data do evento é obrigatória.")
    @FutureOrPresent(message = "A data do evento não pode estar no passado.")
    private LocalDate data;

    public Evento() {
    }

    public Evento(Long idUsuario, String titulo, LocalDate data) {
        this.idUsuario = idUsuario;
        this.titulo = titulo;
        this.data = data;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }
}
