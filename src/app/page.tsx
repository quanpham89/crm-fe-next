import HomePage from "@/components/layout/homepage";
import { auth, signIn } from "@/auth"

export default async  function  Home() {
  const session = await auth()
  console.log("check session home page", session)
  return (
    <div>
      <div> {JSON.stringify(session)}</div>
      <HomePage />
     
    </div>
  );
}
