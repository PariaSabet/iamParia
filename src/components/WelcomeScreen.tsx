import { TaskBar } from './TaskBar'

export function WelcomeScreen() {
  return (
    <div className="fixed inset-0 bg-[#274472] text-white flex flex-col animate-fadeIn">
      <div className="flex-1 flex justify-center items-center text-3xl font-bold">
        Welcome to Paria's PC
      </div>
      <TaskBar />
    </div>
  )
}

export default WelcomeScreen
