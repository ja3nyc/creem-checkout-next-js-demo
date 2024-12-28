/** @type {import('tailwindcss').Config} */

export default {
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'../../packages/ui/components/**/*.{ts,tsx}',
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',

	],
	darkMode: 'class',
	theme: {
		extend: {
			gridTemplateColumns: {
				dashboard: 'repeat(auto-fill, minmax(100px, 32rem));'
			},
			textShadow: {
				sm: '0 1px 2px var(--tw-shadow-color)',
				md: '0 2px 4px var(--tw-shadow-color)',
				DEFAULT: '0 2px 4px var(--tw-shadow-color)',
				lg: '0 8px 16px var(--tw-shadow-color)'
			},
			fontFamily: {
				inter: ['var(--font-inter)', 'sans-serif'],
				arapey: ['var(--font-arapey)', 'serif'],
				dancing_script: ['Dancing Script', 'cursive'],
				lobster: ['Lobster', 'sans-serif'],
				cutive_mono: ['Cutive Mono', 'monospace']
			},
			boxShadow: {
				dashboard: 'rgba(191,168,116, 0.2) 0px 2px 8px 0px',
				calendar: ' 0px 0px 27px -6px rgba(0,0,0,0.25) inset, 0px 2px 1px 1px rgba(255,255,255,0.9) inset, 0px -2px 1px 0px rgba(0,0,0,0.25) inset'
			},
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1.5' }],
				sm: ['0.875rem', { lineHeight: '1.5715' }],
				base: ['1rem', { lineHeight: '1.5', letterSpacing: '-0.017em' }],
				lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.017em' }],
				xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.017em' }],
				'2xl': ['1.5rem', { lineHeight: '1.415', letterSpacing: '-0.017em' }],
				'3xl': ['1.875rem', { lineHeight: '1.333', letterSpacing: '-0.017em' }],
				'4xl': ['2.25rem', { lineHeight: '1.277', letterSpacing: '-0.017em' }],
				'5xl': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.017em' }],
				'6xl': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.017em' }],
				'7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.017em' }]
			},
			letterSpacing: {
				tighter: '-0.02em',
				tight: '-0.01em',
				normal: '0',
				wide: '0.01em',
				wider: '0.02em',
				widest: '0.4em'
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				editorborder: 'hsl(var(--border))',
				editorinput: 'hsl(var(--input))',
				editorring: 'hsl(var(--ring))',
				editorbackground: 'hsl(var(--background))',
				editorforeground: 'hsl(var(--foreground))',
				editorprimary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				editorsecondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				editordestructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				editormuted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				editoraccent: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				editorpopover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				editorcard: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				midnight: {
					'50': '#D9E0FC',
					'100': '#B4C0F8',
					'200': '#6982F2',
					'300': '#1E43EB',
					'400': '#0F2CAE',
					'500': '#091963',
					'550': '#040a24',
					'600': '#020617',
					'700': '#020513',
					'750': '#02040E',
					'800': '#010209',
					'900': '#000105',
					'950': '#000105'
				},
				gold: {
					'50': '#FCFBF8',
					'100': '#F9F6F1',
					'200': '#F1EBE0',
					'300': '#EAE3D2',
					'400': '#E2D8C0',
					'500': '#DCCFB2',
					'600': '#D4C4A1',
					'700': '#CDBC93',
					'800': '#C7B385',
					'900': '#BFA874',
					'950': '#a39064'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'5xl': '2.5rem',
				'6xl': '3rem',
				'7xl': '3.5rem',
				'8xl': '4rem'
			},
			container: {
				center: true,
				padding: '2rem',
				screens: {
					'2xl': '1400px'
				}
			},
			keyframes: {
				wiggle: {
					'0%, 100%': {
						transform: 'rotate(0deg)'
					},
					'25%': {
						transform: 'rotate(15deg)'
					},
					'50%': {
						transform: 'rotate(-13deg)'
					},
					'75%': {
						transform: 'rotate(10deg)'
					}
				},
				'drawUnderline': {
					to: {
						transform: 'scaleX(1)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				vote: {
					'0%, 100%': {
						transform: 'rotate(0deg)'
					},
					'25%': {
						transform: 'rotate(-30deg)'
					},
					'75%': {
						transform: 'rotate(30deg)'
					}
				},
				halfspin: {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(180deg)'
					}
				},
				endless: {
					'0%': {
						transform: 'translateY(0)'
					},
					'100%': {
						transform: 'translateY(-245px)'
					}
				},
				spotlight: {
					'0%': {
						opacity: '0',
						transform: 'translate(-72%, -62%) scale(0.5)'
					},
					'100%': {
						opacity: '1',
						transform: 'translate(-50%,-40%) scale(1)'
					}
				}, 'subtle-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				endless: 'endless 20s linear infinite',
				spotlight: 'spotlight 2s ease .75s 1 forwards',
				vote: 'vote 1s ease-in-out',
				halfspin: 'halfspin 0.5s linear',
				wiggle: 'wiggle 1s ease-in-out',
				underline: 'drawUnderline 1.5s ease-out forwards',
				'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
			}
		}
	},
} 
