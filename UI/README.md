# Quick Vocab Trainer - UI

A simple, offline-first vocabulary learning web app with 4 main features.

## Files

- **index.html** - Main application structure
- **styles.css** - Complete styling with responsive design
- **script.js** - All application logic and data management

## Features

### 1. 📝 Quick Add
- Quickly add new vocabulary words while reading
- Fields: Word, Meaning, Example Sentence, Source
- Save & Add Another for batch entry
- Auto-saves to browser localStorage

### 2. 📋 Word List
- Browse all your vocabulary words
- Real-time search and filtering
- View word details (meaning, example, source)
- Delete words with confirmation
- Mastery level tracking

### 3. 🧠 Quiz
- Two quiz types:
  - Word → Meaning
  - Meaning → Word
- Multiple choice with 4 options
- Immediate feedback on answers
- Quiz results and accuracy tracking
- Configurable quiz size (5, 10, 20, 50 words)

### 4. ✍️ Write & Check
- Sentence writing practice
- Write sentences using target vocabulary
- Get feedback on grammar and naturalness
- See alternative phrasings
- Practice multiple words in sequence

### 5. 📊 Progress
- Track total words learned
- View mastery distribution
- Quiz accuracy statistics
- Learning streaks
- Weekly activity chart

### 6. ⚙️ Settings
- Customize quiz size
- Enable/disable AI features
- Add OpenAI API key for AI feedback
- Export/import vocabulary data
- Theme and font size preferences
- Data management options

## How to Use

### Setup
1. Open `index.html` in any modern web browser
2. No installation or setup required!
3. Start adding vocabulary words

### Adding Words
1. Click the "📝 Quick Add" tab
2. Enter the word and its meaning
3. Optionally add an example sentence and source
4. Click "Save Word" or "Save & Add Another"

### Taking a Quiz
1. Click the "🧠 Quiz" tab
2. Choose quiz type (Word→Meaning or Meaning→Word)
3. Click "Start Quiz" to begin
4. Select your answer and click "Submit"
5. Get instant feedback
6. View results after all questions

### Writing Practice
1. Click the "✍️ Write" tab
2. Click "Start Writing Practice"
3. Read the target word and its meaning
4. Write a sentence using that word
5. Click "Check Sentence" for feedback
6. Click "Next Word" to continue

### Tracking Progress
1. Click the "📊 Progress" tab
2. View your learning statistics
3. See mastery distribution of your vocabulary
4. Track your learning streaks

## Data Storage

All data is stored locally in your browser's localStorage:
- **vocab_app_data** - Your vocabulary words
- **vocab_app_stats** - Quiz performance and streaks
- **vocab_app_settings** - Your preferences

No data is sent to any server. Everything stays on your device!

## Export & Backup

1. Go to Settings tab
2. Click "📥 Export Data (JSON)"
3. A backup file will download automatically
4. To restore: Click "📤 Import Data" and select your backup file

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Opera

Requires localStorage support (all modern browsers have this).

## Tips for Best Results

1. **Be consistent**: Study a bit every day
2. **Add context**: Include example sentences and sources
3. **Review regularly**: Use the quiz feature frequently
4. **Practice writing**: Use the Write feature to internalize words
5. **Track progress**: Check your stats regularly for motivation

## Keyboard Shortcuts (Future)

- `Ctrl/Cmd + K` - Focus search box
- `Enter` - Submit answer in quiz
- `Esc` - Cancel current action

## Future Enhancements

- [ ] Spaced repetition algorithm
- [ ] AI-powered sentence feedback (when API key added)
- [ ] Audio pronunciation
- [ ] Category/topic organization
- [ ] Mobile app version
- [ ] Cloud synchronization
- [ ] Dark mode
- [ ] Multiple languages

## No Account Required

This app doesn't need any login or account. It works 100% offline on your device.

## Privacy

- No data is collected or shared
- No analytics or tracking
- No ads
- All data stays on your device
- You can delete everything anytime

## Version

Quick Vocab Trainer v1.0.0

## License

Personal use application. Feel free to customize and adapt for your learning needs!
