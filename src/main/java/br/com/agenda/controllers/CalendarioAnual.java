package br.com.agenda.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/yearCalendar")
public class CalendarioAnual {

    @GetMapping
    public String mostrarTelaCalendario() {
        return "yearCalendar";
    }
}
