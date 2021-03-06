const ListService = require('./list-service');
const List = require('./linked-list');

const words = new List();

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getHead() {
    return words.head;
  },

  addToCorrect(value) {
    return ListService.addToCorrect(words, value);
  },
  addToIncorrect(value) {
    return ListService.addToIncorrect(words, value);
  },

  getTotalScore() {
  let total = 0;
  const List = words.display();
  List.map((word) => total += word.correct_count);
  return total;
},

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'next',
        'translation',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
      .then((lang) => {
        if (words.head === null) {
          return ListService.sort(lang, words);
        } else {
          return words;
        }
      })
      
  },

  updateCountOnWord(db, id, newField) {
    return db
      .from('word')
      .where({ id })
      .update(newField)
  }

}

module.exports = LanguageService
