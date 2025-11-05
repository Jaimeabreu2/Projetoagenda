package br.com.agenda.controllers;

import br.com.agenda.services.UsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/login")
public class LoginController {
    private final UsuarioService service;

    public LoginController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @Transactional
    public String processarLogin(@RequestParam String email, @RequestParam String senha,
                                 RedirectAttributes redirectAttributes) {
        if (service.verificarLoginValido(email, senha)) {
            return "redirect:/calendario";
        } else {
            redirectAttributes.addFlashAttribute("warning", "E-MAIL E/OU SENHA INVÁLIDOS!");
            return "redirect:/login";
        }
    }

    @GetMapping
    public String mostrarTelaLogin() {
        return "login";
    }
}
