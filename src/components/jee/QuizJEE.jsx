import  { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaDownload } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
`;

// ...existing imports...





const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 48px 16px 32px 16px;

  @media (max-width: 900px) {
    padding: 32px 12px 24px 12px;
  }

  @media (max-width: 600px) {
    padding: 20px 8px 16px 8px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 540px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.13), 0 2px 8px rgba(0,0,0,0.06);
  padding: 38px 30px 30px 30px;
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: ${fadeIn} 0.7s;
  border: 1.5px solid #e3eafc;

  @media (max-width: 900px) {
    padding: 28px 24px;
  }

  @media (max-width: 600px) {
    max-width: 100%;
    padding: 20px 16px;
    margin-bottom: 20px;
    border-radius: 14px;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  font-weight: 900;
  color: #1976d2;
  margin-bottom: 30px;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 600px) {
    gap: 14px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;

  @media (max-width: 600px) {
    gap: 5px;
  }
`;

const Label = styled.label`
  font-weight: 700;
  color: #174ea6;
  font-size: 1rem;

  @media (max-width: 600px) {
    font-size: 0.95rem;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 9px;
  border: 1.5px solid #bdbdbd;
  font-size: 1.05rem;
  background: #f8fafc;
  transition: border 0.2s;

  &:focus {
    border-color: #1976d2;
  }

  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 0.97rem;
  }
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 9px;
  border: 1.5px solid #bdbdbd;
  font-size: 1.05rem;
  background: #f8fafc;
  transition: border 0.2s;

  &:focus {
    border-color: #1976d2;
  }

  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 0.97rem;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  background: linear-gradient(90deg, #1976d2 60%, #43a047 100%);
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 14px 0;
  font-size: 1.18rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);

  &:hover {
    background: linear-gradient(90deg, #1565c0 60%, #388e3c 100%);
    transform: scale(1.03);
  }

  @media (max-width: 600px) {
    padding: 10px 0;
    font-size: 1rem;
  }
`;

const ResultWrapper = styled.div`
  width: 100%;
  max-width: 540px;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(25, 118, 210, 0.10), 0 1px 4px rgba(0,0,0,0.04);
  margin-top: 18px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 220px;
  animation: ${fadeIn} 0.7s;
  border: 1.5px solid #e3eafc;

  @media (max-width: 600px) {
    max-width: 100%;
    border-radius: 12px;
  }
`;

const ResultTitle = styled.div`
  font-size: 1.18rem;
  font-weight: 800;
  color: #1976d2;
  background: #e3f0ff;
  border-radius: 18px 18px 0 0;
  padding: 18px 22px 12px 22px;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 14px 12px 10px;
    border-radius: 12px 12px 0 0;
  }
`;

const ScrollableResult = styled.div`
  max-height: 340px;
  overflow-y: auto;
  background: #fff;
  padding: 22px 18px 18px 18px;
  font-size: 1.07rem;
  color: #222;
  border-bottom: 1px solid #e3eafc;
  white-space: pre-wrap;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    padding: 14px 10px;
    font-size: 0.95rem;
    max-height: 220px;
  }
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 7px;
  background: #e3eafc;
  border-radius: 4px;
  margin: 18px 0 10px 0;
  overflow: hidden;
  position: relative;

  @media (max-width: 600px) {
    height: 5px;
    margin: 10px 0 6px 0;
  }
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1976d2 60%, #43a047 100%);
  width: ${({ stage }) => (stage === 1 ? '33%' : stage === 2 ? '66%' : stage === 3 ? '100%' : '0%')};
  transition: width 0.7s;
`;

const Loading = styled.div`
  color: #1976d2;
  font-weight: 700;
  font-size: 1.13rem;
  text-align: center;
  min-height: 32px;
  margin-top: 12px;

  @media (max-width: 600px) {
    font-size: 1rem;
    min-height: 24px;
    margin-top: 8px;
  }
`;

const DownloadBtn = styled.button`
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 0 0 18px 18px;
  padding: 15px 0;
  font-size: 1.13rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(67, 160, 71, 0.08);
  position: sticky;
  bottom: 0;

  &:hover {
    background: #2e7031;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 10px 0;
    border-radius: 0 0 12px 12px;
  }
`;

// ...rest of your component code remains unchanged...


const classOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `class ${i + 1}`,
  label: `Class ${i + 1}`,
}));
const SubjectsByClass = {
  "class 1": ["english", "maths", "EVS"],
  "class 2": ["english", "maths", "EVS"],
  "class 3": ["english", "maths", "EVS"],
  "class 4": ["english", "maths", "science", "social science"],
  "class 5": ["english", "maths", "science", "social science"],
  "class 6": ["english", "maths", "science", "social science", "hindi"],
  "class 7": ["english", "maths", "science", "social science", "hindi"],
  "class 8": ["english", "maths", "science", "social science", "hindi"],
  "class 9": ["english", "maths", "science", "social science", "hindi"],
  "class 10": ["english", "maths", "science", "social science", "hindi"],
  "class 11": ["english", "maths", "physics", "chemistry", "biology", "computer science", "hindi"],
  "class 12": ["english", "maths", "physics", "chemistry", "biology", "computer science", "hindi"],
};
const QuizJEE = () => {
  const [selectedClass, setSelectedClass] = useState('class 10');
  const [subjectOptions, setSubjectOptions] = useState(SubjectsByClass['class 10']);
  const [subject, setSubject] = useState('english');

  const [difficulty, setDifficulty] = useState('easy');
  const [topics, setTopics] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const resultRef = useRef();

  const processResponse1 = (response) => {
    setResultData(response);
  };

  const onSent6 = async (exam, sub, topic, difficulty, numQues) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response = await run6(exam, sub, topic, difficulty, numQues);
    processResponse1(response);
    setLoading(false);
  };

  async function run6(exam, sub, topic, difficulty, numquestions) {
      const papergene = `
  "Generate a well-structured, in-syllabus multiple-choice quiz for the ${exam} in the subject of ${sub}${topic ? `, specifically focusing on the topic : **${topic}**` : ''}.
  The quiz must contain exactly ${numquestions} multiple-choice questions (MCQs), adhering strictly to the latest syllabus and question pattern of the exam.
  Formatting and structure guidelines:
  Each question should be clearly numbered.
  Present the question text in a new paragraph.
  Provide exactly 4 answer choices labeled (A), (B), (C), and (D), each on a separate line.
  Leave a blank line between questions for readability.
  Indicate the correct answer immediately after each question, using this format: Answer: [Option Letter].
  Ensure that each question and its options are concise and do not exceed 5 lines total (to ensure proper formatting in PDF).
  Do NOT include:
  Explanations, hints, or additional instructions
  Any content outside of the formatted quiz
  Begin the quiz with a centered heading that clearly shows:
  "${exam} – ${sub}${topic ? ` Topic: ${topic}` : ''}"
  The overall difficulty level should be: ${difficulty || 'easy'}.
  Ensure the layout is clean, minimal, and optimized for PDF export.
  Do NOT use LaTeX formatting or special symbols like $, \\frac, \\int, or superscripts/subscripts.
  Instead, use plain text math notation. For example:
  Write x^2 for "x squared"
  Write sqrt(x) for square root
  Write integral from 0 to x of 1 / (1 + t^4) dt instead of LaTeX expressions
  This ensures compatibility with plain text and PDF formats."
  `;

    const apiKey = process.env.REACT_APP_GEMINI_API1;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      responseMimeType: "text/plain",
    };

    const fullPrompt = papergene;

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const result = await chatSession.sendMessage(fullPrompt);
    return result.response.text();
  }

  const handleClassChange = (e) => {
    const selected = e.target.value;
    setSelectedClass(selected);
    const subjects = SubjectsByClass[selected] || [];
    setSubjectOptions(subjects);
    setSubject(subjects[0]); // auto-select first subject
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResult(false);
    setCustomLoading(true);
    setLoadingStage(1);

    setTimeout(() => setLoadingStage(2), 6000);
    setTimeout(() => setLoadingStage(3), 11000);
    setTimeout(() => {
      setCustomLoading(false);
      setShowResult(true);
      onSent6(selectedClass, subject, topics, difficulty, numQuestions);
    }, 16000);
  };

  // PDF download logic
  const handleDownloadPDF = () => {
    if (!resultData) return;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
    const margin = 40;
    const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    let y = margin;

    // Add heading
    pdf.setFontSize(16);
    pdf.text(
      `${selectedClass.toUpperCase()} - ${subject.toUpperCase()}${topics ? ` - Topics: ${topics}` : ''} - Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      margin,
      y
    );
    y += 30;

    // Split resultData into lines
    const lines = resultData.split('\n');
    pdf.setFontSize(12);
    lines.forEach((line) => {
      const split = pdf.splitTextToSize(line, pageWidth);
      split.forEach((txt) => {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(txt, margin, y);
        y += 20;
      });
      y += 5;
    });

    pdf.save(`${selectedClass}_${subject}_quiz.pdf`);
  };

  let loadingMessage = '';
  if (customLoading) {
    if (loadingStage === 1) loadingMessage = 'Thinking...';
    else if (loadingStage === 2) loadingMessage = 'Generating quiz...';
    else if (loadingStage === 3) loadingMessage = 'Finalising...';
  }

  return (
    <PageWrapper>
      <Card>
        <Title>JEE Quiz Generator</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="class">Class</Label>
            <Select
              id="class"
              value={selectedClass}
              onChange={handleClassChange}            >
              {classOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="subject">Subject:</Label>
            <Select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {subjectOptions.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="difficulty">Difficulty:</Label>
            <Select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="numQuestions">Number of Questions:</Label>
            <Select
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="topics">Topics (optional):</Label>
            <Input
              id="topics"
              type="text"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Enter topics separated by commas"
            />
          </Field>
          <Button type="submit" disabled={customLoading}>
            Generate Quiz
          </Button>
        </Form>
      </Card>

      {(customLoading || showResult) && (
        <ResultWrapper>
          <ResultTitle>Quiz</ResultTitle>
          {customLoading && (
            <LoadingBar>
              <Progress stage={loadingStage} />
            </LoadingBar>
          )}
          <ScrollableResult ref={resultRef}>
            {customLoading ? (
              <Loading>{loadingMessage}</Loading>
            ) : showResult && loading ? (
              <Loading>Thinking...</Loading>
            ) : showResult && resultData ? (
              resultData
            ) : null}
          </ScrollableResult>
          {showResult && resultData && !loading && (
            <DownloadBtn onClick={handleDownloadPDF}>
              <FaDownload /> Download PDF
            </DownloadBtn>
          )}
        </ResultWrapper>
      )}
    </PageWrapper>
  );
};

export default QuizJEE;