import Hero from '../components/Hero'
import Stats from '../components/Stats'
import AppsGrid from '../components/AppsGrid'
import WorldCup from '../components/WorldCup'
import Mission from '../components/Mission'
import Organizations from '../components/Organizations'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <AppsGrid />
      <WorldCup />
      <Mission />
      <Organizations />
    </>
  )
}
