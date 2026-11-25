// The directed recordings of her sites in use: how long each runs and what happens when, so the
// player (components/directions/home/Directed.tsx) can caption each step and move the camera to it.
// One source for the homepage and the case studies.
// Every caption and camera point was read off the recording itself, one frame a second (the
// contact sheets made on 2026-11-25). Prices are as each site shows them.
// A cue is [seconds, what is happening, camera: [x, y, zoom]], x and y the centre of attention
// as fractions of the 1440x900 frame. Durations are from ffprobe.

import type { Cue } from '../../components/directions/home/Directed'

export const WIDE: [number, number, number] = [0.5, 0.5, 1]

export type DirectedRec = { duration: number; cues: Cue[] }

export const DIRECTED: Record<string, DirectedRec> = {
  // Recorded on the new site at gwen.zerahq.com, which moves to gwenaddo.com
  'gwen-new-demo': {
    duration: 14.5,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [1.5, 'Scrolls to her programmes', WIDE],
      [3.8, 'Three ways in: the book, the masterclass, a strategy session', [0.5, 0.55, 1.15]],
      [4.7, 'Looks at the masterclass', [0.5, 0.75, 1.7]],
      [7, 'Picks a strategy session with Gwen', [0.78, 0.78, 1.8]],
      [8.9, 'The application opens', [0.68, 0.3, 1.4]],
      [10.7, 'Fills in the first step', [0.6, 0.75, 1.9]],
    ],
  },
  'finest-dietitian-demo': {
    duration: 25,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [1.5, 'The conditions she treats, from PCOS to children’s nutrition', [0.6, 0.3, 1.4]],
      [5, 'The BMI calculator: height and weight on two sliders', [0.3, 0.6, 1.6]],
      [9.5, 'At 85.5 kg the dial reads overweight', [0.75, 0.6, 1.8]],
      [13, 'Book a consultation, from GH₵600', WIDE],
      [15, 'Picks a general consultation', [0.35, 0.35, 1.5]],
      [18, 'Picks a time', [0.33, 0.3, 1.6]],
      [20, 'Fills in the details, ready to pay and book', [0.3, 0.45, 1.6]],
    ],
  },
  'command-space-demo': {
    duration: 16.1,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [1, 'Picks a problem: leads cost too much', [0.3, 0.9, 1.9]],
      [3, 'Types a goal into the brief', [0.3, 0.92, 2]],
      [7, 'Opens the services menu', [0.6, 0.26, 1.6]],
      [11, 'Ten services, each with its own page', WIDE],
    ],
  },
  'anabs-demo': {
    duration: 20.2,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [3, 'Scrolls past the building and its amenities', WIDE],
      [6, 'Picks the two-bedroom residence, from $225,000', [0.5, 0.72, 1.4]],
      [8, 'The two-bedroom page opens', WIDE],
      [14, 'The floor plan', [0.32, 0.55, 1.6]],
      [17, 'The pricing list, unit by unit, with what is sold', [0.5, 0.6, 1.15]],
    ],
  },
  'eleven-eleven-demo': {
    duration: 19.9,
    cues: [
      [0, 'Opens on the homepage film', WIDE],
      [5.5, 'The unit types, from $150,000', [0.5, 0.42, 1.08]],
      [8, 'Opens the Units page', WIDE],
      [13, 'Beach level units, each with its starting price', [0.5, 0.5, 1.2]],
      [17, 'The villas and penthouses', [0.5, 0.55, 1.2]],
    ],
  },
  'girlcode-demo': {
    duration: 25.2,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [8, 'The Courses page, with a form for parents to register a child', [0.3, 0.55, 1.5]],
      [12, 'A parent fills in their details', [0.3, 0.3, 1.8]],
      [18, 'The Get Involved page', WIDE],
      [22.5, 'Three ways to give: GoFundMe, Paystack or mobile money', [0.5, 0.5, 1.4]],
    ],
  },
  'eden-heights-demo': {
    duration: 25,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [6, 'A virtual tour of the whole site', [0.5, 0.55, 1.2]],
      [11, 'The available units', [0.5, 0.45, 1.2]],
      [13, 'Opens the two-bedroom apartment', WIDE],
      [16.6, 'Pricing starts from $130,000', [0.5, 0.88, 1.7]],
      [18, 'The floor plan', [0.5, 0.55, 1.2]],
      [23, 'The property features', [0.5, 0.25, 1.25]],
    ],
  },
  'landmark-homes-demo': {
    duration: 21.1,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [6, 'Three developments: Deiterra, Sapphire and The Madison', [0.5, 0.42, 1.2]],
      [9, 'Opens the Deiterra page', WIDE],
      [15, 'The amenities, from the Sky Oasis to the executive lounge', [0.5, 0.5, 1.15]],
    ],
  },
  'kline-demo': {
    duration: 24.7,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [5, 'The services, from architectural design to renovation', [0.68, 0.5, 1.4]],
      [9, 'The four-step process, from concept to construction oversight', [0.55, 0.45, 1.15]],
      [13, 'Opens the Projects page', WIDE],
      [20.5, 'Projects in Accra, Togo, Abidjan and the US', [0.5, 0.6, 1.2]],
    ],
  },
  'emma-kotia-demo': {
    duration: 22.3,
    cues: [
      [0, 'Opens on the homepage', WIDE],
      [5, 'His education: the University of Ghana and Cranfield', [0.5, 0.75, 1.4]],
      [9, 'His selected publications', [0.5, 0.85, 1.4]],
      [14, 'His service in pictures', [0.45, 0.4, 1.2]],
      [18, 'His news and articles', [0.5, 0.65, 1.3]],
    ],
  },
}
