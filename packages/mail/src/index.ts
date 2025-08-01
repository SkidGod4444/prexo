import { Resend } from "resend";
import PrexoWelcomeMail from "../templates/welcome";
const resendEnv = process.env.RESEND_API_KEY;
export const resend = new Resend(resendEnv);

export const sendWelcomeMail = async (
  email: string,
  userName: string
) => {
  const emailData = {
    from: "welcome@updates.prexoai.xyz",
    to: email,
    subject: 'Welcome to Prexo AI 🥳',
    react: PrexoWelcomeMail({userName}),
  };
  console.log("Welcome email has been sent successfully!");
  return await resend.emails.send(emailData);
};