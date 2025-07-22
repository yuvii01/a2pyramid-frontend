import  { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  min-width:100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
  padding: 0 12px;

  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1976d2;
  letter-spacing: 1px;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }
`;

const BoxGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-bottom: 24px;
  justify-content: center;

  @media (max-width: 900px) {
    gap: 20px;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
    width: 100%;
    align-items: center;
  }
`;

const ActionBox = styled.button`
  width: 200px;
  height: 120px;
  background: #fff;
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.10);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1976d2;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  position: relative;
  white-space: nowrap;
  text-align: center;
  &:hover {
    background: #e3f0ff;
    transform: translateY(-4px) scale(1.04);
  }
  @media (max-width: 600px) {
    width: 95vw;
    height: 80px;
    font-size: 1rem;
  }
`;

const DivisionJEE = ({ examType }) => {
  const [showDoubts, setShowDoubts] = useState(false);
  const [showPaper, setShowPaper] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const courses = JSON.parse(localStorage.getItem('courses')) || [];
  //   if (!courses.includes('jee')) {
  //     navigate('/home');
  //   }
  // }, [navigate]);

  const openOnly = (setter) => {
    setShowDoubts(false);
    setShowPaper(false);
    setShowQuiz(false);
    setShowPlanner(false);
    setter(true);
  };

  useEffect(() => {
    if (showDoubts) navigate('/demo/doubts');
    if (showPaper) navigate('/demo/paper');
    if (showQuiz) navigate('/demo/quiz');
    if (showPlanner) navigate('/demo/revision');
  }, [showDoubts, showPaper, showQuiz, showPlanner, navigate]);

  return (
    <Container>
      <Title>{examType ? `${examType} - ` : ''}What would you like to do?</Title>
      <BoxGrid>
        <ActionBox onClick={() => openOnly(setShowPaper)}>
          📝<div style={{ marginTop: 8 }}>Paper Generator</div>
        </ActionBox>
        <ActionBox onClick={() => openOnly(setShowDoubts)}>
          ❓<div style={{ marginTop: 8 }}>Doubts</div>
        </ActionBox>
        <ActionBox onClick={() => openOnly(setShowQuiz)}>
          🧠<div style={{ marginTop: 8 }}>{examType === 'UPSC' ? 'Current Affairs Booster' : 'Smart Quiz Generator'}</div>
        </ActionBox>
        <ActionBox onClick={() => openOnly(setShowPlanner)}>
          📅<div style={{ marginTop: 8 }}>Revision Planner</div>
        </ActionBox>
      </BoxGrid>
    </Container>
  );
};

export default DivisionJEE;