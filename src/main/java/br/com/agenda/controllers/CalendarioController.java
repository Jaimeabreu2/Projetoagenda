package br.com.agenda.controllers;

import br.com.agenda.services.EventoService;
import br.com.agenda.services.UsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.ui.Model;

import java.time.LocalDate;

@Controller
@RequestMapping("/calendarComAgenda")
public class CalendarioController {
    private final EventoService service;

    public CalendarioController(EventoService service) {
        this.service = service;
    }

    @GetMapping
    public String mostrarTelaCalendario(Model model) {
        if (UsuarioService.getIdAtual() < 0L)
            return "erro401";

        String avisosHtml = service.getEventosHtml();
        model.addAttribute("avisosHtml", avisosHtml);

        return "calendarComAgenda";
    }

    @PostMapping
    @Transactional
    public String salvarEvento(@RequestParam String titulo, @RequestParam LocalDate data, RedirectAttributes redirectAttributes) {
        if (service.verificarEventoExistente(titulo, data))
            redirectAttributes.addFlashAttribute("warning", "EVENTO JÁ CADASTRADO!");
        else
            service.salvarEvento(titulo, data);

        return "redirect:/calendarComAgenda";
    }
}
