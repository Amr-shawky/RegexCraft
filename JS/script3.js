// Story Modal Logic
document.addEventListener('DOMContentLoaded', function () {
    // Initialize and show the modal on page load
    var storyModal = new bootstrap.Modal(document.getElementById('storyModal'), {
        backdrop: 'static', // Prevents closing by clicking outside
        keyboard: false     // Prevents closing with the keyboard
    });
    storyModal.show();

    // Dialogue array for Chapter 3
    const dialogue = [
        { speaker: "Master Eldrin", text: "Welcome back, Apprentice Lyra. Today, we face the Greedy Goblin, a creature obsessed with hoarding treasures." },
        { speaker: "Apprentice Lyra", text: "A goblin? How does that relate to regex, Master?" },
        { speaker: "Master Eldrin", text: "The goblin represents quantifiers in regex—symbols that control how many times a pattern can repeat. They can be greedy, taking as much as they can." },
        { speaker: "Apprentice Lyra", text: "Greedy? What does that mean in regex terms?" },
        { speaker: "Master Eldrin", text: "Quantifiers like '*', '+', and '{}' allow patterns to match multiple characters. For example, 'a*' matches zero or more 'a's, and 'a+' matches one or more." },
        { speaker: "Apprentice Lyra", text: "So, they can match different lengths of text?" },
        { speaker: "Master Eldrin", text: "Exactly. And '{}' lets you specify exact numbers, like '{3}' for exactly three occurrences." },
        { speaker: "Apprentice Lyra", text: "That sounds powerful! But how do I use them in patterns?" },
        { speaker: "Master Eldrin", text: "Let's practice. You'll use quantifiers to match words with varying lengths. Be mindful of their greed!" }
    ];

    let currentIndex = 0;
    const dialogueContainer = document.getElementById('dialogue-container');
    const nextBtn = document.getElementById('next-btn');

    function showNextLine() {
        if (currentIndex < dialogue.length) {
            const part = dialogue[currentIndex];
            // Create speaker and text elements
            const speakerP = document.createElement('p');
            speakerP.className = 'fw-bold';
            speakerP.textContent = part.speaker + ':';
            const textP = document.createElement('p');
            textP.id = 'typed-text-' + currentIndex;
            dialogueContainer.appendChild(speakerP);
            dialogueContainer.appendChild(textP);

            // Disable "Next" button while typing
            nextBtn.disabled = true;

            // Use Typed.js for typing effect
            new Typed('#typed-text-' + currentIndex, {
                strings: [part.text],
                typeSpeed: 30,
                showCursor: false,
                onComplete: function () {
                    // Enable "Next" button or change to "Continue" at the end
                    if (currentIndex === dialogue.length - 1) {
                        nextBtn.textContent = 'Continue to Chapter';
                        nextBtn.disabled = false;
                        nextBtn.onclick = function () {
                            storyModal.hide();
                        };
                    } else {
                        nextBtn.disabled = false;
                    }
                }
            });
            currentIndex++;
        }
    }

    // Start the dialogue when the modal is shown
    document.getElementById('storyModal').addEventListener('shown.bs.modal', function () {
        showNextLine();
    });

    // Handle "Next" button clicks
    nextBtn.onclick = showNextLine;
});

// Existing Question Logic
const questions = [
    {
        test_text: "I have a pet, a poet, and a pot.",
        correct_pattern: "\\bp.*t\\b",
        task_description: "Write a regex pattern that matches words starting with 'p' and ending with 't', with any number of characters in between, such as 'pet', 'poet', 'pot'. Use the <code>*</code> quantifier."
    },
    {
        test_text: "Error codes: 404, 200, 500, 403.",
        correct_pattern: "4\\d+",
        task_description: "Write a regex pattern that matches all error codes that start with '4' followed by one or more digits, such as '404', '403'. Use the <code>+</code> quantifier."
    },
    {
        test_text: "Find the numbers: 123 456 7890 987 654321.",
        correct_pattern: "\\b\\d{3}\\b",
        task_description: "Write a regex pattern that matches numbers that have exactly 3 digits, such as '123', '456', '987'. Use the <code>{}</code> quantifier."
    }
];

let current_question = 0;
let score = 0;
let wrong_attempts = 0;

function loadQuestion() {
    const question = questions[current_question];
    document.getElementById('test-text').innerHTML = question.test_text;
    document.getElementById('regex-input').value = '';
    document.getElementById('result').textContent = 'Enter a regex pattern to see the result.';
    document.getElementById('result').className = 'p-3 rounded';
    document.getElementById('question-number').textContent = current_question + 1;
    document.getElementById('task-instruction').innerHTML = question.task_description;
    wrong_attempts = 0;
}

function showAnswer() {
    const correct_pattern = questions[current_question].correct_pattern;
    Swal.fire({
        title: "Correct Answer",
        text: `The correct regex pattern is: ${correct_pattern}`,
        icon: "info"
    });
}

function testRegex() {
    const input = document.getElementById('regex-input').value;
    const original_text = questions[current_question].test_text;
    let display_text = original_text;

    if (input === '') {
        document.getElementById('test-text').innerHTML = original_text;
        document.getElementById('result').textContent = 'Enter a regex pattern to see the result.';
        document.getElementById('result').className = 'p-3 rounded';
    } else {
        try {
            const regex = new RegExp(input, 'g');
            display_text = original_text.replace(regex, '<span class="highlight">$&</span>');
            document.getElementById('test-text').innerHTML = display_text;
            const matches = original_text.match(regex);
            if (matches) {
                document.getElementById('result').textContent = `Match found: ${matches.join(', ')}`;
                document.getElementById('result').className = 'p-3 rounded bg-success text-white';
            } else {
                document.getElementById('result').textContent = 'No match found.';
                document.getElementById('result').className = 'p-3 rounded bg-warning text-dark';
            }
        } catch (e) {
            document.getElementById('test-text').innerHTML = original_text;
            document.getElementById('result').textContent = 'Invalid regex pattern!';
            document.getElementById('result').className = 'p-3 rounded bg-danger text-white';
        }
    }
}

function checkAnswer() {
    const input = document.getElementById('regex-input').value;
    const correct_pattern = questions[current_question].correct_pattern;

    if (input === correct_pattern) {
        const points = Math.max(3, 5 - Math.floor(wrong_attempts / 2));
        score += points;
        document.getElementById('score').textContent = score;
        Swal.fire({
            title: "Great Job!",
            text: `You've earned ${points} points! Total score: ${score}`,
            icon: "success"
        }).then(() => {
            current_question++;
            if (current_question < questions.length) {
                loadQuestion();
            } else {
                Swal.fire({
                    title: "Chapter Completed!",
                    text: `You've finished the chapter with a total score of ${score}/15.`,
                    icon: "success"
                }).then(() => {
                    window.location.href = '../index.html';
                });
            }
        });
    } else {
        wrong_attempts++;
        Swal.fire({
            title: "Try Again!",
            text: "The pattern is incorrect. Keep practicing!",
            icon: "error"
        });
    }
}

window.onload = function () {
    loadQuestion();
};