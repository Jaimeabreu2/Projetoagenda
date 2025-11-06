package br.com.agenda.controllers;

import br.com.agenda.services.UsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/perfil")
public class PerfilController {
    private final UsuarioService service;

    public PerfilController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public String mostrarTelaPerfil() {
        return "perfil";
    }

    @PostMapping
    @Transactional
    public String processarNovaSenha(@RequestParam String pwd, @RequestParam String newPwd,
                                     @RequestParam String confirmPwd, RedirectAttributes redirectAttributes) {

        return "redirect:/perfil";
    }
}
