import { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from "@google/generative-ai";


const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 48px 0 32px 0;

  @media (max-width: 768px) {
    padding: 32px 16px;
  }

  @media (max-width: 480px) {
    padding: 24px 10px;
  }
`;
const Container = styled.div`
   width: 100%;
  max-width: 540px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.13), 0 2px 8px rgba(0,0,0,0.06);
  padding: 38px 30px 30px 30px;
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.7s;
  border: 1.5px solid #e3eafc;

  @media (max-width: 480px) {
    padding: 24px 20px 24px 20px;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #bdbdbd;
  font-size: 1rem;
  background: #fff;
  transition: border 0.2s;

  &:focus {
    border-color: #1976d2;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 7px 10px;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #bdbdbd;
  font-size: 1rem;
  background: #fff;
  transition: border 0.2s;

  &:focus {
    border-color: #1976d2;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 7px 10px;
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

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 12px 0;
  }
`;

const Result = styled.div`
  margin-top: 18px;
  background: #fff;
  border-radius: 8px;
  padding: 16px 14px;
  min-height: 48px;
  font-size: 1rem;
  color: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 12px 10px;
  }
`;

const Loading = styled.div`
  color: #1976d2;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  min-height: 32px;

  @media (max-width: 480px) {
    font-size: 1rem;
    min-height: 28px;
  }
`;

const DownloadBtn = styled.button`
  margin-top: 16px;
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: #2e7031;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 10px 0;
  }
`;



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
const RevisionJEE = () => {
  const [selectedClass, setSelectedClass] = useState('class 10');
  const [subjectOptions, setSubjectOptions] = useState(SubjectsByClass['class 10']);
  const [subject, setSubject] = useState('english');

  const [topic, setTopic] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const processResponse1 = (response) => {
    setResultData(response);
  };
  const onSent7 = async (exam, sub, topic) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (exam !== undefined) {
      response = await run7(exam, sub, topic);
      setRecentPrompt(exam + " " + sub + " " + topic);
    } else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run7(input);
    }

    processResponse1(response);
    setLoading(false);
    setInput("");
  };
  async function run7(exam, sub, topic) {
    const papergene = `
Generate clear, chapter-wise revision notes for ${exam} in the subject of ${sub}${topic ? `, specifically focusing on the topic: ${topic}` : ''}. 
Begin with a plain text heading that shows the class and subject name${topic ? ` and topic` : ''}. 
Organize notes chapter-wise using plain section headings (e.g., "Chapter 1: Motion").
Within each section, cover:
- Key concepts
- Formulas
- Important facts
- Concise explanations
- Tips for revision

Do not include:
- Questions or answers
- Diagrams (just mention them if necessary)
- Any kind of markdown, special characters, formatting syntax (like **bold**, __underline__, or — dashes)

All content must be in simple plain text. Use only:
- Bullet points using "-" or "*"
- Section titles with plain headings
- Plain text math notation (e.g., x^2, sqrt(x), integral from 0 to x of 1 / (1 + t^4) dt)

Avoid using:
- LaTeX
- Markdown formatting (**, __, ##, etc.)
- Em dashes (—)

Make it clean, structured, and compatible with text-based and PDF export systems.
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

  // const { onSent7, loading, resultData } = useContext(Context);

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
      onSent7(selectedClass, subject, topic);
    }, 16000);
  };

  const handleClassChange = (e) => {
    const selected = e.target.value;
    setSelectedClass(selected);
    const subjects = SubjectsByClass[selected] || [];
    setSubjectOptions(subjects);
    setSubject(subjects[0]); // auto-select first subject
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
      `${selectedClass.toUpperCase()}${subject ? ` - Subject: ${subject}` : ''}${topic ? ` - Topic: ${topic}` : ''}`,
      margin,
      y
    );
    y += 30;

    // Parse HTML and extract lines as plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resultData;

    let lines = [];
    tempDiv.querySelectorAll('p, li, div').forEach((el) => {
      const text = el.innerText.trim();
      if (text) lines.push(text);
    });

    if (lines.length === 0) {
      lines = [tempDiv.innerText.trim()];
    }

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

    pdf.save(`${selectedClass}_revision_plan.pdf`);
  };

  let loadingMessage = '';
  if (customLoading) {
    if (loadingStage === 1) loadingMessage = 'Thinking...';
    else if (loadingStage === 2) loadingMessage = 'Generating revision plan...';
    else if (loadingStage === 3) loadingMessage = 'Finalising...';
  }

  return (
    <PageWrapper>


      <Container>
        <Title>Revision Planner</Title>
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
                <option key={idx} value={opt}>{
                  opt.split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")
                }</option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="topic">Topic (optional):</Label>
            <Input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic if any"
            />
          </Field>
          <Button type="submit">Generate Revision Plan</Button>
        </Form>
        <Result>
          {customLoading ? (
            <Loading>{loadingMessage}</Loading>
          ) : showResult && loading ? (
            <Loading>Thinking...</Loading>
          ) : showResult && resultData ? (
            <Loading>Revision plan generated! You can now download the PDF.</Loading>
          ) : null}
        </Result>
        {showResult && resultData && !loading && (
          <DownloadBtn onClick={handleDownloadPDF}>
            Download PDF
          </DownloadBtn>
        )}
      </Container>
    </PageWrapper>
  );
};

export default RevisionJEE;