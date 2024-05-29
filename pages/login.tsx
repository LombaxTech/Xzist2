import GoogleButton from "@/components/GoogleButton";
import { AuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div
      className={`pt-16 flex-1 flex justify-center items-center duration-1000 ${
        showSignIn ? "bg-blue-500" : "bg-red-500"
      }`}
    >
      <div className="w-[800px] h-[500px] relative overflow-hidden">
        {/*  */}
        <div className="h-full w-full flex items-center">
          <div className="w-full h-[400px] flex">
            <div className="flex-1 h-full p-20 flex flex-col justify-center items-center gap-2 bg-red-300 shadow-md text-white">
              <h1 className="text-xl font-medium">Have an account?</h1>
              <button
                className="btn bg-white rounded-none"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </button>
            </div>
            <div className="flex-1 h-full p-20 flex flex-col justify-center items-center gap-2 bg-blue-300 text-white shadow-md">
              <h1 className="text-xl font-medium">Don't have an account?</h1>
              <button
                className="btn bg-white rounded-none"
                onClick={() => setShowSignIn(false)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
        {/*  */}
        <div
          className={`h-full w-1/2 bg-white z-[100] shadow-xl absolute flex flex-col duration-1000 top-0 ${
            showSignIn ? "left-0" : "left-1/2"
          } `}
        >
          {showSignIn ? (
            <SignInForm showSignIn={showSignIn} />
          ) : (
            <SignupForm showSignIn={showSignIn} />
          )}
        </div>
      </div>
    </div>
  );
}

const SignupForm = ({ showSignIn }: { showSignIn: boolean }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 150);
  }, []);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const signinWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createNewAccount = async () => {
    setError("");

    try {
      let userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      router.push("/");
    } catch (error: any) {
      console.log(error);

      if (error?.code === "auth/email-already-in-use") {
        setError("Email has already been used");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address");
      } else if (error.code === "auth/internal-error") {
        setError("Something went wrong");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div
      className={`flex-1 p-10 flex justify-center items-center duration-1000 relative ${
        fadeIn ? "left-0" : "left-[1000px]"
      }`}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-medium">Create An Account</h1>
        <div className="flex flex-col gap-2">
          <input
            type="email"
            className="p-2 outline-none border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="password"
            className="p-2 outline-none border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="btn bg-red-500 hover:bg-red-700 text-white"
            onClick={createNewAccount}
          >
            Create Account
          </button>
          <GoogleButton
            onClick={signinWithGoogle}
            buttonText="Sign in with Google"
          />
        </div>

        {error && (
          <div className="p-2 bg-red-200 text-red-700 text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

const SignInForm = ({ showSignIn }: { showSignIn: boolean }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 150);
  }, []);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const signinWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const login = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      console.log(error);
      setError(`Incorrect details.`);
    }
  };

  return (
    <div
      className={`flex-1 p-10 flex justify-center items-center duration-1000 relative ${
        fadeIn ? "right-0" : "right-[1000px]"
      }
      `}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-medium">Sign In</h1>
        <div className="flex flex-col gap-2">
          <input
            type="email"
            className="p-2 outline-none border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="password"
            className="p-2 outline-none border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button className="btn btn-primary" onClick={login}>
            Sign In
          </button>
          <GoogleButton
            onClick={signinWithGoogle}
            buttonText="Sign in with Google"
          />
        </div>

        {error && (
          <div className="p-2 bg-red-200 text-red-700 text-center">{error}</div>
        )}
      </div>
    </div>
  );
};
