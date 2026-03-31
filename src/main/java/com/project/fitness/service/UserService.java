package com.project.fitness.service;

import org.springframework.stereotype.Service;

import com.project.fitness.DTO.RegisterRequest;
import com.project.fitness.DTO.UserResponse;
import com.project.fitness.models.User;
import com.project.fitness.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	
	
	public UserResponse registerUser(RegisterRequest registerUser) {
		// TODO Auto-generated method stub
		
            User user = User.builder().firstName(registerUser.getFirstName()).
            		emailId(registerUser.getEmail()).
            		lastName(registerUser.getLastName()).
            		password(registerUser.getPassword()).
            		build();
            
            
            
            User savedUser =  userRepository.save(user);
            return mapToResponse(savedUser);
	}
	
	public UserResponse mapToResponse(User savedUser)
	{
		UserResponse response = new UserResponse();
		response.setFirstName(savedUser.getFirstName());
		response.setLastName(savedUser.getLastName());
		response.setEmailId(savedUser.getEmailId());
		response.setId(savedUser.getId());
		response.setCreated_At(savedUser.getCreated_At());
		response.setUpdated_At(savedUser.getUpdated_At());
		
		return response;
		
	}
	
	
	

}
