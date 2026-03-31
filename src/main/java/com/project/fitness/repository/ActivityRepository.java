package com.project.fitness.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.fitness.models.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

	List<Activity> findByUserId(Integer userId); // JPA WILL GENERATE QUERY FOR THIS FORMAT WRITE IN 
    
	
	
}
