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
const static_fallacies_promp = `This program will generate challenges to cognitive fallacies given the type of fallacy and the statement.
--
Type of Fallacy: Being Right
Statement: You don’t know what you’re talking about. I know that technique won’t help me.
Response: You may not know everything about what can or can't help you. Perhaps you can be open to alternatives.
--
Type of Fallacy: Blaming
Statement: If my wife woke up earlier, I wouldn't be late for work.
Response: There may have been other reasons why you were late for work. It may not be fair to expect your wife to fully control when she wakes up.
--
Type of Fallacy: Blaming
Statement: My partner didn't hug me this morning. He makes me feel bad about myself.
Response: Your partner's actions may not have been to hurt you. Maybe he was not feeling so well either.
--
Type of Fallacy: Catastrophizing
Statement: I failed the interview. What if I never get a job? I'm so useless that I should just die.
Response: You may have failed this interview, but you may do better for the next. There's a lot of luck involved. Even if you don't get a job right now, you still have value to others.
--
Type of Fallacy: Catastrophizing
Statement: If I tell my boyfriend these fears, he'll lose feelings and eventually will want to break up because I'm so paranoid.
Response: Vulnerability is a part of intimacy. Rather than losing feelings, an empathetic boyfriend would feel grateful and trusted to hear your honest feelings.
--
Type of Fallacy: Control Fallacy
Statement: My badness at school is the reason my parents are divorcing.
Response: The way your parents handle their emotions toward one another is not under your control. They have their reasons, and it may not be related to your behavior at school.
--
Type of Fallacy: Control Fallacy
Statement: My sister is depressed, and it's all my fault because I didn't reach out to her enough.
Response: Depression can result from many circumstances outside of your control. Even if you reached out to her, that may not have solved the underlying issue.
--
Type of Fallacy: Emotional Reasoning
Statement: I feel so inadequate, I must not really belong anywhere.
Response: You may feel inadequate after rejection, but you can still find your place among those who see the value in you.
--
Type of Fallacy: Emotional Reasoning
Statement: I have a bad feeling and I just don't think it'll work out.
Response: This bad feeling may be causing you to think negatively. There are reasons it may work out well despite how you feel.
--
Type of Fallacy: Filtering
Statement: Yes, that presentation went well, but it won’t happen again.
Response: Your next presentation may go just as well. What's to say you won't do even better?
--
Type of Fallacy: Filtering
Statement: My boss told me she liked my presentation, but she's just being nice.
Response: Your boss gave you a compliment, which means you did well. It wouldn't be helpful for her to give empty praise.
--
Type of Fallacy: Fortune Telling
Statement: I am always going to be upset about the way I talk.
Response: There's no way to know how things will change in the future. You may feel differently as you improve or find more compassion for yourself.
--
Type of Fallacy: Heaven's Reward
Statement: If I work hard to lose weight, no one will ever make fun of me.
Response: A physical transformation will not necessarily put off others' ridicule.
--
Type of Fallacy: Heaven's Reward
Statement: Someday my crush will return all my affections, if I keep sending gifts and love letters to show her I care.
Response: Your displays of affection don't entitle you to your crush's affection in return.
--
Type of Fallacy: Jumping to Conclusions
Statement: My husband came home from work all serious. He must be mad at me.
Response: He may be serious because of work, not because he's angry at you. Maybe you can ask him before jumping to conclusions.
--
Type of Fallacy: Jumping to Conclusions
Statement: My girlfriend was so gloomy around me today. I think she might want to break up.
Response: She may be gloomy because she's having a bad day, not because she wants to break up. Maybe you can ask her why she is feeling gloomy.
--
Type of Fallacy: Mind Reading
Statement: They are not interested in what I have to say.
Response: It's not possible to know whether their thoughts are so negative. You have many interesting things to say, for those who will listen.
--
Type of Fallacy: Mind Reading
Statement: Everyone thinks I'm not interesting enough to hang around.
Response: I don't think you should assume everyone thinks you're uninteresting.
--
Type of Fallacy: Overgeneralizing
Statement: I ruined my chances for a promotion. I never say the right thing!
Response: Using words like 'never' can overgeneralize your experience. There were probably many times you contributed valuable input.
--
Type of Fallacy: Overgeneralizing
Statement: She puts on so much makeup before meetings, so she must be really shallow.
Response: Just because she puts on makeup doesn't mean she's shallow. Perhaps it gives her confidence, or it's part of her routine.
--
Type of Fallacy: Personalizing
Statement: It’s all my fault that the meeting ran on so long.
Response: The people in a meeting share the responsibility for time management, so it's not all your fault.
--
Type of Fallacy: Personalizing
Statement: If I hadn't let my daughter go to that party, she wouldn't have gotten hurt.
Response: You shouldn't blame yourself. You had no way of knowing that such a chance accident would happen to her.
--
Type of Fallacy: Personalizing
Statement: My manager seemed really upset today. It must have been something I said to her at lunch.
Response: Your manager may have gotten upset for a reason that has nothing to do with you.
--`

app.get('/assert-api', async (req, res) => {
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

app.get('/fallacies-api', async (req, res) => {
    const statement = req.query['statement'];
    // Future: Perform fallacy classification before generation
    const type = !req.query['type']? "Fallacy": req.query['type'];
    console.log(req.query);
  
    if (statement === undefined) {
      res.status(400).send("Statement not specified.");
      return;
    }
  
    const response = await cohere.generate({
      model: 'large',
      prompt: `${static_fallacies_promp}\nFallacy Type: ${type}\nStatement: ${statement}\nResponse:`,
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