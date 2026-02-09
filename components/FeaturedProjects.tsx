'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import TransparentCTA from './ui/TransparentCTA'

const featuredProjects = [
  {
    id: 'anabs',
    title: 'Anabs',
    category: 'Premium Brand Authority',
    description: 'Luxury high-rise development commanding premium positioning through sophisticated digital storytelling',
    image: '/images/anabs.png',
    year: '2025',
    position: 'left'
  },
  {
    id: 'gwen-addo',
    title: 'Gwen Addo',
    category: 'Premium Lead Generation',
    description: 'Strategic consultation platform converting high-value prospects with integrated booking systems',
    image: '/images/gwen-addo.png',
    year: '2025',
    position: 'right'
  },
  {
    id: 'girl-code-africa',
    title: 'Girl Code Africa',
    category: 'Premium Brand Authority',
    description: 'Multi-audience platform driving program enrollments, partnership acquisitions, and donor engagement for STEM education non-profit',
    image: '/images/girlcode.png',
    year: '2023',
    position: 'left'
  }
]

export default function FeaturedProjects() {
  return (
    <section className="bg-black pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-32 md:pb-24 lg:pt-40 lg:pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Section Header */}
        <div className="mb-16 sm:mb-20 md:mb-24 lg:mb-28 text-center max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight mb-6"
          >
            Strategic Challenges Solved. Measurable Results Delivered.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-base sm:text-lg md:text-xl font-light max-w-3xl mx-auto"
          >
            From luxury real estate commanding 340% traffic growth to lead generation systems achieving 28% conversion increases—I architect complete growth ecosystems for premium brands who refuse to compete on price.
          </motion.p>
        </div>

        {/* Projects Stack */}
        <div className="space-y-16 md:space-y-40 lg:space-y-48">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ 
                opacity: 0, 
                y: 60,
                rotateX: 15,
                scale: 0.95,
                z: -100
              }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                rotateX: 0,
                scale: 1,
                z: 0
              }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1.2,
                delay: index * 0.2,
                ease: [0.165, 0.84, 0.44, 1]
              }}
              className="relative"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <Link href={`/portfolio/${project.id}`} className="group block">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[16/9] portfolio-hero-container">
                  <Image
                    src={project.image}
                    alt={`${project.title} project showcase`}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="object-cover portfolio-hero-image"
                    priority={index === 0}
                    quality={95}
                  />

                  {/* Dual gradient overlays - exact match to portfolio/slug */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/8 group-hover:to-accent/4 z-10 rounded-2xl portfolio-overlay"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-tl from-text-primary/0 via-transparent to-text-primary/0 group-hover:from-text-primary/3 group-hover:to-text-primary/6 z-10 rounded-2xl portfolio-overlay"
                  />
                </div>

                {/* Glassmorphism Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: (index * 0.15) + 0.2,
                    ease: [0.165, 0.84, 0.44, 1]
                  }}
                  className={`mt-6 w-full md:absolute md:mt-0 md:max-w-md md:bottom-[-38px] ${
                    index === 1 ? 'md:right-12 md:left-auto' : 'md:left-12 md:right-auto'
                  }`}
                >
                  <div
                    className="backdrop-blur-xl bg-white/10 border border-white/25 rounded-xl p-5 sm:p-6 md:px-10 md:py-16 shadow-2xl group-hover:backdrop-blur-2xl group-hover:bg-white/15 group-hover:border-white/35 transition-all duration-[600ms]"
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    {/* Project Title */}
                    <h3
                      className="text-white text-xl sm:text-2xl md:text-3xl font-light tracking-wide mb-2 group-hover:text-white/90 transition-colors duration-[600ms]"
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Category */}
                    <p className="text-white/85 text-xs sm:text-sm tracking-wider uppercase mb-2 sm:mb-3 font-light">
                      {project.category}
                    </p>

                    {/* Description */}
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 font-light">
                      {project.description}
                    </p>
                    
                    {/* View Project CTA */}
                    <div
                      className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-[600ms]"
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      <span className="text-xs sm:text-sm font-light tracking-wide">View Project</span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-[600ms]"
                        style={{
                          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      />
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                    <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-50" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 sm:mt-40 md:mt-44 lg:mt-48 text-center"
        >
          <TransparentCTA href="/portfolio">
            Explore Growth Outcomes
          </TransparentCTA>
        </motion.div>
      </div>
    </section>
  )
}