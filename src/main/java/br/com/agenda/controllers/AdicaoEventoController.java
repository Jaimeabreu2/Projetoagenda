package br.com.agenda.controllers;

import br.com.agenda.entities.Evento;
import br.com.agenda.services.EventoService;
import br.com.agenda.services.UsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;

@Controller
@RequestMapping("/addEventScreen")
public class AdicaoEventoController {
    private final EventoService eventoService;
    private final UsuarioService usuarioService;

    public AdicaoEventoController(EventoService eventoService, UsuarioService usuarioService) {
        this.eventoService = eventoService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public String mostrarTelaAdicaoEventos(Model model) {
        if (usuarioService.getIdAtual() == -1L)
            return "error401";

        ArrayList<Evento> eventos = eventoService.getEventos();
        model.addAttribute("eventos", eventos);

        return "addEventScreen";
    }

    @PostMapping
    @Transactional
    public String salvarEvento(@RequestParam String disciplina, @RequestParam String descricao,
                               @RequestParam String horario, @RequestParam String dia) {
        eventoService.salvarEvento(disciplina, descricao, horario, dia);

        return "redirect:/calendarComAgenda";
    }
}
