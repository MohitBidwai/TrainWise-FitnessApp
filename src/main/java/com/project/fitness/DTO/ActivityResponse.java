package com.project.fitness.DTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.fitness.models.ActivityType;
import com.project.fitness.models.Recommendations;
import com.project.fitness.models.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityResponse {

	
	private Long id;
	
	
	private Map<String,Object> additionalMetrics;
	private Integer caloriesBurned;
	private LocalDateTime created_At;
	private Integer duration;
	@Enumerated(EnumType.STRING)
	private ActivityType type;
	private LocalDateTime updated_At;
	private Long userId;
	private LocalDateTime startTime;

	
	
	
	
}
