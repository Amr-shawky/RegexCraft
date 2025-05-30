// Story Modal Logic
document.addEventListener('DOMContentLoaded', function () {
    var storyModal = new bootstrap.Modal(document.getElementById('storyModal'), {
        backdrop: 'static', // Prevents closing by clicking outside
        keyboard: false     // Prevents closing with the keyboard
    });
    storyModal.show();

    const dialogue = [
        { speaker: "Master Eldrin", text: "Welcome back, Apprentice Lyra. Today, we enter the Character Cage." },
        { speaker: "Apprentice Lyra", text: "The Character Cage? What's that, Master?" },
        { speaker: "Master Eldrin", text: "It's a metaphor for character classes in regex. They allow you to match any one character from a set of characters." },
        { speaker: "Apprentice Lyra", text: "Like matching specific letters or numbers?" },
        { speaker: "Master Eldrin", text: "Exactly. For example, [abc] matches 'a', 'b', or 'c'." },
        { speaker: "Apprentice Lyra", text: "That seems useful for when you need to match multiple possibilities." },
        { speaker: "Master Eldrin", text: "Indeed. You can also use ranges, like [a-z] for any lowercase letter." },
        { speaker: "Apprentice Lyra", text: "Can I combine them, like [a-zA-Z] for any letter?" },
        { speaker: "Master Eldrin", text: "Yes, and you can include other characters too, like [a-zA-Z0-9] for alphanumerics." },
        { speaker: "Apprentice Lyra", text: "This opens up a lot of possibilities. Let's practice!" }
    ];

    let currentIndex = 0;
    const dialogueContainer = document.getElementById('dialogue-container');
    const nextBtn = document.getElementById('next-btn');

    function showNextLine() {
        if (currentIndex < dialogue.length) {
            const part = dialogue[currentIndex];
            const speakerP = document.createElement('p');
            speakerP.className = 'fw-bold';
            speakerP.textContent = part.speaker + ':';
            const textP = document.createElement('p');
            textP.id = 'typed-text-' + currentIndex;
            dialogueContainer.appendChild(speakerP);
            dialogueContainer.appendChild(textP);

            nextBtn.disabled = true;

            new Typed('#typed-text-' + currentIndex, {
                strings: [part.text],
                typeSpeed: 30,
                showCursor: false,
                onComplete: function () {
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

    document.getElementById('storyModal').addEventListener('shown.bs.modal', function () {
        showNextLine();
    });

    nextBtn.onclick = showNextLine;
});

// Existing Question Logic
const questions = [
    {
        test_text: "The cat sat on the mat. The dog barked. Birds flew in the sky.",
        correct_pattern: "[abc]",
        task_description: "Write a regex pattern that matches any character that is 'a', 'b', or 'c'."
    },
    {
        test_text: "There are 3 apples and 5 oranges.",
        correct_pattern: "[0-9]",
        task_description: "Write a regex pattern that matches any digit from 0 to 9."
    },
    {
        test_text: "Hello world! This is a test.",
        correct_pattern: "[aeiou]",
        task_description: "Write a regex pattern that matches any vowel (a, e, i, o, u)."
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