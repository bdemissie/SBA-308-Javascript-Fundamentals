Function: getLearnerData

Purpose:

This function calculates learner data based on provided CourseInfo, AssignmentGroup, and LearnerSubmissions. It computes the weighted average score and percentage scores for each assignment. The function considers late submissions and skipped assignments. The function returns an array objects containing their IDs, weighted averages, and assignment scores.

Function Inputs:
CourseInfo: Object containing information about the course.

AssignmentGroup: Object representing a group of assignments within the course.

LearnerSubmissions: Array of objects representing submissions made by students.


Error Handling:

Throws an error if the course_id of the AssignmentGroup does not match the id of the CourseInfo.

Throws an error if the assignment points_possible is zero or negative
