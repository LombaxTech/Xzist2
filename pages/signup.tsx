import GoogleButton from "@/components/GoogleButton";
import { auth } from "@/firebase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const provider = new GoogleAuthProvider();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  router.push("/login");

  const signinWithGoogle = async () => {
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          console.log(result);
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (error) {
      console.log(error);
    }
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
    <div className="flex-1 flex flex-col items-center gap-4 justify-center p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-center">Create a new account</h1>
        <Link href={"/signin"} className="underline text-center">
          Already have an account?
        </Link>
      </div>

      <div className="p-10 w-full lg:w-4/12 rounded-md bg-white shadow-md flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="">Email </label>
          <input
            type="email"
            className="p-2 outline-none border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="">Password </label>
          <input
            type="password"
            className="p-2 outline-none border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button className="btn btn-primary" onClick={createNewAccount}>
          Create Account
        </button>
        <GoogleButton
          onClick={signinWithGoogle}
          buttonText="Make account with Google"
        />
        {error && (
          <div className="p-2 bg-red-200 text-red-700 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
