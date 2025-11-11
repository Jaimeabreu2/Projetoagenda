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
@RequestMapping("/profile")
public class PerfilController {
    private final UsuarioService service;

    public PerfilController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public String mostrarTelaPerfil() {
        return "profile";
    }

    @PostMapping
    @Transactional
    public String processarNovaSenha(@RequestParam String pwd, @RequestParam String newPwd,
                                     @RequestParam String confirmPwd, RedirectAttributes r) {
        if (!service.verificarAlterarSenha(pwd, newPwd, confirmPwd))
            r.addFlashAttribute("warning", "As senhas não coincidem!");
        else if (pwd.equals(newPwd))
            r.addFlashAttribute("warning", "A nova senha dever ser diferente da anterior!");
        else if (pwd.length() < 6)
            r.addFlashAttribute("warning", "A nova senha dever ter, pelo menos, 6 caracteres!");

        return "redirect:/profile";
    }
}
