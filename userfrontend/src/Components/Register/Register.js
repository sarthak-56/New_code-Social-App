import React, { useState } from 'react';
import axios from 'axios';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    password2: '',
    tc: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentInput, setCurrentInput] = useState(0);

  const { email, name, password, password2, tc } = formData;

  const inputFields = [
    { name: 'email', placeholder: 'Email', type: 'text', value: email },
    { name: 'name', placeholder: 'Name', type: 'text', value: name },
    { name: 'password', placeholder: 'Password', type: 'password', value: password },
    { name: 'password2', placeholder: 'Confirm Password', type: 'password', value: password2 },
    {
      name: 'tc',
      placeholder: '',
      checkboxLabel: 'I agree to the terms and conditions',
      type: 'checkbox',
      checked: tc,
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNextInput = (e) => {
    e.preventDefault();
    if (currentInput < inputFields.length - 1) {
      setCurrentInput(currentInput + 1);
    } else {
      handleSubmit(e);
    }
  };

  const handleBackInput = (e) => {
    e.preventDefault();
    if (currentInput > 0) {
      setCurrentInput(currentInput - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (password !== password2) {
      setErrorMessage("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/user/register/', formData);
      console.log(res.data);
      setIsLoading(false);
      navigate('/login');
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.appTitle}>Avique</h1>
      <h3 className={styles.subtitle}>Join the social experience</h3>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <p>
          Welcome to Avique! Register with your email, name, and password to connect with friends and explore our vibrant community.
          </p>
        </div>
        <form onSubmit={handleNextInput} className={styles.authForm}>
          {inputFields.map((input, index) => (
            currentInput === index && (
              <div key={input.name} className={styles.inputContainer}>
                <input
                  type={input.type}
                  name={input.name}
                  value={input.type === 'checkbox' ? undefined : input.value}
                  onChange={handleChange}
                  placeholder={input.placeholder}
                  required={input.name !== 'tc'}
                  className={styles.input}
                />
                {input.name === 'tc' && input.checkboxLabel && (
                  <div className={styles.termsContainer}>
                    <label className={styles.label}>
                      <span className={styles.checkboxText}>{input.checkboxLabel}</span>
                    </label>
                    <p className={styles.termsText}>
                      By checking this box, you agree to our terms and conditions. Please read
                      them carefully as they outline your rights and responsibilities.
                      Thank you for being part of our community!
                    </p>
                  </div>
                )}
              </div>
            )
          ))}

          <div className={styles.buttonContainer}>
            {currentInput > 0 && (
              <button type="button" onClick={handleBackInput} className={styles.button}>
                Back
              </button>
            )}

            <button type="submit" className={`${styles.button} ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  <span>Registering...</span>
                </>
              ) : (
                currentInput === inputFields.length - 1 ? 'Register' : 'Next'
              )}
            </button>
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <p onClick={handleLoginRedirect} className={styles.link}>
            Already have an account? Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
