package br.com.agenda.services;

import br.com.agenda.entities.Usuario;
import br.com.agenda.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {
    private static Long idAtual = -1L;
    private final UsuarioRepository repository;
    private final EventoService eventoService;

    public UsuarioService(UsuarioRepository repository, EventoService eventoService) {
        this.repository = repository;
        this.eventoService = eventoService;
    }

    public void cadastrar(Usuario usuario) {
        repository.save(usuario);
    }

    public Usuario getUsuarioAtual() {
        Optional<Usuario> usuario = repository.findById(idAtual);
        return usuario.orElse(null);
    }

    public void deletarUsuario() {
        repository.deleteById(idAtual);
    }

    public boolean verificarEmailExistente(String email) {
        for (Usuario usuario : repository.findAll()) {
            if (usuario.getEmail().equals(email))
                return true;
        }
        return false;
    }

    public boolean verificarLoginValido(String email, String senha) {
        for (Usuario usuario : repository.findAll()) {
            if (usuario.getEmail().equals(email) && usuario.getSenha().equals(senha)) {
                idAtual = usuario.getId();
                EventoService.setIdUsuario(idAtual);
                eventoService.listarEventos();
                return true;
            }
        }
        return false;
    }

    public boolean verificarAlterarSenha(String senha_atual, String nova_senha, String confirmar_senha) {
        Usuario usuario = getUsuarioAtual();

        if (usuario.getSenha().equals(senha_atual) && nova_senha.equals(confirmar_senha)) {
            alterarSenha(usuario, nova_senha);
            return true;
        } else {
            return false;
        }
    }

    private void alterarSenha(Usuario usuario, String nova_senha) {
        usuario.setSenha(nova_senha);
        repository.save(usuario);
    }

    public static Long getIdAtual() {
        return idAtual;
    }
}
