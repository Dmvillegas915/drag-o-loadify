
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enable Lovable's selection feature by injecting the script
const script = document.createElement('script');
script.src = 'https://cdn.gpteng.co/gptengineer.js';
script.type = 'module';
document.head.appendChild(script);

createRoot(document.getElementById("root")!).render(<App />);
