import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
    DATE_INPUT_RESPONSIVE_CLASSNAMES,
    DateInput,
} from '@/components/ui/date-input';

describe('DateInput responsiveness', () => {
    it('expõe classes responsivas esperadas para mobile/tablet/desktop', () => {
        expect(DATE_INPUT_RESPONSIVE_CLASSNAMES).toContain('w-full');
        expect(DATE_INPUT_RESPONSIVE_CLASSNAMES).toContain('min-w-0');
        expect(DATE_INPUT_RESPONSIVE_CLASSNAMES).toContain('max-w-full');
        expect(DATE_INPUT_RESPONSIVE_CLASSNAMES).toContain('px-2');
        expect(DATE_INPUT_RESPONSIVE_CLASSNAMES).toContain('md:px-3');
        expect(DATE_INPUT_RESPONSIVE_CLASSNAMES).toContain('text-xs');
        expect(DATE_INPUT_RESPONSIVE_CLASSNAMES).toContain('sm:text-sm');
    });

    it('mantém atributos de acessibilidade e composição de classes', () => {
        const html = renderToStaticMarkup(
            <DateInput
                id="deadline"
                aria-label="Data limite"
                defaultValue="2026-03-14"
                className="custom-class"
            />,
        );

        expect(html).toContain('id="deadline"');
        expect(html).toContain('aria-label="Data limite"');
        expect(html).toContain('custom-class');
    });
});

