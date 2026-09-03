# Quick Vocab Trainer - Project Structure

## 📁 Project Layout

```
My app/
├── UI/                           # Main application folder
│   ├── index.html               # ← Start here! Main HTML file
│   ├── styles.css               # All styling for the app
│   ├── script.js                # All JavaScript logic
│   ├── sample-vocabulary.json    # Example data to import
│   ├── README.md                # Technical documentation
│   ├── GETTING-STARTED.md       # User guide
│   └── PROJECT-STRUCTURE.md     # This file
│
├── 01_REQUIREMENTS_MVP.md       # Project requirements
├── 02_DATA_MODEL.md             # Database schema
├── 03_UI.md                     # UI design specs
├── 04_AI_PROMPTS.md             # AI integration guide
├── 10_FUTURE_FEATURES.md        # Roadmap
└── README.md                    # Project overview

```

## 🎯 How to Use These Files

### For Using the App
1. **Start here**: Open `UI/index.html` in your browser
2. **Read guide**: `UI/GETTING-STARTED.md` for how to use app
3. **Need help**: Check `UI/README.md` for features

### For Understanding the Project
1. **Overview**: `README.md` - What is this project?
2. **Requirements**: `01_REQUIREMENTS_MVP.md` - What features to build?
3. **Data**: `02_DATA_MODEL.md` - How data is structured
4. **UI Design**: `03_UI.md` - User interface specifications
5. **AI**: `04_AI_PROMPTS.md` - AI integration details
6. **Future**: `10_FUTURE_FEATURES.md` - What's coming next?

### For Developing
- **UI Code**: `UI/index.html` - HTML structure
- **Styling**: `UI/styles.css` - CSS design
- **Logic**: `UI/script.js` - JavaScript functionality
- **Test Data**: `UI/sample-vocabulary.json` - Sample words

## 🔄 How the App Works

### File Relationships

```
index.html (Structure)
    ↓
    └─→ styles.css (Styling)
    └─→ script.js (Logic)
    
User Data → localStorage (browser storage)
    ↓
    └─→ Automatic backup/restore
```

### Data Flow

```
1. User adds word
   ↓
2. JavaScript captures input
   ↓
3. Data saved to localStorage
   ↓
4. Display updates immediately
   ↓
5. Can export to JSON file
```

## 📝 File Purposes

### UI/index.html
- **What**: Main HTML structure
- **Contains**: 6 tabs (Add, List, Quiz, Write, Progress, Settings)
- **Size**: ~500 lines
- **Edit**: Add new UI elements here

### UI/styles.css  
- **What**: All CSS styling
- **Contains**: Colors, layout, animations, responsive design
- **Size**: ~600 lines
- **Edit**: Change colors, fonts, spacing here

### UI/script.js
- **What**: Application logic
- **Contains**: Data storage, quiz logic, word management
- **Size**: ~700 lines
- **Edit**: Add features and functionality here

### sample-vocabulary.json
- **What**: Example vocabulary data
- **Contains**: 8 sample words with full metadata
- **Use**: Import into app for testing

### Documentation Files
- **GETTING-STARTED.md**: How to use the app
- **README.md**: Technical overview
- **PROJECT-STRUCTURE.md**: This file

---

## 🔧 How to Customize

### Change Colors
1. Open `UI/styles.css`
2. Find lines with `#4f46e5` (main color)
3. Replace with your preferred color
4. Refresh browser

### Add New Quiz Type
1. Open `UI/script.js`
2. Find `QuizGame` class
3. Add new quiz logic in `getOptions()` method
4. Add UI in `index.html`

### Change Quiz Size Options
1. Open `UI/index.html`
2. Find `<select id="quizSize">`
3. Modify `<option>` values
4. Changes take effect immediately

### Add New Field to Vocabulary
1. Update `UI/index.html` form
2. Update `VocabStore.addWord()` in `script.js`
3. Update display in `displayWords()` function

---

## 📊 Data Structure

### Vocabulary Word Object
```javascript
{
  id: "1234567890",              // Unique ID
  word: "sophisticated",         // The word/phrase
  meaning: "advanced and refined", // Definition
  example: "She has...",         // Example sentence
  source: "The Economist",       // Where found
  mastery: 2,                    // 0-4 progression
  createdAt: "2024-01-15T...",  // When added
  attempts: 5,                   // Quiz attempts
  correct: 4                     // Correct answers
}
```

### Statistics Object
```javascript
{
  totalSessions: 12,             // Quiz sessions completed
  totalCorrect: 85,              // Total correct answers
  totalAnswered: 120,            // Total questions answered
  currentStreak: 5,              // Days studied in a row
  longestStreak: 12,             // Best streak ever
  lastStudyDate: "2024-01-22..." // Last study date
}
```

### Settings Object
```javascript
{
  quizSize: 10,                  // Words per quiz
  aiEnabled: true,               // Use AI feedback
  theme: "auto",                 // light/dark/auto
  fontSize: "normal"             // small/normal/large
}
```

---

## 🚀 Development Workflow

### To Add a New Feature:

1. **Update HTML** (`index.html`)
   - Add UI elements

2. **Update CSS** (`styles.css`)
   - Add styling for new elements

3. **Update JavaScript** (`script.js`)
   - Add event listeners
   - Add logic
   - Test in browser

4. **Save and Refresh**
   - Data auto-saves to localStorage
   - Refresh to see changes

### Testing Checklist:
- [ ] Add word successfully
- [ ] Word appears in list
- [ ] Can search for word
- [ ] Quiz works with new word
- [ ] Progress updates
- [ ] Can export data
- [ ] Can import backup
- [ ] Works on mobile view
- [ ] No console errors

---

## 🐛 Debugging Tips

### Check Console
1. Press `F12` (Developer Tools)
2. Go to "Console" tab
3. Look for any red errors
4. Read error message to understand issue

### Test with Sample Data
1. Go to Settings
2. Click "📤 Import Data"
3. Select `sample-vocabulary.json`
4. Now have 8 words to test with

### Clear Data to Start Fresh
1. Go to Settings
2. Click "🗑️ Delete All Data"
3. App resets completely
4. Confirm when prompted

### Check Browser Storage
1. Press `F12`
2. Go to "Application" tab
3. Click "Local Storage"
4. Find "vocab_app_data"
5. Can see all saved data here

---

## 📱 Responsive Design

The app is optimized for:
- **Desktop**: Full experience, all features
- **Tablet**: Good experience, slightly condensed
- **Mobile**: Basic experience, simplified layout

### Test on Different Sizes:
1. Press `F12`
2. Click device icon (mobile/tablet view)
3. Test each tab
4. Try adding words
5. Take quiz

---

## 🔒 Data Privacy & Security

### How Data is Stored:
- **Location**: Browser's localStorage
- **Privacy**: 100% local, no server
- **Backup**: Manual JSON export
- **Sharing**: Only if you share the export file

### Backup Procedure:
1. Regularly export to JSON
2. Store file in safe location
3. Keep multiple backups
4. Import anytime to restore

---

## 🆘 Troubleshooting

### App won't open
- Check browser compatibility (use Chrome, Firefox, Safari, Edge)
- Try clearing cache
- Open in private/incognito window

### Data disappeared
- Check if you cleared browser data
- Look for backup file you exported
- Use localStorage check in DevTools

### Quiz not working
- Add words first
- Check browser console for errors
- Try refreshing page

### Import not working
- Ensure JSON file is valid
- Check file isn't corrupted
- Try exporting fresh data first

---

## 📚 Learn More

### Understanding the Code:
- `VocabStore` class: Data management
- `QuizGame` class: Quiz logic
- `initTabNavigation()`: Tab switching
- `displayWords()`: Word list rendering
- `updateProgressStats()`: Stats calculation

### Browser APIs Used:
- `localStorage`: Data storage
- `JSON`: Data format
- `Date`: Timestamps
- `FileReader`: File import
- `Blob`: File export

---

## 🎓 Next Steps After Setup

1. ✅ Add 10-20 words from your reading
2. ✅ Take your first quiz
3. ✅ Practice writing sentences
4. ✅ Check your progress
5. ✅ Export backup
6. ✅ Study consistently!

---

## 📞 Need Help?

1. Check `GETTING-STARTED.md` for user guide
2. Read relevant section in `README.md`
3. Look at browser console for errors (F12)
4. Review this file for structure
5. Check source code comments in `.js` and `.html` files

---

**Happy Learning! 📚**

Everything you need is in the `UI/` folder. Just open `index.html` in your browser and start!
