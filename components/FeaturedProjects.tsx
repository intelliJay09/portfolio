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
    category: 'Luxury Real Estate Website',
    description: 'Premium high-rise residential development showcase',
    image: '/images/anabs.png',
    year: '2025',
    position: 'left'
  },
  {
    id: 'gwen-addo',
    title: 'Gwen Addo',
    category: 'Web Development',
    description: 'Personal brand and portfolio website',
    image: '/images/gwen-addo.png',
    year: '2025',
    position: 'right'
  },
  {
    id: 'girl-code-africa',
    title: 'Girl Code Africa',
    category: 'Website Design & Development',
    description: 'Non-profit tech education platform',
    image: '/images/girlcode.png',
    year: '2023',
    position: 'left'
  }
]

export default function FeaturedProjects() {
  return (
    <section className="bg-black pt-12 pb-20 md:pt-40 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 md:max-w-5xl lg:max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 md:mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white font-light text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            Featured Projects
          </motion.h2>
        </div>

        {/* Projects Stack */}
        <div className="space-y-54 md:space-y-42">
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
                <div className="relative overflow-visible rounded-2xl aspect-[4/3] md:aspect-[16/9]">
                  <Image
                    src={project.image}
                    alt={`${project.title} project showcase`}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-102"
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      willChange: 'transform'
                    }}
                    priority={index === 0}
                    quality={95}
                  />
                  
                  {/* Subtle overlay for hover state */}
                  <div 
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-[900ms]"
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  />
                </div>

                {/* Floating Glassmorphism Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.7,
                    delay: (index * 0.15) + 0.2,
                    ease: [0.165, 0.84, 0.44, 1]
                  }}
                  className={`absolute ${
                    index === 0 ? 'bottom-[-130px] left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-[-38px] md:left-12 md:top-auto' :
                    index === 1 ? 'bottom-[-130px] left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-[-38px] md:right-12 md:left-auto md:top-auto' :
                    'bottom-[-130px] left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-[-38px] md:left-12 md:right-auto md:top-auto'
                  } w-full max-w-[360px] md:max-w-md`}
                >
                  <div 
                    className="backdrop-blur-xl bg-white/10 border border-white/25 rounded-xl p-6 md:px-10 md:py-16 shadow-2xl group-hover:backdrop-blur-2xl group-hover:bg-white/15 group-hover:border-white/35 transition-all duration-[900ms]"
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    {/* Project Title */}
                    <h3 
                      className="text-white text-2xl md:text-3xl font-light tracking-wide mb-2 group-hover:text-white/90 transition-colors duration-[900ms]"
                      style={{ 
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      {project.title}
                    </h3>
                    
                    {/* Category */}
                    <p className="text-white/85 text-sm tracking-wider uppercase mb-3 font-light">
                      {project.category}
                    </p>
                    
                    {/* Description */}
                    <p className="text-white/80 text-base leading-relaxed mb-6 font-light">
                      {project.description}
                    </p>
                    
                    {/* View Project CTA */}
                    <div 
                      className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-[900ms]"
                      style={{ 
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      <span className="text-sm font-light tracking-wide">View Project</span>
                      <ArrowUpRight 
                        className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-[900ms]"
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
          className="mt-48 md:mt-40 text-center"
        >
          <TransparentCTA href="/portfolio">
            View All Projects
          </TransparentCTA>
        </motion.div>
      </div>
    </section>
  )
}