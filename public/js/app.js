// get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// if not logged in, kick them out
if (!user) {
  window.location.href = "login.html";
} else {
  // personalize dashboard
  const welcomeEl = document.getElementById("welcomeText");
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome, ${user.name} 👋`;
  }
  // Populate profile page data if the elements exist
  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");
  if (profileNameEl && profileEmailEl) {
    profileNameEl.textContent = user.name;
    profileEmailEl.textContent = user.email;
  }
}

// New interview functionality
const startInterviewBtn = document.getElementById("startInterviewBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const questionDisplay = document.getElementById("currentQuestion");
const answerInput = document.getElementById("answerInput");
const progressIndicator = document.getElementById("progressIndicator");
const feedbackArea = document.getElementById("feedback-area");
const progressBarContainer = document.querySelector(".progress-bar-container");
const loadingSpinner = document.getElementById("loading-spinner");
const newButton = document.getElementById("startNewI");

let questions = [];
let currentQuestionIndex = 0;
let interviewFeedback = [];

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

// ... (your existing code)

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

  // Show the progress bar container and set initial width
  progressBarContainer.style.display = "block";
  document.getElementById("progress-bar").style.width = "0%";
}

// Function to display the current question
function updateInterviewUI() {
  // Update progress bar on each question
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;
  document.getElementById(
    "progress-bar"
  ).style.width = `${progressPercentage}%`;

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
    newButton.style.display = "block";

    feedbackArea.textContent = ""; // Clear existing feedback
    interviewFeedback.forEach((feedback, index) => {
      const feedbackItem = document.createElement("p");
      feedbackItem.textContent = `Question ${index + 1} Feedback: ${feedback}`;
      feedbackArea.appendChild(feedbackItem);
    });
    // Hide progress bar on completion
    progressBarContainer.style.display = "none";
  }
}

// Event listeners for the buttons
startInterviewBtn.addEventListener("click", () => {
  fetchQuestions();
});

nextQuestionBtn.addEventListener("click", async () => {
  const userAnswer = answerInput.value;
  const question = questions[currentQuestionIndex].question;

  // Check if the user has provided an answer
  if (!userAnswer) {
    feedbackArea.textContent = "Please provide an answer before moving on.";
    feedbackArea.style.color = "red";
    return;
  }

  feedbackArea.style.display = "none";
  loadingSpinner.style.display = "block";

  try {
    const response = await fetch(
      "http://localhost:5000/api/interview/feedback",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, userAnswer }),
      }
    );

    const result = await response.json();

    // Hide the spinner, show feedback text
    loadingSpinner.style.display = "none";
    feedbackArea.style.display = "block";
    feedbackArea.textContent = result.feedback;
    feedbackArea.style.color = "black";

    // Store feedback after receiving it
    interviewFeedback.push(result.feedback);

    // Increment index and update UI with the next question
    currentQuestionIndex++;
    updateInterviewUI();

    // After the last question, set progress bar to 100%
    if (currentQuestionIndex === questions.length) {
      document.getElementById("progress-bar").style.width = "100%";
    }
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    feedbackArea.textContent = "Could not get feedback. Please try again.";
    feedbackArea.style.color = "red";
    loadingSpinner.style.display = "none";
    feedbackArea.style.display = "block";
  }
});

newButton.addEventListener("click", () => {
  // Reset state for a new interview
  interviewFeedback = [];
  currentQuestionIndex = 0;
  updateInterviewUI();
  newButton.style.display = "none";
  nextQuestionBtn.style.display = "inline-block";
  answerInput.style.display = "block";
  feedbackArea.textContent = "";
  startInterviewBtn.style.display = "none";
  progressBarContainer.style.display = "block";
  document.getElementById("progress-bar").style.width = "0%";
});

// ... (your existing code for logout button)
// Original logout button script
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "index.html";
});
