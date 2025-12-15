package br.com.agenda.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/emailSent")
public class EmailEnviadoController {

    @GetMapping
    public String mostrarTelaEmail() {
        return "emailSent";
    }
}
