package br.com.agenda.controllers;

import br.com.agenda.entities.Evento;
import br.com.agenda.services.EventoService;
import br.com.agenda.services.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.util.ArrayList;

@Controller
@RequestMapping("/calendarComAgenda")
public class CalendarioController {
    private final EventoService service;

    public CalendarioController(EventoService service) {
        this.service = service;
    }

    @GetMapping
    public String mostrarTelaCalendario(Model model) {
        ArrayList<Evento> eventos = service.getEventos();

        if (UsuarioService.getIdAtual() == -1L)
            return "error401";

        model.addAttribute("eventos", eventos);
        return "calendarComAgenda";
    }
}
