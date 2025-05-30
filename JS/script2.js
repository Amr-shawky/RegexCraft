// Story Modal Logic
document.addEventListener('DOMContentLoaded', function () {
    // Initialize and show the modal on page load
    var storyModal = new bootstrap.Modal(document.getElementById('storyModal'), {
        backdrop: 'static', // Prevents closing by clicking outside
        keyboard: false     // Prevents closing with the keyboard
    });
    storyModal.show();

    // Dialogue array for Chapter 2
    const dialogue = [
        { speaker: "Master Eldrin", text: "Welcome back, Apprentice Lyra. Today, we delve into the mysterious Dot of Doom." },
        { speaker: "Apprentice Lyra", text: "The Dot of Doom? That sounds ominous, Master." },
        { speaker: "Master Eldrin", text: "Indeed, it is a powerful symbol in regex magic. The dot (.) can match any single character, except for newline characters." },
        { speaker: "Apprentice Lyra", text: "So, it's like a wildcard that can stand for any letter or symbol?" },
        { speaker: "Master Eldrin", text: "Precisely. For example, the pattern 'c.t' would match 'cat', 'cot', 'cut', and so on, as long as there's a single character between 'c' and 't'." },
        { speaker: "Apprentice Lyra", text: "That's useful! But what if I want to match a literal dot, like in a sentence?" },
        { speaker: "Master Eldrin", text: "Ah, to match a literal dot, you must escape it with a backslash, like '\\.'" },
        { speaker: "Apprentice Lyra", text: "I see. So, the dot is special, but I can make it ordinary with the escape rune." },
        { speaker: "Master Eldrin", text: "Exactly. Now, let's practice using the dot in your patterns." }
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
        test_text: "The cat sat on the mat. The cot was comfortable. The cut was deep.",
        correct_pattern: "c.t",
        task_description: "Write a regex pattern that matches any three-letter word starting with 'c' and ending with 't', such as 'cat', 'cot', 'cut'."
    },
    {
        test_text: "She had an ace up her sleeve. The axe was sharp. The ale was bitter.",
        correct_pattern: "a.e",
        task_description: "Write a regex pattern that matches any three-letter word starting with 'a' and ending with 'e', such as 'ace', 'axe', 'ale'."
    },
    {
        test_text: "He hit the ball with a bat. She made a bet on the game. The drill bit was sharp. The robot was called bot. But he didn't agree.",
        correct_pattern: "b.t",
        task_description: "Write a regex pattern that matches any three-letter word starting with 'b' and ending with 't', such as 'bat', 'bet', 'bit'."
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