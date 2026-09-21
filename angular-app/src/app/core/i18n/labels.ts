import type { Theme } from '../theme/theme';

/**
 * Rotulos de acessibilidade (aria-label) que dependem de estado e por isso nao cabem no
 * atributo `i18n-*` do template (ternarios em `[attr.aria-label]`/`[ariaLabel]`).
 * `$localize` (compile-time, um build por idioma) com IDs customizados (`@@`) pra
 * manter as traducoes estaveis; compartilhados entre Header e MobileMenu.
 */
export function themeToggleLabel(theme: Theme): string {
  return theme === 'dark'
    ? $localize`:@@theme.toggle.light.aria:Ativar tema claro`
    : $localize`:@@theme.toggle.dark.aria:Ativar tema escuro`;
}

export function menuToggleLabel(open: boolean): string {
  return open ? $localize`:@@menu.close.aria:Fechar menu` : $localize`:@@menu.open.aria:Abrir menu`;
}
