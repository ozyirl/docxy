import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

import { Style } from "util";

const Page = () => {
    const{getUser} = getKindeServerSession()

    const user = getUser()

    if(!user || !user.id) redirect('/auth-call?origin=dashboard')

    return (
       
        
        <div>
            {user.email}
        </div>
       
    )
}
 
export default Page;