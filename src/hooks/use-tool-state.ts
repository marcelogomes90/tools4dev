import { useCallback, useState } from 'react';

interface ToolState<TOutput> {
    output: TOutput | null;
    error: string | null;
    loading: boolean;
}

interface UseToolStateReturn<TInput, TOutput> {
    output: TOutput | null;
    error: string | null;
    loading: boolean;
    run: (input: TInput) => Promise<void>;
    clear: () => void;
}

/**
 * Generic hook for managing async tool state (input → output, loading, error).
 * Useful for tools that call server APIs (hash, jwt, sql, image, pdf, shorten).
 */
export function useToolState<TInput, TOutput>(
    process: (input: TInput) => Promise<TOutput>,
): UseToolStateReturn<TInput, TOutput> {
    const [state, setState] = useState<ToolState<TOutput>>({
        output: null,
        error: null,
        loading: false,
    });

    const run = useCallback(
        async (input: TInput) => {
            setState({ output: null, error: null, loading: true });
            try {
                const result = await process(input);
                setState({ output: result, error: null, loading: false });
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : 'Erro inesperado. Tente novamente.';
                setState({ output: null, error: message, loading: false });
            }
        },
        [process],
    );

    const clear = useCallback(() => {
        setState({ output: null, error: null, loading: false });
    }, []);

    return {
        output: state.output,
        error: state.error,
        loading: state.loading,
        run,
        clear,
    };
}
