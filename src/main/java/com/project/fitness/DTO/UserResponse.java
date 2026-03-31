package com.project.fitness.DTO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

	
    private Long id;
	private String emailId;
	private String firstName;
	private String lastName;
	private LocalDateTime created_At;
	private LocalDateTime updated_At;
    
}
