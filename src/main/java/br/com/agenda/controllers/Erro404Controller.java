package br.com.agenda.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class Erro404Controller implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {

        Integer status = (Integer) request.getAttribute("jakarta.servlet.error.status_code");

        if (status == 404)
            return "error404";
        else
            return null;
    }
}
