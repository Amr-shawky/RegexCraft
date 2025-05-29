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
            document.getElementById('task-instruction').innerHTML = `Let's practice! Your task is to write a regex pattern that matches the word <strong>"${question.correct_pattern}"</strong> in the text below.`;
            wrong_attempts = 0;
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