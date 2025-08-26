### AI-Powered Employability Coach

An AI-powered bot that helps college graduates and freshers prepare for interviews, improve soft skills, and become placement-ready. This project combines a modern web interface with a robust backend, offering a comprehensive platform for career preparation.



### Features

  * **User Authentication**: Secure sign-up and login functionality with password hashing using `bcryptjs`.
  * **AI-Powered Mock Interviews**: Practice common interview questions with real-time feedback from the Gemini AI model.
  * **Final Report Generation**: Receive a summarized performance report at the end of each interview, including key strengths and areas for improvement.
  * **Dynamic UI**: A clean, modern, and responsive user interface built with HTML, CSS, and vanilla JavaScript.



### Tech Stack

  * **Frontend**: HTML5, CSS3, JavaScript
  * **Backend**: Node.js, Express.js
  * **Database**: MongoDB with Mongoose ODM
  * **API**: Google Gemini API via `@google/generative-ai`
  * **Security**: `bcryptjs` for password hashing, `dotenv` for environment variables, `cors` for cross-origin requests.



### Prerequisites

Before you begin, ensure you have the following installed:

  * **Node.js**: The runtime environment for the backend.
  * **MongoDB**: The database for storing user data.
  * **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).



### Setup and Installation

1.  **Clone the Repository:**

    ```bash
    git clone [repository-url]
    cd ai-employability-coach
    ```

2.  **Install Backend Dependencies:** Navigate to the `backend` directory and install the necessary packages.

    ```bash
    cd backend
    npm install
    ```

3.  **Configure Environment Variables:** In the root directory of your project (same level as the `backend` and `public` folders), create a `.env` file and add your Gemini API key.

    ```
    GEMINI_API_KEY=your_valid_gemini_api_key_here
    ```

4.  **Run the Application:** Start the MongoDB service on your local machine, then run the Node.js server from the `backend` directory.

    ```bash
    node server.js
    ```

5.  **Access the Frontend:** Open your web browser and navigate to `http://localhost:5000` to start using the application.