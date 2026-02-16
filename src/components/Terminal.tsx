import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string | React.ReactNode;
}

const WELCOME_MESSAGE = `Hello, World! I'm Siddharth Jindal
I'm a Software Developer & AI Engineer.

Type 'help' to see available commands.`;

const COMMANDS: Record<string, { description: string; action: () => string | React.ReactNode }> = {
  help: {
    description: 'Show available commands',
    action: () => `
Available commands:
  help          - Show this help message
  about         - Learn about me
  skills        - View my technical skills
  projects      - Browse my projects
  experience    - View my work experience
  education     - View my education
  achievements  - View my achievements & certifications
  contact       - Get my contact information
  whoami        - Display current user
  date          - Show current date and time
  clear         - Clear the terminal
  waifu         - Show a random waifu image
  joke          - Tell a random joke
`,
  },
  about: {
    description: 'Learn about me',
    action: () => (
      <div className="my-4 space-y-4">
        <div className="font-mono leading-relaxed bg-secondary/30 p-4 border border-border rounded-lg">
          <div className="text-terminal-cyan font-bold mb-2">┌ ABOUT ME ┐</div>
          <p className="mb-4 text-foreground/90">
            Hi! I'm <span className="text-terminal-cyan font-bold">Siddharth Jindal</span>, a passionate Software Developer and AI Engineer currently pursuing
            my B.Tech in Electronics & Computer Engineering at <span className="text-terminal-yellow">Thapar Institute of Engineering and Technology</span>, Patiala.
          </p>
          <p className="mb-4 text-foreground/90">
            I specialize in building <span className="text-terminal-green">full-stack applications</span>, <span className="text-terminal-green">AI/ML systems</span>, and
            <span className="text-terminal-green"> RAG pipelines</span>. I have hands-on experience with LLMs, LangChain, vector databases, and modern web technologies.
          </p>
          <p className="text-foreground/90">
            Currently working as an <span className="text-terminal-cyan">SDE Intern at a21.ai</span>, building Text-to-SQL AI agents and RAG pipelines
            for enterprise databases.
          </p>
          <div className="mt-4 text-muted-foreground text-xs italic">
            Competitive Programmer • CodeChef 3-Star • 500+ problems solved
          </div>
        </div>
      </div>
    ),
  },
  skills: {
    description: 'View my technical skills',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  TECHNICAL SKILLS                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Languages                                                  │
│  ─────────────────────────────────────────                  │
│  • Python • C/C++ • JavaScript • SQL                        │
│                                                             │
│  Backend & APIs                                             │
│  ─────────────────────────────────────────                  │
│  • Node.js • Express.js • REST APIs                         │
│  • OAuth 2.0 • Authentication                               │
│                                                             │
│  Frontend                                                   │
│  ─────────────────────────────────────────                  │
│  • React                                                    │
│                                                             │
│  Databases                                                  │
│  ─────────────────────────────────────────                  │
│  • MongoDB • MySQL • Redis • Pinecone                       │
│                                                             │
│  DevOps & Tools                                             │
│  ─────────────────────────────────────────                  │
│  • Git • GitHub • Docker • Postman                          │
│  • VS Code • CI/CD • Render • Vercel                        │
│                                                             │
│  AI/ML                                                      │
│  ─────────────────────────────────────────                  │
│  • Generative AI • RAG • LLMs (GPT-4, Claude)              │
│  • Prompt Engineering • LangChain • NLP                     │
│  • Transformers • Vector Databases                          │
│                                                             │
│  Core CS                                                    │
│  ─────────────────────────────────────────                  │
│  • Data Structures & Algorithms • OOP • DBMS                │
│  • Operating Systems • Computer Networks                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  projects: {
    description: 'Browse my projects',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  FEATURED PROJECTS                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  01. AI Terminal Assistant (CLI)                             │
│      ──────────────────────────────────                     │
│      Tech: Rust, Electron, Groq API, OpenAI API, Node.js   │
│      • Built conversational terminal assistant enabling     │
│        natural language command execution, reducing          │
│        syntax errors by 60%                                 │
│      • Integrated LLM-powered command translation and       │
│        file management using Rust for performance           │
│      • Multi-platform support (Windows, macOS, Linux)       │
│        with Electron-based UI and shell script integration  │
│                                                             │
│  02. Customer Relationship Management (CRM) Platform        │
│      ──────────────────────────────────                     │
│      Tech: React, Node.js, Express, MongoDB, Redis          │
│      • Engineered full-stack CRM managing 500+ customer     │
│        records with real-time order tracking                │
│      • Implemented Google OAuth, Redis caching (40%         │
│        faster queries), and RESTful APIs                    │
│      • Deployed on Render with CI/CD pipeline;              │
│        integrated AI-powered campaign suggestions           │
│      → https://mini-crm-1-gmzf.onrender.com                │
│                                                             │
│  03. Medical Help Chatbot (GenAI & RAG)                     │
│      ──────────────────────────────────                     │
│      Tech: Python, LangChain, Pinecone, Streamlit           │
│      • RAG-based healthcare assistant processing            │
│        medical documents with 85%+ retrieval precision      │
│      • Utilized LangChain for orchestration, vector         │
│        embeddings for semantic search, and Streamlit        │
│        for interactive frontend                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  experience: {
    description: 'View my work experience',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  WORK EXPERIENCE                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ▸ SDE Intern — a21.ai                                      │
│    Jan 2026 – Present | Onsite                              │
│    ───────────────────────────────────────                  │
│    • Developed a full-stack Text-to-SQL AI agent            │
│      enabling natural-language querying over structured     │
│      enterprise databases                                   │
│    • Built agentic document extraction pipelines to         │
│      parse, reason over, and structure data from            │
│      unstructured documents                                 │
│    • Designed and optimized RAG pipelines using vector      │
│      databases to improve retrieval accuracy and latency    │
│    • Worked closely with product and founders in a          │
│      fast-paced startup environment                         │
│                                                             │
│  ▸ Artificial Intelligence Intern — Infosys                 │
│    Nov 2024 – Feb 2025 | Remote                             │
│    ───────────────────────────────────────                  │
│    • Developed an intelligent Medical Help Chatbot          │
│      using RAG, LangChain, and OpenAI/Groq APIs,           │
│      achieving 90%+ accuracy on 1000+ healthcare queries    │
│    • Implemented vector database (Pinecone) integration     │
│      and prompt engineering to optimize LLM performance     │
│      and reduce hallucination by 35%                        │
│    • Designed end-to-end NLP pipeline using Hugging Face    │
│      Transformers for medical text processing               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  education: {
    description: 'View my education',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  EDUCATION                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎓 Thapar Institute of Engineering and Technology          │
│     Patiala, India                                          │
│     ───────────────────────────────────────                 │
│     • B.Tech in Electronics and Computer Engineering        │
│     • CGPA: 7.63 / 10.0                                    │
│     • Oct 2022 – Jul 2026                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  achievements: {
    description: 'View my achievements & certifications',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  ACHIEVEMENTS & CERTIFICATIONS                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏆 CodeChef 3-Star Coder                                   │
│     ───────────────────────────────────────                 │
│     Ranked among top competitive programmers with           │
│     strong DSA and algorithmic problem-solving skills       │
│     → Platforms: CodeChef (sjindal456), Codeforces          │
│     → 500+ problems solved                                  │
│                                                             │
│  📜 Principles of Generative AI Certification               │
│     ───────────────────────────────────────                 │
│     Mastered transformer architectures, diffusion           │
│     models, and responsible AI practices                    │
│                                                             │
│  🌟 Open Source Contributor                                  │
│     ───────────────────────────────────────                 │
│     Active contributions to AI/ML and web development       │
│     projects on GitHub                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  contact: {
    description: 'Get my contact information',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  CONTACT                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📧 Email      siddharthjindal456@gmail.com                 │
│  📱 Phone      623-973-5345                                 │
│  🐙 GitHub     github.com/siddharthj2                       │
│  💼 LinkedIn   linkedin.com/in/siddharth-jindal              │
│                                                             │
│  I'm always open to collaborating on interesting            │
│  projects, AI/ML research, or just chatting about           │
│  technology and competitive programming!                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  whoami: {
    description: 'Display current user',
    action: () => 'siddharth@portfolio',
  },
  date: {
    description: 'Show current date and time',
    action: () => new Date().toLocaleString(),
  },
  clear: {
    description: 'Clear the terminal',
    action: () => 'CLEAR',
  },
  waifu: {
    description: 'Show a random waifu image',
    action: () => <WaifuImage />,
  },
  joke: {
    description: 'Tell a random joke',
    action: () => <JokeDisplay />,
  },
};

const JokeDisplay = () => {
  const [joke, setJoke] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://v2.jokeapi.dev/joke/Any')
      .then(res => res.json())
      .then(data => {
        setJoke(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch joke');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse text-terminal-cyan">Fetching a joke for you...</div>;
  if (error) return <div className="text-terminal-red">{error}</div>;

  return (
    <div className="my-4 p-4 border border-border rounded-lg bg-secondary/30 max-w-lg font-mono leading-relaxed">
      <div className="text-terminal-yellow font-bold mb-2">┌ JOKE ┐</div>
      {joke.type === 'single' ? (
        <p className="text-foreground/90">{joke.joke}</p>
      ) : (
        <div className="space-y-4">
          <p className="text-foreground/90 italic">"{joke.setup}"</p>
          <p className="text-terminal-cyan font-bold">{joke.delivery}</p>
        </div>
      )}
    </div>
  );
};

const WaifuImage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.waifu.pics/sfw/waifu')
      .then(res => res.json())
      .then(data => {
        setImageUrl(data.url);
        setIsApiLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch waifu image');
        setIsApiLoading(false);
      });
  }, []);

  const isLoading = isApiLoading || isImageLoading;

  if (error) return <div className="text-terminal-red">{error}</div>;

  return (
    <div className="my-4">
      {isLoading && (
        <div className="flex items-center gap-2 text-terminal-cyan font-mono animate-pulse">
          <span className="inline-block animate-bounce">/</span>
          <span>Fetching waifu...</span>
        </div>
      )}
      {imageUrl && (
        <div className={`border border-border rounded-lg overflow-hidden w-64 bg-secondary/50 shadow-lg transition-opacity duration-500 ${isImageLoading ? 'opacity-0 h-0' : 'opacity-100'}`}>
          <img
            src={imageUrl}
            alt="Waifu"
            className="w-full h-auto object-cover"
            onLoad={() => setIsImageLoading(false)}
          />
        </div>
      )}
    </div>
  );
};

export const Terminal = forwardRef(({ themeId = 'powershell' }: { themeId?: string }, ref) => {
  const getThemeConfig = (id: string) => {
    switch (id) {
      case 'matrix':
        return {
          bg: '#000500',
          text: '#00FF41',
          prompt: 'neo@matrix:~$',
          header: 'Matrix Core',
          welcome: `Wake up, Neo...\n\nHello, World! I'm Siddharth Jindal\nI'm a Software Developer & AI Engineer.`,
          caret: '#00FF41'
        };
      case 'ubuntu':
        return {
          bg: '#300a24',
          text: '#ffffff',
          prompt: 'siddharth@ubuntu:~$',
          header: 'Terminal (Ubuntu)',
          welcome: WELCOME_MESSAGE,
          caret: '#ffffff'
        };
      case 'dracula':
        return {
          bg: '#282a36',
          text: '#f8f8f2',
          prompt: 'λ',
          header: 'Dracula Terminal',
          welcome: WELCOME_MESSAGE,
          caret: '#bd93f9'
        };
      case 'cmd':
        return {
          bg: '#000000',
          text: '#ffffff',
          prompt: 'C:\\Users\\siddharth>',
          header: 'Command Prompt',
          welcome: WELCOME_MESSAGE,
          caret: '#ffffff'
        };
      default:
        return {
          bg: '#012456',
          text: '#ffffff',
          prompt: 'PS C:\\Users\\siddharth>',
          header: 'Windows PowerShell',
          welcome: WELCOME_MESSAGE,
          caret: '#ffffff'
        };
    }
  };

  const theme = getThemeConfig(themeId);

  const [lines, setLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    setLines([{ id: 0, type: 'output', content: theme.welcome }]);
  }, [themeId]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 800, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  useImperativeHandle(ref, () => ({
    executeExternalCommand: (command: string) => {
      setIsMinimized(false);
      executeCommand(command);
      setTimeout(focusInput, 100);
    }
  }));

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(1);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.terminal-header-buttons')) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleResizeDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y
        });
      }
      if (isResizing && !isMaximized) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        setSize({
          width: Math.max(400, resizeStart.current.w + deltaX),
          height: Math.max(300, resizeStart.current.h + deltaY)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isMaximized]);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  // Handle auto-scroll when content size changes (like images loading)
  useEffect(() => {
    if (!terminalRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [scrollToBottom]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = useCallback((input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    const newLines: TerminalLine[] = [];

    // Add the input line
    newLines.push({
      id: lineIdRef.current++,
      type: 'input',
      content: input,
    });

    if (trimmedInput === '') {
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    // Add to command history
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);

    // Handle clear command specially
    if (trimmedInput === 'cls' || trimmedInput === 'clear') {
      setLines([]);
      return;
    }

    // Execute command
    const command = COMMANDS[trimmedInput];
    if (command) {
      const result = command.action();
      newLines.push({
        id: lineIdRef.current++,
        type: 'output',
        content: result,
      });
    } else {
      newLines.push({
        id: lineIdRef.current++,
        type: 'error',
        content: `Command not found: ${trimmedInput}. Type 'help' for available commands.`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        executeCommand(currentInput);
        setCurrentInput('');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        } else {
          setHistoryIndex(-1);
          setCurrentInput('');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // Auto-complete
        const matches = Object.keys(COMMANDS).filter((cmd) =>
          cmd.startsWith(currentInput.toLowerCase())
        );
        if (matches.length === 1) {
          setCurrentInput(matches[0]);
        }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      }
    },
    [currentInput, commandHistory, historyIndex, executeCommand]
  );

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'error':
        return 'text-terminal-red';
      case 'success':
        return 'text-terminal-green';
      case 'info':
        return 'text-terminal-cyan';
      default:
        return 'text-foreground';
    }
  };

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-[40px] right-4 bg-secondary border border-border rounded-t-lg px-4 py-2 cursor-pointer shadow-lg animate-fade-in flex items-center gap-2 z-[60]"
        onClick={() => setIsMinimized(false)}
      >
        <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
        <span className="text-xs font-mono">Terminal (Siddharth@Portfolio)</span>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: isMaximized ? 'none' : `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: isMaximized ? '100%' : `${size.width}px`,
        height: isMaximized ? '100%' : `${size.height}px`,
        position: isMaximized ? 'fixed' : 'relative',
        top: isMaximized ? 0 : 'auto',
        left: isMaximized ? 0 : 'auto',
        zIndex: isMaximized ? 50 : 10,
        willChange: (isDragging || isResizing) ? 'transform, width, height' : 'auto'
      }}
      className={`bg-card border border-border rounded-lg overflow-hidden shadow-2xl flex flex-col ${isMaximized ? '' : (isDragging || isResizing ? '' : 'transition-all duration-200')} ${isDragging ? 'select-none' : ''}`}
      onClick={(e) => {
        // Only focus if the user isn't selecting text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;

        // Prevent focusing if we clicked a button or interactive element
        if ((e.target as HTMLElement).closest('button, input, [role="button"]')) return;

        focusInput();
      }}
    >
      {/* Terminal Header */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {theme.header}
          </span>
        </div>

        <div className="flex items-center terminal-header-buttons">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            {isMaximized ? <Copy size={14} className="rotate-180" /> : <Square size={14} />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        style={{ backgroundColor: theme.bg, color: theme.text }}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed terminal-scrollbar min-h-0"
      >
        <div ref={contentRef}>
          {lines.map((line) => (
            <div key={line.id} className={`${line.type === 'input' ? '' : getLineColor(line.type)} whitespace-pre-wrap`}>
              {line.type === 'input' ? (
                <div className="flex">
                  <span style={{ color: theme.text }}>{theme.prompt}</span>
                  <span className="ml-2" style={{ color: theme.text }}>{line.content}</span>
                </div>
              ) : (
                <div className="animate-fade-in">{line.content}</div>
              )}
            </div>
          ))}

          {/* Current Input Line */}
          <div className="flex items-center">
            <span style={{ color: theme.text }}>{theme.prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ color: theme.text, caretColor: theme.caret }}
              className="flex-1 ml-2 bg-transparent outline-none"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-secondary border-t border-border text-xs text-muted-foreground flex justify-between select-none">
        <span>Type 'help' for commands</span>
        <div className="flex items-center gap-4">
          <span>↑↓ History • Tab Autocomplete</span>
          {!isMaximized && (
            <div
              onMouseDown={handleResizeDown}
              className="cursor-nwse-resize p-1 hover:text-foreground transition-colors"
            >
              <div className="w-3 h-3 border-r-2 border-b-2 border-muted-foreground/50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
