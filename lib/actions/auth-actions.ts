"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from "@/lib/constants";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebaseClient";
import jwt from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";
import {  UserInfo} from "@/lib/dashboardTypes";


export async function createSession(uid: string , user:UserInfo) {
    const cookie = await cookies();
    cookie.set(SESSION_COOKIE_NAME, uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // One day
      path: "/",
    });
  
    
    const jwtPayload = { uid, ...user }; // Include other user info if needed
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, { expiresIn: "1d" });
  
    // Set the JWT cookie
    cookie.set("jwtcookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // One day
      path: "/",
    });


}

export async function removeSession() {
  try {
    const cookie = await cookies();

    cookie.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error(error);
  } finally {
    redirect(ROOT_ROUTE);
  }
}

export const loginWithCreds = async (state: unknown, formData: FormData) => {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (typeof rawFormData.email !== 'string' || typeof rawFormData.password !== 'string') {
    throw new Error('Email and password must be provided');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      rawFormData.email,
      rawFormData.password
    );
    const idToken = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;

   // Fetch additional user details from Firestore
   const userDocRef = doc(db, "users",uid );
   const userDoc = await getDoc(userDocRef);

   let userData : UserInfo = { id:uid }; // Default user data with UID
   if (userDoc.exists()) {
     userData = { ...userData, ...userDoc.data() }; // Merge Firestore data
   } else {
     console.warn("No additional user data found for UID:", uid);
   }


    if (idToken) {
      await createSession(idToken ,userData );

    } else {
      return "error";
    }
  } catch (error: unknown) {
    console.error("Login error:", error);
    return { error: error };
  }

  redirect(ADMIN_ROUTE);

};


export async function doSignOut() {
  await auth.signOut();
 await removeSession()
}