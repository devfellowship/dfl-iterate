// Origin: agent
import { useEffect, useMemo, useState } from 'react';
import { Activity, CodeBlank } from '@/types';

export type BlankStatus = 'idle' | 'correct' | 'incorrect';

export type CodeSegment =
    | { type: 'text'; value: string }
    | { type: 'blank'; blank: CodeBlank };

export interface UseFillTheBlanksCallbacks {
    /**
     * Disparado em **toda** validação (sucesso e erro).
     * Permite que a página mostre modal de certo/errado consistentemente.
     * O aluno pode revalidar quantas vezes quiser (padrão do projeto).
     */
    onSubmit: (filledCode: string, isCorrect: boolean) => void;
}

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

export function tokenizeCode(text: string) {
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

/**
 * Padrão ouro (alinhado a `useFixTheCode` / `useQualityReview`):
 * `activity` + objeto `callbacks`.
 *
 * Diferença em relação aos outros tipos: `onSubmit` dispara em sucesso E em erro,
 * porque o aluno pode revalidar quantas vezes quiser. A página decide o que
 * persistir/avançar com base em `isCorrect`.
 */
export function useFillTheBlanks(activity: Activity, callbacks: UseFillTheBlanksCallbacks) {
    const { onSubmit } = callbacks;
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

        const isAllCorrect = Object.values(nextStatuses).every((status) => status === 'correct');
        onSubmit(filledCode, isAllCorrect);
    };

    return {
        blanks,
        codeLines,
        answers,
        statuses,
        showPreview,
        setShowPreview,
        filledCode,
        allFilled,
        hasValidatedAnswers,
        allCorrect,
        handleChange,
        handleSubmit,
    };
}
