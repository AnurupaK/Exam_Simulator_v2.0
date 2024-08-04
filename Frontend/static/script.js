let container;
const scrollSpeed = 2.3;

function autoScroll() {
    if (container) {
        // Scroll the container
        container.scrollTop += scrollSpeed;

        // Reset scroll position to top when it reaches the end
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
            container.scrollTop = 0;
        }
    }
}
let count = 0
let isPaperGenerated = false;
let details_collection = {}
let ready_to_chat = false
async function loadContent(page) {
    const mainContent = document.getElementById('main-content');

    try {
        const response = await fetch(`${page}.html`);
        const data = await response.text();
        mainContent.innerHTML = data;

        // // Reinitialize functions after loading content
        if (page === 'application') {
            initializeCalculator();
            initializeQuestionGenerator();
            activateSubmitButton()

        }

        if (page === 'student') {
            setupLoginButton();
            container = document.getElementById('stories-container');
            setInterval(autoScroll, 30); 
        }
    } catch (error) {
        console.error('Error loading content:', error);
        mainContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
    }
}




document.addEventListener('DOMContentLoaded', async function () {
    await loadContent('student'); // Default content

    document.querySelector('.nav1').addEventListener('click', async function () {
        await loadContent('student');
        console.log("Student Area clicked")
    });

    document.querySelector('.nav2').addEventListener('click', async function () {
        await loadContent('application');
        console.log("Application Area clicked")
    });

});



// Login Details Functionality
function setupLoginButton() {
    const loginBtn = document.querySelector('.login_btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async function () {
            console.log("Login button found");
            const loginDetails = await LoginDetails();
            alert("Details submitted")
            if (loginDetails) {
                console.log("Login details:", loginDetails);
                Object.assign(details_collection, loginDetails);
            } else if (loginDetails === null) {
                console.log("No details entered");
                alert('No details entered');
            } else {
                console.log("Please fill in all login details.");
                alert('Please fill in all login details');
            }
        });
    } else {
        console.log("Login button not found");
    }
}

async function LoginDetails() {
    const nameElement = document.querySelector('.name');
    const topicElement = document.querySelector('.topic');
    const gradeElement = document.querySelector('.grade');
    const subjectElement = document.querySelector('.subject');
    const mcqElement = document.querySelector('.mcq');

    if (nameElement && topicElement && gradeElement && subjectElement && mcqElement) {
        const name = nameElement.value.trim();
        const topic = topicElement.value.trim();
        const grade = gradeElement.value.trim();
        const subject = subjectElement.value.trim();
        const mcq = mcqElement.value.trim();

        if (!name && !topic && !grade && !subject && !mcq) {
            return null;  // No details entered
        } else if (name && topic && grade && subject && mcq) {
            return {
                name,
                topic,
                grade,
                subject,
                mcq
            };
        } else {
            return false;  // Some but not all details entered
        }
    } else {
        console.log("Login form elements not found.");
        return null;
    }
}

// Question Generating Functionality
async function initializeQuestionGenerator() {
    // Ensure any previous event listeners are removed
    const generate_btn = document.querySelector('.generate_btn');
    if (generate_btn) {
        generate_btn.removeEventListener('click', handleGenerateClick);
        generate_btn.addEventListener('click', handleGenerateClick);
    }
}

async function handleGenerateClick() {
    try {
        const level = await levelChecking();
        if (level) {
            console.log(`Level selected: ${level}`);
            alert(`Level selected: ${level}`);
            details_collection.level = level;

            //// Fetch and display questions only if level is selected
            const { question, optA, optB, optC, optD, msg } = await QuestionMaker(details_collection);
            if (msg == 'All details not found') {
                alert(msg)
            }

            const screen = document.querySelector('.question_screen');
            console.log("Question made", question, optA, optB, optC, optD);
            screen.innerHTML = ''; // Clear previous questions
            for (let i = 0; i < question.length; i++) {
                let questionHtml = `
                    <div class="question">
                        <p>${i + 1}. ${question[i]}</p>
                        <div class="options">
                            <label><input type="radio" name="Q${i}" value="${optA[i]}">${optA[i]}</label>
                            <label><input type="radio" name="Q${i}" value="${optB[i]}">${optB[i]}</label>
                            <label><input type="radio" name="Q${i}" value="${optC[i]}">${optC[i]}</label>
                            <label><input type="radio" name="Q${i}" value="${optD[i]}">${optD[i]}</label>
                        </div>
                    </div>`;
                screen.insertAdjacentHTML('beforeend', questionHtml);
            }


        }

    } catch (error) {
        console.log("Error:", error);
    }
}

function levelChecking() {
    return new Promise((resolve, reject) => {
        const level = document.querySelector('#level').value;
        if (level) {
            resolve(level);
        } else {
            alert("Please select level");
            reject("Level not selected");
        }
    });
}

async function QuestionMaker(details_collection) {
    isPaperGenerated = true;
    const response = await fetch('/api/questions_making', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ details_collection })
    });
    const data = await response.json();
    return {
        question: data.questions,
        optA: data.OptionsA,
        optB: data.OptionsB,
        optC: data.OptionsC,
        optD: data.OptionsD,
        msg: data.msg
    };
}


//Submit Answer Functionality
async function activateSubmitButton() {
    const submitBtn = document.querySelector('.answer_submit_btn');
    const send = document.querySelector('.sendbtn')
    const ai_screen = document.querySelector('.chat_screen')
    const stop = document.querySelector('.stop')

    const msg_error = document.createElement('div');
    msg_error.className = 'msg msg_area'

    msg_error.innerHTML = "<span class='emoji' style='font-size: 30px; color:black;'>Hi! You need to take the test first🫢</span> "
    ai_screen.appendChild(msg_error)

    if (submitBtn) {
        submitBtn.addEventListener('click', async function () {
            if (isPaperGenerated) {
                const questions = document.querySelectorAll('.question');
                const userResponses = {};
                if (questions.length != 0) {
                    for (let i = 0; i < questions.length; i++) {
                        const selectedOption = document.querySelector(`input[name="Q${i}"]:checked`);
                        userResponses[`User${i}`] = selectedOption ? selectedOption.value : null;
                    }
                    console.log('User responses:', userResponses);
                    console.log("Submitting answers...");
                    alert("Answers submitted successfully!");
                    let { score,mcq, bot_response } = await AnswerCheck(userResponses);
                    console.log(score, mcq,bot_response)

                    if (bot_response) {

                        ready_to_chat = true
                    }
                    let bot = document.createElement('div');
                    bot.className = 'bot msg'
                    setTimeout(async () => {
                        ai_screen.innerHTML = ''
                        msg_error.innerHTML = `<span class='emoji' style='font-size: 30px; color:black;'>🧑🏻‍🏫 Your score is ${score}/${mcq}</span>`
                        ai_screen.appendChild(msg_error)
                        ai_screen.appendChild(bot);
                        bot.innerHTML = "<span class='emoji' style='font-size: 30px;'>🧑🏻‍🏫</span> ";

                        stop.addEventListener('click', function () {
                            stopTyping = true;
                        });

                        stopTyping = false; // Reset the stop flag
                        await typeEffect(bot, bot_response);

                    }, 1000)
                    ready_to_chat = true
                    send.addEventListener('click', async function () {


                        if (ready_to_chat == true) {
                            const userTxt = document.querySelector('#UserTxt')
                            let user = document.createElement('div');
                            user.className = 'user msg'
                            ai_screen.appendChild(user);
                            user.innerHTML = "<span class='emoji' style='font-size: 30px;'>👧🏻</span> " + userTxt.value

                            chatRes = await chatBot(userTxt.value)

                            setTimeout(async () => {

                                userTxt.value = ''
                                let bot = document.createElement('div');
                                bot.className = 'bot msg'
                                ai_screen.appendChild(bot);
                                bot.innerHTML = "<span class='emoji' style='font-size: 30px;'>🧑🏻‍🏫</span> "
                                stop.addEventListener('click', function () {
                                    stopTyping = true;
                                });
                                stopTyping = false;
                                await typeEffect(bot, chatRes)
                            }, 1000);
                        }
                        else {
                            let bot = document.createElement('div');
                            bot.className = 'bot msg'
                            ai_screen.appendChild(bot);
                            bot.innerHTML = "<span class='emoji' style='font-size: 30px;'>🧑🏻‍🏫</span> "
                            await typeEffect(bot, "Hi! I will definitely help you. Can you take the exam first?😊")

                        }
                    })

                }

            } else {
                alert("Please select a level and generate the paper first.");
            }
        });
    }
}


//Sending user responses to backend
async function AnswerCheck(userResponses) {
    console.log('Detail Collection:', userResponses)
    try {
        let response = await fetch('/api/bot_checking_answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userResponses })
        })
        let data = await response.json()
        console.log(data)
        return {
            score: data.score,
            mcq: data.mcq,
            bot_response: data.bot_response
        }

    }
    catch (error) {
        console.error("Bot was not able to check your answers")
    }
}







//Calculator Functionality
function initializeCalculator() {
    const calculatorArea = document.querySelector('.calculator_area');
    const themeBtn = document.querySelector('.theme_btn');
    const items = document.querySelectorAll('.item');
    const numbers = document.querySelector('.numbers');

    if (!calculatorArea || !themeBtn || !items || !numbers) {
        console.log('Calculator elements not found');
        return;
    }

    if (!calculatorArea.classList.contains('theme_light') && !calculatorArea.classList.contains('theme_dark')) {
        calculatorArea.classList.add('theme_light');
    }

    themeBtn.addEventListener('click', function () {
        calculatorArea.classList.toggle('theme_dark');
        calculatorArea.classList.toggle('theme_light');
    });

    items.forEach(item => {
        item.addEventListener('click', function () {
            handleItem(item, numbers);
        });
    });

    const backspace = document.querySelector('.backspace');
    backspace.addEventListener('click', function () {
        if (numbers.innerHTML) {
            numbers.innerHTML = numbers.innerHTML.slice(0, -1);
            count = count - 1
        } else {
            numbers.innerHTML = 'Nothing to delete';
        }
    });
}

async function handleItem(item, numbers) {
    if (item.innerHTML === 'C') {
        numbers.innerHTML = '';
        if (document.querySelector('.output')) {
            document.querySelector('.output').innerHTML = ''
        }
        count = 0;
    } else if (item.innerHTML === '=') {
        await Calculator(numbers.innerHTML);
        count = 0
    } else if (item.innerHTML === '+/−') {
        if (count < 30) {
            count += 1
            toggleSign(numbers);
            console.log(count)
        }
    } else if (item.innerHTML === '%') {
        if (count < 30) {
            numbers.innerHTML += '%*';
            count += 1
            console.log(count)
        }
    }
    else {
        if (count < 30) {
            numbers.innerHTML += item.innerHTML
            count += 1
            console.log(count)
        }
    }
}

function toggleSign(numbers) {
    let currentContent = numbers.innerHTML;
    if (currentContent.endsWith('+')) {
        numbers.innerHTML = currentContent.slice(0, -1) + '−';
    } else if (currentContent.endsWith('−')) {
        numbers.innerHTML = currentContent.slice(0, -1) + '+';
    } else {
        numbers.innerHTML += '+';
    }
}

async function Calculator(numberAdded) {
    console.log(numberAdded);
    try {
        // Evaluate the expression using math.js
        if (numberAdded) {
            let result = math.evaluate(numberAdded);
            result = String(result)
            document.querySelector('.output').innerHTML = result.substring(0, 9);
        }
        else {
            document.querySelector('.output').innerHTML = "Nothing to evaluate";
        }
    } catch (error) {
        // Handle errors (e.g., invalid expressions)
        console.error('Error evaluating expression:', error);
        document.querySelector('.output').innerHTML = 'Error';
    }
}

//Typing effect
async function typeEffect(element, text) {
    const typingSpeed = 50;
    let i = 0;
    while (i < text.length && !stopTyping) {
        element.innerHTML += text.charAt(i);
        i++;
        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
    }
}

//Chatting Functionality
async function chatBot(user_text) {
    try {
        let response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'user_text': user_text })
        })
        let data = await response.json()
        console.log(data)
        return data.chatRes;

    }
    catch (error) {
        console.error("Bot was not able to chat")
    }
}




