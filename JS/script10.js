const questions = [
    {
        test_text: "Contact me at 123-456-7890.",
        correct_pattern: "(\\d{3})-(\\d{3})-(\\d{4})",
        task_description: "Write a regex pattern to capture the three parts of the phone number: area code, exchange code, and line number."
    },
    {
        test_text: "The event is on 2023-12-25.",
        correct_pattern: "(\\d{4})-(\\d{2})-(\\d{2})",
        task_description: "Write a regex pattern to capture the year, month, and day from the date."
    },
    {
        test_text: "Visit https://www.example.com for more info.",
        correct_pattern: "(https?)://(\\w+\\.\\w+\\.\\w+)",
        task_description: "Write a regex pattern to capture the protocol (http or https) and the domain name."
    }
];

let current_question = 0;
let score = 0;
let wrong_attempts = 0;

function loadQuestion() {
    const question = questions[current_question];
    document.getElementById('test-text').innerHTML = question.test_text;
    document.getElementById('regex-input').value = '';
    document.getElementById('result').innerHTML = 'Enter a regex pattern to see the result.';
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
        document.getElementById('result').innerHTML = 'Enter a regex pattern to see the result.';
        document.getElementById('result').className = 'p-3 rounded';
    } else {
        try {
            const regex = new RegExp(input);
            const match = original_text.match(regex);
            if (match) {
                const full_match = match[0];
                const groups = match.slice(1);
                display_text = original_text.replace(full_match, '<span class="highlight">' + full_match + '</span>');
                document.getElementById('test-text').innerHTML = display_text;
                let result_text = 'Match found: ' + full_match + '<br>Captured groups: ';
                groups.forEach((group, index) => {
                    result_text += `Group ${index + 1}: '${group}' `;
                });
                document.getElementById('result').innerHTML = result_text;
                document.getElementById('result').className = 'p-3 rounded bg-success text-white';
            } else {
                document.getElementById('test-text').innerHTML = original_text;
                document.getElementById('result').innerHTML = 'No match found.';
                document.getElementById('result').className = 'p-3 rounded bg-warning text-dark';
            }
        } catch (e) {
            document.getElementById('test-text').innerHTML = original_text;
            document.getElementById('result').innerHTML = 'Invalid regex pattern!';
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