return {
  debug: false,
  midnight: new Date('1-1-2025 12:00:00 AM EST'),
  timekeeper: {
    shift: 0,
    speed: 1,
    // shift: 24*3600*0+1*3600,
    // speed: 6,
  },
  schedule: {
    '12-29-2024 12:00:00 AM EST': {
      state: {
        phase: 'ambient',
        ambientCountdown: false,
        ambientCountdownBlackout: 0.0,
        // ambientCountdown: true,
      }
    },
    '12-31-2024 4:50:00 PM EST': {
      state: {
        ambientCountdown: true,
        ambientCountdownBlackout: 0.1,
      }
    },
    '12-31-2024 11:30:00 PM EST': {
      state: {
        ambientCountdown: true,
        ambientCountdownBlackout: 0.4,
      }
    },
    '1-1-2025 12:00:00 AM EST': {
      state: {
        phase: 'blackout',
      }
    }
  }
}
