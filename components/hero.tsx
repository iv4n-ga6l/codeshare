import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground">
      <div className="container mx-auto px-8 py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-5xl font-bold mb-4">Share Code Snippets with Ease</h1>
          <p className="text-xl mb-6">CodeShare makes it simple to share and collaborate on code snippets. Start sharing your code today!</p>
          <Button size="lg" variant="secondary">
            <a href="#create">Get Started</a>
          </Button>
        </div>
        <div className="md:w-1/2">
          <Image 
            src="https://i.ibb.co/BP2sf81/a-vector-illustration-of-a-computer-scre-uk-Ap-NEN8-T8uy-Xx2dn-HVu-Rg-ue-Z-Iwu-ISy-Cc-N62m-Gu-POGg.jpg" 
            alt="Code sharing illustration" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

