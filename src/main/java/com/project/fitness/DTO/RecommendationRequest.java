package com.project.fitness.DTO;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {

	
	private Long userId;
	private Long activityId;

	private List<String> suggestions;

	private List<String> safety;
	private List<String> improvemenets;
}
