package br.com.agenda.services;

import br.com.agenda.entities.Usuario;
import br.com.agenda.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;

@Service
public class UsuarioService {
    private Long idAtual = -1L;
    private final UsuarioRepository repository;
    private final EventoService eventoService;
    private final JsonService jsonService;
    private boolean podeAlterarSenha;
    private Usuario usuario;

    public UsuarioService(UsuarioRepository repository, EventoService eventoService, JsonService jsonService) {
        this.repository = repository;
        this.eventoService = eventoService;
        this.jsonService = jsonService;
    }

    public void cadastrar(Usuario usuario) {
        repository.save(usuario);
    }

    public Usuario getUsuarioAtual() {
        return usuario;
    }

    public void deletarUsuario() {
        jsonService.salvarDados(-1L, "", "");
        repository.deleteById(idAtual);
    }

    public ArrayList<Usuario> listarUsuarios() {
        return new ArrayList<>(repository.findAll());
    }

    public boolean verificarEmailExistente(String email) {
        for (Usuario usuario : repository.findAll()) {
            if (usuario.getEmail().equals(email))
                return true;
        }
        return false;
    }

    public Usuario getUsuarioPorEmail(String email) {
        for (Usuario usuario : repository.findAll()) {
            if (usuario.getEmail().equals(email))
                return usuario;
        }
        return null;
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
        if (jsonService.getId() != -1L)
            jsonService.salvarDados(idAtual, email, novaSenha);

        podeAlterarSenha = false;
    }

    public void reajustarUsuario() {
        repository.save(usuario);
    }

    private void reajustarUsuarioNulo(Long novoID) {
        if (novoID != -1L) {
            idAtual = novoID;
            eventoService.setIdUsuario(novoID);
            eventoService.listarEventos();

            for (Usuario usuarioAtual : repository.findAll()) {
                if (usuarioAtual.getId().equals(novoID)) {
                    usuario = usuarioAtual;
                    break;
                }
            }

            usuario.setUltimoLogin(LocalDate.now());
        }
    }

    public Long getIdAtual() {
        if (idAtual == -1L)
            reajustarUsuarioNulo(jsonService.getId());

        return idAtual;
    }
}
