package br.com.agenda.controllers;

import br.com.agenda.services.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/calendar")
public class CalendarioSecundarioController {

    @GetMapping
    public String mostrarTelaCalendario() {
        if (UsuarioService.getIdAtual() == -1L)
            return "error401";

        return "calendar";
    }
}