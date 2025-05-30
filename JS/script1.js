        document.addEventListener('DOMContentLoaded', function () {
            var storyModal = new bootstrap.Modal(document.getElementById('storyModal'), {
                backdrop: 'static',
                keyboard: false
            });
            storyModal.show();

            const dialogue = [
                { speaker: "Master Eldrin", text: "Greetings, Apprentice Lyra. Today, we embark on your journey into the art of regex magic. Our first lesson is the simplest spell of all: the literal character." },
                { speaker: "Apprentice Lyra", text: "Literal character? What’s that, Master?" },
                { speaker: "Master Eldrin", text: "It’s the foundation of pattern-crafting. A literal character matches exactly what you write. Cast 'b' into the scroll, and it will reveal every 'b' hidden within the text." },
                { speaker: "Apprentice Lyra", text: "So, it’s like searching for an exact match? Could I use it to find a whole word, like 'rune'?" },
                { speaker: "Master Eldrin", text: "Indeed! If you inscribe 'rune', it will match 'rune' precisely—nothing more, nothing less. It won’t find 'runes' or 'run'. The spell is strict." },
                { speaker: "Apprentice Lyra", text: "That’s straightforward! But are there any tricks I should watch out for?" },
                { speaker: "Master Eldrin", text: "A keen question. Most characters obey as written, but some—like the dot (.), star (*), or question mark (?)—wield special powers. To bind them as literals, you must use the escape rune: the backslash (\\)." },
                { speaker: "Apprentice Lyra", text: "So, if I want to match a dot, I’d write '\\.' instead of just '.'?" },
                { speaker: "Master Eldrin", text: "Exactly, Lyra. The backslash strips away its wild magic, making it a mere mark. These literal characters are the stepping stones to greater spells." },
                { speaker: "Apprentice Lyra", text: "I think I’ve got it, Master. I’m ready to try it myself!" },
                { speaker: "Master Eldrin", text: "Then let us begin. Step forward, and weave your first pattern!" }
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
                        typeSpeed: 7,  // Faster typing speed
                        showCursor: false,
                        onComplete: function() {
                            if (currentIndex === dialogue.length) {
                                nextBtn.textContent = 'Continue to Chapter';
                                nextBtn.disabled = false;
                                nextBtn.onclick = function() {
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

        const questions = [
            { test_text: "I found a magic scroll in the forest!", correct_pattern: "scroll" },
            { test_text: "The pattern on the scroll was intricate.", correct_pattern: "pattern" },
            { test_text: "Learning regex is fun!", correct_pattern: "regex" }
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
                            window.location.href = '../levels/chapter2.html';
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