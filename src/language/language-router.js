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
  .use(async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      if (!words)
        return res.status(404).json({
          error: `There aren\'t any words`,
        })
      const head = words.head;
      req.words = words;
      req.head = head;
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      res.json({
        language: req.language,
        words: req.words.display(),
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
      const head = req.head.value;

      if (!head) {
        return res.status(404).json({
          error: 'No item on top',
        })
      }
      return res.status(200).json({
        head: head,
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
      const words = req.words;
      const head = req.head.value;
      const db = req.app.get('db');
      let updatedNode;
      let updatedField;
      let message;

      if (!guess) {
        return res.status(400).json({ error: 'Must include user guess in request body'});
      }
      if (guess.toLowerCase() === head.translation.toLowerCase()) {
        updatedNode = await ListService.addToCorrect(words, head);
        updatedField = { correct_count: updatedNode.value.correct_count };
        message = 'You got the right answer';
        
      } else {
        updatedNode = await ListService.addToIncorrect(words, head);
        updatedField = { incorrect_count: updatedNode.value.incorrect_count };
        message = 'You did not get the right answer';

      }
      await LanguageService.updateCountOnWord(db, head.id, updatedField)
          .then(() => res.status(201).json({ message }))
          .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  })

module.exports = languageRouter
