package br.com.agenda.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/error401")
public class Erro401Controller {

    @GetMapping
    public String mostrarTelaError() {
        return "error401";
    }
}
