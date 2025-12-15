package br.com.agenda.controllers;

import br.com.agenda.entities.Evento;
import br.com.agenda.services.EventoService;
import br.com.agenda.services.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.time.LocalDate;
import java.util.ArrayList;

@Controller
@RequestMapping("/calendarComAgenda")
public class CalendarioController {
    private final UsuarioService usuarioService;
    private final EventoService eventoService;

    public CalendarioController(UsuarioService usuarioService, EventoService eventoService) {
        this.usuarioService = usuarioService;
        this.eventoService = eventoService;

        eventoService.deletarEventosPassados();
    }

    @GetMapping
    public String mostrarTelaCalendario(Model model) {
        if (usuarioService.getIdAtual() == -1L)
            return "error401";

        LocalDate[] dias = eventoService.getDias();
        ArrayList<Evento> eventos = eventoService.getEventos();

        model.addAttribute("dias", dias);
        model.addAttribute("eventos", eventos);

        return "calendarComAgenda";
    }
}
