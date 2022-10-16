import './App.css';
import React from 'react';
import {Button, Box, Card, Tab, Tabs, TextField, Typography, FormControl} from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

function CogFallaciesComponent(props) {
  const [data, setData] = React.useState(null);
  const [statement, setStatement] = React.useState('');

  const handleStatementChange = (statement) => {
    setStatement(statement.target.value);
  }

  const handleSubmit = (abc) => {
    abc.preventDefault();
    setData(null);
    fetch(`/fallacies-api?statement=${statement}`)
      .then((res) => res.json())
      .then((data) => setData(`${data.generations[0].text.slice(0,-2)}`));
  }

  return <FormControl sx={{ width: '70ch' }}>
          <p>
            Struggling with spiraling negative thoughts? Let's try to call out and 
            crush those cognitive fallacies.
          </p>
          <Card>
            <br/>
            <TextField id="outlined-basic" variant="outlined" label="Put your troubling statement here"
              helperText="ex: My boss told me she liked my presentation, but I think she's just being nice."
              value={statement} onChange={handleStatementChange}/><br/><br/>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                <br/><br/>  
          </Card><br/>

          <TextField id="filled-basic" variant="filled"
              value={!data ? '' : data}/><br/>

        </FormControl>;
}

function AssertComponent(props) {
  const [data, setData] = React.useState(null);
  const [situation, setSituation] = React.useState('');
  const [draftText, setDraftText] = React.useState('');

  // Update prompt variable when handleChange is called
  const handleDraftChange = (draft) => {
    setDraftText(draft.target.value);
  }
  
  const handleSituationChange = (situation) => {
    setSituation(situation.target.value);
  }

  const handleSubmit = (abc) => {
    abc.preventDefault();
    setData(null);
    fetch(`/assert-api?situation=${situation}&text=${draftText}`)
      .then((res) => res.json())
      .then((data) => setData(`${data.generations[0].text.slice(0,-1)}`));
  }

  return <FormControl sx={{ width: '70ch' }}>
      <p>Are you tired of laying down and passively giving into your boss's demands? It's about 
              time to 💪 <em>get assertive</em> 💪 and 📣 <em>speak out</em> 📣 for what you want.
            </p>
          <Card>
            <br/>
            <TextField id="outlined-basic" variant="outlined" label="Describe the Situation"
              helperText="ex: The employee is responding to an assignment that is out of their scope."
              value={situation} onChange={handleSituationChange}/><br/><br/>
            <TextField id="outlined-basic" variant="outlined"  label="What you'd like to communicate"
              helperText="ex: I can try to make time to work on this, even though I'm not as familiar with Joe's feature."
              value={draftText} onChange={handleDraftChange}/><br/><br/>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                <br/><br/>  
          </Card><br/>

          <TextField id="filled-basic" variant="filled"
              value={!data ? '' : data}/><br/>

        </FormControl>;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <h1>Work Those Asserts 💦</h1>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Assertiveness Booster" {...a11yProps(0)} />
            <Tab label="Cognitive Fallacy Crusher" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          
          <AssertComponent></AssertComponent>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CogFallaciesComponent></CogFallaciesComponent>
        </TabPanel>
        
        </header>

        <p>Feedback? <a href="mailto:christykoh@berkeley.edu" className="App-link">Send me an email</a>. For errors please include a screenshot.</p>
        <p>Powered by <a href="https://cohere.ai/" className="App-link">Cohere</a></p>
      </div>
    </ThemeProvider>
  );
}

export default App;
