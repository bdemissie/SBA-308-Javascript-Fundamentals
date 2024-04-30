
function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {

    // Check if AssignmentGroup belongs to the CourseInfo
    
    if (CourseInfo.id !== AssignmentGroup.course_id) {
        
        throw new Error("CourseInfo.id !== AssignmentGroup.course_id")
    }
    
    // Initialize the variable
  
    let possibleTotal = 0;
    let learnerTotalScore = 0;
    let weightedAverage = 0;
    let percentageScore = 0;
    let LearnerData = [];
      
    // get unique student IDs
  
    let studentIds = getUniqueStudentIds(LearnerSubmissions);
  
    for (let studentId of studentIds) {
      let assignmentScore = {};
  
      // Filterout the submissions that match the studentId
  
      let studentSubmissions = LearnerSubmissions.filter(
        (submission) => submission.learner_id === studentId
      );
  
      for (let submission of studentSubmissions) {
        // Match assignment_id with AssginmentGroup.assignment.id
  
        let assignment = AssignmentGroup.assignments.find(
          (assignment) => assignment.id === submission.assignment_id
        );
  
        // Skip assignment if not found
  
        if (!assignment) {
          continue;
        }
  
        // Remove the assignments that are not due
  
        if (new Date(assignment.due_at) > new Date()) {
          continue;
        }
  
        let possiblePoints = assignment.points_possible;
        let learnerScore = submission.submission.score;
  
        // Check for late submission
  
        let latePenality = checkLateSubmission(
          assignment.due_at,
          submission.submission.submitted_at
        );

// Calculate Weighted Average and Assignment Scores

        try {

            if (possiblePoints <= 0) {

                console.error(`zero or negative possible_points value for Assignment submission with assignment id ${assignment.id}. Entry skipped`)
                continue;

            }

        possibleTotal += possiblePoints;
        learnerScore = learnerScore - latePenality * 0.1 * possiblePoints;
        learnerTotalScore += learnerScore;
  
        // calculate scores
        weightedAverage = learnerTotalScore / possibleTotal;
        percentageScore = learnerScore / possiblePoints;
        assignmentScore[submission.assignment_id] = percentageScore;


        } catch (error) {

        console.error("An error occurred while processing assignment:", error.message);

    }
  
        
      }
  
    LearnerData.push({
        id: studentId,
        avg: weightedAverage,
        ...assignmentScore,
      });
  
      learnerTotalScore = 0;
      possibleTotal = 0;
    }
  
    return LearnerData;
  }
  
  //   Check for late submission
  
  function checkLateSubmission(dueDate, submittedAt) {
    // Convert to date format
  
    let newDueDate = new Date(dueDate);
    let newSubmittedAt = new Date(submittedAt);
  
    if (newSubmittedAt > newDueDate) {
      return true;
    } else {
      return false;
    }
  }
  
  // Get unique Student Ids
  
  function getUniqueStudentIds(LearnerSubmissions) {
    // Extract student Ids from each submission
  
    let studentIds = LearnerSubmissions.map(
      (submission) => submission.learner_id
    );
  
    // Remove duplicated and show only unique student Ids
  
    return (studentIds = [...new Set(studentIds)]);
  }
  
  const LearnerData = getLearnerData(
    CourseInfo,
    AssignmentGroup,
    LearnerSubmissions
  );
  
  console.log(LearnerData);