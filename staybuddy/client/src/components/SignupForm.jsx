import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  return (
    <div className="main-content">
      <div className="container">
        <div className="form-container">
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
              try {
                const res = await fetch("/auth/signup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });
                const data = await res.json();
                if (res.ok) {
                  localStorage.setItem("token", data.token);
                  if (login) login(data.user);
                  navigate("/");
                } else {
                  setErrors({ email: data.error || "Signup failed" });
                }
              } catch (err) {
                console.error("Network error:", err);
                setErrors({
                  email:
                    "Backend server unavailable. Please start the backend server by running: cd staybuddy/server && python3 app.py",
                });
              }
              setSubmitting(false);
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
