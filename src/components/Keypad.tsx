import { Delete } from 'lucide-react';

const KEYS: [string, string][] = [
  ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
  ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
  ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
];

/** iOS-ийн тоон гар (утасны дэлгэц дээр бодит мэт харагдуулахын тулд) */
export function Keypad({ onKey, onDelete, suggestion, onSuggestion }: {
  onKey: (d: string) => void;
  onDelete: () => void;
  suggestion?: string;
  onSuggestion?: () => void;
}) {
  return (
    <>
      {suggestion && (
        <div className="suggest">
          <button onClick={onSuggestion}>{suggestion}</button>
        </div>
      )}
      <div className="keypad" style={suggestion ? { paddingTop: 2 } : undefined}>
        {KEYS.map(([d, l]) => (
          <button key={d} className="key" onClick={() => onKey(d)}>
            {d}
            <small>{l || ' '}</small>
          </button>
        ))}
        <span className="key ghost" />
        <button className="key" onClick={() => onKey('0')}>0<small>&nbsp;</small></button>
        <button className="key ghost" onClick={onDelete} aria-label="Устгах"><Delete size={24} strokeWidth={1.8} /></button>
      </div>
    </>
  );
}
