package com.project.fitness.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String emailId;
	private String firstName;
	private String lastName;
	private String password;
	private Role role;
	private LocalDateTime created_At;
	private LocalDateTime updated_At;
    
	@OneToMany(mappedBy = "user" , cascade = CascadeType.ALL , orphanRemoval = true)
	@JsonIgnore
	private List<Activity> activites = new ArrayList<>();
	
	@OneToMany(mappedBy = "user" , cascade = CascadeType.ALL , orphanRemoval = true)
	@JsonIgnore
	private List<Recommendations> recommendations = new ArrayList<>();
	
	
	
}
