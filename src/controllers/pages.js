// Controller for simple static-ish pages

const showHomePage = (req, res) => {
    res.render('home', {
        title: 'EduStar – Smart Learning for Africa',
        metaDesc: 'Free AI-powered education for every African student. Curriculum-aligned lessons, free textbooks, and a supportive learning community.'
    });
};

const showDashboardPage = (req, res) => {
    res.render('dashboard', {
        title: 'My Dashboard',
        metaDesc: 'Track your learning progress, points, and achievements.'
    });
};

const showSubjectsPage = (req, res) => {
    res.render('subjects', {
        title: 'Subjects',
        metaDesc: 'Curriculum-aligned lessons for your grade level and country.'
    });
};

const showLessonPage = (req, res) => {
    res.render('lesson', {
        title: 'Lesson',
        metaDesc: 'AI-powered lesson with your personal tutor.'
    });
};

const showAboutPage = (req, res) => {
    res.render('about', {
        title: 'About EduStar',
        metaDesc: 'Our mission is free quality education for every African student.'
    });
};

const showQuizPage = (req, res) => {
  res.render('quiz', {
    title: 'Quiz',
    metaDesc: 'Test your knowledge with AI-generated quizzes aligned to your curriculum.'
  });
};

export { showHomePage, showDashboardPage, showSubjectsPage, showLessonPage, showAboutPage, showQuizPage };