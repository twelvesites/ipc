import { AlluraFontBase64 } from "./AlluraFontBase64.js";
let userName = "";
let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 15; // Total number of questions
const questions = [
    {
        question: "What is the best way to prevent the spread of infections?",
        options: ["Washing your hands regularly", "Wearing gloves all the time", "Avoiding eating", "Sharing drinks"],
        correctAnswer: 0
    },
    {
        question: "How long should you wash your hands to remove germs effectively?",
        options: ["5 seconds", "10 seconds", "20 seconds", "1 minute"],
        correctAnswer: 2
    },
    {
        question: "When should you wash your hands?",
        options: ["Before eating", "After using the bathroom", "After touching public surfaces", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "What should you do when you cough or sneeze to prevent the spread of germs?",
        options: ["Cough into your hands", "Cough into the air", "Cough into your elbow or a tissue", "None of the above"],
        correctAnswer: 2
    },
    {
        question: "What should you do if soap and water are not available to wash your hands?",
        options: ["Use water only", "Use any soap", "Use a hand sanitizer with at least 60% alcohol", "Nothing"],
        correctAnswer: 2
    },
    {
        question: "What should you do if you feel sick with flu-like symptoms?",
        options: ["Go to work or school", "Stay home and rest", "Go to a crowded place", "Ignore it and keep working"],
        correctAnswer: 1
    },
    {
        question: "Which of the following is an effective way to protect yourself from infections?",
        options: ["Avoid touching your face", "Washing your hands after touching surfaces", "Using hand sanitizer", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "What should you do with used tissues to prevent the spread of infection?",
        options: ["Throw them in a regular trash can", "Leave them on the table", "Throw them in a closed trash bin", "Use them again later"],
        correctAnswer: 2
    },
    {
        question: "What is the proper way to dispose of a face mask after use?",
        options: ["Throw it on the ground", "Re-use it multiple times", "Dispose of it in a trash bin", "Wash it and reuse it immediately"],
        correctAnswer: 2
    },
    {
        question: "Why is it important to get vaccinated?",
        options: ["To protect yourself from serious illnesses", "To avoid infections", "To protect others from illnesses", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "How can you reduce the spread of germs in public spaces?",
        options: ["Avoid touching surfaces", "Wash your hands regularly", "Wear a mask if necessary", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "What is the proper way to clean surfaces in your home to prevent infection?",
        options: ["Wipe them once a week", "Wipe them regularly with disinfectant", "Leave them untouched", "Only clean them if someone is sick"],
        correctAnswer: 1
    },
    {
        question: "What should you do after touching commonly used public items like door handles?",
        options: ["Wash your hands", "Wait until you get home", "Use your sleeve to touch them", "Nothing"],
        correctAnswer: 0
    },
    {
        question: "Which of the following is a sign that you should wash your hands?",
        options: ["Before eating", "After coughing or sneezing", "After touching something that could be dirty", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "Which of the following is the most effective way to protect yourself from respiratory infections?",
        options: ["Wearing a mask in crowded places", "Drinking hot water regularly", "Taking vitamin supplements", "Avoiding cold weather"],
        correctAnswer: 0
    }
];

function startQuiz() {
    userName = document.getElementById('userName').value.trim();
    if (userName === "") {
        alert("Please enter your name.");
        return;
    }
    document.getElementById('nameModal').style.display = "none";
    document.getElementById('quizContainer').style.display = "block";
    showQuestion();
}

// Expose to global scope
window.startQuiz = startQuiz;

// Displays the current question
function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('questionNumber').innerHTML = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    document.getElementById('questionContainer').innerText = question.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = ""; // Clear previous options
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-button'); // Add a class for styling
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });
}

// Checks if the selected answer is correct
function checkAnswer(selectedIndex, button) {
    const question = questions[currentQuestionIndex];
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Highlight the selected option in red if wrong
    if (selectedIndex !== question.correctAnswer) {
        button.style.backgroundColor = "red";
        // Play wrong sound
        const wrongSound = new Audio('wrong.mp3');
        wrongSound.play();

        // Highlight the correct answer in green
        const correctButton = optionsContainer.children[question.correctAnswer];
        correctButton.style.backgroundColor = "green";
    } else {
        score++;
        button.style.backgroundColor = "green";
        // Play correct sound
        const correctSound = new Audio('correct.mp3');
        correctSound.play();
    }

    // Fade out the buttons and move to the next question
    setTimeout(() => {
        fadeOut(button);
    }, 2000);
}

// Fades out the button after selection
function fadeOut(button) {
    button.style.transition = "opacity 0.5s ease-out";
    button.style.opacity = 0;
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 500); // Wait for fade-out to complete
}

// Show the results after completing the quiz
function showResult() {
    document.getElementById('quizContainer').style.display = "none";
    document.getElementById('resultContainer').style.display = "block";

    // Calculate the percentage score
    const percentage = ((score / totalQuestions) * 100).toFixed(2);
    document.getElementById('score').innerText = `${percentage}%`;

    // Collect user data and store it in Firebase
    const userData = {
        name: userName,
        device: getDeviceInfo(),  // Get the device info (brand/model)
        browser: getBrowserInfo(),
        correctAnswers: score,
        score: percentage,
        time: new Date().toLocaleString() // Store the time and date of completion
    };

    // Store user data in Firebase
    firebase.database().ref('quizResults').push(userData)
        .then(() => {
            console.log("User data stored successfully.");
        })
        .catch((error) => {
            console.error("Error storing user data: ", error);
        });

    // Enable the download certificate button
    document.getElementById('downloadCertificateButton').style.display = "block";
}
function capitalizeName(name) {
    return name
        .split(' ')  // Split the name into words
        .map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Capitalize the first letter of each word
        )
        .join(' ');  // Join the words back together
}

function downloadCertificate() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF('landscape');
    doc.addFileToVFS("Allura-Regular.ttf", AlluraFontBase64);
    doc.addFont("Allura-Regular.ttf", "Allura", "normal");

    const img = new Image();
    img.onload = () => {
        doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

        doc.setFont("Allura");
        doc.setFontSize(60);
        doc.setTextColor(71, 46, 24);

        const capitalizedUserName = capitalizeName(userName);
        const nameWidth = doc.getTextWidth(capitalizedUserName);
        const centerX = doc.internal.pageSize.width / 2;
        doc.text(capitalizedUserName, centerX - nameWidth / 2, 100);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(15);
        doc.setTextColor(0, 0, 0);

        const percentage = ((score / totalQuestions) * 100).toFixed(2);
        doc.text(`Score: ${percentage}%`, centerX, 135, { align: "center" });

        // Generate the PDF as a Blob
        const pdfBlob = doc.output('blob');

        // Create an Object URL for the Blob
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'certificate.pdf';

        // Append the link to the document and trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the Object URL to free memory
        URL.revokeObjectURL(link.href);
    };

    img.src = 'https://twelvesites.github.io/ipc/images/certificate_template.png'; // Path to your certificate template image
}

// Expose to global scope
window.downloadCertificate = downloadCertificate;
// Function to get the device information
function getDeviceInfo() {
    const userAgent = navigator.userAgent;

    // Check if the device is mobile
    if (/mobile/i.test(userAgent)) {
        if (/iPhone|iPad|iPod/i.test(userAgent)) {
            return "Apple iPhone/iPad"; // This can be improved to detect specific iPhone/iPad models if needed
        } else if (/Android/i.test(userAgent)) {
            return "Android Device"; // This can be extended to detect specific Android models
        } else {
            return "Mobile Device";
        }
    } else if (/tablet/i.test(userAgent)) {
        return "Tablet Device";
    } else {
        return "Desktop"; // Default to desktop if no mobile/tablet detected
    }
}

// Function to get the browser information
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    if (/Chrome/i.test(userAgent)) {
        return "Chrome";
    } else if (/Firefox/i.test(userAgent)) {
        return "Firefox";
    } else if (/Safari/i.test(userAgent)) {
        return "Safari";
    } else if (/Edge/i.test(userAgent)) {
        return "Edge";
    } else {
        return "Unknown Browser";
    }
}
