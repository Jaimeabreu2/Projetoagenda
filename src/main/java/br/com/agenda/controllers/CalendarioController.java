package br.com.agenda.controllers;

import br.com.agenda.services.EventoService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.ui.Model;

import java.time.LocalDate;

@Controller
@RequestMapping("/calendario")
public class CalendarioController {
    private final EventoService service;

    public CalendarioController(EventoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<String> mostrarTelaCalendario(Model model) {
        String avisosHtml = service.getEventosHtml();

        if (EventoService.getIdAtual() < 0L)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Acesso não autorizado!");

        model.addAttribute("avisosHtml", avisosHtml);
        return ResponseEntity.ok("calendario");
    }

    @PostMapping
    @Transactional
    public String salvarEvento(@RequestParam String titulo, @RequestParam LocalDate data, RedirectAttributes redirectAttributes) {
        if (service.verificarEventoExistente(titulo, data))
            redirectAttributes.addFlashAttribute("warning", "EVENTO JÁ CADASTRADO!");
        else
            service.salvarEvento(titulo, data);

        return "redirect:/calendario";
    }
}
