import React, { useState, useEffect } from 'react';
import './Form.css';

const Form = ({ companyId, initialCompanyName, initialCompanyLocation }) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !user._id) {
      console.warn("User not logged in or invalid user data. Redirecting to login.");
      window.location.href = '/login';
      return;
    }
  }, [user]);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: '',
    companyName: initialCompanyName || '', // Initialize with props
    companyLocation: initialCompanyLocation || '', // Initialize with props
    role: '',
    placementType: '',
    totalRounds: 0,
    rounds: [],
    additionalDetails: '',
    tips: '',
    month: '',
    year: '',
    preparationTime: '',
    skillsUsed: '',
    privacyAgreement: false,
  });

  useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            companyName: initialCompanyName || '',
            companyLocation: initialCompanyLocation || ''
        }));
    }, [initialCompanyName, initialCompanyLocation]);

  const roundTypes = [
    'Aptitude',
    'Programming',
    'Advanced Programming',
    'Technical HR',
    'General HR',
    'Behavioral',
    'Managerial',
    'System Design',
    'Machine Learning',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRoundChange = (e, roundIndex) => {
    const { name, value } = e.target;
    const updatedRounds = [...formData.rounds];
    if (!updatedRounds[roundIndex]) {
      updatedRounds[roundIndex] = {};
    }
    updatedRounds[roundIndex][name] = value;
    setFormData({ ...formData, rounds: updatedRounds });
  };

  useEffect(() => {
    if (formData.totalRounds > formData.rounds.length) {
      const newRounds = [...formData.rounds];
      for (let i = formData.rounds.length; i < formData.totalRounds; i++) {
        newRounds.push({ roundName: '', questions: [''] });
      }
      setFormData({ ...formData, rounds: newRounds });
    }
  }, [formData.totalRounds]);

  const handleQuestionsChange = (e, roundIndex, questionIndex) => {
    const { value } = e.target;
    const updatedRounds = [...formData.rounds];
    updatedRounds[roundIndex].questions[questionIndex] = value;
    setFormData({ ...formData, rounds: updatedRounds });
  };

  const handleAddQuestion = (roundIndex) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[roundIndex].questions.push('');
    setFormData({ ...formData, rounds: updatedRounds });
  };

  const handleRemoveQuestion = (roundIndex, questionIndex) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[roundIndex].questions.splice(questionIndex, 1);
    setFormData({ ...formData, rounds: updatedRounds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    console.log('Form data:', formData);

    if (!formData.privacyAgreement) {
      alert('Please accept the privacy agreement to submit.');
      return;
    }

    setIsLoading(true);
    try {
      if (!user || !user._id) {
        console.error("User data is invalid:", user);
        alert("User data is invalid. Please log in again.");
        return;
      }

      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user._id,
          companyId: companyId, // Include the companyId here!
        }),
      });

      if (response.ok) {
        console.log('Feedback submitted successfully!');
        alert('Thank you for your feedback!');
        setFormData({
          name: '',
          rollNumber: '',
          department: '',
          companyName: '',
          companyLocation: '',
          role: '',
          placementType: '',
          totalRounds: 0,
          rounds: [],
          additionalDetails: '',
          tips: '',
          month: '',
          year: '',
          preparationTime: '',
          skillsUsed: '',
          privacyAgreement: false,
        });
      } else {
        console.error('Failed to submit feedback:', response.status);
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred while submitting feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoundInputs = () => {
    const roundInputs = [];
    for (let i = 0; i < formData.totalRounds; i++) {
      roundInputs.push(
        <div key={i}>
          <h3>Round {i + 1}</h3>
          <label>
            Round Name:
            <select
              name="roundName"
              value={formData.rounds[i]?.roundName || ''}
              onChange={(e) => handleRoundChange(e, i)}
              required
            >
              <option value="">Select Round Type</option>
              {roundTypes.map((round, index) => (
                <option key={index} value={round}>
                  {round}
                </option>
              ))}
            </select>
          </label>

          <h4>Questions Asked in Round {i + 1}:</h4>
          {formData.rounds[i]?.questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <label>
                Question {questionIndex + 1}:
                <input
                  type="text"
                  value={question}
                  onChange={(e) => handleQuestionsChange(e, i, questionIndex)}
                  placeholder={`Enter Question ${questionIndex + 1}`}
                  required
                />
              </label>
              {questionIndex > 0 && (
                <button type="button" onClick={() => handleRemoveQuestion(i, questionIndex)}>
                  Remove Question
                </button>
              )}
            </div>
          ))}
          {formData.rounds[i]?.questions.length > 0 && (
            <button
              type="button"
              onClick={() => handleAddQuestion(i)}
              style={{ fontSize: '20px', padding: '5px 10px', border: '1px solid #000' }}
            >
              Add another question
            </button>
          )}
        </div>
      );
    }
    return roundInputs;
  };

  return (
    <form onSubmit={handleSubmit} className={'feedback-form'}>
      <h2>Placement Feedback Form</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
      </label>
      <label>
        Roll Number:
        <input
          type="text"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          placeholder="Enter your roll number"
          required
        />
      </label>

      {/* Department Dropdown */}
      <label>
        Department:
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="AIDS">AIDS</option>
          <option value="EEE">EEE</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>
      </label>
      <label>
        Company Name:
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter the company name"
          required
        />
      </label>

      <label>
        Company Location:
        <input
          type="text"
          name="companyLocation"
          value={formData.companyLocation}
          onChange={handleChange}
          placeholder="Enter the company location"
          required
        />
      </label>

      <label>
        Role/Position:
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Enter the role (e.g., Software Developer)"
          required
        />
      </label>
      <label>
        Placement Type:
        <select name="placementType" value={formData.placementType} onChange={handleChange} required>
          <option value="">Select placement type</option>
          <option value="Internship">Internship</option>
          <option value="Full-time">Full-time</option>
        </select>
      </label>

      {/* Month and Year of Placement */}
      <label>
        Month of Placement:
        <select name="month" value={formData.month} onChange={handleChange} required>
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </label>
      <label>
        Year of Placement:
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Enter year (e.g., 2025)"
          required
        />
      </label>

      {/* Total Rounds Input */}
      <label>
        Total Number of Rounds:
        <input
          type="number"
          name="totalRounds"
          value={formData.totalRounds}
          onChange={handleChange}
          min="1"
          max="10"
          required
        />
      </label>
      {formData.totalRounds > 0 && generateRoundInputs()}

      <label>
        Skills Used:
        <input
          type="text"
          name="skillsUsed"
          value={formData.skillsUsed}
          onChange={handleChange}
          placeholder="Skills you used in the interview (e.g., Java, Data Structures)"
        />
      </label>

      <label>
        Additional Details (optional):
        <textarea
          name="additionalDetails"
          value={formData.additionalDetails}
          onChange={handleChange}
          placeholder="Provide additional context or experience details..."
        ></textarea>
      </label>
      <label>
        Tips for Future Candidates (optional):
        <textarea
          name="tips"
          value={formData.tips}
          onChange={handleChange}
          placeholder="Share advice for future candidates..."
        ></textarea>
      </label>

      <label>
        <input
          type="checkbox"
          name="privacyAgreement"
          checked={formData.privacyAgreement}
          onChange={handleChange}
          required
        />
        I agree that my feedback can be shared anonymously for educational purposes.
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default Form;