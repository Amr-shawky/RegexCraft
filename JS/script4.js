// Story Modal Logic
document.addEventListener('DOMContentLoaded', function () {
    var storyModal = new bootstrap.Modal(document.getElementById('storyModal'), {
        backdrop: 'static', // Prevents closing by clicking outside
        keyboard: false     // Prevents closing with the keyboard
    });
    storyModal.show();

    const dialogue = [
        { speaker: "Master Eldrin", text: "Welcome back, Apprentice Lyra. Today, we learn about the Lazy Blade." },
        { speaker: "Apprentice Lyra", text: "The Lazy Blade? What's that, Master?" },
        { speaker: "Master Eldrin", text: "It's a metaphor for lazy quantifiers in regex. They match as few characters as possible, unlike their greedy counterparts." },
        { speaker: "Apprentice Lyra", text: "Greedy counterparts? What do you mean?" },
        { speaker: "Master Eldrin", text: "Remember the Greedy Goblin from the last chapter? Quantifiers like '*' and '+' are greedy by default, meaning they match as much as possible." },
        { speaker: "Apprentice Lyra", text: "Oh, right! So lazy quantifiers do the opposite?" },
        { speaker: "Master Eldrin", text: "Exactly. By adding a '?' after a quantifier, like '*?' or '+?', it becomes lazy, matching as little as possible." },
        { speaker: "Apprentice Lyra", text: "That sounds useful. When would I use a lazy quantifier?" },
        { speaker: "Master Eldrin", text: "For example, when you want to match the smallest possible string between two characters. Let's practice with some examples." }
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
        test_text: "aab abb acb", 
        correct_pattern: "a.*?b",
        task_description: "Write a regex pattern that matches the smallest string starting with 'a' and ending with 'b'."
    },
    { 
        test_text: "<div>content</div><div>more content</div>", 
        correct_pattern: "<div>.*?</div>",
        task_description: "Write a regex pattern to match the smallest possible content inside <div> tags."
    },
    { 
        test_text: "12345 67890", 
        correct_pattern: "\\d+?",
        task_description: "Write a regex pattern to match the smallest possible sequence of digits."
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

window.onload = function() {
    loadQuestion();
};