package br.com.agenda.repositories;

import br.com.agenda.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    void deleteByDiaBefore(LocalDate data);
}
