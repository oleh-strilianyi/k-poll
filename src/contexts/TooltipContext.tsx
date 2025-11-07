import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';

interface TooltipState {
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

interface TooltipContextType {
  showTooltip: (text: string, x: number, y: number) => void;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

const TOOLTIP_HIDE_DELAY = 3000;

const tooltipStyle: React.CSSProperties = {
  position: 'fixed',
  padding: '4px 8px',
  background: '#333',
  color: 'white',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  zIndex: 3000,
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.2s ease',
  willChange: 'opacity, transform',
};

const tooltipVisibleStyle: React.CSSProperties = {
  opacity: 1,
  transform: 'translate(-50%, calc(-100% - 8px))',
};

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    text: '',
    x: 0,
    y: 0,
    visible: false,
  });
  const hideTimerRef = useRef<number | null>(null);

  const showTooltip = useCallback((text: string, x: number, y: number) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setTooltip({ text, x, y, visible: true });

    hideTimerRef.current = window.setTimeout(() => {
      setTooltip((s) => ({ ...s, visible: false }));
      hideTimerRef.current = null;
    }, TOOLTIP_HIDE_DELAY);
  }, []);

  return (
    <TooltipContext.Provider value={{ showTooltip }}>
      {children}
      <div
        style={{
          ...tooltipStyle,
          left: tooltip.x,
          top: tooltip.y,
          ...(tooltip.visible ? tooltipVisibleStyle : {}),
        }}
      >
        {tooltip.text}
      </div>
    </TooltipContext.Provider>
  );
}

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};