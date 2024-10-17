import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0); // Step state for multi-step form
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await loginUser(formData);
      localStorage.setItem('token', response.data.token.access);
      setAuth(true);
      navigate('/main');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed: Incorrect email or password';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to go to the next step
  const nextStep = () => {
    if (step < 1) { // Ensure we do not exceed the number of steps
      setStep(step + 1);
    }
  };

  // Function to go back to the previous step
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.description}>
        <h3 className={styles.appTitle}>Welcome back to Avique!</h3>
        <p className={styles.subtitle}>
        Welcome back! We're excited to have you here. Please log in with your email and password to access your account and dive back into the features you love. Let’s get you started on another great session!
        </p>
      </div>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {step === 0 && ( // Step 1: Email Input
          <>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="username"
              required
              className={styles.input}
            />
            <div className={styles.buttonContainer}>
              <button type="button" onClick={nextStep} className={styles.button}>
                Next
              </button>
            </div>
          </>
        )}
        {step === 1 && ( // Step 2: Password Input
          <>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={styles.input}
            />
            <div className={styles.buttonContainer}>
              <button type="button" onClick={prevStep} className={styles.button}>
                Back
              </button>
              <button type="submit" disabled={isLoading} className={styles.button}>
                {isLoading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </>
        )}
        {message && <div className={styles.alert}>{message}</div>}
        <div className={styles.navigation}>
          <p onClick={handleLoginRedirect} className={styles.link}>
            I don't have an account
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
