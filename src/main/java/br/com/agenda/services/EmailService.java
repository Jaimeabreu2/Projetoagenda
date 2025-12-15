package br.com.agenda.services;

import br.com.agenda.entities.Usuario;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.lang.reflect.Type;
import java.util.Map;
import java.util.Properties;

@Service
public class EmailService {

    private final String meuEmail;
    private final String senhaApp;
    private final Session session;

    public EmailService() throws Exception {
        Gson gson = new Gson();
        Type tipoMapa = new TypeToken<Map<String, String>>() {}.getType();
        Map<String, String> config;

        try (FileReader reader = new FileReader("config-email.json")) {
            config = gson.fromJson(reader, tipoMapa);
        }

        this.meuEmail = config.get("email");
        this.senhaApp = config.get("senhaApp");
        this.session = criarSession();
    }

    private Session criarSession() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        return Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(meuEmail, senhaApp);
            }
        });
    }

    public void enviarSenhaDecorada(Usuario usuario) {
        try {
            Message mensagem = new MimeMessage(session);
            mensagem.setFrom(new InternetAddress(meuEmail));
            mensagem.setRecipients(Message.RecipientType.TO, InternetAddress.parse(usuario.getEmail()));
            mensagem.setSubject("Tua Senha Decorada");

            String htmlMessage = "<!DOCTYPE html>\n" +
                    "<html lang='pt-BR'>\n" +
                    "<head>\n" +
                    "  <meta charset='UTF-8'>\n" +
                    "  <style>\n" +
                    "    body { font-family: Arial, sans-serif; background:#f0f2f5; text-align:center; padding:50px; }\n" +
                    "    .senha-box { background:#fff; padding:30px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.1); display:inline-block; }\n" +
                    "    .senha { font-weight:bold; color:#2a9d8f; font-size:22px; }\n" +
                    "  </style>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "  <div class='senha-box'>\n" +
                    "    <h1>Tua Senha é:</h1>\n" +
                    "    <p class='senha'>" + usuario.getSenha() + "</p>\n" +
                    "  </div>\n" +
                    "</body>\n" +
                    "</html>";

            mensagem.setContent(htmlMessage, "text/html; charset=utf-8");

            Transport.send(mensagem);
            System.out.println("Senha decorada enviada com sucesso!");
        } catch (Exception e) {
            System.err.println("Erro ao enviar senha decorada:");
        }
    }
}
