// get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// if not logged in, kick them out
if (!user) {
  window.location.href = "login.html";
} else {
  // personalize dashboard
  document.getElementById(
    "welcomeText"
  ).textContent = `Welcome, ${user.name} 👋`;
}

// logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});
// New interview functionality
const startInterviewBtn = document.getElementById("startInterviewBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const questionDisplay = document.getElementById("currentQuestion");
const answerInput = document.getElementById("answerInput");
const progressIndicator = document.getElementById("progressIndicator");
const feedbackArea = document.getElementById("feedback-area");

let questions = [];
let currentQuestionIndex = 0;

// Function to fetch questions from the backend
async function fetchQuestions() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/interview/questions"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch interview questions.");
    }
    questions = await response.json();
    startInterview();
  } catch (error) {
    console.error("Error:", error);
    questionDisplay.textContent =
      "Could not load questions. Please try again later.";
  }
}

// Function to start the interview
function startInterview() {
  if (questions.length === 0) {
    questionDisplay.textContent = "No questions available.";
    return;
  }
  currentQuestionIndex = 0;
  updateInterviewUI();
  startInterviewBtn.style.display = "none";
  nextQuestionBtn.style.display = "inline-block";
  answerInput.style.display = "block";
}

// Function to display the current question
function updateInterviewUI() {
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    questionDisplay.textContent = question.question;
    progressIndicator.textContent = `Question ${currentQuestionIndex + 1} of ${
      questions.length
    }`;
    answerInput.value = ""; // Clear the text area for the new question
  } else {
    questionDisplay.textContent = "Interview complete! Great job!";
    progressIndicator.textContent = "";
    nextQuestionBtn.style.display = "none";
    answerInput.style.display = "none";
    // Here you would send the answers to the backend for AI feedback
  }
}

// Event listeners for the buttons
startInterviewBtn.addEventListener("click", () => {
  fetchQuestions();
});


nextQuestionBtn.addEventListener('click', async () => {
    const userAnswer = answerInput.value;
    const question = questions[currentQuestionIndex].question;
    
    // Check if the user has provided an answer
    if (userAnswer) {
        // Show a loading message
        feedbackArea.textContent = "Getting feedback...";
        feedbackArea.style.color = "gray";

        try {
            const response = await fetch('http://localhost:5000/api/interview/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, userAnswer }),
            });

            const result = await response.json();
            
            // Clear the loading message and display the feedback
            feedbackArea.textContent = result.feedback;
            feedbackArea.style.color = "black";
            
        } catch (error) {
            console.error('Error fetching AI feedback:', error);
            feedbackArea.textContent = 'Could not get feedback. Please try again.';
            feedbackArea.style.color = "red";
        }
    } else {
        feedbackArea.textContent = "Please provide an answer before moving on.";
        feedbackArea.style.color = "red";
    }

    // Move to the next question
    currentQuestionIndex++;
    updateInterviewUI();
});

// Original logout button script
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});
