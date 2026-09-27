import type { Skill } from '../../data/types'

type Props = {
  skill: Skill
  state: 'selected' | 'related' | 'idle' | 'dimmed'
  onSelect: () => void
  onPreview: (active: boolean) => void
}

const styles = {
  selected: 'border-ember text-paper bg-ember/[0.1] shadow-[0_0_28px_-8px_rgba(255,106,43,0.7)]',
  related: 'border-flare/60 text-paper shadow-[0_0_20px_-10px_rgba(240,69,122,0.6)]',
  idle: 'border-line text-fog hover:border-ember/70 hover:text-paper hover:shadow-[0_0_22px_-10px_rgba(255,106,43,0.6)]',
  dimmed: 'border-line/60 text-dim',
}

export function TechNode({ skill, state, onSelect, onPreview }: Props) {
  return (
    <button
      type="button"
      aria-pressed={state === 'selected'}
      onClick={onSelect}
      onMouseEnter={() => onPreview(true)}
      onMouseLeave={() => onPreview(false)}
      data-cursor="Trace"
      className={`meta relative border px-3 py-1.5 text-left transition-[color,border-color,background-color,box-shadow] duration-300 ${styles[state]}`}
    >
      {state === 'related' && (
        <span aria-hidden="true" className="absolute -top-px -left-px block size-1.5 bg-ember" />
      )}
      {skill.name}
    </button>
  )
}
