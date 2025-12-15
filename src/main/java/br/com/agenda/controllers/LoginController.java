package br.com.agenda.controllers;

import br.com.agenda.entities.Usuario;
import br.com.agenda.services.JsonService;
import br.com.agenda.services.UsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/")
public class LoginController {
    private final UsuarioService usuarioService;
    private final JsonService jsonService;

    public LoginController(UsuarioService usuarioService, JsonService jsonService) {
        this.usuarioService = usuarioService;
        this.jsonService = jsonService;
    }

    @PostMapping
    @Transactional
    public String processarLogin(
            @RequestParam(name = "manterLogado", required = false, defaultValue = "false") boolean manterLogado,
            @RequestParam String email,
            @RequestParam String senha,
            RedirectAttributes redirectAttributes) {

        if (usuarioService.verificarLoginValido(email, senha)) {
            Usuario usuario = usuarioService.getUsuarioAtual();

            if (manterLogado)
                jsonService.salvarDados(usuario.getId(), usuario.getEmail(), usuario.getSenha());
            else
                jsonService.salvarDados(-1L, "", "");

            return "redirect:/calendarComAgenda";
        } else {
            redirectAttributes.addFlashAttribute("warning", "E-MAIL E/OU SENHA INVÁLIDOS!");
            return "redirect:/";
        }
    }

    @GetMapping
    public String mostrarTelaLogin(Model model) {
        boolean manterLogado = jsonService.getId() > -1L;
        String email = jsonService.getEmail(), senha = jsonService.getSenha();

        model.addAttribute("manterLogado", manterLogado);
        model.addAttribute("email", email);
        model.addAttribute("senha", senha);

        return "index";
    }
}
