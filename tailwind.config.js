const plugin = require('tailwindcss/plugin');

/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  purge: {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './hooks/**/*.{js,ts,jsx,tsx}',
      './public/**/*.{js,ts,jsx,tsx}',
      './images/**/*.{js,ts,jsx,tsx}',
      './utils/**/*.{js,ts,jsx,tsx}',
      './*.{js,ts,jsx,tsx}',
    ],
    options: { keyframes: true, fontFace: true, variables: true },
  },
  mode: 'jit',
  darkMode: 'media',
  theme: {
    fontFamily: {
      sans: ['Fira Sans', 'typeofweb-fallback-sans', 'Arial', 'Helvetica', 'sans-serif'],
      serif: ['Merriweather', 'typeofweb-fallback-serif', 'Times New Roman', 'Times', 'serif'],
      mono: [
        'Fira Mono',
        'typeofweb-fallback-mono',
        'Courier New',
        'Courier',
        'Consolas',
        'Menlo',
        'Liberation Mono',
        'ui-monospace',
        'SFMono-Regular',
        'monospace',
      ],
    },
    colors: {
      white: 'hsl(0, 0%, 100%)',
      transparent: 'transparent',
      red: {
        500: 'hsl(0, 85%, 54%)',
        900: 'hsl(0, 85%, 40%)',
      },
      green: {
        100: 'hsl(145.9, 100%, 90%)',
        200: 'hsl(146, 73.5%, 77.8%)',
        300: 'hsl(146, 70.1%, 62%)',
        400: 'hsl(146, 70.1%, 54.1%)',
        500: 'hsl(146.4, 38.7%, 53.9%)',
        600: 'hsl(145.7, 54.8%, 45.1%)',
        700: 'hsl(146.4, 70.2%, 36.9%)',
        800: 'hsl(146.2, 85.1%, 29%)',
        900: 'hsl(145.9, 100%, 20%)',
      },

      blue: {
        100: 'hsl(220.5, 100%, 85.5%)',
        200: 'hsl(223.8, 98.4%, 74.9%)',
        300: 'hsl(224, 99.1%, 57.1%)',
        400: 'hsl(234.9, 80.3%, 54.1%)',
        500: 'hsl(247.8, 78%, 48.2%)',
        600: 'hsl(247.7, 68%, 38%)',
        700: 'hsl(248.1, 86.1%, 33.9%)',
        800: 'hsl(248, 100%, 22%)',
        900: 'hsl(247.5, 78.3%, 18%)',
      },

      pink: {
        100: 'hsl(323.1, 95.1%, 92%)',
        200: 'hsl(318.5, 90.7%, 83.1%)',
        300: 'hsl(318, 100%, 72%)',
        400: 'hsl(323.4, 89.1%, 63.9%)',
        500: 'hsl(323.4, 75.5%, 52%)',
        600: 'hsl(323.3, 90.4%, 40.8%)',
        700: 'hsl(323.6, 96.6%, 34.1%)',
        800: 'hsl(323.5, 100%, 26.1%)',
        900: 'hsl(323.5, 90.2%, 16.1%)',
      },

      gray: {
        100: 'hsl(0, 0%, 98%)',
        200: 'hsl(0, 0%, 94.1%)',
        300: 'hsl(0, 0%, 72.9%)',
        400: 'hsl(0, 0%, 63.1%)',
        500: 'hsl(0, 0%, 54.1%)',
        600: 'hsl(0, 0%, 43.1%)',
        700: 'hsl(0, 0%, 32.9%)',
        800: 'hsl(0, 0%, 23.1%)',
        900: 'hsl(0, 0%, 13.3%)',
      },
    },
    extend: {
      keyframes: {
        appear: {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
      },
      animation: {
        appear: 'appear 1s',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    plugin(function ({ config, addUtilities, addVariant, e, postcss, theme }) {
      {
        addUtilities({
          '.w-fit': {
            width: 'fit-content',
          },
          '.overflow-scrolling-touch': {
            '-webkit-overflow-scrolling': 'touch',
          },
          '.word-break-break-word': {
            'word-break': 'break-word',
          },
          '.text-stroke': {
            '-webkit-text-stroke': `1px ${theme('colors.gray.500')}`,
            '-webkit-text-fill-color': `${theme('colors.gray.100')}`,
          },
          '.indent-0': {
            'text-indent': '0',
          },
          '.text-tiny': {
            'font-size': '0.625rem',
            'line-height': '0.8125rem',
          },
          '.no-touch-highlight': {
            '-webkit-tap-highlight-color': 'transparent',
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
          },
          '.transcluent-white': {
            /**
             * Co = Ca*alpha + Cb*(1-alpha)
             * green: #73b588
             * blue: #301cd2
             * pink: #cf3c96
             *
             * dark:
             * green: #375841
             * blue: #342a84
             * pink: #7d3261
             *
             * light:
             * green: #e6f1ea
             * blue: #dddaf4
             * pink: #f3ddec
             */
            'backdrop-filter': 'blur(25px)',
            'background-color': 'rgba(255, 255, 255, 0.825)',
          },
          '.transcluent-black': {
            'backdrop-filter': 'blur(25px)',
            'background-color': 'rgba(0, 0, 0, 0.36)',
          },
          '.content-visibility': {
            'content-visibility': 'auto',
          },
        });
      }

      {
        // ios variant
        addVariant('ios', ({ container, separator }) => {
          const supportsRule = postcss.atRule({ name: 'supports', params: '(-webkit-touch-callout: none)' });
          supportsRule.append(container.nodes);
          container.append(supportsRule);
          supportsRule.walkRules((rule) => {
            rule.selector = `.${e(`ios${separator}${rule.selector.slice(1)}`)}`;
          });
        });
      }

      {
        // counters
        // Copyright (c) 2020 Konstantin Komelin
        const counterName = 'c' + Math.random().toString(32).slice(3);
        addUtilities({
          '.counter-reset': {
            'counter-reset': counterName,
          },
          '.counter-increment': {
            'counter-increment': `${counterName} 1`,
          },
          '.counter-decrement': {
            'counter-increment': `${counterName} -1`,
          },
        });
        addUtilities({
          '.counter-result': {
            content: `counter(${counterName})`,
          },
        });
      }

      {
        // animations
        const animDelays = [0, 75, 100, 150, 200, 300, 500, 700, 1000];
        addUtilities(
          animDelays.map((val) => {
            return {
              [`.${e(`animate-delay-${val}`)}`]: {
                'animation-delay': `${val}ms`,
                'animation-fill-mode': 'both',
              },
              [`.${e(`animate-duration-${val}`)}`]: {
                'animation-duration': `${val}ms`,
              },
            };
          }),
          [],
        );
      }
    }),
  ],
};
