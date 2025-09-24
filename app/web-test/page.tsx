'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PagePreloader from '../../components/PagePreloader';

export default function WebTestPage() {
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  const pageContentRef = useRef<HTMLDivElement>(null)

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  const skills = [
    'React & Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'UI/UX Design',
    'Database Design',
    'API Development',
    'Performance Optimization'
  ];

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack marketplace with advanced filtering and real-time inventory management.',
      tech: ['Next.js', 'Stripe', 'PostgreSQL'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
      year: '2024'
    },
    {
      id: 2,
      title: 'SaaS Analytics Dashboard',
      description: 'Real-time data visualization platform with custom charting and automated reporting.',
      tech: ['React', 'D3.js', 'Node.js'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
      year: '2024'
    },
    {
      id: 3,
      title: 'AI Content Generator',
      description: 'Machine learning powered content creation tool with natural language processing.',
      tech: ['Python', 'OpenAI', 'FastAPI'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
      year: '2023'
    },
    {
      id: 4,
      title: 'Mobile Banking App',
      description: 'Secure financial application with biometric authentication and real-time transactions.',
      tech: ['React Native', 'Firebase', 'Plaid'],
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center',
      year: '2023'
    }
  ];

  return (
    <>
      {!preloaderComplete && (
        <PagePreloader 
          pageName="Web Test" 
          onComplete={handlePreloaderComplete}
          pageContentRef={pageContentRef}
        />
      )}
      
      <div 
        ref={pageContentRef}
        style={{ 
          opacity: preloaderComplete ? 1 : 0,
          willChange: 'filter, transform, opacity'
        }}
      >
        <main className="bg-black min-h-screen text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-10 py-4"
        >
          <div className="flex items-center space-x-16">
            <div className="font-extralight text-xl tracking-[0.15em]">ALEXIS CHEN</div>
            <div className="flex space-x-10 text-sm tracking-[0.2em] font-light">
              <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">WORK</span>
              <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">ABOUT</span>
              <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">CONTACT</span>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-40 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-sm font-light tracking-[0.2em] text-white/70 mb-8 uppercase"
              >
                Full-Stack Developer
              </motion.p>
              <h1 className="text-7xl md:text-8xl font-extralight tracking-[0.08em] mb-8 leading-[0.95]">
                CRAFTING
                <br />
                <span className="font-light">DIGITAL</span>
                <br />
                <span className="font-extralight">EXPERIENCES</span>
              </h1>
              <p className="text-xl font-light tracking-[0.03em] text-white/80 max-w-xl leading-[1.6] mb-12">
                Specializing in modern web applications, scalable architectures, and exceptional user experiences that drive business growth.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex space-x-6"
              >
                <button className="bg-white text-black rounded-full px-10 py-4 text-sm font-light tracking-[0.1em] hover:bg-white/90 transition-colors duration-300">
                  VIEW WORK
                </button>
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-10 py-4 text-sm font-light tracking-[0.1em] hover:bg-white/20 transition-all duration-300">
                  DOWNLOAD CV
                </button>
              </motion.div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl blur-3xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=center"
                  alt="Developer"
                  className="relative z-10 rounded-3xl w-full max-w-md mx-auto"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-32 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-extralight tracking-[0.08em] mb-8 leading-[1.1]">
              EXPERTISE
            </h2>
            <p className="text-lg font-light text-white/70 tracking-[0.03em] max-w-3xl mx-auto leading-[1.6]">
              Mastering technologies that power modern digital experiences, from client-side interfaces to backend architectures.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <h3 className="text-lg font-light tracking-[0.03em] group-hover:text-white/90 transition-colors duration-300">
                  {skill}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-extralight tracking-[0.08em] mb-8 leading-[1.1]">
              SELECTED WORK
            </h2>
            <p className="text-lg font-light text-white/70 tracking-[0.03em] max-w-3xl mx-auto leading-[1.6]">
              A showcase of projects that demonstrate technical excellence and creative problem-solving.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl mb-8 aspect-[4/3]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-xs font-light tracking-[0.1em]">
                      {project.year}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-light tracking-[0.03em] group-hover:text-white/80 transition-colors duration-300 leading-[1.3]">
                    {project.title}
                  </h3>
                  <p className="text-lg font-light text-white/70 tracking-[0.02em] leading-[1.6]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-light tracking-[0.1em] text-white/60 border border-white/20 rounded-full px-4 py-2"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div>
              <h2 className="text-5xl font-extralight tracking-[0.08em] mb-8 leading-[1.2]">
                ABOUT
              </h2>
              <div className="space-y-6 text-lg font-light text-white/80 leading-[1.7] tracking-[0.02em]">
                <p>
                  With over 6 years of experience in full-stack development, I specialize in creating scalable web applications that solve complex business challenges.
                </p>
                <p>
                  My approach combines technical expertise with design thinking, ensuring that every project not only functions flawlessly but also provides an exceptional user experience.
                </p>
                <p>
                  Based in San Francisco, I work with startups and established companies worldwide, helping them transform ideas into digital realities.
                </p>
              </div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h4 className="text-sm font-light tracking-[0.2em] text-white/60 mb-4">EXPERIENCE</h4>
                  <p className="text-2xl font-light tracking-[0.03em]">6+ Years</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h4 className="text-sm font-light tracking-[0.2em] text-white/60 mb-4">PROJECTS COMPLETED</h4>
                  <p className="text-2xl font-light tracking-[0.03em]">50+</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h4 className="text-sm font-light tracking-[0.2em] text-white/60 mb-4">CLIENT SATISFACTION</h4>
                  <p className="text-2xl font-light tracking-[0.03em]">100%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-extralight tracking-[0.08em] mb-8 leading-[1.2]">
              LET&apos;S CREATE
              <br />
              SOMETHING EXTRAORDINARY
            </h2>
            <p className="text-lg font-light text-white/70 tracking-[0.03em] mb-16 max-w-2xl mx-auto leading-[1.6]">
              Ready to bring your vision to life? Let&apos;s discuss how we can work together to create exceptional digital experiences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <h4 className="text-sm font-light tracking-[0.2em] text-white/60 mb-4">EMAIL</h4>
                <p className="text-lg font-light tracking-[0.02em]">hello@alexischen.dev</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <h4 className="text-sm font-light tracking-[0.2em] text-white/60 mb-4">LOCATION</h4>
                <p className="text-lg font-light tracking-[0.02em]">San Francisco, CA</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white text-black rounded-full px-12 py-4 text-sm font-light tracking-[0.1em] hover:bg-white/90 transition-colors duration-300">
                START A PROJECT
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-12 py-4 text-sm font-light tracking-[0.1em] hover:bg-white/20 transition-all duration-300">
                SCHEDULE CALL
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-extralight tracking-[0.15em] mb-8">ALEXIS CHEN</h3>
              <p className="text-sm font-light text-white/70 leading-[1.6] tracking-[0.02em]">
                Full-stack developer creating exceptional digital experiences for forward-thinking companies.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light tracking-[0.2em] text-white/80 mb-6">SERVICES</h4>
              <ul className="space-y-3 text-sm font-light text-white/60">
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Web Development</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Mobile Apps</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">API Design</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Consulting</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light tracking-[0.2em] text-white/80 mb-6">CONNECT</h4>
              <ul className="space-y-3 text-sm font-light text-white/60">
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">LinkedIn</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">GitHub</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Twitter</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Dribbble</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm font-light text-white/50">
              <p>&copy; 2024 Alexis Chen. All rights reserved.</p>
              <div className="flex space-x-8 mt-4 md:mt-0">
                <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">Privacy</span>
                <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">Terms</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
    </div>
    </>
  );
}