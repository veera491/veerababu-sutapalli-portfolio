import { HeroSection } from '@/components/hero/hero-section';

export default async function Home() {
  return (
    <>
      <HeroSection />
      
      {/* 
        Temporary structural anchor ensuring the "Explore Selected Work" 
        CTA resolves safely before the final project grid is implemented.
      */}
      <div id="work" className="w-full h-px opacity-0 invisible" aria-hidden="true" />
    </>
  );
}
