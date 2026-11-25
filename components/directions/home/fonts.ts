// The redesign's two families, loaded once and shared by every page built in it.
// Archivo with its width axis (the 125% caps are the shout voice), IBM Plex Mono for labels.

import { Archivo, IBM_Plex_Mono } from 'next/font/google'

export const sans = Archivo({ subsets: ['latin'], weight: 'variable', axes: ['wdth'], variable: '--h-sans', display: 'swap' })
export const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--h-mono', display: 'swap' })
