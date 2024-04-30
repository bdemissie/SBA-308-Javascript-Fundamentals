// You will create a script that gathers data, processes it, and then outputs a consistent result as described by a specification. This is a very typical situation in industry, and this particular scenario has been modified from a real application. The data you will use is provided below.
// You will be provided with four different types of data:
// A CourseInfo object, which looks like this:
// {
//   "id": number,
//   "name": string,
// }

// An AssignmentGroup object, which looks like this:
// {
//   "id": number,
//   "name": string,
//   // the ID of the course the assignment group belongs to
//   "course_id": number,
//   // the percentage weight of the entire assignment group
//   "group_weight": number,
//   "assignments": [AssignmentInfo],
// }

// Each AssignmentInfo object within the assignments array looks like this:
// {
//   "id": number,
//   "name": string,
//   // the due date for the assignment
//   "due_at": Date string,
//   // the maximum points possible for the assignment
//   "points_possible": number,
// }

// An array of LearnerSubmission objects, which each look like this:
// {
//     "learner_id": number,
//     "assignment_id": number,
//     "submission": {
//       "submitted_at": Date string,
//       "score": number
//     }
// }

// Your goal is to analyze and transform this data such that the output of your program is an array of objects, each containing the following information in the following format:
// {
//     // the ID of the learner for which this data has been collected
//     "id": number,
//     // the learner’s total, weighted average, in which assignments
//     // with more points_possible should be counted for more
//     // e.g. a learner with 50/100 on one assignment and 190/200 on another
//     // would have a weighted average score of 240/300 = 80%.
//     "avg": number,
//     // each assignment should have a key with its ID,
//     // and the value associated with it should be the percentage that
//     // the learner scored on the assignment (submission.score / points_possible)
//     <assignment_id>: number,
//     // if an assignment is not yet due, it should not be included in either
//     // the average or the keyed dictionary of scores
// }

// The provided assignment group.

const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};


// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];


function getLearnerData(course, ag, submissions) {

    // Initialize the variable
  
    let possibleTotal = 0;
    let learnerTotalScore = 0;
    let weightedAverage = 0;
    let percentageScore = 0;
    let LearnerData = [];
    let assignmentScores = [];
  
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
  
        // calculate weightedAverage
  
        possibleTotal += possiblePoints;
        learnerScore = learnerScore - latePenality * 0.1 * possiblePoints;
        learnerTotalScore += learnerScore;
  
        // calculate scores
        weightedAverage = learnerTotalScore / possibleTotal;
        percentageScore = learnerScore / possiblePoints;
        assignmentScore[submission.assignment_id] = percentageScore;
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