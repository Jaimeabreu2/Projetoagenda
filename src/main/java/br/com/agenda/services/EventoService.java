package br.com.agenda.services;

import br.com.agenda.entities.Evento;
import br.com.agenda.repositories.EventoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Objects;

@Service
public class EventoService {
    private final static ArrayList<Evento> eventos = new ArrayList<>();
    private static EventoRepository repository;
    private static Long idUsuario;

    public EventoService(EventoRepository repository) {
        EventoService.repository = repository;
    }

    public void salvarEvento(String disciplina, String descricao, String horario, String dia) {
        Evento evento = new Evento(idUsuario, disciplina, descricao, horario, dia);

        repository.save(evento);
        eventos.add(evento);
    }

    public boolean verificarEventoExistente(String disciplina, String descricao, String horario, String dia) {
        for (Evento e : eventos) {
            if (e.getDisciplina().equalsIgnoreCase(disciplina) && e.getDescricao().equalsIgnoreCase(descricao) &&
                    e.getHorario().equals(LocalTime.parse(horario)) && e.getDia().equals(LocalDate.parse(dia)))
                return true;
        }
        return false;
    }

    public void listarEventos() {
        for (Evento evento : repository.findAll()) {
            if (Objects.equals(evento.getIdUsuario(), idUsuario))
                eventos.add(evento);
        }
    }

    public ArrayList<Evento> getEventos() {
        return eventos;
    }

    public static void setIdUsuario(Long idUsuario) {
        EventoService.idUsuario = idUsuario;
    }
}
