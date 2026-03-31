package com.project.fitness.DTO;

import java.time.LocalDateTime;
import java.util.Map;

import com.project.fitness.models.ActivityType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityRequest {

	@Enumerated(EnumType.STRING)
	private ActivityType type;
	
    private Integer duration;
    
    private Long userId;
   
    private LocalDateTime startTime;
    private Integer caloriesBurned;
    
     private Map<String,Object> additionalMetrics;	
}
