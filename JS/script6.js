// Story Modal Logic
document.addEventListener('DOMContentLoaded', function () {
    var storyModal = new bootstrap.Modal(document.getElementById('storyModal'), {
        backdrop: 'static', // Prevents closing by clicking outside
        keyboard: false     // Prevents closing with the keyboard
    });
    storyModal.show();

    const dialogue = [
        { speaker: "Master Eldrin", text: "Welcome back, Apprentice Lyra. Today, we face the Negator’s Curse." },
        { speaker: "Apprentice Lyra", text: "The Negator’s Curse? What’s that, Master?" },
        { speaker: "Master Eldrin", text: "It’s a powerful tool in regex—the negated character class. It allows you to match any character except those specified." },
        { speaker: "Apprentice Lyra", text: "So, like matching everything but certain letters?" },
        { speaker: "Master Eldrin", text: "Exactly. For example, [^abc] matches any character that is not 'a', 'b', or 'c'." },
        { speaker: "Apprentice Lyra", text: "That sounds useful for excluding specific characters." },
        { speaker: "Master Eldrin", text: "Indeed. You can also use it with ranges, like [^a-z] to match any non-lowercase letter." },
        { speaker: "Apprentice Lyra", text: "Can I use it to match anything but digits or vowels?" },
        { speaker: "Master Eldrin", text: "Yes, for instance, [^0-9] matches any non-digit, and [^aeiou] matches any non-vowel." },
        { speaker: "Apprentice Lyra", text: "This seems powerful. Let’s practice!" }
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
        test_text: "The quick brown fox jumps over the lazy dog.",
        correct_pattern: "[^aeiou]",
        task_description: "Write a regex pattern that matches any character that is not a vowel (a, e, i, o, u)."
    },
    {
        test_text: "There are 3 apples and 5 oranges in the basket.",
        correct_pattern: "[^0-9]",
        task_description: "Write a regex pattern that matches any character that is not a digit (0-9)."
    },
    {
        test_text: "Regex is powerful but can be tricky.",
        correct_pattern: "[^abc]",
        task_description: "Write a regex pattern that matches any character that is not 'a', 'b', or 'c'."
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