package br.com.agenda.controllers;

import br.com.agenda.services.EventoService;
import br.com.agenda.services.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDate;

@Controller
@RequestMapping("/yearCalendar")
public class CalendarioAnualController {
    UsuarioService usuarioService;
    EventoService eventoService;

    public CalendarioAnualController(UsuarioService usuarioService, EventoService eventoService) {
        this.usuarioService = usuarioService;
        this.eventoService = eventoService;
    }

    @GetMapping
    public String mostrarTelaCalendario(Model model) {
        if (usuarioService.getIdAtual() == -1L)
            return "error401";

        LocalDate[] dias = eventoService.getDias();
        model.addAttribute("dias", dias);

        return "yearCalendar";
    }
}
