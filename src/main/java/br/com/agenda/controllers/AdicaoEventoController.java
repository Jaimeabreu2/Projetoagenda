package br.com.agenda.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/addEventScreen")
public class AdicaoEventoController {

    @GetMapping
    public String mostrarTelaAdicaoEvento() {
        return "addEventScreen";
    }
}
