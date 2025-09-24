'use client'

import { motion } from 'framer-motion'
import content from '../content.json'
import GlassCTA from './ui/GlassCTA'

export default function Introduction() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }



  return (
    <motion.section 
      className="section bg-background-primary" 
      style={{ paddingLeft: '30px', paddingRight: '30px' }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left flex items-center justify-center lg:justify-start">
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-satoshi font-normal text-primary cursor-pointer"
              style={{ 
                lineHeight: '1.2',
                letterSpacing: '0.02em'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.2
                }
              }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              {content.homepage.introduction.title}
            </motion.h2>
          </div>
          <div className="text-center lg:text-left flex flex-col justify-center">
            <motion.p
              className="text-lg lg:text-xl text-text-secondary leading-relaxed mb-6 lg:mb-8 cursor-pointer font-normal"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ 
                opacity: 1, 
                x: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.4
                }
              }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              {content.homepage.introduction.body}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.6
                }
              }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <GlassCTA href="/contact" variant="white">
                {content.homepage.introduction.cta}
              </GlassCTA>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}