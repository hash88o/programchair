package com.example.programchair.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "program_chair")
public class ProgramChair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chair_id;
    private String name;
    private String email_id;
    private String affiliation;
    private String phone_no;
    private String expertise_area;
    private int conference_id;

    // Default constructor
    public ProgramChair() {
    }

    // Parameterized constructor
    public ProgramChair(int chair_id, String name, String email_id, String affiliation, String phone_no,
            String expertise_area, int conference_id) {
        this.chair_id = chair_id;
        this.name = name;
        this.email_id = email_id;
        this.affiliation = affiliation;
        this.phone_no = phone_no;
        this.expertise_area = expertise_area;
        this.conference_id = conference_id;
    }

    // Getters and setters
    public int getChair_id() {
        return chair_id;
    }

    public void setChair_id(int id) {
        this.chair_id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail_id() {
        return email_id;
    }

    public void setEmail_id(String email_id) {
        this.email_id = email_id;
    }

    public String getAffiliation() {
        return affiliation;
    }

    public void setAffiliation(String affiliation) {
        this.affiliation = affiliation;
    }

    public String getPhone_no() {
        return phone_no;
    }

    public void setPhone_no(String phone_no) {
        this.phone_no = phone_no;
    }

    public String getExpertise_area() {
        return expertise_area;
    }

    public void setExpertise_area(String expertise_area) {
        this.expertise_area = expertise_area;
    }

    public int getConference_id() {
        return conference_id;
    }

    public void setConference_id(int conference_id) {
        this.conference_id = conference_id;
    }

    @Override
    public String toString() {
        return "ProgramChair [chair_id=" + chair_id + ", name=" + name + ", email_id=" + email_id +
                ", affiliation=" + affiliation + ", phone_no=" + phone_no +
                ", expertise_area=" + expertise_area + ", conference_id=" + conference_id + "]";
    }
}
