package com.project.fitness.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.fitness.DTO.ActivityRequest;
import com.project.fitness.DTO.ActivityResponse;
import com.project.fitness.service.ActivityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/activities")
public class ActivityController {

	private final ActivityService activityService;
	
	@PostMapping
	public ResponseEntity<?> trackActivities(@RequestBody ActivityRequest activityRequest )
	{
		return ResponseEntity.ok(activityService.trackActivity(activityRequest));
	}
	
	@GetMapping("/users/{userId}")
	public ResponseEntity<List<ActivityResponse>> getUserActivity(@PathVariable Integer userId)
	{
		return ResponseEntity.ok(activityService.getUserActivity(userId));
	}
	
}
