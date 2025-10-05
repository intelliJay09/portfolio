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
    <section className="bg-black pt-16 pb-24 sm:pt-20 sm:pb-28 md:pt-32 md:pb-32 lg:pt-40">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Section Header */}
        <div className="mb-16 sm:mb-20 md:mb-24 lg:mb-28 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight"
          >
            Featured Projects
          </motion.h2>
        </div>

        {/* Projects Stack */}
        <div className="space-y-24 sm:space-y-32 md:space-y-40 lg:space-y-48">
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
                    index === 0 ? 'bottom-[-110px] left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 md:translate-x-0 md:bottom-[-38px] md:left-12 md:right-auto md:top-auto' :
                    index === 1 ? 'bottom-[-110px] left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 md:translate-x-0 md:bottom-[-38px] md:right-12 md:left-auto md:top-auto' :
                    'bottom-[-110px] left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 md:translate-x-0 md:bottom-[-38px] md:left-12 md:right-auto md:top-auto'
                  } w-auto sm:w-full sm:max-w-[90%] md:max-w-md`}
                >
                  <div
                    className="backdrop-blur-xl bg-white/10 border border-white/25 rounded-xl p-5 sm:p-6 md:px-10 md:py-16 shadow-2xl group-hover:backdrop-blur-2xl group-hover:bg-white/15 group-hover:border-white/35 transition-all duration-[900ms]"
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    {/* Project Title */}
                    <h3
                      className="text-white text-xl sm:text-2xl md:text-3xl font-light tracking-wide mb-2 group-hover:text-white/90 transition-colors duration-[900ms]"
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
                      className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-[900ms]"
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      <span className="text-xs sm:text-sm font-light tracking-wide">View Project</span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-[900ms]"
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
          className="mt-32 sm:mt-40 md:mt-44 lg:mt-48 text-center"
        >
          <TransparentCTA href="/portfolio">
            View All Projects
          </TransparentCTA>
        </motion.div>
      </div>
    </section>
  )
}