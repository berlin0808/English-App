# Data Model

## Vocabulary Entry

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Unique identifier |
| word | string | The word or phrase |
| meaning | text | Primary meaning/definition |
| alternative_meanings | json | Array of additional meanings |
| topic | string | Category/topic (e.g., "business", "travel") |
| type | enum | word/phrase/idiom/collocation |
| example_sentences | json | Array of example sentences |
| difficulty_level | integer | 1-5 scale (AI-assessed) |
| personal_notes | text | User's personal notes |
| source | string | Where the word was encountered |
| mastery_level | integer | 0-4 (unknown → mastered) |
| created_at | datetime | When added to vocabulary |
| updated_at | datetime | Last modification time |

## Quiz Session

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Session identifier |
| session_type | enum | quiz_type (definition_match, multiple_choice, etc.) |
| words_count | integer | Number of words in session |
| correct_answers | integer | Number correct |
| total_time_seconds | integer | Time spent on session |
| created_at | datetime | Session start time |

## Quiz Result

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Result identifier |
| session_id | uuid | Foreign key to quiz_session |
| word_id | uuid | Foreign key to vocabulary |
| question_type | enum | Type of question asked |
| user_answer | text | User's response |
| correct_answer | text | Expected answer |
| is_correct | boolean | Whether answer was correct |
| response_time_ms | integer | Time to answer in milliseconds |
| created_at | datetime | When answered |

## Sentence Practice

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Practice identifier |
| word_id | uuid | Foreign key to vocabulary |
| user_sentence | text | Sentence written by user |
| ai_feedback | json | AI analysis and corrections |
| grammar_score | integer | 1-5 grammar rating |
| naturalness_score | integer | 1-5 naturalness rating |
| created_at | datetime | When practice was done |

## Study Statistics

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Stat identifier |
| date | date | Study date |
| words_studied | integer | Unique words practiced |
| quiz_sessions | integer | Number of quiz sessions |
| sentence_practices | integer | Number of sentence practices |
| total_time_minutes | integer | Total study time |
| accuracy_percentage | float | Overall accuracy for the day |
| new_words_added | integer | New vocabulary entries |

## Review Schedule

| Field | Type | Description |
|-------|------|-------------|
| word_id | uuid | Foreign key to vocabulary |
| next_review_date | datetime | When word should be reviewed next |
| review_interval_days | integer | Current spacing interval |
| consecutive_correct | integer | Streak of correct answers |
| ease_factor | float | Spaced repetition ease multiplier |
| last_reviewed | datetime | Last review timestamp |

## Enums

### Word Type
- word
- phrase  
- idiom
- collocation

### Quiz Type
- definition_match
- multiple_choice
- fill_blank
- sentence_creation
- translation
- context_clues

### Mastery Level
- 0: Unknown
- 1: Recognized
- 2: Understood
- 3: Can Use
- 4: Mastered
