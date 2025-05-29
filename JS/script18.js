const questions = [
    {
        test_text: "Today's date is 2023-05-15. Yesterday was 2023-05-14. Tomorrow will be 2023-05-16.",
        expected_matches: [
            { match: "2023-05-15", groups: { year: "2023", month: "05", day: "15" } },
            { match: "2023-05-14", groups: { year: "2023", month: "05", day: "14" } },
            { match: "2023-05-16", groups: { year: "2023", month: "05", day: "16" } }
        ],
        task_description: "Write a regex pattern with named capturing groups 'year', 'month', and 'day' to match dates in 'YYYY-MM-DD' format. Use the 'g' flag to find all matches."
    },
    {
        test_text: "John Doe is a developer. Jane Smith is a designer. Bob is a tester.",
        expected_matches: [
            { match: "John Doe", groups: { first: "John", last: "Doe" } },
            { match: "Jane Smith", groups: { first: "Jane", last: "Smith" } }
        ],
        task_description: "Write a regex pattern with named capturing groups 'first' and 'last' to match full names in 'First Last' format. Use the 'g' flag to find all matches."
    },
    {
        test_text: "Contact us at support@example.com or sales@example.com. Invalid email: user@com.",
        expected_matches: [
            { match: "support@example.com", groups: { user: "support", domain: "example.com" } },
            { match: "sales@example.com", groups: { user: "sales", domain: "example.com" } }
        ],
        task_description: "Write a regex pattern with named capturing groups 'user' and 'domain' to match email addresses. Use the 'g' flag to find all matches."
    }
];

let current_question = 0;
let score = 0;
let wrong_attempts = 0;

function loadQuestion() {
    const question = questions[current_question];
    document.getElementById('test-text').innerHTML = question.test_text;
    document.getElementById('regex-input').value = '';
    document.getElementById('flags-input').value = '';
    document.getElementById('result').innerHTML = 'Enter a regex pattern and flags to see the result.';
    document.getElementById('result').className = 'p-3 rounded';
    document.getElementById('question-number').textContent = current_question + 1;
    document.getElementById('task-instruction').innerHTML = question.task_description;
    wrong_attempts = 0;
}

function showAnswer() {
    const correct_pattern = "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})"; // Example for question 1
    const correct_flags = "g";
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
    let highlighted_text = original_text;
    let result_html = '';

    if (pattern === '' || flags === '') {
        document.getElementById('test-text').innerHTML = original_text;
        document.getElementById('result').innerHTML = 'Enter a regex pattern and flags to see the result.';
        document.getElementById('result').className = 'p-3 rounded';
        return;
    }

    try {
        const regex = new RegExp(pattern, flags);
        const matches = [...original_text.matchAll(regex)];

        if (matches.length > 0) {
            matches.forEach(match => {
                highlighted_text = highlighted_text.replace(match[0], `<span class="highlight">${match[0]}</span>`);
            });
            result_html += '<ul>';
            matches.forEach((match, index) => {
                result_html += `<li>Match ${index + 1}: "${match[0]}"</li>`;
                if (match.groups) {
                    result_html += '<ul>';
                    for (let group in match.groups) {
                        result_html += `<li>${group}: "${match.groups[group]}"</li>`;
                    }
                    result_html += '</ul>';
                }
            });
            result_html += '</ul>';
            document.getElementById('result').className = 'p-3 rounded bg-success text-white';
        } else {
            result_html = 'No match found.';
            document.getElementById('result').className = 'p-3 rounded bg-warning text-dark';
        }
        document.getElementById('test-text').innerHTML = highlighted_text;
        document.getElementById('result').innerHTML = result_html;
    } catch (e) {
        document.getElementById('test-text').innerHTML = original_text;
        document.getElementById('result').innerHTML = 'Invalid regex pattern or flags! ' + e.message;
        document.getElementById('result').className = 'p-3 rounded bg-danger text-white';
    }
}

function checkAnswer() {
    const pattern = document.getElementById('regex-input').value;
    const flags = document.getElementById('flags-input').value;
    const test_text = questions[current_question].test_text;
    const expected = questions[current_question].expected_matches;

    try {
        const regex = new RegExp(pattern, flags);
        const matches = [...test_text.matchAll(regex)];

        let isCorrect = true;

        if (matches.length !== expected.length) {
            isCorrect = false;
        } else {
            for (let i = 0; i < matches.length; i++) {
                if (matches[i][0] !== expected[i].match) {
                    isCorrect = false;
                    break;
                }
                for (let group in expected[i].groups) {
                    if (matches[i].groups[group] !== expected[i].groups[group]) {
                        isCorrect = false;
                        break;
                    }
                }
                if (!isCorrect) break;
            }
        }

        if (isCorrect) {
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
                text: "The pattern or flags are incorrect. Check your matches and captured groups.",
                icon: "error"
            });
        }
    } catch (e) {
        Swal.fire({
            title: "Invalid Regex",
            text: "Your regex pattern or flags are invalid. " + e.message,
            icon: "error"
        });
    }
}

window.onload = function () {
    loadQuestion();
};