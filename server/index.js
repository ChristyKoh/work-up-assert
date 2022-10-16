// server/index.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/build')));

const cohere = require('cohere-ai');
cohere.init(process.env.cohere_key);
const static_assert_prompt = `This program will generate assertive speech text given the situation and original speech text.\n--\nSituation: The employee is asking the manager to take a week off from work to spend time with grandparents.\nOriginal Text: I\'m sorry to ask for this at such a busy time. I was wondering if I could take a week off to spend time with my grandparents who are visiting from Spain?\nAssertive Text: I\'d like to take a week off to spend time with my grandparents who are visiting from Spain. I understand it\'s a busy time, but I\'ll jump right back into work at the beginning of next week.\n--\nSituation: The employee is raising an issue with application performance to teammates.\nOriginal Text: I\'m not sure, but I think our app slowdown could be due to our servers being overloaded.\nAssertive Text: The slowdown might lie with overloaded servers. Why don\'t we check the server logs?\n--\nSituation: The employee is responding to an assignment that is out of their scope.\nOriginal Text: I can try to make time to work on this, even though I\'m not as familiar with Joe\'s feature.\nAssertive Text: I don\'t think I should work on this. It seems best for Joe to document the feature, since he is the expert on it.\n--\nSituation: The employee is answering the manager\'s request to take on additional work.\nOriginal Text: I\'m quite busy, but I\'ll try to find some time to work on this.\nAssertive Text: I really appreciate the opportunity, but I can\'t take on extra work at this time.\n--\nSituation: The employee is declining the manager\'s request to take on additional work.\nOriginal Text: I don\'t have time to work on this.\nAssertive Text: I am currently finishing up a few urgent and important tasks. Once those are wrapped up, I will have time next week to help you. Will that work for you?\n--\nSituation: The employee is asking a teammate for help with a blocker.\nOriginal Text: I really hope I\'m not bothering you. Do you have time to take a look at this issue I\'ve been struggling with?\nAssertive Text: I\'m very close to an answer, but I am stuck. I was hoping you could take a look and point me in the right direction?\n--\nSituation: The manager is trying to resolve a disagreement with the team.\nOriginal Text: I don\'t think we should spend any more time discussing this. You can implement whatever you want.\nAssertive Text: I trust your expertise, why don\'t we go with your solution for now, if it will get us the results we need.\n--\nSituation: The employee is asking the manager for feedback.\nOriginal Text: I\'m not sure if my presentation is up to scratch, and I\'d really appreciate if you could take a look at it.\nAssertive Text: I\'d really appreciate if you could take a look at my presentation. Let me know if you have any suggestions for improvement.\n--\nSituation: The employee is accepting teammates\' constructive feedback.\nOriginal Text: I am sorry for the oversight, I\'ll defer to your suggestions.\nAssertive Text: Thank you for pointing out these concerns. I\'ll make sure to take your suggestions into consideration.\n--`;
app.get('/api', async (req, res) => {
  const situation = req.query['situation'];
  const og_text = req.query['text'];
  console.log(req.query);

  if (situation === undefined || og_text === undefined) {
    res.status(400).send("Either situation or text not specified.");
    return;
  }

  const response = await cohere.generate({
    model: 'large',
    prompt: `${static_assert_prompt}\nSituation: ${situation}\nOriginal Text: ${og_text}\nAssertive Text:`,
    max_tokens: 100,
    temperature: 0.8,
    k:0,
    p:1,
    stop_sequences: ['--'],
  });
  res.json(response.body);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});