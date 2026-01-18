package com.project.fitness.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

@Entity
@Data // geeter setter combination
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
     
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@JdbcTypeCode(SqlTypes.JSON)
	@Column(columnDefinition = "json")
	private Map<String,Object> additionalMetrics;
	private Integer caloriesBurned;
	private LocalDateTime created_At;
	private Integer duration;
	@Enumerated(EnumType.STRING)
	private ActivityType type;
	private LocalDateTime updated_At;
	
	
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id" , nullable = false , foreignKey = @ForeignKey(name = "fk_activity_user"))
	@JsonIgnore
	private User user;
	

	@OneToMany(mappedBy = "activity" ,cascade = CascadeType.ALL  , orphanRemoval = true)
	@JsonIgnore
	List<Recommendations> recommendations = new ArrayList<>();
}
