import { Resend } from "resend";
import PrexoWelcomeMail from "../templates/welcome";
const resendEnv = process.env.RESEND_API_KEY;
if (!resendEnv) {
  throw new Error("RESEND_API_KEY environment variable is required");
}
export const resend = new Resend(resendEnv);

export const sendWelcomeMail = async (email: string, userName: string) => {
  const emailData = {
    from: "welcome@updates.prexoai.xyz",
    to: email,
    subject: "Welcome to Prexo AI 🥳",
    react: PrexoWelcomeMail({ userName }),
  };
  const result = await resend.emails.send(emailData);
  console.log("Welcome email has been sent successfully!");
  return result;
};
