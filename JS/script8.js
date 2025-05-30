// Story Modal Logic
document.addEventListener('DOMContentLoaded', function () {
    var storyModal = new bootstrap.Modal(document.getElementById('storyModal'), {
        backdrop: 'static', // Prevents closing by clicking outside
        keyboard: false     // Prevents closing with the keyboard
    });
    storyModal.show();

    const dialogue = [
        { speaker: "Master Eldrin", text: "Welcome back, Apprentice Lyra. Today, we enter the Anchor Arena." },
        { speaker: "Apprentice Lyra", text: "The Anchor Arena? What’s that, Master?" },
        { speaker: "Master Eldrin", text: "It’s a place where we learn about anchors in regex. Anchors help us match patterns at specific positions in the text." },
        { speaker: "Apprentice Lyra", text: "Positions? Like the start or end of a string?" },
        { speaker: "Master Eldrin", text: "Exactly. The caret (^) matches the start of the string, and the dollar sign ($) matches the end." },
        { speaker: "Apprentice Lyra", text: "So, if I use ^a, it will match any string that starts with 'a'?" },
        { speaker: "Master Eldrin", text: "Yes, and a$ would match any string that ends with 'a'." },
        { speaker: "Apprentice Lyra", text: "That’s useful for ensuring patterns are at the beginning or end." },
        { speaker: "Master Eldrin", text: "Indeed. Anchors are crucial for precise pattern matching." },
        { speaker: "Apprentice Lyra", text: "Let’s practice using them!" }
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
        test_text: "apple banana apricot cherry date",
        correct_pattern: "^a\\w*",
        task_description: "Write a regex pattern that matches any word starting with 'a'."
    },
    {
        test_text: "Hello world. This is a test. Regex is fun.",
        correct_pattern: "\\w+\\.$",
        task_description: "Write a regex pattern that matches any sentence ending with a period."
    },
    {
        test_text: "Hello world",
        correct_pattern: "^Hello world$",
        task_description: "Write a regex pattern that matches the entire string 'Hello world'."
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