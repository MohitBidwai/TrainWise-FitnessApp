package com.project.fitness.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.fitness.DTO.ActivityRequest;
import com.project.fitness.DTO.ActivityResponse;
import com.project.fitness.models.Activity;
import com.project.fitness.models.User;
import com.project.fitness.repository.ActivityRepository;
import com.project.fitness.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityService {

	private final ActivityRepository activityRepository;
	private final UserRepository userRepository;
	
	public ActivityResponse trackActivity(ActivityRequest activityRequest)
	{
		
		User user = userRepository.findById(activityRequest.getUserId()).orElseThrow(()-> new RuntimeException("Invalid user ID"));
		Activity activity = Activity.builder().
				user(user).
				type(activityRequest.getType()).
				duration(activityRequest.getDuration()).
				caloriesBurned(activityRequest.getCaloriesBurned()).
				additionalMetrics(activityRequest.getAdditionalMetrics())
				.startTime(activityRequest.getStartTime()).build();
		
		
	Activity savedActivity=	activityRepository.save(activity);
		
 	
			
		return mapToActivityResponse(savedActivity);
		
	}
	
	public ActivityResponse mapToActivityResponse (Activity activity)
	{
		ActivityResponse activityResponse = new ActivityResponse();
		activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
		activityResponse.setId(activity.getId());
		activityResponse.setUserId(activity.getUser().getId());
		activityResponse.setType(activity.getType());
		activityResponse.setDuration(activity.getDuration());
		activityResponse.setCaloriesBurned(activity.getCaloriesBurned());
		activityResponse.setStartTime(activity.getStartTime());
		activityResponse.setCreated_At(activity.getCreated_At());
		activityResponse.setUpdated_At(activity.getUpdated_At());
		
		return activityResponse;
		
	}

	public List<ActivityResponse> getUserActivity(@PathVariable Integer userId) {
		// TODO Auto-generated method stub
		List<Activity> activity = activityRepository.findByUserId(userId);
		
		return activity.
				stream().
				map(this::mapToActivityResponse).
				collect(Collectors.toList());
	}
	
	
}
