package br.com.agenda.components;

import br.com.agenda.entities.Evento;
import br.com.agenda.entities.Usuario;
import br.com.agenda.services.EventoService;
import br.com.agenda.services.UsuarioService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import jakarta.mail.*;
import jakarta.mail.internet.*;

import java.io.FileReader;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Properties;

@Component
public class ResumoSemanalComponent {
    private final UsuarioService usuarioService;
    private final EventoService eventoService;

    public ResumoSemanalComponent(UsuarioService usuarioService, EventoService eventoService) {
        this.usuarioService = usuarioService;
        this.eventoService = eventoService;
    }

    private String escreverMensagem(Long idUsuario) {
        StringBuilder msg = new StringBuilder();

        msg.append("Olá!\n\nAqui estão seus eventos desta semana:\n\n");

        eventoService.setIdUsuario(idUsuario);
        eventoService.listarEventos();

        if (eventoService.getEventos().isEmpty()) {
            msg.append("Você não possui eventos agendados para esta semana.\n");
        } else {
            for (Evento evento : eventoService.getEventos()) {
                msg.append("• ").append(evento.getDisciplina()).append(" - ").append(evento.getDescricao()).
                        append(" no dia ").append(evento.getDia()).append(" às ").append(evento.getHorario()).
                        append("\n");
            }
        }

        msg.append("\nTenha uma ótima semana!\n");

        return msg.toString();
    }


    @Scheduled(cron = "0 26 16 ? * FRI")
    public void executarTodoSabado() {
        for (Usuario usuario : usuarioService.listarUsuarios()) {
            if (!usuario.getResumoSemanal())
                continue;

            try {
                Gson gson = new Gson();
                Type tipoMapa = new TypeToken<Map<String, String>>() {
                }.getType();
                Map<String, String> config;

                try (FileReader reader = new FileReader("config-email.json")) {
                    config = gson.fromJson(reader, tipoMapa);
                }

                final String meuEmail = config.get("email");
                final String senhaApp = config.get("senhaApp");

                Properties props = new Properties();
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");
                props.put("mail.smtp.host", "smtp.gmail.com");
                props.put("mail.smtp.port", "587");

                Session session = Session.getInstance(props, new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(meuEmail, senhaApp);
                    }
                });

                LocalDate hoje = LocalDate.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                String hojeStr = hoje.format(formatter);

                Message mensagem = new MimeMessage(session);
                mensagem.setFrom(new InternetAddress(meuEmail));
                mensagem.setRecipients(Message.RecipientType.TO, InternetAddress.parse(usuario.getEmail()));
                mensagem.setSubject("Resumo Semanal - " + hojeStr);
                mensagem.setText(escreverMensagem(usuario.getId()));

                Transport.send(mensagem);
            } catch (Exception e) {
                System.err.println("Erro ao enviar e-mail: " + e.getMessage());
            }
        }

        Long idAtual = usuarioService.getIdAtual();

        if (idAtual != -1L) {
            eventoService.setIdUsuario(idAtual);
            eventoService.listarEventos();
        }
    }
}
