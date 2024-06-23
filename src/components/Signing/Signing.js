import React from "react";
import "./Signing.css";

const Signing = () => {
  return (
    <div className="Signing">


{/* {!isSignUp && (
        <div></div>
      )}

      {isSignUp && (
        <div></div>
      )} */}



      {/* Sign In */}

      <div className="container">
        <br />
        <br />
        <h1 className="text-center">Sign In</h1>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-wrap p-0">
              <form action="#" className="signin-form">
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    required=""
                  />
                </div>
                <div className="form-group">
                  <input
                    id="password-field"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required=""
                  />
                  <span toggle="#password-field" className="toggle-password" />
                </div>

                <div className="form-group text-center">
                  <div className="m-3">
                    <a href="#">Forgot Password?</a>
                  </div>

                  <button
                    type="submit"
                    className="form-control btn submit px-3"
                  >
                    Sign In
                  </button>
                </div>
              </form>
              <p className="text-center"> — Or — </p>
              <div className="text-center">
                <button className="btn-google px-3">
                  <img src="./img/icons/google.svg" alt="Google" /> Sign In With Google
                </button>
              </div>
              <br />
              <div className="m-3 text-center">
                Don&rsquo;t have an account? <a href="#">Sign Up</a>
              </div>
              <br /> <br />
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up */}

      <div className="container">
        <br />
        <br />
        <h1 className="text-center">Sign Up</h1>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-wrap p-0">
              <form action="#" className="signin-form">
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    required=""
                  />
                </div>
                <div className="form-group">
                  <input
                    id="password-field"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required=""
                  />
                  <span toggle="#password-field" className="toggle-password" />
                </div>

                <div className="form-group">
                  <input
                    id="password-field"
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    required=""
                  />
                  <span toggle="#password-field" className="toggle-password" />
                </div>

                <div className="form-group text-center">
                  <button
                    type="submit"
                    className="form-control btn submit px-3"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <p className="text-center"> — Or — </p>
              <div className="text-center">
                <button className="btn-google px-3">
                  <img src="./img/icons/google.svg" alt="Google" /> Sign Up With Google
                </button>
                <br />
                <div className="m-3 text-center">
                  Already have an account? <a href="#">Sign In</a>
                </div>
                <br /> <br />
                <br /> <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signing;
