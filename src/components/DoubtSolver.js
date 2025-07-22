import { useContext, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useState } from "react";
import jsPDF from "jspdf";
import { GoogleGenerativeAI } from "@google/generative-ai";
const Card = styled.div`
  background: #f8fafc;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  padding: 12px 32px 36px 32px;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    margin-bottom: 24px;
  }
`;

const SubjectBadge = styled.span`
  display: inline-block;
  background: #e3f0ff;
  color: #1976d2;
  font-weight: 700;
  border-radius: 10px;
  padding: 8px 20px;
  font-size: 1.25rem;
  margin-bottom: 12px;
  text-transform: capitalize;

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 6px 16px;
  }
`;

const Title = styled.h2`
  color: #174ea6;
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 10px 0;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1.25rem;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 16px 20px;
  border-radius: 10px;
  border: 2px solid #bdbdbd;
  font-size: 1.25rem;
  background: #fff;
  transition: border 0.2s;

  &:focus {
    border-color: #1976d2;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 14px 16px;
  }
`;

const Button = styled.button`
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 32px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 120px;

  &:hover:enabled {
    background: #1565c0;
  }

  &:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 1.1rem;
    padding: 12px 0;
  }
`;

const Result = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 24px 20px;
  min-height: 80px;
  font-size: 1.25rem;
  color: #333;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 260px;
  overflow-y: auto;

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 16px;
  }
`;

const LoaderAnim = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const Loader = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1976d2;
  animation: ${LoaderAnim} 1s infinite;

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`;

const LoadingText = styled.div`
  color: #1976d2;
  font-weight: 600;
  text-align: center;
  font-size: 1.3rem;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #1976d2;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-start;
  margin-bottom: 12px;
  transition: color 0.2s;

  &:hover {
    color: #0d47a1;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

// Styled components remain the same...
// ... (omitted for brevity)

const DoubtSolver = ({ subject, selectedClass, onBack }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const processResponse = (response) => {
    setResultData("");

    // Split by step numbers (1. 2. etc.)
    const steps = response.split(/\d+\.\s/).filter(Boolean);

    // Format each step with ➤ and <br> for sub-parts
    const formattedSteps = steps.map((step) => {
      // Insert <br> if it looks like multiple statements in one line
      const stepWithBreaks = step
        .replace(/([a-zA-Z])\s([A-Z])/g, "$1<br>$2") // Add break before capital letter (like end of sentence)
        .replace(/([a-z0-9])\s([A-Z])/g, "$1<br>$2");

      return `<p>➤ ${stepWithBreaks.trim()}</p>`;
    });

    const finalFormatted = formattedSteps.join("");

    // Animate word-by-word
    const words = finalFormatted.split(" ");
    let liveResult = "";
    words.forEach((word, i) => {
      setTimeout(() => {
        liveResult += word + " ";
        setResultData(liveResult);
      }, 50 * i);
    });
  };

  const getPromptByClassAndSubject = (classLevel, subject, topic) => {
    const basePrompt = `You are a helpful and concise school teacher for the subject of ${subject}, teaching students of ${classLevel} class.`;
    const topicLine = topic
      ? ` You are asked to explain the topic: "${topic}".`
      : "";

    // Check if subject is Maths
    if (subject.toLowerCase() === "maths") {
      return `${basePrompt}${topicLine}
    
Please follow these rules strictly:

1. Do NOT include greetings, intro, or conclusion.
2. Present the answer step-by-step in plain text.
3. Use plain math notation only:
   - Write x^2 for x squared
   - Write sqrt(x) for square root
   - Write 1/2 instead of ½
4. DO NOT use LaTeX (\\frac, \\sqrt, etc) or any special formatting like **, *, #, or emojis.
5. Keep explanations short and clear in every step.
6. Use age-appropriate language for ${classLevel} class.
7. Start directly from Step 1.`;
    }

    // Generic prompt for other subjects
    const instruction = `
Please follow these formatting rules strictly:

1. Do NOT include greetings, intro, or conclusion.
2. Present the answer in numbered format.
3. Use plain text only. Avoid symbols like **, *, #, etc.
4. Each point must be short, simple, and focused.
5. Language must be age-appropriate for ${classLevel} class.
6. Do NOT use LaTeX or special characters.
7. Start directly from point 1.`;

    return basePrompt + topicLine + instruction;
  };

  const runWithPrompt = async (userPrompt, classLevel, subject) => {
    const apiKey = process.env.REACT_APP_GEMINI_API4;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      responseMimeType: "text/plain",
    };

    const systemPrompt = getPromptByClassAndSubject(classLevel, subject);
    const fullPrompt = `${systemPrompt}\n\nQuestion: ${userPrompt}`;

    const chatSession = model.startChat({
      generationConfig,
      history: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const result = await chatSession.sendMessage(fullPrompt);
    return result.response.text();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultData("");
    setLoading(true);
    setShowResult(true);

    const response = await runWithPrompt(input, selectedClass, subject);
    setRecentPrompt(input);
    processResponse(response);
    setLoading(false);
    setInput("");
  };

  useEffect(() => {
    setInput("");
    setResultData("");
  }, [subject, selectedClass]);

  return (
    <Card>
      <BackButton onClick={onBack}>←Back</BackButton>
      <Header>
        <SubjectBadge>{subject}</SubjectBadge>
        <Title>{subject} Doubt Solver</Title>
        <Subtitle>
          Ask any question related to {subject} and get instant help!
        </Subtitle>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type your doubt in ${subject}...`}
          autoFocus
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? <Loader /> : "Submit"}
        </Button>
      </Form>
      <Result>
        {loading ? (
          <LoadingText>Thinking...</LoadingText>
        ) : (
          resultData && <div dangerouslySetInnerHTML={{ __html: resultData }} />
        )}
      </Result>
    </Card>
  );
};

export default DoubtSolver;
