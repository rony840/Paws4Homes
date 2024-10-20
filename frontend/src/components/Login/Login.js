// Login.js
import './Login.css';
import paw from '../../assets/img/PawIconColor.png';
import cloud from '../../assets/img/dogCloud.png';

const Login = () => {
    return (
      <div className="login-container">
        <div className="white-rectangle">
        <img src={cloud} alt="Cloud" className="cloud-icon" />
          <div className="login-rectangle">
            <h2 className="login-title">Login</h2>
            <form className="email-form">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@gmail.com"
                className="email-input"
              />
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="password-input" 
              />
              <button type="submit" className="login-button">
                <span className="login-button-text">Login</span>
              </button>
            </form>
            <div className="or-divider">
              <div className="or-text">OR</div>
            </div>
            <button className="signup-button">
              <span className="signup-text">Signup Now</span>
            </button>
            <img src={paw} alt="Paw Icon" className="paw-icon" />
          </div>
        </div>
      </div>
    );
};

export default Login;
