package br.com.agenda.services;

import br.com.agenda.entities.Usuario;
import br.com.agenda.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UsuarioService {
    private static Long idAtual = -1L;
    private final UsuarioRepository repository;
    private final EventoService eventoService;
    private boolean podeAlterarSenha;
    private Usuario usuario;

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
        for (Usuario usuarioAtual : repository.findAll()) {
            if (usuarioAtual.getEmail().equals(email) && usuarioAtual.getSenha().equals(senha)) {
                idAtual = usuarioAtual.getId();
                usuario = usuarioAtual;
                usuario.setUltimoLogin(LocalDate.now());
                eventoService.setIdUsuario(idAtual);
                eventoService.listarEventos();

                reajustarUsuario();
                return true;
            }
        }
        return false;
    }

    public boolean verificarAlterarSenha(String senha_atual, String nova_senha, String confirmar_senha) {
        podeAlterarSenha = usuario.getSenha().equals(senha_atual) && nova_senha.equals(confirmar_senha);
        return podeAlterarSenha;
    }

    public void alterarInformacoes(boolean notificacaoEmail, boolean resumoSemanal, String nome, String email, String novaSenha) {
        usuario.setNotificacaoEmail(notificacaoEmail);
        usuario.setResumoSemanal(resumoSemanal);
        usuario.setEmail(email);
        usuario.setNome(nome);

        if (podeAlterarSenha)
            usuario.setSenha(novaSenha);

        podeAlterarSenha = false;
    }

    public void reajustarUsuario() {
        repository.save(usuario);
    }

    public static Long getIdAtual() {
        return idAtual;
    }
}
