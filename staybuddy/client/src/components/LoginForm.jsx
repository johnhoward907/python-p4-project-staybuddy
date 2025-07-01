import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext.jsx";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  return (
    <div className="main-content">
      <div className="container">
        <div className="form-container">
          <h2 className="form-title">Welcome Back</h2>
          <div className="demo-credentials">
            <p>
              <strong>🧪 Demo Credentials:</strong>
            </p>
            <p>
              Email: <code>demo@example.com</code>
            </p>
            <p>
              Password: <code>password123</code>
            </p>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
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

                const response = await fetch("/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  setErrors({ email: errorData.error || "Login failed" });
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
                    placeholder="Enter your password"
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
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="form-link">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
