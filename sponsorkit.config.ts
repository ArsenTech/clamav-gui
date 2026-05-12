import "dotenv/config"
import { BadgePreset, defineConfig, tierPresets } from 'sponsorkit'

const past: BadgePreset = {
     avatar: {
          size: 20,
     },
     boxWidth: 22,
     boxHeight: 22,
     container: {
          sidePadding: 35,
     },
}

export default defineConfig({
     mode: 'sponsors',
     github: {
          login: 'ArsenTech',
          type: 'user',
     },
     outputDir: 'public/sponsors',
     width: 800,
     renderer: 'tiers',
     formats: ['svg', 'png'],
     tiers: [
          {
               title: 'Past Sponsors',
               monthlyDollars: -1,
               preset: past,
          },
          {
               title: 'Backers',
               preset: tierPresets.small,
          },
          {
               title: 'Sponsors',
               monthlyDollars: 5,
               preset: {
                    avatar: {
                         size: 42,
                    },
                    boxWidth: 52,
                    boxHeight: 52,
                    container: {
                         sidePadding: 30,
                    },
               }
          },
          {
               title: 'Special Sponsor',
               monthlyDollars: Infinity,
          },
     ]
})