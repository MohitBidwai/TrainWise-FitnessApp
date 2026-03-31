package com.project.fitness.service;

import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import com.project.fitness.DTO.RecommendationRequest;
import com.project.fitness.models.Activity;
import com.project.fitness.models.Recommendations;
import com.project.fitness.models.User;
import com.project.fitness.repository.ActivityRepository;
import com.project.fitness.repository.RecommendationRepository;
import com.project.fitness.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class RecommendationService {
	
	private final UserRepository userRepository;
	private final RecommendationRepository recommendationRepository;
    private final ActivityRepository activityRepository;
	public Recommendations generateRecommendation(RecommendationRequest recommendationRequest) {
		// TODO Auto-generated method stub
		
		User user  = userRepository.findById(recommendationRequest.getUserId()).orElseThrow(()-> new RuntimeException("No User found"));
		Activity activity = activityRepository.findById(recommendationRequest.getActivityId()).orElseThrow(()-> new RuntimeException("No Activity found"));
		
		Recommendations recommendation = Recommendations.builder().
				activity(activity).
				user(user).
				improvemenets(recommendationRequest.getImprovemenets()).
				suggestions(recommendationRequest.getSuggestions()).safety(recommendationRequest.getSafety()).
				build();
		
		return recommendationRepository.save(recommendation);
	}
	public List<Recommendations> getUserRecommendation(Long userId) {
		// TODO Auto-generated method stub
		return recommendationRepository.findByUserId(userId);
	
		
	}
	
	public List<Recommendations> getActivityRecommendation(Long activityId) {
		// TODO Auto-generated method stub
		return recommendationRepository.findByActivityId(activityId);
		
		
	}
	

}
