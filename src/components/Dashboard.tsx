"use client"

import { trpc } from "@/app/_trpc/client";
import { Ghost } from "lucide-react";
import UploadButton from "./UploadButton";

const Dashboard = () => {


    const {data:files,isLoading} = trpc.getUserFiles.useQuery()



    return ( 
        <main className="mx-auto max-w-7xl md:pd-10">
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-5xl text-gray-900">
                    My Files
                </h1>

                <UploadButton/>
            </div>

            {files && files?.length!== 0?(
                    <div>

                    </div>
            ):isLoading?(
                <div>

                </div>
            ):(
                <div className="mt-16 flex flex-col items-center gap-2">
                        <Ghost className="h-8 w-8 text-stone-600"/>
                        <h3 className="font-semibold text-xl">nothing to see here</h3>
                        <p>
                            upload your first pdf
                        </p>
                </div>
            )}


            
        </main>
     );
}
 
export default Dashboard;