const questions = [
    {
      questionText: "Is this statement false?",
      options: ["1. True", "2. False", "3. This isn't a statement, it's a question!", "4. Unsure"],
      answer: "3. This isn't a statement, it's a question!",
    },
    {
      questionText: "How long is New Zealand's Ninety Mile Beach?",
      options: ["1. 55 miles", "2. 90 miles", "3. 88 miles","4. none of the above"],
      answer: "1. 55 miles",
    },
    {
      questionText: "How many months have 28 days in them?",
      options: ["1. February", "2. Febuary", "3. Frebruary", "4. Every month"],
      answer: "4. Every month",
    },
    {
      questionText: "The company Nintendo started out as a:",
      options: ["1. Card company", "2. Video game company", "3. Mascot merchandise company", "4. Copyright law enforcing company"],
      answer: "1. Card company",
    },
    {
      questionText: "Were any of these questions about Javascript?",
      options: ["1. Not even one!", "2. A few were", "3. All of them were", "4. This question was the only one that mentioned it!"],
      answer: "4. This question was the only one",
    },
  ];
  
  const startCard = document.querySelector("#start-card");
  const questionCard = document.querySelector("#question-card");
  const scoreCard = document.querySelector("#score-card");
  const leaderboardCard = document.querySelector("#leaderboard-card");
  
  function hideCards() {
    startCard.setAttribute("hidden", true);
    questionCard.setAttribute("hidden", true);
    scoreCard.setAttribute("hidden", true);
    leaderboardCard.setAttribute("hidden", true);
  }
  
  const resultDiv = document.querySelector("#result-div");
  const resultText = document.querySelector("#result-text");
  
  function hideResultText() {
    resultDiv.style.display = "none";
  }
  
  var intervalID;
  var time;
  var currentQuestion;
  
  document.querySelector("#start-button").addEventListener("click", startQuiz);
  
  function startQuiz() {
    hideCards();
    questionCard.removeAttribute("hidden");
  
    currentQuestion = 0;
    displayQuestion();
  
    time = questions.length * 10;
  
    intervalID = setInterval(countdown, 1000);
  
    displayTime();
  }
  
  function countdown() {
    time--;
    displayTime();
    if (time < 1) {
      endQuiz();
    }
  }

  const timeDisplay = document.querySelector("#time");
  function displayTime() {
    timeDisplay.textContent = time;
  }
  
  function displayQuestion() {
    let question = questions[currentQuestion];
    let options = question.options;
  
    let h2QuestionElement = document.querySelector("#question-text");
    h2QuestionElement.textContent = question.questionText;
  
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      let optionButton = document.querySelector("#option" + i);
      optionButton.textContent = option;
    }
  }
  
  document.querySelector("#quiz-options").addEventListener("click", checkAnswer);
  
  function optionIsCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
  }
  
  function checkAnswer(eventObject) {
    let optionButton = eventObject.target;
    resultDiv.style.display = "block";
    if (optionIsCorrect(optionButton)) {
      resultText.textContent = "Correct!";
      setTimeout(hideResultText, 1000);
    } else {
      resultText.textContent = "Incorrect!";
      setTimeout(hideResultText, 1000);
      if (time >= 10) {
        time = time - 10;
        displayTime();
      } else {
        time = 0;
        displayTime();
        endQuiz();
      }
    }
  
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  }

  const score = document.querySelector("#score");
  
  function endQuiz() {
    clearInterval(intervalID);
    hideCards();
    scoreCard.removeAttribute("hidden");
    score.textContent = time;
  }
  
  const submitButton = document.querySelector("#submit-button");
  const inputElement = document.querySelector("#initials");
  
  submitButton.addEventListener("click", storeScore);
  
  function storeScore(event) {
    event.preventDefault();
  
    if (!inputElement.value) {
      alert("Please enter your initials before pressing submit!");
      return;
    }
  
    let leaderboardItem = {
      initials: inputElement.value,
      score: time,
    };
  
    updateStoredLeaderboard(leaderboardItem);
  
    hideCards();
    leaderboardCard.removeAttribute("hidden");
  
    renderLeaderboard();
  }
  
  function updateStoredLeaderboard(leaderboardItem) {
    let leaderboardArray = getLeaderboard();
    leaderboardArray.push(leaderboardItem);
    localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
  }
  
  function getLeaderboard() {
    let storedLeaderboard = localStorage.getItem("leaderboardArray");
    if (storedLeaderboard !== null) {
      let leaderboardArray = JSON.parse(storedLeaderboard);
      return leaderboardArray;
    } else {
      leaderboardArray = [];
    }
    return leaderboardArray;
  }
  
  function renderLeaderboard() {
    let sortedLeaderboardArray = sortLeaderboard();
    const highscoreList = document.querySelector("#highscore-list");
    highscoreList.innerHTML = "";
    for (let i = 0; i < sortedLeaderboardArray.length; i++) {
      let leaderboardEntry = sortedLeaderboardArray[i];
      let newListItem = document.createElement("li");
      newListItem.textContent =
        leaderboardEntry.initials + " - " + leaderboardEntry.score;
      highscoreList.append(newListItem);
    }
  }
  
  function sortLeaderboard() {
    let leaderboardArray = getLeaderboard();
    if (!leaderboardArray) {
      return;
    }
  
    leaderboardArray.sort(function (a, b) {
      return b.score - a.score;
    });
    return leaderboardArray;
  }