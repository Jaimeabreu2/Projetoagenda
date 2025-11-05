package br.com.agenda.services;

import br.com.agenda.entities.Evento;
import br.com.agenda.repositories.EventoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class EventoService {
    private final EventoRepository repository;
    private static Long idAtual = -1L;

    public EventoService(EventoRepository repository) {
        this.repository = repository;
    }

    public static void setIdAtual(Long idAtual) {
        EventoService.idAtual = idAtual;
    }

    public static Long getIdAtual() {
        return EventoService.idAtual;
    }

    public void salvarEvento(String titulo, LocalDate data) {
        repository.save(new Evento(idAtual, titulo, data));
    }

    public boolean verificarEventoExistente(String titulo, LocalDate data) {
        for (Evento e : repository.findAll()) {
            if (Objects.equals(e.getIdUsuario(), idAtual) && e.getTitulo().equals(titulo) && e.getData().equals(data))
                return true;
        }
        return false;
    }

    public String getEventosHtml() {
        List<Evento> eventosUsuario = repository.findAll().stream().
                filter(e -> Objects.equals(e.getIdUsuario(), idAtual)).toList();

        int totalEventos = eventosUsuario.size();
        StringBuilder sb = new StringBuilder();

        if (totalEventos > 0) {
            if (totalEventos > 4)
                sb.append("<div style='max-height:300px; overflow-y:auto; padding-right:8px;'>");
            else
                sb.append("<div>");

            for (Evento evento : eventosUsuario) {
                sb.append("<div class='evento-item' style='").append("background:#fff;").append("border-radius:8px;")
                        .append("padding:10px;").append("margin-bottom:8px;").append("box-shadow:0 2px 6px rgba(0,0,0,0.1);")
                        .append("transition:transform 0.2s;'>").append("<div style='font-weight:bold;color:#4CAF50;margin-bottom:4px;'>")
                        .append(evento.getTitulo()).append("</div>").append("<div style='color:#555;font-size:14px;'>📅 ")
                        .append(evento.getData()).append("</div>").append("</div>");
            }

            sb.append("</div>");
        } else {
            sb.append("<div class='alert-warning'>").append("Nenhum evento cadastrado ainda.").append("</div>");
        }

        return sb.toString();
    }
}
