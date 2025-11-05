package br.com.agenda.services;

import br.com.agenda.entities.Usuario;
import br.com.agenda.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public void cadastrar(Usuario usuario) {
        repository.save(usuario);
    }

    public boolean verificarEmailExistente(String email) {
        for (Usuario usuario : repository.findAll()) {
            if (usuario.getEmail().equals(email)) {
                EventoService.setIdAtual(usuario.getId());
                return true;
            }
        }
        return false;
    }

    public boolean verificarLoginValido(String email, String senha) {
        for (Usuario usuario : repository.findAll()) {
            if (usuario.getEmail().equals(email) && usuario.getSenha().equals(senha)) {
                EventoService.setIdAtual(usuario.getId());
                return true;
            }
        }
        return false;
    }
}
