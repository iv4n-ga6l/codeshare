'use client'

import { motion } from 'framer-motion'

const codeSnippet = `
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('CodeShare');
`.trim()

export default function CodeAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-muted p-6 rounded-lg shadow-lg"
    >
      <pre className="text-sm">
        {codeSnippet.split('\n').map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {line}
          </motion.div>
        ))}
      </pre>
    </motion.div>
  )
}

