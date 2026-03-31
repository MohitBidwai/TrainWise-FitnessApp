package com.project.fitness.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.fitness.models.Recommendations;


@Repository
public interface RecommendationRepository extends JpaRepository<Recommendations, Long> {

	List<Recommendations> findByUserId(Long userId);

	List<Recommendations> findByActivityId(Long activityId);

}
