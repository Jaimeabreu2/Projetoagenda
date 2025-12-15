package br.com.agenda.controllers;

import br.com.agenda.entities.Usuario;
import br.com.agenda.services.UsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/signup")
public class CadastroController {

    private final UsuarioService service;

    public CadastroController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @Transactional
    public String processarCadastro(@RequestParam String nome, @RequestParam String email,
                                    @RequestParam String senha, RedirectAttributes redirectAttributes) {
        if (service.verificarEmailExistente(email)) {
            redirectAttributes.addFlashAttribute("warning", "E-mail já cadastrado!");
            return "redirect:/signup";
        } else if (senha.length() < 6) {
            redirectAttributes.addFlashAttribute("warning", "Senha inválida! Coloque, pelo menos, 6 caracteres.");
            return "redirect:/signup";
        } else {
            service.cadastrar(new Usuario(nome, email, senha));
            return "redirect:/";
        }
    }

    @GetMapping
    public String mostrarTelaCadastro() {
        return "signup";
    }
}
