{/* Who I Work Best With - Asymmetric Editorial Cards */}
        <section className="py-32 md:py-40 lg:py-48 bg-background-secondary relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">

            {/* Header - Left Aligned */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-20 md:mb-28 lg:mb-32"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-text-primary/20"></div>
                <span className="text-xs font-satoshi tracking-[0.2em] uppercase text-text-tertiary">
                  Partnership Criteria
                </span>
              </div>
              <h2
                className="font-satoshi text-text-primary mb-8"
                style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em'
                }}
              >
                {content.about.idealClient.title}
              </h2>
              <p
                className="font-satoshi text-text-secondary max-w-2xl"
                style={{
                  fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  letterSpacing: '0.01em'
                }}
              >
                {content.about.idealClient.intro}
              </p>
            </motion.div>

            {/* Staggered Editorial Cards */}
            <div className="space-y-8 md:space-y-12 lg:space-y-16">
              {content.about.idealClient.criteria.map((item, index) => (
                <motion.article
                  key={item.characteristic}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className={`
                    group relative
                    ${index % 2 === 0 ? 'md:ml-0 md:mr-auto md:max-w-4xl' : 'md:ml-auto md:mr-0 md:max-w-4xl lg:max-w-5xl'}
                  `}
                >
                  {/* Floating Card */}
                  <div
                    className="relative bg-background-primary px-8 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16
                               transition-all"
                    style={{
                      transitionDuration: '600ms',
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)'
                    }}
                  >
                    {/* Oversized Index Number - Top Right */}
                    <div
                      className="absolute -top-3 right-8 md:-top-4 md:right-12 lg:-top-5 lg:right-16
                                 font-satoshi text-text-primary transition-all"
                      style={{
                        fontSize: 'clamp(5rem, 12vw, 9rem)',
                        fontWeight: 200,
                        lineHeight: 0.8,
                        letterSpacing: '-0.05em',
                        opacity: 0.04,
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="relative">
                      {/* Characteristic Title */}
                      <h3
                        className="font-satoshi text-text-primary mb-5 md:mb-6
                                   transition-all group-hover:translate-x-2"
                        style={{
                          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                          fontWeight: 400,
                          lineHeight: 1.25,
                          letterSpacing: '-0.015em',
                          transitionDuration: '600ms',
                          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      >
                        {item.characteristic}
                      </h3>

                      {/* Description */}
                      <p
                        className="font-satoshi transition-all
                                   group-hover:translate-x-2"
                        style={{
                          fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
                          fontWeight: 400,
                          lineHeight: 1.75,
                          letterSpacing: '0.005em',
                          color: 'rgb(var(--color-text-secondary) / 0.9)',
                          transitionDuration: '600ms',
                          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Accent Line - Expands on Hover */}
                    <div
                      className="absolute bottom-0 left-0 h-px bg-text-primary
                                 w-0 group-hover:w-full transition-all"
                      style={{
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    />
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Not Ideal For - Elegant Closing Statement */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-24 md:mt-32 lg:mt-40 max-w-4xl mx-auto"
            >
              {/* Divider Line */}
              <div className="flex items-center gap-4 mb-10 md:mb-12">
                <div className="flex-1 h-px bg-text-primary/10" />
                <span
                  className="font-satoshi text-text-tertiary tracking-[0.15em] uppercase"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  {content.about.idealClient.notIdealFor.title}
                </span>
                <div className="flex-1 h-px bg-text-primary/10" />
              </div>

              {/* Criteria List - Spaced Bullets */}
              <div className="space-y-4 md:space-y-5">
                {content.about.idealClient.notIdealFor.criteria.map((criterion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="flex items-start gap-4 group"
                  >
                    {/* Bullet */}
                    <div
                      className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full transition-all"
                      style={{
                        backgroundColor: 'rgb(var(--color-text-tertiary) / 0.3)',
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    />
                    {/* Text */}
                    <p
                      className="font-satoshi transition-colors group-hover:text-text-secondary"
                      style={{
                        fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
                        fontWeight: 400,
                        lineHeight: 1.7,
                        color: 'rgb(var(--color-text-tertiary) / 0.75)',
                        transitionDuration: '600ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      {criterion}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>
