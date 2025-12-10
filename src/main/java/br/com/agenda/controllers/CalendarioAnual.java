package br.com.agenda.controllers;

import br.com.agenda.services.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/yearCalendar")
public class CalendarioAnual {
    UsuarioService usuarioService;

    public CalendarioAnual(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public String mostrarTelaCalendario() {
        if (usuarioService.getIdAtual() == -1L)
            return "error401";

        return "yearCalendar";
    }
}
