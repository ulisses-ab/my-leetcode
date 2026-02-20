import { Navbar } from "@/components/layout/Navbar/Navbar"
import { ProblemList } from "@/features/ProblemList/ProblemList"
import { useNavbarStore } from "@/stores/useNavbarStore"
import { useEffect } from "react";
import { ParticleCanvas } from "../lib/particle-canvas"

export function Problems() {
  const setNavbarCenter = useNavbarStore((state) => state.setNavbarCenter);

  useEffect(() => {
    setNavbarCenter(<></>);
  }, [])

  return (
    <div className="h-screen flex flex-col items-center">
      <Navbar />
      <div className="my-20 text-center">
        <h1 className="text-5xl font-bold">
          Solve coding problems
        </h1>
      </div>
      <ProblemList />
    </div>
  )
}
