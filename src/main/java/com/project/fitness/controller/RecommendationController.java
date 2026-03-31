package com.project.fitness.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.fitness.DTO.RecommendationRequest;
import com.project.fitness.models.Recommendations;
import com.project.fitness.models.User;
import com.project.fitness.service.RecommendationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendation")
public class RecommendationController {

	private final RecommendationService recommendationService;
	
	@PostMapping("/generate")
	public ResponseEntity<Recommendations> generateRecommendation(@RequestBody RecommendationRequest recommendationRequest){
		
		return ResponseEntity.ok(recommendationService.generateRecommendation(recommendationRequest));
		
	}
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Recommendations>> getUserRecommendation(@PathVariable Long userId){
		
		return ResponseEntity.ok(recommendationService.getUserRecommendation(userId));
		
	}
	
	@GetMapping("/activity/{activityId}")
    public ResponseEntity<List<Recommendations>> getActivityRecommendation(@PathVariable Long activityId){
		
		return ResponseEntity.ok(recommendationService.getActivityRecommendation(activityId));
		
	}
	
	
}
