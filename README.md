# Exam_Simulator_v2.0 🎓

Welcome to the **Exam Simulator App**! This AI-powered desktop application leverages the Llama 8B model to provide an interactive and personalized exam experience. This is the second and most robust release, featuring login capabilities, student reviews, AI-generated papers, an AI teacher, and a dark mode calculator. Deployed on Render and powered by Flask, this app is your ultimate exam preparation tool.

## Features ✨

- **User Detail Collection** 📝: Gather user details to generate customized exam papers.
- **AI-Generated Exam Papers** 📄: Custom papers generated based on the provided user details.
- **AI Teacher** 🧑‍🏫: Get answers to your queries and detailed performance reports.
- **Calculator with Dark Mode** 🖤: Functional calculator that’s easy on the eyes.
- **Student Reviews** 💬: Collect feedback to continuously improve the experience.

## Project Structure 📁

```plaintext
Exam Simulator App/
│
├── AI_Service/
│   └── llama.py
│
├── Backend/
│   └── app.py
│
├── Frontend/
│   └── static/
│       ├── style.css
│       ├── static.js
│       └── images/
│           └── different images files
│   └── templates/
│       ├── index.html
│       ├── student.html
│       └── application.html
│
├── requirements.txt
└── .env
```

## Installation 🛠️

### Prerequisites
- Python 3.7 or higher
- Git
- Virtual Environment (venv)
- Groq API Key

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/exam-simulator-app.git
    cd exam-simulator-app
    ```

2. **Set up the environment**:
    - Create a virtual environment:
      ```bash
      python -m venv venv
      venv\Scripts\activate  # On Windows 
      ```
    - Install the required packages:
      ```bash
      pip install -r requirements.txt
      ```

3. **Configure environment variables**:
    - Create a `.env` file in the root directory and add your Groq API key:
      ```env
      GROQ_API_KEY=your_groq_api_key
      ```

4. **Run the app**:
    ```bash
    python app.py 
    ```

## Deployment 🚀

The app is deployed on Render. To deploy the app:

1. Connect your GitHub repository to Render.
2. Follow the Render deployment steps.
3. Set the environment variables on Render with your Groq API key.

## Usage 📚

### User Detail Collection
- **Enter Details**: Provide your details such as name, subject, topic, and grade level. This information is used to generate a customized exam paper tailored to your needs.

### Generate Exam Papers
- **Custom Exam Papers**: Once you've entered your details, the AI generates an exam paper specifically for you. This includes questions from the topics you need to focus on, ensuring a targeted study session.
- **Review Questions**: After completing the exam, review the questions and your answers.

### AI Teacher Assistance
- **Ask Queries**: Have any doubts or questions? Ask the AI teacher, who is always ready to help you understand the concepts better.
- **Performance Reports**: Get detailed reports on your performance, highlighting areas of strength and topics that need improvement.

### Calculator
- **Dark Mode**: Use the built-in calculator with dark mode for all your calculation needs, ensuring comfort during long study hours.

### Student Reviews
- **Feedback**: Provide feedback on your experience, which helps us improve the app continuously.

## Modules 🧩

- **AI_Service/llama.py**: Handles interactions with the Llama 8B model.
- **Backend/app.py**: Flask application managing backend logic and routing.
- **Frontend/static/**: Contains all static assets like CSS, JS, and images.
- **Frontend/templates/**: HTML templates for different pages.

## Platform Compatibility 🖥️

- Desktop Application: This app is designed and recommended for use on desktop computers. It ensures a seamless experience with all the features functioning optimally.
- Mobile Version: A mobile version is not currently supported. Future updates will include a mobile-friendly version along with bug fixes and performance enhancements.

## Contributions 🤝

We welcome contributions from the community! Here’s how you can contribute:

1. **Fork the repository**.
2. **Create a new branch**:
    ```bash
    git checkout -b feature-branch
    ```
3. **Make your changes** and commit them:
    ```bash
    git commit -m "Description of changes"
    ```
4. **Push to the branch**:
    ```bash
    git push origin feature-branch
    ```
5. **Open a Pull Request**: Describe your changes and submit the pull request.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Thank you for using the **Exam Simulator App**! If you have any questions or feedback, please reach out. Happy studying! 📖✨
