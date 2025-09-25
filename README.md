# Enhanced News App<<<<<<< HEAD

# Getting Started with Create React App

A comprehensive, full-stack news application built with React and Express.js, featuring authentication, voting, user preferences, and beautiful responsive UI.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 🚀 Features

## Available Scripts

- **🔐 Authentication**: Google OAuth 2.0 integration with JWT tokens

- **📰 Live News**: Real-time news from NewsAPI.org with advanced filteringIn the project directory, you can run:

- **👍 Voting System**: Vote on articles with backend synchronization

- **⚙️ User Preferences**: Personalized settings and saved preferences### `npm start`

- **📱 Responsive Design**: Mobile-first, accessible UI

- **🎯 Advanced Filtering**: Date range, category, and search filtersRuns the app in the development mode.\

- **📊 Sorting Options**: Sort by date, relevance, or popularityOpen [http://localhost:3000](http://localhost:3000) to view it in your browser.

- **♿ Accessibility**: WCAG compliant with screen reader support

The page will reload when you make changes.\

## 🛠️ Tech StackYou may also see any lint errors in the console.



**Frontend:**### `npm test`

- React 19.1.1 with modern hooks

- Context API for state managementLaunches the test runner in the interactive watch mode.\

- Google Identity ServicesSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- Responsive CSS with mobile-first design

### `npm run build`

**Backend:**

- Express.js 5.1.0Builds the app for production to the `build` folder.\

- SQLite database with better-sqlite3It correctly bundles React in production mode and optimizes the build for the best performance.

- JWT authentication

- Google OAuth verificationThe build is minified and the filenames include the hashes.\

- CORS enabledYour app is ready to be deployed!



## 🏃‍♂️ Quick StartSee the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.



### Prerequisites### `npm run eject`

- Node.js (v14 or higher)

- npm or yarn**Note: this is a one-way operation. Once you `eject`, you can't go back!**

- Google Cloud Console account (for OAuth)

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

### Installation

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

1. **Clone the repository**

   ```bashYou don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

   git clone https://github.com/mynamevansh/News-APP.git

   cd News-APP## Learn More

   ```

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

2. **Install dependencies**

   ```bashTo learn React, check out the [React documentation](https://reactjs.org/).

   npm install

   ```### Code Splitting



3. **Set up environment variables**This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

   Create a `.env` file in the root directory:

   ```env### Analyzing the Bundle Size

   # NewsAPI.org API key

   REACT_APP_NEWS_API_KEY=your_news_api_key_hereThis section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

   

   # Google OAuth Client ID### Making a Progressive Web App

   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

   This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

   # JWT Secret for backend

   JWT_SECRET=your_jwt_secret_here### Advanced Configuration

   ```

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

4. **Configure Google OAuth**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)### Deployment

   - Create a new project or select existing one

   - Enable Google+ APIThis section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

   - Create OAuth 2.0 credentials

   - Add authorized origins: `http://localhost:3000`, `http://localhost:3001`### `npm run build` fails to minify

   - See `GOOGLE-OAUTH-FIX.md` for detailed setup instructions

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

5. **Run the application**=======

   ```bash# News-APP

   npm run devA responsive web application that fetches and displays the latest news articles with advanced filtering and sorting features.

   ```>>>>>>> cd47f6c76d7b1052f6fc0008fdce40ff40688d2c

   
   This starts both frontend (port 3000) and backend (port 3002) servers.

## 📁 Project Structure

```
news-app/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── DateFilter.jsx  # Date filtering component
│   │   ├── Filters.jsx     # News filters
│   │   ├── NewsItem.jsx    # Individual news article
│   │   ├── NewsList.jsx    # News articles list
│   │   └── Pagination.jsx  # Pagination controls
│   ├── contexts/          # React Context providers
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── backend/               # Express.js server
│   ├── server.js          # Main server file
│   └── database.db        # SQLite database
├── GOOGLE-OAUTH-FIX.md   # OAuth setup guide
└── package.json
```

## 🎯 Available Scripts

- `npm start` - Run frontend only (port 3000)
- `npm run backend` - Run backend only (port 3002)
- `npm run dev` - Run both frontend and backend concurrently
- `npm test` - Run tests
- `npm run build` - Build for production

## 🔧 Configuration

### News API Setup
1. Get your free API key from [NewsAPI.org](https://newsapi.org/)
2. Add it to your `.env` file as `REACT_APP_NEWS_API_KEY`

### Google OAuth Setup
1. Follow the detailed guide in `GOOGLE-OAUTH-FIX.md`
2. Add your Google Client ID to `.env` as `REACT_APP_GOOGLE_CLIENT_ID`

## 📱 Features in Detail

### Authentication System
- **Google Sign-In**: One-click authentication with Google accounts
- **JWT Tokens**: Secure session management
- **User Profiles**: Display user information and preferences
- **Persistent Sessions**: Stay logged in across browser sessions

### Voting System
- **Guest Voting**: Vote without authentication (stored locally)
- **User Voting**: Authenticated votes synced to backend database
- **Vote Migration**: Guest votes transferred when signing in
- **Real-time Updates**: Instant vote count updates

### News Features
- **Live Data**: Fresh news from multiple sources via NewsAPI
- **Advanced Filtering**: Filter by date range, category, source
- **Search**: Full-text search across headlines and descriptions
- **Sorting**: Multiple sorting options (date, relevance, popularity)
- **Pagination**: Efficient navigation through large result sets

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Theme**: Comfortable viewing in any environment
- **Loading States**: Clear feedback during data fetching
- **Error Handling**: Graceful error messages and recovery
- **Accessibility**: Screen reader support and keyboard navigation

## 🐛 Troubleshooting

### Common Issues

1. **Google OAuth "origin not allowed" error**
   - Check `GOOGLE-OAUTH-FIX.md` for detailed solution
   - Verify authorized origins in Google Cloud Console

2. **News not loading**
   - Verify your NewsAPI key is valid and not rate-limited
   - Check browser console for API errors

3. **Backend connection issues**
   - Ensure backend server is running on port 3002
   - Check firewall and antivirus settings

4. **Database errors**
   - Delete `backend/database.db` and restart to reset database
   - Check file permissions in the backend directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for providing news data
- [Google Identity Services](https://developers.google.com/identity) for authentication
- [Create React App](https://create-react-app.dev/) for the initial setup
- All the amazing open-source libraries that made this project possible

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review `GOOGLE-OAUTH-FIX.md` for OAuth issues
3. Open an issue on GitHub with detailed error information

---

**Built with ❤️ using React, Express.js, and modern web technologies**