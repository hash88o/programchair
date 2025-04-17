package com.example.programchair;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.programchair.Entity.ProgramChair;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramChairRepo extends JpaRepository<ProgramChair, Long> {
    // Additional query methods can be defined here
}
