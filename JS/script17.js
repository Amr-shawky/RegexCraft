const questions = [
    {
        test_text: "Error: File not found\nWarning: Low disk space\nError: Access denied",
        correct_pattern: "^Error:.*",
        correct_flags: "m",
        task_description: "Write a regex pattern that matches lines starting with 'Error:' using the <code>m</code> flag."
    },
    {
        test_text: "Start\nMiddle\nEnd",
        correct_pattern: "Start.*End",
        correct_flags: "s",
        task_description: "Write a regex pattern that matches the entire text from 'Start' to 'End', including newlines, using the <code>s</code> flag."
    },
    {
        test_text: "Line1: Hello\nLine2: World\nLine3: Regex",
        correct_pattern: "^Line\\d:.*$",
        correct_flags: "gm",
        task_description: "Write a regex pattern that matches all lines in the format 'LineX: text', using the <code>m</code> and <code>g</code> flags."
    }
];

let current_question = 0;
let score = 0;
let wrong_attempts = 0;

function loadQuestion() {
    const question = questions[current_question];
    document.getElementById('test-text').innerHTML = question.test_text.replace(/\n/g, '<br>');
    document.getElementById('regex-input').value = '';
    document.getElementById('flags-input').value = '';
    document.getElementById('result').textContent = 'Enter a regex pattern and flags to see the result.';
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

function testRegex() {
    const pattern = document.getElementById('regex-input').value;
    const flags = document.getElementById('flags-input').value;
    const original_text = questions[current_question].test_text;
    let display_text = original_text.replace(/\n/g, '<br>');

    if (pattern === '' || flags === '') {
        document.getElementById('test-text').innerHTML = display_text;
        document.getElementById('result').textContent = 'Enter a regex pattern and flags to see the result.';
        document.getElementById('result').className = 'p-3 rounded';
    } else {
        try {
            const regex = new RegExp(pattern, flags);
            display_text = original_text.replace(regex, '<span class="highlight">$&</span>').replace(/\n/g, '<br>');
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
            document.getElementById('test-text').innerHTML = display_text;
            document.getElementById('result').textContent = 'Invalid regex pattern or flags!';
            document.getElementById('result').className = 'p-3 rounded bg-danger text-white';
        }
    }
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