const questions = [
    {
        highlighted_text: '<span class="highlight">unable</span> <span class="highlight">doing</span> <span class="highlight">undoable</span> doingable',
        correct_pattern: "(un)?(\\w+)(?(1)able|ing)",
        correct_flags: "g",
        task_description: "Write a regex pattern that matches words starting with 'un' and ending with 'able', or words not starting with 'un' and ending with 'ing'. Use the 'g' flag."
    },
    {
        highlighted_text: '<span class="highlight">images/photo.jpg</span> <span class="highlight">docs/document.png</span> images/document.png docs/photo.jpg',
        correct_pattern: "(images/)?(.*)\\.(?(1)jpg|png)",
        correct_flags: "g",
        task_description: "Write a regex pattern that matches file paths starting with 'images/' and ending with '.jpg', or not starting with 'images/' and ending with '.png'. Use the 'g' flag."
    },
    {
        highlighted_text: '<span class="highlight">VIP-123-VIP</span> <span class="highlight">456-STD</span> VIP-789-STD 012-VIP',
        correct_pattern: "(VIP-)?(\\d+)(?(1)-VIP|-STD)",
        correct_flags: "g",
        task_description: "Write a regex pattern that matches product codes starting with 'VIP-' and ending with '-VIP', or not starting with 'VIP-' and ending with '-STD'. Use the 'g' flag."
    }
];

let current_question = 0;
let score = 0;
let wrong_attempts = 0;

function loadQuestion() {
    const question = questions[current_question];
    document.getElementById('test-text').innerHTML = question.highlighted_text;
    document.getElementById('regex-input').value = '';
    document.getElementById('flags-input').value = '';
    document.getElementById('result').textContent = 'Write the pattern that would match the highlighted words.';
    document.getElementById('result').className = 'p-3 rounded';
    document.getElementById('question-number').textContent = current_question + 1;
    document.getElementById('task-instruction').innerHTML = question.task_description;
    wrong_attempts = 0;
}

function showAnswer() {
    const correct_pattern = questions[current_question].correct_pattern;
    const correct_flags = questions[current_question].correct_flags;
    Swal.fire({
        title: "Correct Answer",
        text: `Pattern: ${correct_pattern}, Flags: ${correct_flags}`,
        icon: "info"
    });
}

function checkAnswer() {
    const pattern = document.getElementById('regex-input').value;
    const flags = document.getElementById('flags-input').value;
    const correct_pattern = questions[current_question].correct_pattern;
    const correct_flags = questions[current_question].correct_flags;

    if (pattern === correct_pattern && flags === correct_flags) {
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
            text: "The pattern or flags are incorrect. Keep practicing!",
            icon: "error"
        });
    }
}

window.onload = function () {
    loadQuestion();
};