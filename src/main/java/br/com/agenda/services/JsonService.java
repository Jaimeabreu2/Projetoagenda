package br.com.agenda.services;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.FileWriter;

@Service
public class JsonService {
    private final String path = "src/main/java/br/com/agenda/usuario_salvo.json";
    private final Gson gson = new Gson();

    private String email, senha;

    public Long getId() {
        try (FileReader reader = new FileReader(path)) {
            JsonObject obj = gson.fromJson(reader, JsonObject.class);

            email = obj.get("email").getAsString();
            senha = obj.get("senha").getAsString();

            return obj.get("id").getAsLong();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao ler usuario_salvo.json: " + e.getMessage(), e);
        }
    }

    public String getEmail() {
        if (email.isEmpty())
            email = null;

        return email;
    }

    public String getSenha() {
        if (senha.isEmpty())
            senha = null;

        return senha;
    }

    public void salvarDados(Long novoId, String novoEmail, String novaSenha) {
        try (FileWriter writer = new FileWriter(path)) {
            JsonObject obj = new JsonObject();
            obj.addProperty("id", novoId);
            obj.addProperty("email", novoEmail);
            obj.addProperty("senha", novaSenha);

            gson.toJson(obj, writer);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar usuario_salvo.json: " + e.getMessage(), e);
        }
    }
}

