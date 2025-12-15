package br.com.agenda.controllers;

import br.com.agenda.entities.Usuario;
import br.com.agenda.services.EmailService;
import br.com.agenda.services.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/emailEntered")
public class EmailDigitadoController {
    private final UsuarioService usuarioService;
    private final EmailService emailService;

    public EmailDigitadoController(UsuarioService usuarioService, EmailService emailService) {
        this.usuarioService = usuarioService;
        this.emailService = emailService;
    }

    @GetMapping
    public String mostrarTelaEmail() {
        return "emailEntered";
    }

    @PostMapping
    public String processarEmail(@RequestParam("email") String email) {
        Usuario usuario;

        if ((usuario = usuarioService.getUsuarioPorEmail(email)) != null) {
            emailService.enviarSenhaDecorada(usuario);
            return "redirect:/emailSent";
        }

        return "redirect:/emailNotSent";
    }
}
