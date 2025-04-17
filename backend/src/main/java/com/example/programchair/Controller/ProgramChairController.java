package com.example.programchair.Controller;

import java.util.List;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.server.ResponseStatusException;

import com.example.programchair.Entity.ProgramChair;
import com.example.programchair.ProgramChairRepo;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ProgramChairController {

    @Autowired
    private ProgramChairRepo programChairRepo;

    // Welcome message
    @GetMapping("/home")
    public String home() {
        return "Welcome to the Program Chair application!";
    }

    // Get all program chairs
    @GetMapping
    public List<ProgramChair> getAllProgramChairs() {
        return programChairRepo.findAll();
    }

    // Get a program chair by ID
    @GetMapping("/{id}")
    public Optional<ProgramChair> getProgramChairById(@PathVariable("id") int id) {
        return programChairRepo.findById((long) id)
                .or(() -> {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Program Chair not found");
                });
    }

    // Create a new program chair
    @PostMapping("/program-chair")
    public ResponseEntity<?> createProgramChair(@RequestBody ProgramChair programChair) {
        try {
            ProgramChair savedChair = programChairRepo.save(programChair);
            return new ResponseEntity<>(savedChair, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Error creating program chair: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST);
        }
    }

    // Update an existing program chair
    @PutMapping("/{id}")
    public ResponseEntity<ProgramChair> updateProgramChair(
            @PathVariable("id") int id,
            @RequestBody ProgramChair programChair) {
        try {
            return programChairRepo.findById((long) id)
                    .map(existingChair -> {
                        existingChair.setName(programChair.getName());
                        existingChair.setEmail_id(programChair.getEmail_id());
                        existingChair.setAffiliation(programChair.getAffiliation());
                        existingChair.setPhone_no(programChair.getPhone_no());
                        existingChair.setExpertise_area(programChair.getExpertise_area());
                        existingChair.setConference_id(programChair.getConference_id());
                        ProgramChair updatedChair = programChairRepo.save(existingChair);
                        return ResponseEntity.ok(updatedChair);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/programchairs/{id}")
    public ResponseEntity<ProgramChair> updateProgramChairFields(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        ProgramChair programChair = programChairRepo.findById(id)
                .orElseThrow(() -> new ResourceAccessException("ProgramChair not found"));

        // Apply the updates
        if (updates.containsKey("email_id")) {
            programChair.setEmail_id((String) updates.get("email_id"));
        }
        if (updates.containsKey("phone_no")) {
            programChair.setPhone_no((String) updates.get("phone_no"));
        }

        // Fix: Use the autowired repository
        ProgramChair savedChair = programChairRepo.save(programChair);
        return ResponseEntity.ok(savedChair);
    }

    // Delete a program chair by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProgramChair(@PathVariable("id") int id) {
        try {
            if (programChairRepo.existsById((long) id)) {
                programChairRepo.deleteById((long) id);
                return ResponseEntity.ok("Program Chair deleted");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting program chair: " + e.getMessage());
        }
    }
}
