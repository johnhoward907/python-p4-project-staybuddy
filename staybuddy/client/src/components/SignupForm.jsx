import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext.jsx";

const SignupForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext);

  // Check if we came from the auth prompt
  const showBackButton =
    location.state?.from === "auth-prompt" ||
    !document.referrer.includes("/signup");

  return (
    <div className="main-content">
      <div className="container">
        <div className="form-container">
          {showBackButton && (
            <button
              onClick={() => navigate("/")}
              className="back-button"
              type="button"
            >
              ← Back to Welcome
            </button>
          )}
          <h2 className="form-title">Join StayBuddy</h2>
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={Yup.object({
              username: Yup.string()
                .min(3, "Username must be at least 3 characters")
                .required("Username is required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
            })}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              // Prevent duplicate submissions
              if (setSubmitting) setSubmitting(true);

              try {
                // Clear any previous errors
                setErrors({});

                const response = await fetch("/auth/signup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  setErrors({ email: errorData.error || "Signup failed" });
                  return;
                }

                const data = await response.json();
                localStorage.setItem("token", data.token);
                if (login) login(data.user);
                navigate("/");
              } catch (err) {
                console.error("Network error:", err);
                setErrors({
                  email:
                    "Network error. Please check your connection and try again.",
                });
              } finally {
                if (setSubmitting) setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <Field
                    name="username"
                    type="text"
                    className="form-input"
                    placeholder="Choose a username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Create a password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary form-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="form-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
