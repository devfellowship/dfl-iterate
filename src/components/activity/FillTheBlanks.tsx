import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Eye, Lightbulb } from 'lucide-react';
import { Activity, CodeBlank } from '@/types';
import { ActivityGameCard, GameButton } from '@/components/game';
import { cn } from '@/lib/utils';

interface FillTheBlanksProps {
    activity: Activity;
    onSubmit: (filledCode: string) => void;
}

type BlankStatus = 'idle' | 'correct' | 'incorrect';

type CodeSegment =
    | { type: 'text'; value: string }
    | { type: 'blank'; blank: CodeBlank };

const KEYWORDS = new Set([
    'const',
    'let',
    'var',
    'function',
    'return',
    'export',
    'default',
    'import',
    'from',
    'className',
]);

const TOKEN_PATTERN =
    /(\/\/.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/gm;

function tokenizeCode(text: string) {
    const tokens: { value: string; className?: string }[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(TOKEN_PATTERN)) {
        const value = match[0];
        const index = match.index ?? 0;

        if (index > lastIndex) {
            tokens.push({ value: text.slice(lastIndex, index) });
        }

        let className = '';

        if (value.startsWith('//')) {
            className = 'text-emerald-300/80';
        } else if (
            value.startsWith('"') ||
            value.startsWith("'") ||
            value.startsWith('`')
        ) {
            className = 'text-orange-200';
        } else if (/^\d/.test(value)) {
            className = 'text-lime-300';
        } else if (KEYWORDS.has(value)) {
            className = 'text-sky-300';
        } else {
            className = 'text-slate-100';
        }

        tokens.push({ value, className });
        lastIndex = index + value.length;
    }

    if (lastIndex < text.length) {
        tokens.push({ value: text.slice(lastIndex) });
    }

    return tokens;
}

function inferBlanks(code: string, blanks?: CodeBlank[]) {
    if (blanks?.length) {
        return [...blanks].sort((a, b) => {
            if (a.line !== b.line) return a.line - b.line;
            return a.startColumn - b.startColumn;
        });
    }

    return code.split('\n').flatMap((line, lineIndex) => {
        const found: CodeBlank[] = [];
        let searchIndex = 0;
        let blankIndex = 0;

        while (true) {
            const start = line.indexOf('___', searchIndex);
            if (start === -1) break;

            found.push({
                id: `auto-${lineIndex + 1}-${blankIndex}`,
                line: lineIndex + 1,
                startColumn: start + 1,
                endColumn: start + 3,
                correctAnswer: '',
            });

            searchIndex = start + 3;
            blankIndex += 1;
        }

        return found;
    });
}

function buildCodeSegments(code: string, blanks: CodeBlank[]) {
    const lines = code.split('\n');
    const grouped = new Map<number, CodeBlank[]>();

    blanks.forEach((blank) => {
        const current = grouped.get(blank.line) ?? [];
        current.push(blank);
        grouped.set(blank.line, current);
    });

    return lines.map((line, index) => {
        const lineNumber = index + 1;
        const lineBlanks = (grouped.get(lineNumber) ?? []).sort(
            (a, b) => a.startColumn - b.startColumn
        );

        if (lineBlanks.length === 0) {
            return [{ type: 'text', value: line } satisfies CodeSegment];
        }

        const segments: CodeSegment[] = [];
        let cursor = 0;

        lineBlanks.forEach((blank) => {
            const start = Math.max(blank.startColumn - 1, 0);
            const end = Math.max(blank.endColumn, start);

            if (start > cursor) {
                segments.push({ type: 'text', value: line.slice(cursor, start) });
            }

            segments.push({ type: 'blank', blank });
            cursor = end;
        });

        if (cursor < line.length) {
            segments.push({ type: 'text', value: line.slice(cursor) });
        }

        return segments;
    });
}

function replaceBlankValues(code: string, blanks: CodeBlank[], values: Record<string, string>) {
    const lines = code.split('\n');
    const grouped = new Map<number, CodeBlank[]>();

    blanks.forEach((blank) => {
        const current = grouped.get(blank.line) ?? [];
        current.push(blank);
        grouped.set(blank.line, current);
    });

    grouped.forEach((lineBlanks, lineNumber) => {
        const lineIndex = lineNumber - 1;
        let nextLine = lines[lineIndex] ?? '';

        [...lineBlanks]
            .sort((a, b) => b.startColumn - a.startColumn)
            .forEach((blank) => {
                const start = Math.max(blank.startColumn - 1, 0);
                const end = Math.max(blank.endColumn, start);
                const replacement = values[blank.id] ?? nextLine.slice(start, end);
                nextLine = `${nextLine.slice(0, start)}${replacement}${nextLine.slice(end)}`;
            });

        lines[lineIndex] = nextLine;
    });

    return lines.join('\n');
}

export function FillTheBlanks({ activity, onSubmit }: FillTheBlanksProps) {
    const code = activity.aiGeneratedCode ?? '';
    const blanks = useMemo(() => inferBlanks(code, activity.blanks), [code, activity.blanks]);
    const codeLines = useMemo(() => buildCodeSegments(code, blanks), [code, blanks]);

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [statuses, setStatuses] = useState<Record<string, BlankStatus>>({});
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        setAnswers(
            blanks.reduce<Record<string, string>>((acc, blank) => {
                acc[blank.id] = '';
                return acc;
            }, {})
        );
        setStatuses(
            blanks.reduce<Record<string, BlankStatus>>((acc, blank) => {
                acc[blank.id] = 'idle';
                return acc;
            }, {})
        );
        setShowPreview(false);
    }, [blanks]);

    const filledCode = useMemo(
        () => replaceBlankValues(code, blanks, answers),
        [code, blanks, answers]
    );

    const allFilled = blanks.every((blank) => answers[blank.id]?.trim());
    const hasValidatedAnswers = Object.values(statuses).some((status) => status !== 'idle');
    const allCorrect =
        blanks.length > 0 &&
        blanks.every((blank) => {
            const answer = answers[blank.id]?.trim();
            const expected = blank.correctAnswer.trim();
            return expected ? answer === expected : Boolean(answer);
        });

    const handleChange = (blankId: string, value: string) => {
        setAnswers((current) => ({ ...current, [blankId]: value }));
        setStatuses((current) => ({ ...current, [blankId]: 'idle' }));
    };

    const handleSubmit = () => {
        const nextStatuses = blanks.reduce<Record<string, BlankStatus>>((acc, blank) => {
            const answer = answers[blank.id]?.trim() ?? '';
            const expected = blank.correctAnswer.trim();
            const isCorrect = expected ? answer === expected : Boolean(answer);
            acc[blank.id] = isCorrect ? 'correct' : 'incorrect';
            return acc;
        }, {});

        setStatuses(nextStatuses);

        if (Object.values(nextStatuses).every((status) => status === 'correct')) {
            onSubmit(filledCode);
        }
    };

    return (
        <ActivityGameCard
            type={activity.type}
            title={activity.title}
            question={activity.instructions || activity.objective}
            actions={
                <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowPreview((current) => !current)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <Eye className="h-4 w-4" />
                        {showPreview ? 'Ocultar preview' : 'Ver preview'}
                        {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    <GameButton
                        onClick={handleSubmit}
                        disabled={!allFilled}
                        variant="primary"
                        icon={<Check className="h-5 w-5" />}
                    >
                        Validar código
                    </GameButton>
                </div>
            }
        >
            <div className="flex flex-1 flex-col gap-4 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2">
                    {blanks.map((blank, index) => (
                        <div
                            key={blank.id}
                            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
                            style={{
                                borderColor: 'hsl(var(--warning) / 0.3)',
                                background: 'hsl(var(--warning) / 0.12)',
                                color: 'hsl(var(--warning-foreground) / 0.96)',
                            }}
                        >
                            <Lightbulb className="h-3.5 w-3.5" />
                            <span>Lacuna {index + 1}</span>
                            <span style={{ color: 'hsl(var(--warning-foreground) / 0.7)' }}>linha {blank.line}</span>
                            {blank.hint ? (
                                <span style={{ color: 'hsl(var(--foreground) / 0.72)' }}>{blank.hint}</span>
                            ) : null}
                        </div>
                    ))}
                </div>

                <div
                    className="overflow-hidden rounded-[1.75rem] border"
                    style={{
                        borderColor: 'hsl(215 32% 18%)',
                        background:
                            'radial-gradient(circle at top, hsl(var(--primary) / 0.08), transparent 32%), linear-gradient(180deg, hsl(215 55% 10%), hsl(224 57% 8%))',
                        boxShadow: '0 24px 80px rgba(2, 6, 23, 0.45)',
                    }}
                >
                    <div
                        className="border-b px-4 py-3 font-mono text-[11px] uppercase tracking-[0.3em]"
                        style={{
                            borderColor: 'hsl(215 32% 18%)',
                            background: 'hsl(222 47% 8% / 0.82)',
                            color: 'hsl(215 20% 68%)',
                        }}
                    >
                        Fill the blanks
                    </div>

                    <div className="custom-scrollbar max-h-[420px] overflow-auto py-2">
                        <div className="min-w-max font-mono text-[14px] leading-7 text-foreground">
                            {codeLines.map((segments, lineIndex) => (
                                <div
                                    key={`line-${lineIndex + 1}`}
                                    className="grid items-start px-4"
                                    style={{ gridTemplateColumns: '56px minmax(0, 1fr)' }}
                                >
                                    <div className="select-none pr-4 text-right" style={{ color: 'hsl(215 16% 45%)' }}>
                                        {lineIndex + 1}
                                    </div>

                                    <div className="whitespace-pre-wrap break-words">
                                        {segments.map((segment, segmentIndex) => {
                                            if (segment.type === 'text') {
                                                return tokenizeCode(segment.value).map((token, tokenIndex) => (
                                                    <span
                                                        key={`text-${segmentIndex}-${tokenIndex}`}
                                                        className={token.className}
                                                    >
                            {token.value}
                          </span>
                                                ));
                                            }

                                            const blank = segment.blank;
                                            const value = answers[blank.id] ?? '';
                                            const status = statuses[blank.id] ?? 'idle';
                                            const sharedClassName = 'mx-1 inline-flex min-w-[88px] align-middle';

                                            if (blank.options?.length) {
                                                return (
                                                    <span key={blank.id} className={sharedClassName}>
                            <select
                                value={value}
                                onChange={(event) => handleChange(blank.id, event.target.value)}
                                className={cn(
                                    'h-9 w-full rounded-xl border px-3 font-mono text-[13px] outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/20',
                                    status === 'correct'
                                        ? 'border-success bg-success/85 text-success-foreground'
                                        : status === 'incorrect'
                                            ? 'border-destructive bg-destructive/85 text-destructive-foreground'
                                            : 'border-warning/70 bg-warning/90 text-primary-foreground'
                                )}
                            >
                              <option value="">Selecione</option>
                                {blank.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                          </span>
                                                );
                                            }

                                            return (
                                                <input
                                                    key={blank.id}
                                                    value={value}
                                                    onChange={(event) => handleChange(blank.id, event.target.value)}
                                                    placeholder="..."
                                                    className={cn(
                                                        sharedClassName,
                                                        'h-9 rounded-xl border px-3 font-mono text-[13px] outline-none transition-colors placeholder:text-primary-foreground/55 focus:border-primary focus:ring-4 focus:ring-primary/20',
                                                        status === 'correct'
                                                            ? 'border-success bg-success/85 text-success-foreground'
                                                            : status === 'incorrect'
                                                                ? 'border-destructive bg-destructive/85 text-destructive-foreground'
                                                                : 'border-warning/70 bg-warning/90 text-primary-foreground'
                                                    )}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {blanks.map((blank, index) => {
                        const status = statuses[blank.id] ?? 'idle';
                        const answer = answers[blank.id] ?? '';

                        return (
                            <div
                                key={blank.id}
                                className={cn(
                                    'rounded-2xl border px-4 py-3',
                                    status === 'correct' && 'border-success/40 bg-success/10',
                                    status === 'incorrect' && 'border-destructive/40 bg-destructive/10',
                                    status === 'idle' && 'border-border bg-card/70'
                                )}
                            >
                                <div className="mb-1 text-sm font-semibold text-foreground">Lacuna {index + 1}</div>
                                <div className="text-xs text-muted-foreground">
                                    {blank.hint || `Linha ${blank.line}`}
                                </div>
                                {status === 'correct' ? (
                                    <div className="mt-2 text-sm text-success">Correto</div>
                                ) : null}
                                {status === 'incorrect' ? (
                                    <div className="mt-2 text-sm text-destructive-foreground">
                                        Incorreto. Resposta esperada: <code>{blank.correctAnswer}</code>
                                    </div>
                                ) : null}
                                {status === 'idle' && answer ? (
                                    <div className="mt-2 text-sm text-warning">Resposta preenchida, aguardando validação.</div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                {showPreview ? (
                    <div className="rounded-[1.75rem] border border-primary/20 bg-card/80 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold text-foreground">Preview do código completo</div>
                                <div className="text-xs text-muted-foreground">
                                    {allCorrect
                                        ? 'Todas as lacunas estão corretas.'
                                        : 'Preencha e valide para conferir o resultado final.'}
                                </div>
                            </div>
                        </div>
                        <pre className="custom-scrollbar overflow-auto rounded-2xl bg-[#0d1424] p-4 font-mono text-sm leading-6 text-foreground">
              <code>{filledCode}</code>
            </pre>
                    </div>
                ) : null}

                {hasValidatedAnswers && !allCorrect ? (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                        Algumas lacunas ainda estão incorretas. Corrija os campos marcados em vermelho para continuar.
                    </div>
                ) : null}
            </div>
        </ActivityGameCard>
    );
}
