import { SetupUser } from "@/actions/billing/SetupUser";
import { waitFor } from "@/lib/helper/waitFor";

export default async function SetupPage(){
   return  await SetupUser();
}