const express = require('express')
const LanguageService = require('./language-service')
const ListService = require('./list-service');
const { requireAuth } = require('../middleware/jwt-auth')
const jsonParser = express.json();
const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      if (!words)
        return res.status(404).json({
          error: `There aren\'t any words`,
        })
      res.json({
        language: req.language,
        words: words.display(),
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    // my guess is that this head endpoint will be the one responsible for getting me the first card every time. Getting the "head" of the linked list
    try {
      const first = LanguageService.getHead();

      if (!first) {
        return res.status(404).json({
          error: 'No item on top',
        })
      }
      
      console.log('Line 74', first);
      const total = LanguageService.getTotalScore();
      const head = {
        nextWord:first.value.original,
        totalScore:total,
        wordCorrectCount:first.value.correct_count,
        wordIncorrectCount:first.value.incorrect_count,
      };

      return res.status(200).json({
        ...head,
      })
    } catch (error) {
      next(error);
    }
    
  })

languageRouter
  .post('/guess', jsonParser, async (req, res, next) => {
    // This will take a users guess from the request body and decide whether it matches the head of the linked list or not. Then send an appropriate response 

    // If they get the right answer than the correct field needs to be updated and the word should be moved to the end of the list. 
    // If they get the WRONG answer than the incorrect fields needs to be updated and the word should be moved into the middle of the list. 

    try {
      const { guess } = req.body;
      const head = LanguageService.getHead();
      console.log('line 91', head);
      const db = req.app.get('db');
      let updatedNode;
      let updatedField;
      let isCorrect;

      if (!guess) {
        return res.status(400).json({ error: `Missing 'guess' in request body`});
      }
      // Decides if they got the right answer or not and prepares the response
      if (guess.toLowerCase() === head.value.translation.toLowerCase()) {
        updatedNode = await LanguageService.addToCorrect(head.value);
        updatedField = { correct_count: updatedNode.value.correct_count };
        isCorrect = true;
        
      } else {
        updatedNode = await LanguageService.addToIncorrect(head.value);
        updatedField = { incorrect_count: updatedNode.value.incorrect_count };
        isCorrect = false;
      }
      const totalScore = LanguageService.getTotalScore();
      // Takes the updated fields and inputs it into the db then sends the response
      await LanguageService.updateCountOnWord(db, head.value.id, updatedField)
          .then(() => LanguageService.getHead())
          .then((nextWord) => (
            res.status(200).json({ 
              nextWord: nextWord.value.original,
              totalScore: totalScore,
              wordCorrectCount:nextWord.value.correct_count,
              wordIncorrectCount: nextWord.value.incorrect_count,
              answer: head.value.translation,
              isCorrect, 
          })))
          .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  })

module.exports = languageRouter
