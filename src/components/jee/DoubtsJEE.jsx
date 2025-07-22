import  { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import DoubtSolver from '../DoubtSolver';
import SubjectsJEE from './SubjectsJEE';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  min-width:100vw;
  padding: 20px;
  background: linear-gradient(135deg, #e3f2fd, #f8fafc);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 12px;
    align-items: flex-start;
  }
`;

const PaperCard = styled.div`
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 20px;
  padding: 36px 28px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.13), 0 4px 12px rgba(0,0,0,0.06);
  animation: ${fadeIn} 0.6s ease;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 480px) {
    padding: 28px 20px;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: #1565c0;
  margin-bottom: 10px;
  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #174ea6;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #cbd5e1;
  font-size: 1rem;
  background: #f8fafc;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1976d2;
    outline: none;
  }
`;

const classOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `class ${i + 1}`,
  label: `Class ${i + 1}`,
}));

const DoubtsJEE = () => {
  const [selectedClass, setSelectedClass] = useState("class 10");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(
      subject.split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );
  };

  return (
    <AppContainer>

      {selectedSubject ? (
        <DoubtSolver subject={selectedSubject} selectedClass={selectedClass} onBack={() => setSelectedSubject(null)} />
      ) : (
        <PaperCard>
          <Title>Doubt Solver</Title>


          <Field>
            <Label htmlFor="class">Select Class:</Label>
            <Select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </Field>

          <SubjectsJEE
            selectedClass={selectedClass}
            onSelectSubject={handleSubjectSelect}
          />
        </PaperCard>
      )}
    </AppContainer>
  );
};

export default DoubtsJEE;
