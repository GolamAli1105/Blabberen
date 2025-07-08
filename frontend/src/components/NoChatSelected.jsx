import { Chats } from 'phosphor-react'
import React from 'react'

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
        <div className="max-w-md text-center space-y-6">

            <div className="flex justify-center gap-4 mb-4">
                <div className="relative">
                    <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                        <Chats className="size-8 text-primary" />
                    </div>
                </div>    
            </div>

            <h2 className="text-wxl font-bold">Welcome to Blabberen!</h2>
            
        </div>
    </div>
  )
}

export default NoChatSelected