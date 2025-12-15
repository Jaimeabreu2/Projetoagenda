package br.com.agenda.services;

import br.com.agenda.entities.Evento;
import br.com.agenda.repositories.EventoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Objects;

@Service
public class EventoService {
    private final ArrayList<Evento> eventos = new ArrayList<>();
    private final EventoRepository repository;
    private Long idUsuario;

    public EventoService(EventoRepository repository) {
        this.repository = repository;
    }

    public void salvarEvento(String disciplina, String descricao, String horario, String dia) {
        Evento evento = new Evento(idUsuario, disciplina, descricao, horario, dia);

        repository.save(evento);
        eventos.add(evento);
    }

    public void listarEventos() {
        eventos.clear();

        for (Evento evento : repository.findAll()) {
            if (Objects.equals(evento.getIdUsuario(), idUsuario))
                eventos.add(evento);
        }
    }

    public ArrayList<Evento> getEventos() {
        return eventos;
    }

    public LocalDate[] getDias() {
        LocalDate[] dias = new LocalDate[eventos.size()];

        for (int i = 0; i < eventos.size(); i++)
            dias[i] = eventos.get(i).getDia();

        return dias;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
}
