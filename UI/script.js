// =====================================================
// Quick Vocab Trainer - Main Application Script
// =====================================================

// Data Storage
class VocabStore {
    constructor() {
        this.storageKey = 'vocab_app_data';
        this.statsKey = 'vocab_app_stats';
        this.settingsKey = 'vocab_app_settings';
        this.categoriesKey = 'vocab_app_categories';
        this.init();
    }

    init() {
        if (!this.getAll()) {
            // Add some sample words for testing
            const sampleWords = [
                {
                    id: '1',
                    word: 'sophisticated',
                    meaning: 'advanced and refined',
                    example: 'She has sophisticated taste in art',
                    source: '',
                    mastery: 0,
                    createdAt: new Date().toISOString(),
                    attempts: 0,
                    correct: 0
                },
                {
                    id: '2',
                    word: 'brilliant',
                    meaning: 'extremely clever or talented',
                    example: 'He is a brilliant scientist',
                    source: '',
                    mastery: 0,
                    createdAt: new Date().toISOString(),
                    attempts: 0,
                    correct: 0
                },
                {
                    id: '3',
                    word: 'magnificent',
                    meaning: 'extremely beautiful or impressive',
                    example: 'The view from the mountain was magnificent',
                    source: '',
                    mastery: 0,
                    createdAt: new Date().toISOString(),
                    attempts: 0,
                    correct: 0
                },
                {
                    id: '4',
                    word: 'extraordinary',
                    meaning: 'very unusual or remarkable',
                    example: 'She has extraordinary musical talent',
                    source: '',
                    mastery: 0,
                    createdAt: new Date().toISOString(),
                    attempts: 0,
                    correct: 0
                }
            ];
            this.save(sampleWords);
        }
        if (!this.getStats()) {
            this.saveStats({
                totalSessions: 0,
                totalCorrect: 0,
                totalAnswered: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastStudyDate: null,
                activityLog: [],
            });
        } else {
            // Migrate: ensure activityLog exists in existing stats
            const stats = this.getStats();
            if (!stats.activityLog) {
                stats.activityLog = [];
                this.saveStats(stats);
            }
        }
        if (!this.getSettings()) {
            this.saveSettings({
                quizSize: 10,
                aiEnabled: true,
                theme: 'auto',
                fontSize: 'normal',
            });
        }
    }

    getAll() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    getStats() {
        const stats = localStorage.getItem(this.statsKey);
        return stats ? JSON.parse(stats) : null;
    }

    getSettings() {
        const settings = localStorage.getItem(this.settingsKey);
        return settings ? JSON.parse(settings) : null;
    }

    save(words) {
        localStorage.setItem(this.storageKey, JSON.stringify(words));
        this.updateWordCount();
    }

    saveStats(stats) {
        localStorage.setItem(this.statsKey, JSON.stringify(stats));
    }

    saveSettings(settings) {
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    }

    addWord(word, meaning, example = '', source = '', category = '') {
        const words = this.getAll();
        const newWord = {
            id: Date.now().toString(),
            word: word.trim(),
            meaning: meaning.trim(),
            example: example.trim(),
            source: source.trim(),
            category: category.trim(),
            mastery: 0,
            createdAt: new Date().toISOString(),
            attempts: 0,
            correct: 0,
        };
        words.push(newWord);
        this.save(words);
        this.logActivity('wordsAdded', 1);
        return newWord;
    }

    deleteWord(id) {
        const words = this.getAll();
        const filtered = words.filter(w => w.id !== id);
        this.save(filtered);
    }

    updateWord(id, updates) {
        const words = this.getAll();
        const word = words.find(w => w.id === id);
        if (word) {
            Object.assign(word, updates);
            this.save(words);
        }
    }

    updateWordCount() {
        const words = this.getAll();
        document.getElementById('wordCount').textContent = `${words.length} words`;
    }

    // Activity tracking helpers
    getTodayKey() {
        return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    }

    logActivity(type, count = 1) {
        const stats = this.getStats();
        const today = this.getTodayKey();
        let entry = stats.activityLog.find(e => e.date === today);
        if (!entry) {
            entry = { date: today, wordsAdded: 0, quizzesTaken: 0, wordsQuizzed: 0 };
            stats.activityLog.push(entry);
        }
        if (type === 'wordsAdded') entry.wordsAdded += count;
        if (type === 'quizzesTaken') entry.quizzesTaken += count;
        if (type === 'wordsQuizzed') entry.wordsQuizzed += count;

        // Keep only last 30 days of activity to avoid storage bloat
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const cutoffKey = cutoff.toISOString().split('T')[0];
        stats.activityLog = stats.activityLog.filter(e => e.date >= cutoffKey);

        this.saveStats(stats);
    }

    getActivityForWeek() {
        const stats = this.getStats();
        const result = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const dayName = dayNames[d.getDay()];
            const entry = stats.activityLog.find(e => e.date === key);
            const total = entry ? (entry.wordsAdded + entry.wordsQuizzed) : 0;
            result.push({ day: dayName, total });
        }
        return result;
    }

    // Category management
    getCategories() {
        const data = localStorage.getItem(this.categoriesKey);
        return data ? JSON.parse(data) : ['General', 'Academic', 'Business', 'Daily Life'];
    }

    saveCategories(categories) {
        localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
    }

    addCategory(name) {
        const categories = this.getCategories();
        const trimmed = name.trim();
        if (trimmed && !categories.includes(trimmed)) {
            categories.push(trimmed);
            this.saveCategories(categories);
            return true;
        }
        return false;
    }

    deleteCategory(name) {
        const categories = this.getCategories();
        const filtered = categories.filter(c => c !== name);
        this.saveCategories(filtered);
    }
}

// Initialize Store
const store = new VocabStore();

// =====================================================
// Tab Navigation
// =====================================================
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;

            // Remove active class
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');

            // Update progress when switching to progress tab
            if (tabName === 'progress') {
                updateProgressStats();
            }
        });
    });
}

// =====================================================
// Category Dropdowns - populate all category selects
// =====================================================
function populateCategoryDropdowns() {
    const categories = store.getCategories();
    const selects = document.querySelectorAll('.category-select');
    selects.forEach(select => {
        const currentValue = select.value;
        // Keep the first option (All / No Category)
        const firstOption = select.querySelector('option:first-child');
        select.innerHTML = '';
        select.appendChild(firstOption);
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            if (cat === currentValue) option.selected = true;
            select.appendChild(option);
        });
    });
}

// =====================================================
// Add Word Form
// =====================================================
function initAddWordForm() {
    const form = document.getElementById('addWordForm');
    const saveAndAddBtn = document.getElementById('saveAndAdd');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const word = document.getElementById('word').value;
        const meaning = document.getElementById('meaning').value;
        const example = document.getElementById('example').value;
        const source = document.getElementById('source').value;
        const category = document.getElementById('category').value;

        store.addWord(word, meaning, example, source, category);

        // Update the word list display
        displayWords('');

        // Show success message
        showNotification('Word added successfully! ✓', 'success');

        // Clear form
        form.reset();
        document.getElementById('word').focus();
    });

    saveAndAddBtn.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit'));
    });
}

// =====================================================
// Word List
// =====================================================
function initWordList() {
    const searchInput = document.getElementById('searchInput');
    const wordList = document.getElementById('wordList');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        displayWords(query);
    });

    displayWords('');
}

function displayWords(query = '') {
    const words = store.getAll();
    const wordList = document.getElementById('wordList');

    let filtered = words;
    if (query) {
        filtered = words.filter(w =>
            w.word.toLowerCase().includes(query) ||
            w.meaning.toLowerCase().includes(query)
        );
    }

    if (filtered.length === 0) {
        wordList.innerHTML = '<div class="empty-state"><p>No words found. Try adding some vocabulary!</p></div>';
        return;
    }

    wordList.innerHTML = filtered.map(word => `
        <div class="word-item" data-id="${word.id}">
            <div class="word-header">
                <div>
                    <div class="word-title">${escapeHtml(word.word)}</div>
                    <div class="word-meaning">${escapeHtml(word.meaning)}</div>
                </div>
                <div class="word-actions">
                    <button type="button" class="btn btn-secondary btn-edit" data-id="${word.id}" onclick="editWord('${word.id}')">✏️ Edit</button>
                    <button type="button" class="btn btn-danger btn-delete" data-id="${word.id}" onclick="deleteWord('${word.id}')">🗑️ Delete</button>
                </div>
            </div>
            ${word.example ? `<div style="margin-top: 0.5rem; font-size: 0.9rem; color: #6b7280; font-style: italic;">"${escapeHtml(word.example)}"</div>` : ''}
            <div class="word-meta">
                ${word.category ? `<span style="background: #eef2ff; color: #4f46e5; padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">📁 ${escapeHtml(word.category)}</span>` : ''}
                ${word.source ? `<span>📍 ${escapeHtml(word.source)}</span>` : ''}
                <span>Added: ${new Date(word.createdAt).toLocaleDateString()}</span>
                <span>Mastery: ${getMasteryLabel(word.mastery)}</span>
            </div>
        </div>
    `).join('');
}

function deleteWord(id) {
    // Use custom confirmation instead of confirm() which can be blocked on file:// protocol
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 350px;
            width: 90%;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            text-align: center;
        ">
            <h3 style="margin-top: 0; color: #ef4444;">🗑️ Delete Word</h3>
            <p style="color: #6b7280; margin-bottom: 1.5rem;">Are you sure you want to delete this word? This cannot be undone.</p>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
                <button id="confirmCancel" style="
                    padding: 0.5rem 1.5rem; border: 1px solid #d1d5db;
                    background: white; color: #6b7280; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
                ">Cancel</button>
                <button id="confirmDelete" style="
                    padding: 0.5rem 1.5rem; border: none;
                    background: #ef4444; color: white; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
                ">Delete</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#confirmDelete').onclick = () => {
        document.body.removeChild(modal);
        store.deleteWord(id);
        displayWords(document.getElementById('searchInput').value.toLowerCase());
        showNotification('Word deleted!', 'info');
    };

    modal.querySelector('#confirmCancel').onclick = () => {
        document.body.removeChild(modal);
    };

    modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    };
}

function editWord(id) {
    const words = store.getAll();
    const word = words.find(w => w.id === id);
    if (!word) return;

    // Create edit modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            max-height: 90vh;
            overflow-y: auto;
        ">
            <h3 style="margin-top: 0; color: #4f46e5;">✏️ Edit Word</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.25rem;">Word or Phrase</label>
                    <input type="text" id="editWord" value="${escapeHtml(word.word)}" style="
                        width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb;
                        border-radius: 6px; font-size: 14px; box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.25rem;">Meaning</label>
                    <textarea id="editMeaning" rows="2" style="
                        width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb;
                        border-radius: 6px; font-size: 14px; box-sizing: border-box; resize: vertical;
                    ">${escapeHtml(word.meaning)}</textarea>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.25rem;">Example Sentence</label>
                    <textarea id="editExample" rows="2" style="
                        width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb;
                        border-radius: 6px; font-size: 14px; box-sizing: border-box; resize: vertical;
                    ">${escapeHtml(word.example || '')}</textarea>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.25rem;">Source</label>
                    <input type="text" id="editSource" value="${escapeHtml(word.source || '')}" style="
                        width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb;
                        border-radius: 6px; font-size: 14px; box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.25rem;">Category</label>
                    <select id="editCategory" style="
                        width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb;
                        border-radius: 6px; font-size: 14px; box-sizing: border-box;
                    ">
                        <option value="">-- No Category --</option>
                        ${store.getCategories().map(c => `<option value="${escapeHtml(c)}" ${(word.category || '') === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
                    </select>
                </div>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem;">
                    <button id="editCancelBtn" style="
                        padding: 0.5rem 1rem; border: 1px solid #d1d5db;
                        background: white; color: #6b7280; border-radius: 6px; cursor: pointer;
                    ">Cancel</button>
                    <button id="editSaveBtn" style="
                        padding: 0.5rem 1rem; border: none;
                        background: #4f46e5; color: white; border-radius: 6px; cursor: pointer;
                    ">💾 Save Changes</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const cleanup = () => document.body.removeChild(modal);

    modal.querySelector('#editSaveBtn').onclick = () => {
        const newWord = modal.querySelector('#editWord').value.trim();
        const newMeaning = modal.querySelector('#editMeaning').value.trim();
        const newExample = modal.querySelector('#editExample').value.trim();
        const newSource = modal.querySelector('#editSource').value.trim();
        const newCategory = modal.querySelector('#editCategory').value;

        if (!newWord || !newMeaning) {
            alert('Word and Meaning are required!');
            return;
        }

        store.updateWord(id, {
            word: newWord,
            meaning: newMeaning,
            example: newExample,
            source: newSource,
            category: newCategory,
        });

        cleanup();
        displayWords(document.getElementById('searchInput').value.toLowerCase());
        showNotification('Word updated! ✓', 'success');
    };

    modal.querySelector('#editCancelBtn').onclick = cleanup;

    // Close on backdrop click
    modal.onclick = (e) => {
        if (e.target === modal) cleanup();
    };
}

function getMasteryLabel(level) {
    const labels = ['Unknown', 'Recognized', 'Understood', 'Can Use', 'Mastered'];
    return labels[Math.min(level, 4)];
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// =====================================================
// Quiz System
// =====================================================
class QuizGame {
    constructor() {
        this.words = [];
        this.currentIndex = 0;
        this.correct = 0;
        this.quizType = 'meaning';
        this.results = [];
    }

    start(quizType, quizSize, category = '') {
        let allWords = store.getAll();
        if (category) {
            allWords = allWords.filter(w => w.category === category);
        }
        if (allWords.length === 0) {
            alert(category ? `No words in category "${category}". Add some words first!` : 'Add some words first!');
            return false;
        }

        this.quizType = quizType;
        this.words = allWords.sort(() => Math.random() - 0.5).slice(0, quizSize);
        this.currentIndex = 0;
        this.correct = 0;
        this.results = [];
        return true;
    }

    getCurrentQuestion() {
        return this.words[this.currentIndex];
    }

    getOptions() {
        const current = this.getCurrentQuestion();
        const allWords = store.getAll();

        if (this.quizType === 'meaning') {
            const options = [current.meaning];
            while (options.length < 4) {
                const random = allWords[Math.floor(Math.random() * allWords.length)];
                if (!options.includes(random.meaning)) {
                    options.push(random.meaning);
                }
            }
            return options.sort(() => Math.random() - 0.5);
        } else {
            const options = [current.word];
            while (options.length < 4) {
                const random = allWords[Math.floor(Math.random() * allWords.length)];
                if (!options.includes(random.word)) {
                    options.push(random.word);
                }
            }
            return options.sort(() => Math.random() - 0.5);
        }
    }

    checkAnswer(answer) {
        const current = this.getCurrentQuestion();
        const correct =
            this.quizType === 'meaning' ? answer === current.meaning : answer === current.word;

        if (correct) {
            this.correct++;
            // Increase mastery (cap at 4)
            const newMastery = Math.min((current.mastery || 0) + 1, 4);
            store.updateWord(current.id, {
                mastery: newMastery,
                attempts: (current.attempts || 0) + 1,
                correct: (current.correct || 0) + 1,
            });
        } else {
            // Decrease mastery on wrong answer (floor at 0)
            const newMastery = Math.max((current.mastery || 0) - 1, 0);
            store.updateWord(current.id, {
                mastery: newMastery,
                attempts: (current.attempts || 0) + 1,
            });
        }

        this.results.push({
            word: current.word,
            correct: correct,
            answer: answer,
        });

        return correct;
    }

    nextQuestion() {
        this.currentIndex++;
        return this.currentIndex < this.words.length;
    }

    isFinished() {
        return this.currentIndex >= this.words.length;
    }

    getScore() {
        return `${this.correct}/${this.words.length}`;
    }

    getPercentage() {
        return Math.round((this.correct / this.words.length) * 100);
    }
}

const quiz = new QuizGame();

function initQuiz() {
    const startQuizBtn = document.getElementById('startQuiz');
    const submitAnswerBtn = document.getElementById('submitAnswer');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const retakeQuizBtn = document.getElementById('retakeQuiz');

    startQuizBtn.addEventListener('click', startQuiz);
    submitAnswerBtn.addEventListener('click', submitAnswer);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    retakeQuizBtn.addEventListener('click', startQuiz);
}

function startQuiz() {
    const quizType = document.querySelector('input[name="quizType"]:checked').value;
    const settings = store.getSettings();
    const quizSize = parseInt(settings.quizSize);
    const category = document.getElementById('quizCategory').value;

    if (!quiz.start(quizType, quizSize, category)) return;

    document.getElementById('quizSetup').classList.add('hidden');
    document.getElementById('quizGame').classList.remove('hidden');
    document.getElementById('quizResults').classList.add('hidden');

    displayQuestion();
}

function displayQuestion() {
    const current = quiz.getCurrentQuestion();
    const options = quiz.getOptions();
    const total = quiz.words.length;
    const current_num = quiz.currentIndex + 1;

    document.getElementById('questionNumber').textContent = `Question ${current_num} of ${total}`;
    document.getElementById('progressFill').style.width = `${(current_num / total) * 100}%`;

    if (quiz.quizType === 'meaning') {
        document.getElementById('questionText').textContent = `What does "${current.word}" mean?`;
    } else {
        document.getElementById('questionText').textContent = `Which word means: "${current.meaning}"?`;
    }

    const answerOptions = document.getElementById('answerOptions');
    answerOptions.innerHTML = options.map((option, index) => `
        <label class="answer-option">
            <input type="radio" name="answer" value="${option}" data-index="${index}">
            <span>${escapeHtml(option)}</span>
        </label>
    `).join('');

    // Enable submit button when an option is selected
    const radioButtons = answerOptions.querySelectorAll('input[type="radio"]');
    const submitBtn = document.getElementById('submitAnswer');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            submitBtn.disabled = false;
        });
    });

    // Hide feedback
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('submitAnswer').disabled = true;
}

function submitAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return;

    const answer = selected.value;
    const isCorrect = quiz.checkAnswer(answer);

    // Show feedback
    const feedback = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedbackText');
    const current = quiz.getCurrentQuestion();

    if (isCorrect) {
        feedback.classList.add('correct');
        feedback.classList.remove('incorrect');
        feedbackText.innerHTML = `✓ Correct! "${current.word}" means "${escapeHtml(current.meaning)}"`;
    } else {
        feedback.classList.add('incorrect');
        feedback.classList.remove('correct');
        feedbackText.innerHTML = `✗ Incorrect. "${current.word}" means "${escapeHtml(current.meaning)}", not "${escapeHtml(answer)}"`;
    }

    feedback.classList.remove('hidden');
    document.getElementById('submitAnswer').disabled = true;
}

function nextQuestion() {
    if (quiz.nextQuestion()) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quizGame').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');

    const score = quiz.getScore();
    const percentage = quiz.getPercentage();

    document.getElementById('finalScore').textContent = score;

    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfect! You got them all right!';
    } else if (percentage >= 80) {
        message = '🌟 Excellent! You\'re doing great!';
    } else if (percentage >= 60) {
        message = '👍 Good job! Keep practicing!';
    } else if (percentage >= 40) {
        message = '💪 You\'re getting there! Keep going!';
    } else {
        message = '📚 Keep learning! You\'ll improve with practice!';
    }

    document.getElementById('scoreMessage').textContent = message;

    // Update stats
    const stats = store.getStats();
    stats.totalSessions += 1;
    stats.totalCorrect += quiz.correct;
    stats.totalAnswered += quiz.words.length;

    // Update streaks
    const today = store.getTodayKey();
    if (stats.lastStudyDate !== today) {
        // Check if yesterday was a study day (consecutive)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split('T')[0];

        if (stats.lastStudyDate === yesterdayKey) {
            stats.currentStreak += 1;
        } else if (stats.lastStudyDate === null) {
            // First ever session
            stats.currentStreak = 1;
        } else {
            // Gap in study — reset streak
            stats.currentStreak = 1;
        }
        stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
        stats.lastStudyDate = today;
    }

    store.saveStats(stats);

    // Log activity
    store.logActivity('quizzesTaken', 1);
    store.logActivity('wordsQuizzed', quiz.words.length);
}

// =====================================================
// Writing Practice
// =====================================================
function initWritingPractice() {
    const startBtn = document.getElementById('startWriting');
    const checkBtn = document.getElementById('checkSentence');
    const nextBtn = document.getElementById('nextWord');

    startBtn.addEventListener('click', startWritingPractice);
    checkBtn.addEventListener('click', checkSentence);
    nextBtn.addEventListener('click', nextWritingWord);
}

let currentWritingWord = null;

function startWritingPractice() {
    let words = store.getAll();
    const category = document.getElementById('writeCategory').value;
    if (category) {
        words = words.filter(w => w.category === category);
    }
    if (words.length === 0) {
        alert(category ? `No words in category "${category}". Add some words first!` : 'Add some words first!');
        return;
    }

    currentWritingWord = words[Math.floor(Math.random() * words.length)];

    document.getElementById('writeSetup').classList.add('hidden');
    document.getElementById('writePractice').classList.remove('hidden');

    document.getElementById('targetWord').textContent = currentWritingWord.word;
    document.getElementById('targetMeaning').textContent = currentWritingWord.meaning;
    document.getElementById('userSentence').value = '';
    document.getElementById('sentenceFeedback').classList.add('hidden');
    document.getElementById('userSentence').focus();
}

// API Key Management — prefer Settings (localStorage) over sessionStorage
function getApiKey() {
    // First check Settings input
    const settingsKey = document.getElementById('apiKey')?.value?.trim();
    if (settingsKey) return settingsKey;
    // Then check localStorage (saved from settings)
    const stored = localStorage.getItem('vocab_api_key');
    if (stored) return stored;
    // Fallback to sessionStorage
    return sessionStorage.getItem('vocab_api_key');
}

function setApiKey(apiKey) {
    localStorage.setItem('vocab_api_key', apiKey);
    sessionStorage.setItem('vocab_api_key', apiKey);
}

async function promptForApiKey() {
    return new Promise((resolve) => {
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            ">
                <h3 style="margin-top: 0; color: #4f46e5;">🔑 API Key Required</h3>
                <p style="color: #6b7280; margin-bottom: 1rem;">To use AI sentence checking, please enter your API key. It will be stored securely for this session only.</p>
                <input type="password" id="apiKeyInput" placeholder="Enter your API key..." style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 6px;
                    margin-bottom: 1rem;
                    font-size: 14px;
                    box-sizing: border-box;
                ">
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button id="cancelBtn" style="
                        padding: 0.5rem 1rem;
                        border: 1px solid #d1d5db;
                        background: white;
                        color: #6b7280;
                        border-radius: 6px;
                        cursor: pointer;
                    ">Cancel</button>
                    <button id="saveBtn" style="
                        padding: 0.5rem 1rem;
                        border: none;
                        background: #4f46e5;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                    ">Save & Continue</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const input = modal.querySelector('#apiKeyInput');
        const saveBtn = modal.querySelector('#saveBtn');
        const cancelBtn = modal.querySelector('#cancelBtn');
        
        input.focus();
        
        const cleanup = () => {
            document.body.removeChild(modal);
        };
        
        saveBtn.onclick = () => {
            const apiKey = input.value.trim();
            if (apiKey) {
                setApiKey(apiKey);
                cleanup();
                resolve(apiKey);
            } else {
                input.style.borderColor = '#ef4444';
                input.placeholder = 'API key is required';
            }
        };
        
        cancelBtn.onclick = () => {
            cleanup();
            resolve(null);
        };
        
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                cleanup();
                resolve(null);
            }
        };
    });
}

async function getAIFeedback(sentence, word) {
    // Get API key — default to sk-vietlong if none configured
    let apiKey = getApiKey();
    if (!apiKey) {
        apiKey = 'sk-vietlong';
    }

    const systemPrompt = `You are an expert English language tutor helping an intermediate (B1-B2) learner improve their writing. Your goal is to provide constructive, encouraging feedback that helps them write more naturally and accurately.

Guidelines:
- Focus on the most important improvements (don't overwhelm with minor issues)
- Explain WHY changes improve the sentence
- Provide alternative phrasings when helpful
- Maintain an encouraging, supportive tone
- Consider both grammar and naturalness`;

    const userPrompt = `Target word: "${word.word}"
Word meaning: "${word.meaning}"
Student's sentence: "${sentence}"

Please analyze this sentence and provide feedback in this JSON format:
{
    "grammar": "Brief grammar assessment (✓ if correct, or explain the issues)",
    "corrected_sentence": "Corrected version if there are errors, or repeat the original if correct",
    "naturalness": number from 1-5 (how natural/fluent the sentence sounds),
    "naturalness_feedback": "Brief explanation of the naturalness score",
    "wordUsage": "Assessment of how well they used the target word",
    "suggestions": "Specific suggestions to improve the sentence",
    "alternative": "A better/more natural way to write a similar sentence using the target word",
    "additional_example": "One more example sentence using the target word in a different context",
    "issues": ["list", "of", "specific", "problems"] (empty array if no issues),
    "overall_feedback": "Brief encouraging summary (1-2 sentences)"
}

Be encouraging but honest. Focus on helping them improve. Keep feedback concise but helpful.
IMPORTANT: Return ONLY valid JSON, no markdown formatting.`;

    const response = await fetch('https://carmella-overviolent-unsomberly.ngrok-free.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'VocabTrainer/1.0'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 600
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your key in Settings.');
        } else if (response.status === 502 || response.status === 503) {
            throw new Error('AI server is offline. The ngrok tunnel may not be running.');
        }
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse JSON response (strip markdown code fences if present)
    try {
        const cleaned = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const feedback = JSON.parse(cleaned);
        return feedback;
    } catch (parseError) {
        // If JSON parsing fails, create structured feedback from text
        return {
            grammar: "✓ Analysis completed",
            naturalness: 3,
            naturalness_feedback: "See details below",
            wordUsage: "Word usage analyzed",
            suggestions: aiResponse,
            alternative: `Consider different phrasing with "${word.word}".`,
            issues: [],
            overall_feedback: aiResponse
        };
    }
}

async function checkSentence() {
    const sentence = document.getElementById('userSentence').value.trim();
    if (!sentence) {
        alert('Please write a sentence first!');
        return;
    }

    // Show loading state
    const checkBtn = document.getElementById('checkSentence');
    const originalText = checkBtn.textContent;
    checkBtn.textContent = '🔄 Checking with AI...';
    checkBtn.disabled = true;

    try {
        const feedback = await getAIFeedback(sentence, currentWritingWord);
        displaySentenceFeedback(feedback);
        showNotification('AI feedback received! ✨', 'success');
    } catch (error) {
        console.error('AI check failed:', error);
        
        if (error.message.includes('API key')) {
            showNotification(error.message, 'error');
        } else if (error.message.includes('offline') || error.message.includes('tunnel')) {
            showNotification('AI server offline — check that ngrok is running', 'error');
        } else if (error.message.includes('Failed to fetch')) {
            showNotification('Cannot reach AI server — is ngrok tunnel active?', 'error');
        } else {
            showNotification(`AI error: ${error.message}`, 'error');
        }
        
        // Show fallback feedback with clear message that AI was unavailable
        const feedback = generateMockFeedback(sentence, currentWritingWord);
        feedback.overall_feedback = '⚠️ AI is currently unavailable. This is basic offline feedback only.';
        displaySentenceFeedback(feedback);
    } finally {
        checkBtn.textContent = originalText;
        checkBtn.disabled = false;
    }
}

function generateMockFeedback(sentence, word) {
    const hasWord = sentence.toLowerCase().includes(word.word.toLowerCase());
    const length = sentence.split(' ').length;
    const endsWithPunctuation = /[.!?]$/.test(sentence);

    return {
        grammar: '✓ Grammar looks good!',
        naturalness: hasWord ? 5 : 3,
        alternative: `"It was ${word.word} to see such a perfect example."`,
        example: `Another way to use "${word.word}": ${word.example}`,
        issues: [],
    };
}

function displaySentenceFeedback(feedback) {
    const feedbackContent = document.getElementById('feedbackContent');
    
    // Build issues display
    let issuesHtml = '';
    if (feedback.issues && feedback.issues.length > 0) {
        issuesHtml = `
            <div class="feedback-item" style="border-left: 3px solid #ef4444; padding-left: 0.75rem; margin-bottom: 0.75rem;">
                <strong>⚠️ Issues to fix:</strong>
                <ul style="margin: 0.25rem 0 0 1rem; padding: 0;">${feedback.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
            </div>
        `;
    }

    // Corrected sentence (if different from original)
    let correctedHtml = '';
    if (feedback.corrected_sentence && !feedback.corrected_sentence.toLowerCase().includes('correct')) {
        correctedHtml = `
            <div class="feedback-item" style="border-left: 3px solid #f59e0b; padding-left: 0.75rem; margin-bottom: 0.75rem;">
                <strong>✏️ Corrected:</strong> "${feedback.corrected_sentence}"
            </div>
        `;
    }

    feedbackContent.innerHTML = `
        <div class="feedback-item" style="border-left: 3px solid #10b981; padding-left: 0.75rem; margin-bottom: 0.75rem;">
            <strong>Grammar:</strong> ${feedback.grammar || 'N/A'}
        </div>
        ${correctedHtml}
        <div class="feedback-item" style="border-left: 3px solid #3b82f6; padding-left: 0.75rem; margin-bottom: 0.75rem;">
            <strong>Naturalness:</strong> ${feedback.naturalness || '?'}/5
            ${feedback.naturalness_feedback ? `<br><small style="color: #6b7280;">${feedback.naturalness_feedback}</small>` : ''}
        </div>
        ${feedback.wordUsage ? `
            <div class="feedback-item" style="border-left: 3px solid #8b5cf6; padding-left: 0.75rem; margin-bottom: 0.75rem;">
                <strong>Word Usage:</strong> ${feedback.wordUsage}
            </div>
        ` : ''}
        ${feedback.suggestions ? `
            <div class="feedback-item" style="border-left: 3px solid #f59e0b; padding-left: 0.75rem; margin-bottom: 0.75rem;">
                <strong>💡 Suggestions:</strong> ${feedback.suggestions}
            </div>
        ` : ''}
        ${issuesHtml}
        ${feedback.alternative ? `
            <div class="feedback-item" style="border-left: 3px solid #6366f1; padding-left: 0.75rem; margin-bottom: 0.75rem;">
                <strong>Alternative:</strong> "${feedback.alternative}"
            </div>
        ` : ''}
        ${feedback.additional_example ? `
            <div class="feedback-item" style="border-left: 3px solid #14b8a6; padding-left: 0.75rem; margin-bottom: 0.75rem;">
                <strong>📝 Another example:</strong> "${feedback.additional_example}"
            </div>
        ` : ''}
        ${feedback.overall_feedback ? `
            <div class="feedback-item" style="border-left: 3px solid #10b981; padding-left: 0.75rem; margin-bottom: 0.75rem; background: #f0fdf4; padding: 0.5rem 0.75rem; border-radius: 4px;">
                <strong>${feedback.overall_feedback}</strong>
            </div>
        ` : ''}
    `;

    document.getElementById('sentenceFeedback').classList.remove('hidden');
}

function nextWritingWord() {
    startWritingPractice();
}

// =====================================================
// Progress Statistics
// =====================================================
function updateProgressStats() {
    const words = store.getAll();
    const stats = store.getStats();

    // Update counts
    document.getElementById('totalWords').textContent = words.length;

    const mastered = words.filter(w => w.mastery >= 4).length;
    const learning = words.filter(w => w.mastery > 0 && w.mastery < 4).length;

    document.getElementById('masteredWords').textContent = mastered;
    document.getElementById('learningWords').textContent = learning;

    // Quiz accuracy
    const accuracy = stats.totalAnswered > 0
        ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
        : 0;
    document.getElementById('quizAccuracy').textContent = `${accuracy}%`;

    // Streaks
    document.getElementById('currentStreak').textContent = `${stats.currentStreak} days`;
    document.getElementById('longestStreak').textContent = `${stats.longestStreak} days`;

    // Activity chart — render last 7 days dynamically
    const weekActivity = store.getActivityForWeek();
    const maxActivity = Math.max(...weekActivity.map(d => d.total), 1); // avoid division by 0
    const chartContainer = document.getElementById('activityChart');
    const bars = chartContainer.querySelectorAll('.activity-bar');

    bars.forEach((bar, index) => {
        const data = weekActivity[index];
        const fill = bar.querySelector('.bar-fill');
        const value = bar.querySelector('.bar-value');
        const label = bar.querySelector('.bar-label');

        const heightPercent = Math.round((data.total / maxActivity) * 100);
        fill.style.height = `${heightPercent}%`;
        value.textContent = data.total;
        label.textContent = data.day;
    });

    // Mastery distribution
    const unknown = words.filter(w => w.mastery === 0).length;
    const recognized = words.filter(w => w.mastery === 1).length;
    const understood = words.filter(w => w.mastery >= 2 && w.mastery <= 3).length;

    const total = words.length || 1;
    const unknownPct = Math.round((unknown / total) * 100);
    const recognizedPct = Math.round((recognized / total) * 100);
    const understoodPct = Math.round((understood / total) * 100);
    const masteredPct = Math.round((mastered / total) * 100);

    document.getElementById('masteryUnknown').textContent = `${unknownPct}%`;
    document.getElementById('masteryRecognized').textContent = `${recognizedPct}%`;
    document.getElementById('masteryUnderstood').textContent = `${understoodPct}%`;
    document.getElementById('masteryMastered').textContent = `${masteredPct}%`;

    // Update mastery bar widths
    document.querySelector('.mastery-fill.unknown').style.width = `${unknownPct}%`;
    document.querySelector('.mastery-fill.recognized').style.width = `${recognizedPct}%`;
    document.querySelector('.mastery-fill.understood').style.width = `${understoodPct}%`;
    document.querySelector('.mastery-fill.mastered').style.width = `${masteredPct}%`;
}

// =====================================================
// Settings
// =====================================================
function initSettings() {
    const exportBtn = document.getElementById('exportData');
    const importBtn = document.getElementById('importData');
    const importFile = document.getElementById('importFile');
    const resetBtn = document.getElementById('resetProgress');
    const clearBtn = document.getElementById('clearData');

    // Load current settings
    const settings = store.getSettings();
    document.getElementById('quizSize').value = settings.quizSize;
    document.getElementById('aiEnabled').checked = settings.aiEnabled;
    document.getElementById('theme').value = settings.theme;
    document.getElementById('fontSize').value = settings.fontSize;

    // Event listeners
    exportBtn.addEventListener('click', exportData);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', handleImport);
    resetBtn.addEventListener('click', resetProgress);
    clearBtn.addEventListener('click', clearAllData);

    // Settings changes
    document.getElementById('quizSize').addEventListener('change', (e) => {
        settings.quizSize = parseInt(e.target.value);
        store.saveSettings(settings);
    });

    // Save API key to localStorage when changed
    const apiKeyInput = document.getElementById('apiKey');
    // Load saved API key
    const savedKey = localStorage.getItem('vocab_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
    apiKeyInput.addEventListener('change', (e) => {
        const key = e.target.value.trim();
        if (key) {
            setApiKey(key);
            showNotification('API key saved!', 'success');
        }
    });

    // Category management
    renderCategoryList();
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        const input = document.getElementById('newCategoryInput');
        const name = input.value.trim();
        if (!name) return;
        if (store.addCategory(name)) {
            input.value = '';
            renderCategoryList();
            populateCategoryDropdowns();
            showNotification(`Category "${name}" added!`, 'success');
        } else {
            showNotification('Category already exists or invalid', 'error');
        }
    });
    // Allow Enter key to add category
    document.getElementById('newCategoryInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('addCategoryBtn').click();
        }
    });
}

function renderCategoryList() {
    const categories = store.getCategories();
    const container = document.getElementById('categoryList');
    if (categories.length === 0) {
        container.innerHTML = '<p style="color: #9ca3af; font-size: 0.9rem;">No categories yet.</p>';
        return;
    }
    container.innerHTML = categories.map(cat => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: #f9fafb; border-radius: 6px; margin-bottom: 0.5rem;">
            <span style="font-size: 0.95rem;">📁 ${escapeHtml(cat)}</span>
            <button type="button" onclick="removeCategoryItem('${escapeHtml(cat)}')" style="
                background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; padding: 0.25rem;
            ">✕</button>
        </div>
    `).join('');
}

function removeCategoryItem(name) {
    store.deleteCategory(name);
    renderCategoryList();
    populateCategoryDropdowns();
    showNotification(`Category "${name}" removed`, 'info');
}

function exportData() {
    const words = store.getAll();
    const stats = store.getStats();
    const data = { words, stats, exportDate: new Date().toISOString() };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `vocab-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    showNotification('Data exported successfully!', 'success');
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            store.save(data.words);
            if (data.stats) {
                store.saveStats(data.stats);
            }
            showNotification('Data imported successfully!', 'success');
            displayWords('');
        } catch (err) {
            alert('Error importing file: ' + err.message);
        }
    };
    reader.readAsText(file);
}

function resetProgress() {
    if (confirm('Are you sure? This will reset all your quiz progress but keep your vocabulary.')) {
        store.saveStats({
            totalSessions: 0,
            totalCorrect: 0,
            totalAnswered: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: null,
        });
        showNotification('Progress reset!', 'success');
    }
}

function clearAllData() {
    if (confirm('WARNING: This will delete ALL data permanently. Are you sure?')) {
        if (confirm('This cannot be undone. Are you really sure?')) {
            store.save([]);
            store.init();
            location.reload();
        }
    }
}

// =====================================================
// Notifications
// =====================================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    if (type === 'success') {
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
    } else {
        notification.style.background = '#4f46e5';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =====================================================
// Initialization
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initAddWordForm();
    initWordList();
    initQuiz();
    initWritingPractice();
    initSettings();
    populateCategoryDropdowns();

    // Initial display
    store.updateWordCount();
});

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
