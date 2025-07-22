
import styled from 'styled-components';

const SubjectBoxesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin: 20px 0;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const SubjectBox = styled.div`
  background: linear-gradient(135deg, #e3f2fd, #fff);
  border: 2px solid #1976d2;
  border-radius: 14px;
  padding: 16px 22px;
  min-width: 130px;
  min-height: 44px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #174ea6;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);

  &:hover {
    background: #1976d2;
    color: #fff;
    transform: scale(1.05);
    box-shadow: 0 4px 14px rgba(25, 118, 210, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 14px 18px;
    min-width: 100px;
  }
`;

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

const capitalizeWords = (text) =>
  text
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const SubjectsJEE = ({ onSelectSubject, selectedClass }) => {
  const subjects = SubjectsByClass[selectedClass?.toLowerCase()] || [];

  return (
    <SubjectBoxesWrapper>
      {subjects.map((subject) => (
        <SubjectBox key={subject} onClick={() => onSelectSubject(subject)}>
          {capitalizeWords(subject)}
        </SubjectBox>
      ))}
    </SubjectBoxesWrapper>
  );
};

export default SubjectsJEE;
