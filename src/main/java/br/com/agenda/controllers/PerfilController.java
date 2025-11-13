package br.com.agenda.controllers;

import br.com.agenda.entities.Usuario;
import br.com.agenda.services.UsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/profile")
public class PerfilController {
    private final UsuarioService service;

    public PerfilController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public String mostrarTelaPerfil(Model model) {
        Usuario usuario = service.getUsuarioAtual();

        model.addAttribute("usuario", usuario);
        return "profile";
    }

    @PostMapping
    @Transactional
    public String processarNovaSenha(
            @RequestParam(defaultValue = "false") boolean notificacaoEmail,
            @RequestParam(defaultValue = "false") boolean resumoSemanal,
            @RequestParam String nome,
            @RequestParam String email,
            @RequestParam(required = false) String pwd,
            @RequestParam(required = false) String newPwd,
            @RequestParam(required = false) String confirmPwd,
            RedirectAttributes r) {

        if (!service.verificarAlterarSenha(pwd, newPwd, confirmPwd))
            r.addFlashAttribute("warning", "As senhas não coincidem!");
        else if (pwd.equals(newPwd))
            r.addFlashAttribute("warning", "A nova senha dever ser diferente da anterior!");
        else if (pwd.length() < 6)
            r.addFlashAttribute("warning", "A nova senha dever ter, pelo menos, 6 caracteres!");

        service.alterarInformacoes(notificacaoEmail, resumoSemanal, nome, email, newPwd);
        service.reajustarUsuario();

        r.addFlashAttribute("success", "Alterações salvas com sucesso!");
        return "redirect:/profile";
    }
}
